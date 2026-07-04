const BRAND_GOLD = '#D4AF37';
const BRAND_DARK = '#1A1000';
const BRAND_TEXT_GOLD = '#7A5C00';

const baseLayout = (content: string) =>
  `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Maharaja Restaurant</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    body { margin: 0; padding: 0; background-color: #FFF8DC; font-family: Georgia, 'Times New Roman', serif; }
    table { border-collapse: collapse; }
    img { border: 0; display: block; }
    a { color: ${BRAND_TEXT_GOLD}; }
    .wrapper { width: 100%; background-color: #FFF8DC; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: ${BRAND_DARK}; padding: 32px 40px; text-align: center; }
    .header h1 { margin: 0; color: ${BRAND_GOLD}; font-size: 28px; letter-spacing: 3px; font-weight: normal; }
    .header p { margin: 6px 0 0; color: #c9a227; font-size: 13px; letter-spacing: 1px; }
    .body { padding: 40px; }
    .greeting { font-size: 20px; color: ${BRAND_TEXT_GOLD}; margin: 0 0 16px; }
    .text { font-size: 15px; line-height: 1.6; color: #444444; margin: 0 0 24px; }
    .detail-box { background-color: #FFF8DC; border-left: 4px solid ${BRAND_GOLD}; padding: 20px 24px; margin: 24px 0; }
    .detail-row { display: flex; padding: 6px 0; font-size: 14px; color: #333333; }
    .detail-label { font-weight: bold; min-width: 120px; color: ${BRAND_TEXT_GOLD}; }
    .detail-value { color: #333333; }
    .ref-box { text-align: center; background-color: ${BRAND_DARK}; padding: 16px; margin: 24px 0; border-radius: 4px; }
    .ref-label { color: #c9a227; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 4px; }
    .ref-code { color: ${BRAND_GOLD}; font-family: 'Courier New', monospace; font-size: 22px; font-weight: bold; letter-spacing: 4px; margin: 0; }
    .divider { border: none; border-top: 1px solid #e5d9a0; margin: 32px 0; }
    .footer { background-color: #f9f0c0; padding: 24px 40px; text-align: center; }
    .footer p { margin: 0 0 8px; font-size: 12px; color: #7a6a40; line-height: 1.5; }
    .footer a { color: ${BRAND_TEXT_GOLD}; text-decoration: none; }
    @media (max-width: 600px) {
      .body { padding: 24px 20px; }
      .header { padding: 24px 20px; }
      .footer { padding: 20px; }
    }
  </style>
</head>
<body>
<div class="wrapper">
  <!--[if mso]><table width="600" align="center" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
  <div class="container">
    <div class="header">
      <h1>MAHARAJA</h1>
      <p>Authentic Indian Cuisine · Delhi</p>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>456 Spice Avenue, Delhi, India 110001</p>
      <p>
        <a href="tel:+919876543210">+91 98765 43210</a> &nbsp;·&nbsp;
        <a href="mailto:contact@maharajarestaurant.in">contact@maharajarestaurant.in</a>
      </p>
      <p style="margin-top:12px; font-size:11px; color:#aaa;">
        This email was sent because a reservation or enquiry was made on our website.
      </p>
    </div>
  </div>
  <!--[if mso]></td></tr></table><![endif]-->
</div>
</body>
</html>
`.trim();

export interface ReservationEmailData {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  party_size: number;
  special_requests?: string | null;
}

const formatDate = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export function reservationConfirmationHtml(data: ReservationEmailData): string {
  const shortRef = data.id.split('-')[0]?.toUpperCase() ?? data.id.slice(0, 8).toUpperCase();

  return baseLayout(`
    <p class="greeting">Your table is confirmed, ${data.name}!</p>
    <p class="text">
      We're delighted to welcome you to Maharaja. Here are your reservation details:
    </p>

    <div class="ref-box">
      <p class="ref-label">Reference Number</p>
      <p class="ref-code">${shortRef}</p>
    </div>

    <div class="detail-box">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:6px 0; font-size:14px; font-weight:bold; color:${BRAND_TEXT_GOLD}; width:130px;">Date</td>
          <td style="padding:6px 0; font-size:14px; color:#333;">${formatDate(data.date)}</td>
        </tr>
        <tr>
          <td style="padding:6px 0; font-size:14px; font-weight:bold; color:${BRAND_TEXT_GOLD};">Time</td>
          <td style="padding:6px 0; font-size:14px; color:#333;">${data.time}</td>
        </tr>
        <tr>
          <td style="padding:6px 0; font-size:14px; font-weight:bold; color:${BRAND_TEXT_GOLD};">Party size</td>
          <td style="padding:6px 0; font-size:14px; color:#333;">${data.party_size} ${data.party_size === 1 ? 'guest' : 'guests'}</td>
        </tr>
        ${
          data.special_requests
            ? `<tr>
          <td style="padding:6px 0; font-size:14px; font-weight:bold; color:${BRAND_TEXT_GOLD}; vertical-align:top;">Requests</td>
          <td style="padding:6px 0; font-size:14px; color:#333;">${data.special_requests}</td>
        </tr>`
            : ''
        }
      </table>
    </div>

    <p class="text">
      Please quote your reference number <strong>${shortRef}</strong> if you need to modify or cancel.
      To reach us: <a href="tel:+919876543210">+91 98765 43210</a> or reply to this email.
    </p>

    <hr class="divider" />

    <p class="text" style="font-size:13px; color:#888;">
      We're located at 456 Spice Avenue, Delhi 110001.
      Lunch 12:00–15:00 &nbsp;·&nbsp; Dinner 19:00–23:00
    </p>

    <p style="text-align:center; margin:20px 0;">
      <a href="https://maps.google.com/?q=456+Spice+Avenue+Delhi+110001"
         style="display:inline-block; background:${BRAND_GOLD}; color:${BRAND_DARK}; font-weight:bold;
                font-size:13px; padding:10px 24px; border-radius:24px; text-decoration:none;">
        📍 Get Directions
      </a>
    </p>
  `);
}

