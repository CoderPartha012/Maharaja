import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { orderConfirmationHtml } from '../_shared/email-templates.ts';

const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET') ?? '';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const FROM_EMAIL = 'orders@maharajarestaurant.in';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

async function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(RAZORPAY_KEY_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(`${orderId}|${paymentId}`));
  const hex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hex === signature;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const body = (await req.json()) as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      name: string;
      phone: string;
      email?: string | null;
      orderType: string;
      address?: string | null;
      items: OrderItem[];
      grandTotal: number;
    };

    // Verify Razorpay signature (skip in dev if secret not set)
    if (RAZORPAY_KEY_SECRET) {
      const valid = await verifySignature(
        body.razorpay_order_id,
        body.razorpay_payment_id,
        body.razorpay_signature
      );
      if (!valid) {
        return new Response(JSON.stringify({ error: 'Invalid payment signature' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Store order in Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: order, error: dbError } = await supabase
      .from('orders')
      .insert({
        name: body.name,
        phone: body.phone,
        email: body.email ?? null,
        order_type: body.orderType,
        address: body.address ?? null,
        items: body.items,
        total: body.grandTotal,
        status: 'paid',
        razorpay_order_id: body.razorpay_order_id,
        razorpay_payment_id: body.razorpay_payment_id,
      })
      .select('id')
      .single();

    if (dbError || !order) {
      console.error('DB insert error:', dbError);
      return new Response(JSON.stringify({ error: 'Failed to save order' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Send confirmation email
    if (body.email && RESEND_API_KEY) {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `Maharaja Restaurant <${FROM_EMAIL}>`,
          to: [body.email],
          subject: `Order confirmed — Ref #${body.razorpay_payment_id.slice(-8).toUpperCase()}`,
          html: orderConfirmationHtml({
            orderId: body.razorpay_payment_id,
            name: body.name,
            email: body.email,
            orderType: body.orderType,
            items: body.items,
            grandTotal: body.grandTotal,
          }),
        }),
      });

      if (!emailRes.ok) {
        console.error('Resend error:', await emailRes.text());
        // non-fatal — order is saved
      }
    }

    return new Response(JSON.stringify({ id: order.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
