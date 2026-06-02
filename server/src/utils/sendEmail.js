import nodemailer from 'nodemailer'

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('EMAIL_USER or EMAIL_PASS environment variables are not set')
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  try {
    const result = await transporter.sendMail({
      from: `"EMS App" <${process.env.EMAIL_USER}>`,
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