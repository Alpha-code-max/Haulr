import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const sendEmail = async (options: SendEmailOptions) => {
  // Try to use provided SMTP credentials, otherwise fallback to standard logs
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM_EMAIL, NODE_ENV } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      console.warn("SMTP credentials (SMTP_HOST, SMTP_USER, SMTP_PASS) not found in .env. Email will be logged instead of sent.");
      return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || "587"),
    secure: parseInt(SMTP_PORT || "587") === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const mailOptions = {
    from: SMTP_FROM_EMAIL || `"Haulr Support" <noreply@haulr.com>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent to ${options.to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
