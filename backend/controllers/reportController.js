const Petition = require("../models/Petition");
const Signature = require("../models/Signature");
const Poll = require("../models/Poll");
const Vote = require("../models/Vote");

exports.getMonthlyReport = async (req, res) => {
  try {
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

    res.status(200).json({
      month: now.toLocaleString("en-US", { month: "long" }),
      totalPetitions,
      activePetitions,
      closedPetitions,
      pendingPetitions,
      underReviewPetitions,
      totalSignatures,
      totalPolls,
      totalVotes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
