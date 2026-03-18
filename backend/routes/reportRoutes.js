const express = require("express");
const router = express.Router();
const { getMonthlyReport } = require("../controllers/reportController");

router.get("/monthly", getMonthlyReport);

module.exports = router;
