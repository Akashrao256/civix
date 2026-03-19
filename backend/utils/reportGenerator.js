const { Parser } = require("json2csv");

// CSV
exports.generateCSV = (data, res) => {

  const fields = [
    "month",
    "totalPetitions",
    "activePetitions",
    "closedPetitions",
    "pendingPetitions",
    "underReviewPetitions",
    "totalSignatures",
    "totalPolls",
    "totalVotes"
  ];

  const parser = new Parser({ fields });

  const csv = parser.parse([data]); // wrap in array

  res.header("Content-Type", "text/csv");
  res.attachment("monthly-report.csv");

  return res.send(csv);
};


const PDFDocument = require("pdfkit");

exports.generatePDF = (data, res) => {

  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=monthly-report.pdf");

  doc.pipe(res);

  doc.fontSize(18).text("Monthly Civic Report", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Month: ${data.month}`);
  doc.text(`Total Petitions: ${data.totalPetitions}`);
  doc.text(`Active Petitions: ${data.activePetitions}`);
  doc.text(`Closed Petitions: ${data.closedPetitions}`);
  doc.text(`Pending Petitions: ${data.pendingPetitions}`);
  doc.text(`Under Review: ${data.underReviewPetitions}`);
  doc.text(`Total Signatures: ${data.totalSignatures}`);
  doc.text(`Total Polls: ${data.totalPolls}`);
  doc.text(`Total Votes: ${data.totalVotes}`);

  doc.end();
};