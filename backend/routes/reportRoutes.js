const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
	getMonthlyReport,
	exportCSV,
	exportPDF,
} = require("../controllers/reportController");

router.get("/monthly", protect, getMonthlyReport);
router.get("/export/csv", protect, exportCSV);
router.get("/export/pdf", protect, exportPDF);

module.exports = router;
