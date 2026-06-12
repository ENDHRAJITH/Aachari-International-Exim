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
        <h2>New Enquiry Received</h2>
        <table>
          <tr><td><b>Name</b></td><td>${data.name}</td></tr>
          <tr><td><b>Email</b></td><td>${data.email}</td></tr>
          <tr><td><b>Phone</b></td><td>${data.phone}</td></tr>
          <tr><td><b>Country</b></td><td>${data.country}</td></tr>
          <tr><td><b>City</b></td><td>${data.city}</td></tr>
          <tr><td><b>Product</b></td><td>${data.productName}</td></tr>
          <tr><td><b>Message</b></td><td>${data.message}</td></tr>
        </table>
      `
    })
    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}