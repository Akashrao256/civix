const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const mongoUri = process.env.MONGO_URI;


app.use(cors());
app.use(express.json());

if (!mongoUri) {
  console.error("MongoDB connection error: MONGO_URI is not set");
  process.exit(1);
}



mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });


app.get("/", (req, res) => {
  res.status(200).json({ status: "ok" });
});

