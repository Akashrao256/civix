const { Parser } = require("json2csv");

const getSafeReportData = (data = {}) => ({
  meta: {
    month: data.meta?.month || "Unknown",
  },
  summary: {
    totalPetitions: Number(data.summary?.totalPetitions || 0),
    totalSignatures: Number(data.summary?.totalSignatures || 0),
    totalPolls: Number(data.summary?.totalPolls || 0),
    totalVotes: Number(data.summary?.totalVotes || 0),
  },
  statusBreakdown: {
    active: Number(data.statusBreakdown?.active || 0),
    pending: Number(data.statusBreakdown?.pending || 0),
    underReview: Number(data.statusBreakdown?.underReview || 0),
    closed: Number(data.statusBreakdown?.closed || 0),
  },
});

exports.generateCSV = (data, res) => {
  const safeData = getSafeReportData(data);

  const formattedData = [
    { Section: "Summary", Metric: "Month", Value: safeData.meta.month },
    {
      Section: "Summary",
      Metric: "Total Petitions",
      Value: safeData.summary.totalPetitions,
    },
    {
      Section: "Summary",
      Metric: "Total Signatures",
      Value: safeData.summary.totalSignatures,
    },
    {
      Section: "Summary",
      Metric: "Total Polls",
      Value: safeData.summary.totalPolls,
    },
    {
      Section: "Summary",
      Metric: "Total Votes",
      Value: safeData.summary.totalVotes,
    },
    {
      Section: "Status",
      Metric: "Active",
      Value: safeData.statusBreakdown.active,
    },
    {
      Section: "Status",
      Metric: "Pending",
      Value: safeData.statusBreakdown.pending,
    },
    {
      Section: "Status",
      Metric: "Under Review",
      Value: safeData.statusBreakdown.underReview,
    },
    {
      Section: "Status",
      Metric: "Closed",
      Value: safeData.statusBreakdown.closed,
    },
  ];

  const parser = new Parser({
    fields: ["Section", "Metric", "Value"],
  });

  const csv = parser.parse(formattedData);

  res.header("Content-Type", "text/csv");
  res.attachment("monthly-report.csv");

  return res.send(csv);
};
