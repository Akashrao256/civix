const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;

const generateOtp = () =>
  Math.floor(10 ** (OTP_LENGTH - 1) + Math.random() * 9 * 10 ** (OTP_LENGTH - 1)).toString();

const getOtpExpiry = (minutes = OTP_EXPIRY_MINUTES) =>
  new Date(Date.now() + minutes * 60 * 1000);

const assignRegistrationOtp = (user, minutes = OTP_EXPIRY_MINUTES) => {
  const otp = generateOtp();
  user.otp = otp;
  user.otpExpires = getOtpExpiry(minutes);
  return otp;
};

const assignResetOtp = (user, minutes = OTP_EXPIRY_MINUTES) => {
  const otp = generateOtp();
  user.resetOtp = otp;
  user.resetOtpExpires = getOtpExpiry(minutes);
  user.resetOtpVerified = false;
  return otp;
};

const verifyRegistrationOtp = (user, otp) => {
  if (!user.otp || user.otp !== otp) {
    return { valid: false, message: "Invalid OTP" };
  }

  if (!user.otpExpires || user.otpExpires < Date.now()) {
    return { valid: false, message: "OTP expired" };
  }

  return { valid: true };
};

const verifyPasswordResetOtp = (user, otp) => {
  if (!user.resetOtp || user.resetOtp !== otp) {
    return { valid: false, message: "Invalid OTP" };
  }

  if (!user.resetOtpExpires || user.resetOtpExpires < Date.now()) {
    return { valid: false, message: "OTP expired" };
  }

  return { valid: true };
};

const getOtpMessage = (type, otp, minutes = OTP_EXPIRY_MINUTES) => {
  if (type === "registration") {
    return {
      subject: "Your Civix OTP Verification Code",
      text: `Your OTP is ${otp}. It will expire in ${minutes} minutes.`,
    };
  }

  if (type === "reset") {
    return {
      subject: "Your Civix Password Reset OTP",
      text: `Your password reset OTP is ${otp}. It will expire in ${minutes} minutes.`,
    };
  }

  throw new Error(`Unsupported OTP message type: ${type}`);
};

module.exports = {
  OTP_EXPIRY_MINUTES,
  assignRegistrationOtp,
  assignResetOtp,
  verifyRegistrationOtp,
  verifyPasswordResetOtp,
  getOtpMessage,
};
