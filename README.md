# Civix - Civic Engagement Platform

> A full-stack civic engagement platform empowering citizens and officials to collaborate on civic matters through petitions, polls, and data-driven reports.

## 📚 Documentation Structure

| Document                                                     | Purpose                                              |
| ------------------------------------------------------------ | ---------------------------------------------------- |
| **This README**                                              | Project overview & full-stack setup                  |
| **[BACKEND_README.md](./BACKEND_README.md)**                 | Backend architecture, API reference, database schema |
| **[frontend/client/README.md](./frontend/client/README.md)** | Frontend setup & component guide                     |

---

## 🎯 Project Overview

Civix is a platform designed to strengthen civic engagement by:

- **Citizens** 👥: Submit petitions on local issues, sign community petitions, vote on public polls
- **Officials** 👔: Respond to constituent petitions, create community surveys (polls)
- **Admins** 🔑: Manage users, approve official accounts, generate platform reports

**Technology**: Full-stack Node.js + React application with MongoDB

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                        │
│                  Vite, Shadcn/ui, Axios                     │
│         User Interface & Petition/Poll Management           │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST API
┌────────────────────▼────────────────────────────────────────┐
│                 Backend (Node.js/Express)                   │
│  ✅ JWT Authentication    ✅ RBAC                          │
│  ✅ RESTful APIs          ✅ OTP Verification              │
│  ✅ Email Service         ✅ Report Generation              │
└────────────────────┬────────────────────────────────────────┘
                     │ Mongoose ODM
┌────────────────────▼────────────────────────────────────────┐
│                MongoDB Database                             │
│  Users | Petitions | Polls | Votes | Signatures            │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** v16+
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### One-Command Setup

```bash
# Install both frontend and backend dependencies
npm install

# Copy and configure environment
cp backend/.env.example backend/.env

# Start backend (Terminal 1)
cd backend && npm run dev

# Start frontend (Terminal 2)
cd frontend/client && npm run dev
```

**Access the application:**

- 🌐 Frontend: http://localhost:5173
- 🔌 Backend API: http://localhost:5000/api

---

## 📁 Project Structure

```
civix/
├── backend/                    # Node.js/Express REST API
│   ├── config/                # Database configuration
│   ├── controllers/           # Business logic & request handlers
│   ├── middleware/            # Auth, RBAC middleware
│   ├── models/                # Mongoose schemas (5 collections)
│   ├── routes/                # API endpoint definitions
│   ├── services/              # Utility services (OTP, Email)
│   ├── utils/                 # Helpers (reports, email)
│   ├── server.js              # Express app setup
│   └── package.json
│
├── frontend/
│   └── client/                # React + Vite application
│       ├── src/
│       │   ├── components/    # Reusable UI components
│       │   ├── pages/         # Page components
│       │   ├── context/       # Auth & Toast context
│       │   ├── api/           # Axios HTTP client
│       │   ├── assets/        # Images, styles
│       │   └── App.jsx
│       └── package.json
│
├── BACKEND_README.md          # Detailed backend documentation
├── README.md                  # This file
├── package.json               # Root workspace configuration
└── LICENSE
```

---

## 🔌 Backend Quick Reference

### Core Technologies

| Component      | Tech                           |
| -------------- | ------------------------------ |
| Server         | Express.js 5.2.1               |
| Database       | MongoDB 7.1.0 + Mongoose 9.2.1 |
| Authentication | JWT + bcryptjs                 |
| Email/OTP      | Nodemailer + Custom Service    |
| Reports        | Puppeteer (PDF), json2csv      |

### Key Endpoints

**Authentication:**

```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login with credentials
POST   /api/auth/verify-otp        Verify registration OTP
POST   /api/auth/forgot-password   Request password reset
```

**Petitions:**

```
GET    /api/petitions              List all petitions
POST   /api/petitions              Create petition
GET    /api/petitions/:id          Get petition details
POST   /api/petitions/:id/sign     Sign petition
POST   /api/petitions/:id/respond  Official response
PATCH  /api/petitions/:id/status   Update petition status
```

**Polls:**

```
GET    /api/polls                  List all polls
POST   /api/polls                  Create poll
POST   /api/polls/:id/vote         Vote on poll
GET    /api/polls/:id/results      Get poll results
```

**Admin:**

```
GET    /api/admin/pending-officials    List pending approvals
PUT    /api/admin/approve-official/:id Approve official
```

**Reports:**

```
GET    /api/reports/monthly        Monthly statistics
GET    /api/reports/export/csv     Export as CSV
GET    /api/reports/export/pdf     Generate PDF
```

