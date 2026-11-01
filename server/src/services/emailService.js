
import nodemailer from "nodemailer";

const normalizeEnvValue = (value) => {
  if (typeof value !== "string") return value;
  return value.trim().replace(/^['"]|['"]$/g, "");
};

const getSmtpConfig = () => ({
  host: normalizeEnvValue(process.env.SMTP_HOST) || "live.smtp.mailtrap.io",
  port: Number(normalizeEnvValue(process.env.SMTP_PORT) || 587),
  secure: Number(normalizeEnvValue(process.env.SMTP_PORT) || 587) === 465,
  auth: {
    user: normalizeEnvValue(process.env.SMTP_USER) || "api",
    pass: normalizeEnvValue(process.env.SMTP_PASS),
  },
  requireTLS: Number(normalizeEnvValue(process.env.SMTP_PORT) || 587) !== 465,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

export const isEmailConfigured = () => Boolean(
  normalizeEnvValue(process.env.RESEND_API_KEY) ||
  normalizeEnvValue(process.env.SMTP_PASS)
);

export const verifyEmailConfiguration = async () => {
  if (normalizeEnvValue(process.env.RESEND_API_KEY)) {
    // Resend verifies credentials on API requests; no SMTP connection is needed.
    return true;
  }

  if (!normalizeEnvValue(process.env.SMTP_PASS)) {
    throw new Error("Configure RESEND_API_KEY or SMTP_PASS to enable invitation emails.");
  }

  const transporter = nodemailer.createTransport(getSmtpConfig());
  await transporter.verify();
  return true;
};

export const sendEmail = async ({ to, subject, text, html }) => {
  if (!to) throw new Error("Recipient email is required");
  if (!subject) throw new Error("Email subject is required");

  const resendApiKey = normalizeEnvValue(process.env.RESEND_API_KEY);
  const from = normalizeEnvValue(process.env.EMAIL_FROM || process.env.SMTP_FROM);

  if (resendApiKey) {
    if (!from) {
      throw new Error("EMAIL_FROM is required when using Resend. Use a sender address on a verified domain.");
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, text, html }),
      signal: AbortSignal.timeout(15000),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detail = result.message || result.error || `Resend returned HTTP ${response.status}`;
      throw new Error(`Email provider rejected the message: ${detail}`);
    }
    return { provider: "resend", id: result.id };
  }

  const smtpPass = normalizeEnvValue(process.env.SMTP_PASS);
  if (!smtpPass) throw new Error("Email is not configured. Set RESEND_API_KEY or SMTP_PASS in server/.env.");
  if (!from) throw new Error("EMAIL_FROM or SMTP_FROM is required to send email.");

  const transporter = nodemailer.createTransport(getSmtpConfig());
  const result = await transporter.sendMail({ from, to, subject, text, html });
  return { provider: "smtp", messageId: result.messageId };
};

export default nodemailer.createTransport(getSmtpConfig());
