const Petition = require("../models/Petition");
const Signature = require("../models/Signature");
const Poll = require("../models/Poll");
const Vote = require("../models/Vote");

const REPORT_MONTH_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])$/;

const resolveReportMonth = (monthParam) => {
  if (!monthParam) {
    const now = new Date();
    const startOfMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
    );
    const endOfMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
    );

    return {
      startOfMonth,
      endOfMonth,
      label: startOfMonth.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }),
    };
  }

  const match = monthParam.match(REPORT_MONTH_PATTERN);
  if (!match) {
    const error = new Error("Invalid month format. Use YYYY-MM.");
    error.statusCode = 400;
    throw error;
  }

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const startOfMonth = new Date(Date.UTC(year, monthIndex, 1));
  const endOfMonth = new Date(Date.UTC(year, monthIndex + 1, 1));

  return {
    startOfMonth,
    endOfMonth,
    label: startOfMonth.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }),
  };
};

exports.getMonthlyReportData = async (monthParam) => {
  const { startOfMonth, endOfMonth, label } = resolveReportMonth(monthParam);

  const createdAtFilter = {
    createdAt: { $gte: startOfMonth, $lt: endOfMonth },
  };

  const [
    totalPetitions,
    activePetitions,
    closedPetitions,
    pendingPetitions,
    underReviewPetitions,
    totalSignatures,
    totalPolls,
    totalVotes,
  ] = await Promise.all([
    Petition.countDocuments(createdAtFilter),
    Petition.countDocuments({ ...createdAtFilter, status: "active" }),
    Petition.countDocuments({ ...createdAtFilter, status: "closed" }),
    Petition.countDocuments({ ...createdAtFilter, status: "pending" }),
    Petition.countDocuments({ ...createdAtFilter, status: "under_review" }),
    Signature.countDocuments(createdAtFilter),
    Poll.countDocuments(createdAtFilter),
    Vote.countDocuments(createdAtFilter),
  ]);

  return {
    meta: {
      month: label,
      generatedAt: new Date(),
    },

    summary: {
      totalPetitions,
      totalSignatures,
      totalPolls,
      totalVotes,
    },

    statusBreakdown: {
      active: activePetitions,
      pending: pendingPetitions,
      underReview: underReviewPetitions,
      closed: closedPetitions,
    },
  };
};