👉 **Full API documentation**: See [BACKEND_README.md](./BACKEND_README.md#-api-endpoints)

---

## 🔐 Authentication Flow

```
1. User Registration
   ├─ Sign up with email, password, location, role
   ├─ OTP sent to email (or shown in terminal)
   └─ Verify OTP → Account activated

2. User Login
   ├─ Send email + password
   ├─ Server returns JWT token
   └─ Token stored in client (localStorage/sessionStorage)

3. Protected Requests
   ├─ Client includes: Authorization: Bearer <token>
   ├─ authMiddleware validates token signature
   └─ Request processed with req.user context

4. Password Reset
   ├─ Request reset → OTP sent
   ├─ Verify OTP → Set new password
   └─ Login with new credentials
```

---

## 💾 Database Schema Overview

### Collections (5)

**User**

```javascript
{
  (fullName, email, password(hashed), location, role, isVerified, isApproved);
}
```

**Petition**

```javascript
{ title, description, category, location, status, creator, signatures[], response }
```

**Poll**

```javascript
{ question, options[], targetLocation, createdBy, votes[] }
```

**Vote** (tracks poll votes)

```javascript
{
  (pollId, userId, selectedOption);
}
```

**Signature** (tracks petition signatures)

```javascript
{
  (petitionId, userId);
}
```

---

## 🚀 Development Workflow

### Backend Development

```bash
cd backend

# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Server runs on http://localhost:5000
```

### Frontend Development

```bash
cd frontend/client

# Install dependencies
npm install

# Start development server
npm run dev

# App runs on http://localhost:5173
```

### Database Setup

**Option 1: MongoDB Local**

```bash
# Start MongoDB service
mongod

# Connection string in .env
MONGO_URI=mongodb://localhost:27017/civix
```

**Option 2: MongoDB Atlas (Cloud)**

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/civix
```

**Initialize Data (Optional)**

```bash
cd backend

# Seed test data
node qa_seed.js

# Create admin account
node createAdmin.js

# Approve officials for testing
node approve_officials.js
```

---

## 🔑 Environment Configuration

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/civix

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# Email (Optional)
EMAIL_ENABLED=false
DEV_SHOW_OTP=true
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend (src/api/axios.js)

```javascript
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
});
```

---

## 🧪 Testing

### Manual API Testing

Use **Postman** or **VS Code REST Client**:

```http
### Register User
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "location": "New York",
  "role": "citizen"
}

### Verify OTP
POST http://localhost:5000/api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}

### Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

### Create Petition (Requires JWT)
POST http://localhost:5000/api/petitions
Content-Type: application/json
Authorization: Bearer <your-token>

{
  "title": "Fix Potholes",
  "description": "Main street needs repair",
  "category": "Infrastructure",
  "location": "Downtown"
}
```

---

## 🎨 Frontend Features

The React frontend provides:

- **Authentication Pages**: Register, Login, Forgot Password, OTP Verification
- **Citizen Dashboard**: View/create petitions, sign petitions, vote on polls
- **Official Dashboard**: View petitions, submit responses, create polls
- **Admin Dashboard**: Manage users, approve officials, view reports
- **Responsive UI**: Built with Shadcn/ui components and Vite

---

## 📊 Use Cases

### For Citizens

1. ✅ Create a petition about local issue
2. ✅ Sign other citizens' petitions
3. ✅ Vote in community polls
4. ✅ View official responses to petitions

### For Officials

1. ✅ View petitions from constituents
2. ✅ Respond to petitions
3. ✅ Create community surveys/polls
4. ✅ Access monthly activity reports

### For Admins

1. ✅ Review pending official registrations
2. ✅ Approve/reject officials
3. ✅ Generate platform reports
4. ✅ Export data (CSV/PDF)

---

## 🔒 Security Features

- ✅ **Password Security**: bcryptjs hashing with salt
- ✅ **JWT Authentication**: Stateless token-based auth
- ✅ **Email Verification**: OTP-based account activation
- ✅ **RBAC**: Role-based access control (Citizen/Official/Admin)
- ✅ **Password Reset**: Secure OTP-verified reset flow
- ✅ **Input Validation**: Mongoose schema validation
- ✅ **CORS Protection**: Configurable cross-origin requests

---

## 📈 Scalability Considerations

1. **Database Indexing**: Indexes on email, role, status, creator
2. **Connection Pooling**: Mongoose manages MongoDB pool
3. **Pagination**: Implement for large result sets
4. **Caching**: Consider Redis for frequent queries
5. **Load Balancing**: Use Nginx reverse proxy for multiple instances

---

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check MongoDB connection
mongod

# Check environment variables
cat backend/.env

# Check port availability
netstat -an | grep 5000
```

### OTP not working

```env
# Dev mode: OTP prints to terminal
DEV_SHOW_OTP=true

# Email mode: Configure Gmail
EMAIL_ENABLED=true
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=app_password  # Use 2FA App Password
```

### Frontend can't connect to backend

```javascript
// Check axios config in src/api/axios.js
// Ensure BASE_URL matches backend PORT
// Check CORS is enabled in server.js
```

---

## 📚 Additional Resources

- **Backend Deep Dive**: [BACKEND_README.md](./BACKEND_README.md)
- **API Reference**: [BACKEND_README.md#-api-endpoints](./BACKEND_README.md#-api-endpoints)
- **Database Schema**: [BACKEND_README.md#-database-schema](./BACKEND_README.md#-database-schema)
- **Frontend Docs**: [frontend/client/README.md](./frontend/client/README.md)

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Commit changes: `git commit -m "Add feature"`
3. Push to branch: `git push origin feature/feature-name`
4. Submit pull request

---

## 📄 License

ISC License - See [LICENSE](./LICENSE) file for details

---

## 📧 Contact & Support

**Backend Development**: Akash Rao  
**Project**: Civix - Civic Engagement Platform  
**Current Date**: April 2026

---

## 🗺️ Roadmap

- [ ] Unit & integration tests
- [ ] WebSocket support for real-time notifications
- [ ] File upload for petition attachments
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support

---

**Happy coding! 🚀**
