## 🔐 OTP Verification Setup

### 📌 Overview

OTP is used for:

- Email verification (registration)
- Password reset

Supports:

- **Development mode** (no setup)
- **Email mode** (optional)

---

### 🧪 Development Mode (Default)

No setup required.
OTP will be shown in the backend terminal:

[OTP:REGISTRATION] email=test@example.com otp=123456

👉 Use this OTP in the frontend.

---

### 📧 Email Mode (Optional)

To receive OTP via email:

1. Create `.env` in `backend`:

EMAIL_ENABLED=true
DEV_SHOW_OTP=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

2. Use Gmail App Password (enable 2FA)

3. Restart server:

npm run dev

---

### 📬 Result

- Dev mode → OTP in terminal
- Email mode → OTP in email

---

### Admin Credentials (for testing)

Email: admin@civix.com
Password: Admin123
Role: admin