export interface OrderEmailData {
  orderId: string;
  name: string;
  email: string;
  orderType: string;
  items: { name: string; quantity: number; price: number }[];
  grandTotal: number;
}

const ORDER_TYPE_LABEL: Record<string, string> = {
  'dine-in': 'Dine In 🍽️',
  takeaway: 'Takeaway 🛍️',
  delivery: 'Delivery 🛵',
};

export function orderConfirmationHtml(data: OrderEmailData): string {
  const shortRef = data.orderId.slice(-8).toUpperCase();
  const subtotal = data.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const gst = Math.round(subtotal * 0.05);

  const itemRows = data.items
    .map(
      (i) => `
    <tr>
      <td style="padding:6px 8px; font-size:14px; color:#333;">${i.name}</td>
      <td style="padding:6px 8px; font-size:14px; color:#666; text-align:center;">×${i.quantity}</td>
      <td style="padding:6px 8px; font-size:14px; color:#333; text-align:right; font-weight:bold;">₹${i.price * i.quantity}</td>
    </tr>`
    )
    .join('');

  return baseLayout(`
    <p class="greeting">Your order is confirmed, ${data.name}!</p>
    <p class="text">
      We're preparing your food with love. Here's your order summary:
    </p>

    <div class="ref-box">
      <p class="ref-label">Order Reference</p>
      <p class="ref-code">${shortRef}</p>
    </div>

    <div class="detail-box">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:6px 0; font-size:14px; font-weight:bold; color:${BRAND_TEXT_GOLD}; width:120px;">Order type</td>
          <td style="padding:6px 0; font-size:14px; color:#333;">${ORDER_TYPE_LABEL[data.orderType] ?? data.orderType}</td>
        </tr>
      </table>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0; border:1px solid #e5d9a0; border-radius:6px; overflow:hidden;">
      <thead>
        <tr style="background:#FFF8DC;">
          <th style="padding:8px; font-size:12px; color:${BRAND_TEXT_GOLD}; text-align:left; text-transform:uppercase; letter-spacing:1px;">Item</th>
          <th style="padding:8px; font-size:12px; color:${BRAND_TEXT_GOLD}; text-align:center; text-transform:uppercase; letter-spacing:1px;">Qty</th>
          <th style="padding:8px; font-size:12px; color:${BRAND_TEXT_GOLD}; text-align:right; text-transform:uppercase; letter-spacing:1px;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
        <tr style="border-top:1px solid #e5d9a0; background:#fffdf5;">
          <td colspan="2" style="padding:8px; font-size:13px; color:#666;">Subtotal</td>
          <td style="padding:8px; font-size:13px; color:#333; text-align:right;">₹${subtotal}</td>
        </tr>
        <tr style="background:#fffdf5;">
          <td colspan="2" style="padding:8px; font-size:13px; color:#666;">GST (5%)</td>
          <td style="padding:8px; font-size:13px; color:#333; text-align:right;">₹${gst}</td>
        </tr>
        <tr style="background:#FFF8DC;">
          <td colspan="2" style="padding:10px 8px; font-size:15px; font-weight:bold; color:${BRAND_TEXT_GOLD};">Total Paid</td>
          <td style="padding:10px 8px; font-size:15px; font-weight:bold; color:${BRAND_TEXT_GOLD}; text-align:right;">₹${data.grandTotal}</td>
        </tr>
      </tbody>
    </table>

    <p class="text">
      Questions about your order? Call us at <a href="tel:+919876543210">+91 98765 43210</a> or
      reply to this email. Please quote reference <strong>${shortRef}</strong>.
    </p>

    <hr class="divider" />

    <p class="text" style="font-size:13px; color:#888;">
      Lunch 12:00–15:00 &nbsp;·&nbsp; Dinner 19:00–23:00<br />
      456 Spice Avenue, Delhi 110001
    </p>
  `);
}

export interface ContactNotificationData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function contactNotificationHtml(data: ContactNotificationData): string {
  return baseLayout(`
    <p class="greeting">New contact message</p>
    <p class="text">Someone submitted the contact form on <strong>maharajarestaurant.in</strong>.</p>

    <div class="detail-box">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:6px 0; font-size:14px; font-weight:bold; color:${BRAND_TEXT_GOLD}; width:80px;">From</td>
          <td style="padding:6px 0; font-size:14px; color:#333;">${data.name} &lt;<a href="mailto:${data.email}">${data.email}</a>&gt;</td>
        </tr>
        <tr>
          <td style="padding:6px 0; font-size:14px; font-weight:bold; color:${BRAND_TEXT_GOLD}; vertical-align:top;">Subject</td>
          <td style="padding:6px 0; font-size:14px; color:#333;">${data.subject}</td>
        </tr>
      </table>
    </div>

    <p style="font-size:14px; line-height:1.7; color:#333; white-space:pre-line;">${data.message}</p>

    <hr class="divider" />

    <p class="text" style="font-size:13px;">
      Reply directly to this email to respond to ${data.name}.
    </p>
  `);
}
