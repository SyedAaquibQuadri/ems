import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  })

  try {
    await transporter.verify()
    console.log('Email server connected ✅')
  } catch (err) {
    console.error('Email server error:', err.message)
    throw new Error('Email service unavailable')
  }

  await transporter.sendMail({
    from: `"EMS App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  })
}

export default sendEmail