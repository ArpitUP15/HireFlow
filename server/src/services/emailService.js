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

  const smtpPass = normalizeEnvValue(process.env.SMTP_PASS);
  if (!smtpPass) {
    throw new Error(
      "SMTP_PASS is not configured. Configure SMTP credentials to send invitation emails."
    );
  }

  const from = normalizeEnvValue(process.env.SMTP_FROM);
  if (!from) {
    throw new Error(
      "SMTP_FROM is not configured. Set a verified sender email address to send invitation emails."
    );
  }

  const transporter = nodemailer.createTransport(getSmtpConfig());

  const mailOptions = {
    from,
    to,
    subject,
    text,
    html,
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    const response = String(error.response || "");
    if (
      error.responseCode === 554 &&
      /demo domains can only be used/i.test(response)
    ) {
      const deliveryError = new Error(
        "Mailtrap rejected this recipient because the configured demo sender can only email the Mailtrap account owner. Verify a sending domain in Mailtrap and set SMTP_FROM to an address on that domain to invite other users."
      );
      deliveryError.statusCode = 502;
      throw deliveryError;
    }

    throw error;
  }
};

export default nodemailer.createTransport(getSmtpConfig());