const Petition = require("../models/Petition");
const Signature = require("../models/Signature");
const Poll = require("../models/Poll");
const Vote = require("../models/Vote");

exports.getMonthlyReportData = async () => {
  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

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
      month: now.toLocaleString("en-US", { month: "long" }),
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
