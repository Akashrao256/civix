const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const petitionRoutes = require("./routes/petitionRoutes");
const pollRoutes = require("./routes/pollRoutes");
const reportRoutes = require("./routes/reportRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/petitions", petitionRoutes);
app.get("/api/polls-test", (req, res) => res.json({ message: "polls test route works" }));
app.use("/api/polls", pollRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.send("Civix Backend Running...");
});

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

const sendEmail = require("./utils/sendEmail");

app.get("/test-email", async (req, res) => {
  await sendEmail(
    "akashrao2562004@gmail.com",
    "Civix Test Email",
    "Email system working successfully",
  );

  res.send("Test email sent");
});
