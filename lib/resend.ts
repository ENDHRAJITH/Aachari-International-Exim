import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!

export async function sendEnquiryEmail(data: {
  name: string
  email: string
  phone: string
  country: string
  city: string
  message: string
  productName: string
}) {
  try {
    await resend.emails.send({
      from: 'Aachari International <onboarding@resend.dev>',
      to: ADMIN_EMAIL,
      subject: `New Enquiry — ${data.productName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="margin:0; padding:0; background-color:#F8F7F4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <div style="max-width:600px; margin:0 auto; padding:32px 16px;">

            <!-- Header -->
            <div style="background-color:#C1622A; border-radius:16px 16px 0 0; padding:28px 32px;">
              <p style="margin:0; color:#ffffff; font-size:12px; font-weight:600; letter-spacing:1px; text-transform:uppercase; opacity:0.85;">
                Aachari International Exim
              </p>
              <h1 style="margin:8px 0 0; color:#ffffff; font-size:22px; font-weight:700;">
                New Product Enquiry
              </h1>
            </div>

            <!-- Body card -->
            <div style="background-color:#ffffff; border:1px solid #E8E0D8; border-top:none; border-radius:0 0 16px 16px; padding:32px;">

              <!-- Product highlight -->
              <div style="background-color:#FAFAF8; border:1px solid #E8E0D8; border-radius:12px; padding:16px 20px; margin-bottom:24px;">
                <p style="margin:0; font-size:11px; font-weight:600; color:#9B9B9B; text-transform:uppercase; letter-spacing:0.5px;">
                  Product Enquired
                </p>
                <p style="margin:4px 0 0; font-size:17px; font-weight:700; color:#1A1A1A;">
                  ${data.productName}
                </p>
              </div>

              <!-- Details table -->
              <table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
                <tr>
                  <td style="padding:12px 0; border-bottom:1px solid #F0EBE3; font-size:13px; color:#6B6B6B; font-weight:500; width:120px; vertical-align:top;">Name</td>
                  <td style="padding:12px 0; border-bottom:1px solid #F0EBE3; font-size:14px; color:#1A1A1A; font-weight:600;">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding:12px 0; border-bottom:1px solid #F0EBE3; font-size:13px; color:#6B6B6B; font-weight:500; vertical-align:top;">Email</td>
                  <td style="padding:12px 0; border-bottom:1px solid #F0EBE3; font-size:14px;">
                    <a href="mailto:${data.email}" style="color:#C1622A; text-decoration:none; font-weight:600;">${data.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0; border-bottom:1px solid #F0EBE3; font-size:13px; color:#6B6B6B; font-weight:500; vertical-align:top;">Phone</td>
                  <td style="padding:12px 0; border-bottom:1px solid #F0EBE3; font-size:14px; color:#1A1A1A; font-weight:600;">
                    ${data.phone ? `<a href="tel:${data.phone}" style="color:#1A1A1A; text-decoration:none; font-weight:600;">${data.phone}</a>` : '—'}
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0; border-bottom:1px solid #F0EBE3; font-size:13px; color:#6B6B6B; font-weight:500; vertical-align:top;">Country</td>
                  <td style="padding:12px 0; border-bottom:1px solid #F0EBE3; font-size:14px; color:#1A1A1A; font-weight:600;">${data.country || '—'}</td>
                </tr>
                <tr>
                  <td style="padding:12px 0; font-size:13px; color:#6B6B6B; font-weight:500; vertical-align:top;">City</td>
                  <td style="padding:12px 0; font-size:14px; color:#1A1A1A; font-weight:600;">${data.city || '—'}</td>
                </tr>
              </table>

              <!-- Message -->
              <p style="margin:0 0 8px; font-size:11px; font-weight:600; color:#9B9B9B; text-transform:uppercase; letter-spacing:0.5px;">
                Message
              </p>
              <div style="background-color:#FAFAF8; border:1px solid #E8E0D8; border-radius:12px; padding:16px 20px;">
                <p style="margin:0; font-size:14px; color:#3D3D3D; line-height:1.7; white-space:pre-wrap;">${data.message}</p>
              </div>

              <!-- CTA -->
              <div style="margin-top:28px; text-align:center;">
                <a href="mailto:${data.email}" style="display:inline-block; background-color:#C1622A; color:#ffffff; text-decoration:none; padding:13px 28px; border-radius:10px; font-size:14px; font-weight:600;">
                  Reply to ${data.name}
                </a>
              </div>
            </div>

            <!-- Footer -->
            <p style="text-align:center; font-size:11px; color:#9B9B9B; margin-top:20px;">
              This enquiry was submitted via aachariinternational.com
            </p>
          </div>
        </body>
        </html>
      `
    })
    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}