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
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/petitions", require("./routes/petitionRoutes"));
app.use("/api/polls", require("./routes/pollRoutes"));

app.get("/", (req, res) => {
  res.send("Civix Backend Running...");
});

const PORT = process.env.PORT;

app.listen(PORT, () =>
  console.log(`Server running on ${PORT}`)
);