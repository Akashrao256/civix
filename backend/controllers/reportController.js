const { getMonthlyReportData } = require("../services/reportService");
const { generateCSV } = require("../utils/reportGenerator");
const { generatePDF } = require("../utils/puppeteerReportGenerator");

// GET JSON Report
exports.getMonthlyReport = async (req, res) => {
  try {
    const report = await getMonthlyReportData(req.query.month);

    res.status(200).json(report);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};


// Export CSV
exports.exportCSV = async (req, res) => {
  try {
    const report = await getMonthlyReportData(req.query.month);

    return generateCSV(report, res);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};


// Export PDF
exports.exportPDF = async (req, res) => {
  try {
    const report = await getMonthlyReportData(req.query.month);

    return generatePDF(report, res);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
