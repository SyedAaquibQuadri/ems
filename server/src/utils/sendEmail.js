import nodemailer from 'nodemailer'
import { google } from 'googleapis'

const sendEmail = async ({ to, subject, html }) => {
  const requiredVars = ['GMAIL_CLIENT_ID', 'GMAIL_CLIENT_SECRET', 'GMAIL_REFRESH_TOKEN', 'GMAIL_FROM_EMAIL']
  const missing = requiredVars.filter(v => !process.env[v])
  if (missing.length) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`)
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  )

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  })

  try {
    const { credentials } = await oauth2Client.refreshAccessToken()
    const accessToken = credentials.access_token

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_FROM_EMAIL,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    })

    const result = await transporter.sendMail({
      from: `"EMS App" <${process.env.GMAIL_FROM_EMAIL}>`,
      to,
      subject,
      html,
    })
    console.log('Email sent successfully:', result.messageId)
    return result
  } catch (error) {
    console.error('Email send error:', error.message)
    throw error
  }
}

export default sendEmail