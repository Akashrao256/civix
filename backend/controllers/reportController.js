const { getMonthlyReportData } = require("../services/reportService");
const { generateCSV, generatePDF } = require("../utils/reportGenerator");

// GET JSON Report
exports.getMonthlyReport = async (req, res) => {
  try {

    const report = await getMonthlyReportData();

    res.status(200).json(report);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Export CSV
exports.exportCSV = async (req, res) => {
  try {

    const report = await getMonthlyReportData();

    return generateCSV(report, res);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Export PDF
exports.exportPDF = async (req, res) => {
  try {

    const report = await getMonthlyReportData();

    return generatePDF(report, res);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};