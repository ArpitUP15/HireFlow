import nodemailer from "nodemailer";

const normalizeEnvValue = (value) => {
  if (typeof value !== "string") return value;

  return value.trim().replace(/^['"]|['"]$/g, "");
};

const getSmtpConfig = () => ({
  host: normalizeEnvValue(process.env.SMTP_HOST) || "live.smtp.mailtrap.io",
  port: Number(normalizeEnvValue(process.env.SMTP_PORT) || 587),
  secure: false,
  auth: {
    user: normalizeEnvValue(process.env.SMTP_USER) || "api",
    pass: normalizeEnvValue(process.env.SMTP_PASS),
  },
  requireTLS: true,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

export const verifyEmailConfiguration = async () => {
  const smtpUser = normalizeEnvValue(process.env.SMTP_USER) || "api";
  const smtpPass = normalizeEnvValue(process.env.SMTP_PASS);

  if (!smtpPass) {
    throw new Error(
      "SMTP_PASS is missing. For Mailtrap, use your SMTP token from the Mailtrap inbox settings."
    );
  }

  const transporter = nodemailer.createTransport(getSmtpConfig());
  await transporter.verify();

  console.log("✅ Mailtrap SMTP configuration verified successfully");
};

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}) => {
  if (!to) {
    throw new Error("Recipient email is required");
  }

  if (!subject) {
    throw new Error("Email subject is required");
  }

  const transporter = nodemailer.createTransport(getSmtpConfig());

  const mailOptions = {
    from: normalizeEnvValue(process.env.SMTP_FROM),
    to,
    subject,
    text,
    html,
  };

  const result = await transporter.sendMail(mailOptions);

  console.log(`✅ Email sent successfully to ${to}`);

  return result;
};

export default nodemailer.createTransport(getSmtpConfig());