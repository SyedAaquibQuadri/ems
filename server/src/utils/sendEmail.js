import axios from 'axios'

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY not set')
  }

  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        to: [{ email: to }],
        sender: { email: process.env.GMAIL_FROM_EMAIL, name: 'EMS App' },
        subject,
        htmlContent: html,
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    )
    console.log('Email sent via Brevo:', response.data.messageId)
    return response.data
  } catch (error) {
    console.error('Brevo email error:', error.response?.data || error.message)
    throw error
  }
}

export default sendEmail