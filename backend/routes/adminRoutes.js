const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getPendingOfficials,
  approveOfficial
} = require("../controllers/adminController");

router.get("/pending-officials", protect, getPendingOfficials);

router.put("/approve-official/:id", protect, approveOfficial);

module.exports = router;