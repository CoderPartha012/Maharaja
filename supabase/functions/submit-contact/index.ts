import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { contactNotificationHtml } from '../_shared/email-templates.ts';

const HCAPTCHA_SECRET = Deno.env.get('HCAPTCHA_SECRET_KEY') ?? '';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const FROM_EMAIL = 'noreply@maharajarestaurant.in';
const OWNER_EMAIL = Deno.env.get('OWNER_EMAIL') ?? 'owner@maharajarestaurant.in';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

async function verifyHCaptcha(token: string): Promise<boolean> {
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
      email: string;
      subject: string;
      message: string;
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

    // Insert contact message
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { error: dbError } = await supabase.from('contact_messages').insert({
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
      status: 'unread',
    });

    if (dbError) {
      console.error('DB insert error:', dbError);
      return new Response(JSON.stringify({ error: 'Failed to save message' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Notify restaurant owner
    if (RESEND_API_KEY) {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `Maharaja Website <${FROM_EMAIL}>`,
          to: [OWNER_EMAIL],
          reply_to: body.email,
          subject: `New message: ${body.subject}`,
          html: contactNotificationHtml({
            name: body.name,
            email: body.email,
            subject: body.subject,
            message: body.message,
          }),
        }),
      });

      if (!emailRes.ok) {
        console.error('Resend error:', await emailRes.text());
      }
    }

    return new Response(JSON.stringify({ success: true }), {
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
