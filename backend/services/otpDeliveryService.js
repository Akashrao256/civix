const sendEmail = require("../utils/sendEmail");
const { getOtpMessage, OTP_EXPIRY_MINUTES } = require("./otpService");

const deliverOtp = async ({ email, otp, type, minutes = OTP_EXPIRY_MINUTES }) => {
  const { subject, text } = getOtpMessage(type, otp, minutes);

  if (process.env.NODE_ENV !== "production") {
    console.log(
      `[OTP:${type.toUpperCase()}] email=${email} otp=${otp} expiresInMinutes=${minutes}`,
    );
    return;
  }

  await sendEmail(email, subject, text);
};

module.exports = { deliverOtp };
