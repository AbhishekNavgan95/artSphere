const transporter = require("../config/mailConfig");

const sendMail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📩 Mail sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Mail error:", error);
    return { success: false, error };
  }
};

module.exports = sendMail;
