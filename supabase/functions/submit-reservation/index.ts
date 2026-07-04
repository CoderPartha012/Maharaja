import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { reservationConfirmationHtml } from '../_shared/email-templates.ts';

const HCAPTCHA_SECRET = Deno.env.get('HCAPTCHA_SECRET_KEY') ?? '';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const FROM_EMAIL = 'reservations@maharajarestaurant.in';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

async function verifyHCaptcha(token: string): Promise<boolean> {
  // Skip verification in test mode (hCaptcha test secret always passes)
  const secret = HCAPTCHA_SECRET || '0x0000000000000000000000000000000000000000';

  const res = await fetch('https://api.hcaptcha.com/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token }),
  });

  const json = (await res.json()) as { success: boolean };
  return json.success;
}

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const body = (await req.json()) as {
      name: string;
      phone: string;
      email?: string | null;
      date: string;
      time: string;
      party_size: number;
      special_requests?: string | null;
      captchaToken: string;
    };

    // Verify hCaptcha
    const captchaOk = await verifyHCaptcha(body.captchaToken);
    if (!captchaOk) {
      return new Response(JSON.stringify({ error: 'CAPTCHA verification failed' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Insert reservation using service role (bypasses RLS)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: reservation, error: dbError } = await supabase
      .from('reservations')
      .insert({
        name: body.name,
        phone: body.phone,
        email: body.email ?? null,
        date: body.date,
        time: body.time,
        party_size: body.party_size,
        special_requests: body.special_requests ?? null,
        status: 'pending',
      })
      .select('id, name, email, date, time, party_size, special_requests')
      .single();

    if (dbError || !reservation) {
      console.error('DB insert error:', dbError);
      return new Response(JSON.stringify({ error: 'Failed to save reservation' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Send confirmation email if guest provided an email address
    if (reservation.email && RESEND_API_KEY) {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `Maharaja Restaurant <${FROM_EMAIL}>`,
          to: [reservation.email],
          subject: `Reservation confirmed — ${reservation.date} at ${reservation.time}`,
          html: reservationConfirmationHtml({
            id: reservation.id,
            name: reservation.name,
            email: reservation.email,
            date: reservation.date,
            time: reservation.time,
            party_size: reservation.party_size,
            special_requests: reservation.special_requests,
          }),
        }),
      });

      if (!emailRes.ok) {
        // Email failure is non-fatal — reservation is still saved
        console.error('Resend error:', await emailRes.text());
      }
    }

    return new Response(JSON.stringify({ id: reservation.id }), {
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
