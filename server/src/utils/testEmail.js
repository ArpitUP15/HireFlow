import "dotenv/config";

import {
  verifyEmailConfiguration,
  sendEmail,
} from "../services/emailService.js";

const testEmail = async () => {
  try {
    console.log("🔄 Testing Mailtrap SMTP...");

    console.log(
      "SMTP_HOST:",
      process.env.SMTP_HOST
    );

    console.log(
      "SMTP_PORT:",
      process.env.SMTP_PORT
    );

    console.log(
      "SMTP_USER:",
      process.env.SMTP_USER
    );

    console.log(
      "SMTP_PASS configured:",
      Boolean(process.env.SMTP_PASS)
    );

    console.log(
      "SMTP_FROM:",
      process.env.SMTP_FROM
    );

    await verifyEmailConfiguration();

    const testRecipient =
      process.env.SMTP_TEST_TO ||
      "arpitbansal1975@gmail.com";

    await sendEmail({
      to: testRecipient,

      subject: "HireFlow SMTP Test",

      text: `
Hello,

This is a test email from HireFlow.

Your Gmail SMTP configuration is working correctly.

Regards,
HireFlow
      `,

      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>HireFlow SMTP Test</h2>

          <p>
            Hello,
          </p>

          <p>
            This is a test email from HireFlow.
          </p>

          <p>
            Your Gmail SMTP configuration is working correctly.
          </p>

          <br />

          <p>
            Regards,<br />
            <strong>HireFlow</strong>
          </p>
        </div>
      `,
    });

    console.log(
      "🎉 SMTP test completed successfully!"
    );
  } catch (error) {
    console.error(
      "❌ SMTP test failed:"
    );

    console.error(
      error.message
    );

    if (error.response) {
      console.error(
        "SMTP Response:",
        error.response
      );
    }

    if (error.code) {
      console.error(
        "Error Code:",
        error.code
      );
    }
  }
};

testEmail();