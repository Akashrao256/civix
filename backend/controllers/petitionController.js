const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Petition = require("../models/Petition");
const Signature = require("../models/Signature");

/* ===================================================
   CREATE PETITION
=================================================== */
exports.createPetition = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({
        message: "title, description, category, and location are required",
      });
    }

    const petition = await Petition.create({
      title,
      description,
      category,
      location,
      creator: req.user.id,
    });

    res.status(201).json({
      message: "Petition created successfully",
      petition,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===================================================
   SIGN PETITION
=================================================== */
exports.signPetition = async (req, res) => {
  try {
    const petitionId = req.params.id;
    const userId = req.user.id;

    // 🔐 ROLE CHECK HERE (correct place)
    if (req.user.role !== "citizen") {
      return res.status(403).json({
        message: "Only citizens can sign petitions",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(petitionId)) {
      return res.status(400).json({ message: "Invalid Petition ID" });
    }

    const petition = await Petition.findById(petitionId);
    if (!petition || petition.isDeleted) {
      return res.status(404).json({ message: "Petition not found" });
    }

    const alreadySigned = await Signature.findOne({
      petition: petitionId,
      user: userId,
    });

    if (alreadySigned) {
      return res.status(400).json({
        message: "You have already signed this petition",
      });
    }

    await Signature.create({
      petition: petitionId,
      user: userId,
    });

    const signatureCount = await Signature.countDocuments({
      petition: petitionId,
    });

    res.status(201).json({
      message: "Petition signed successfully",
      signatureCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===================================================
   GET PETITIONS (FILTER + PAGINATION)
=================================================== */
exports.getPetitions = async (req, res) => {
  try {
    const { location, category, status, page = 1, limit = 10 } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const requester = req.user || null;

    const conditions = [];

    if (requester?.role !== "official") {
      conditions.push({ isDeleted: false });
      if (requester?.role === "citizen") {
        conditions.push({
          $or: [{ status: "active" }, { creator: requester.id }],
        });
      } else {
        conditions.push({ status: "active" });
      }
    }

    if (location)
      conditions.push({ location: { $regex: location, $options: "i" } });

    if (category)
      conditions.push({ category: { $regex: category, $options: "i" } });

    if (status) conditions.push({ status });

    const filter =
      conditions.length > 1 ? { $and: conditions } : conditions[0] || {};

    const petitions = await Petition.find(filter)
      .populate("creator", "fullName email")
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    const petitionsWithCount = await Promise.all(
      petitions.map(async (petition) => {
        const count = await Signature.countDocuments({
          petition: petition._id,
        });

        return {
          ...petition.toObject(),
          signatureCount: count,
        };
      }),
    );

    const total = await Petition.countDocuments(filter);

    res.status(200).json({
      total,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      petitions: petitionsWithCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===================================================
   UPDATE PETITION (Creator Only)
=================================================== */
exports.updatePetition = async (req, res) => {
  try {
    const petitionId = req.params.id;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(petitionId)) {
      return res.status(400).json({ message: "Invalid Petition ID" });
    }

    const petition = await Petition.findById(petitionId);

    if (!petition || petition.isDeleted) {
      return res.status(404).json({ message: "Petition not found" });
    }

    if (petition.creator.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to edit" });
    }

    if (petition.status === "closed") {
      return res.status(400).json({ message: "Cannot edit closed petition" });
    }

    const { title, description, category, location } = req.body;

    petition.title = title || petition.title;
    petition.description = description || petition.description;
    petition.category = category || petition.category;
    petition.location = location || petition.location;

    await petition.save();

    res.status(200).json({
      message: "Petition updated successfully",
      petition,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===================================================
   UPDATE STATUS (Official Only)
=================================================== */
exports.updateStatus = async (req, res) => {
  try {
    const petitionId = req.params.id;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(petitionId)) {
      return res.status(400).json({ message: "Invalid Petition ID" });
    }

    const petition = await Petition.findById(petitionId);

    if (!petition || petition.isDeleted) {
      return res.status(404).json({ message: "Petition not found" });
    }

    if (req.user.role !== "official") {
      return res.status(403).json({
        message: "Only officials can update petition status",
      });
    }

    const validStatuses = ["pending", "active", "under_review", "closed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    petition.status = status;
    await petition.save();

    res.status(200).json({
      message: "Status updated successfully",
      petition,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===================================================
   RESPOND TO PETITION (Official Only)
=================================================== */
exports.respondToPetition = async (req, res) => {
  try {
    const petitionId = req.params.id;
    const { message } = req.body;
    const user = req.user;

    if (!mongoose.Types.ObjectId.isValid(petitionId)) {
      return res.status(400).json({ message: "Invalid Petition ID" });
    }

    const petition = await Petition.findById(petitionId);

    if (!petition || petition.isDeleted) {
      return res.status(404).json({ message: "Petition not found" });
    }

    if (user.role !== "official") {
      return res.status(403).json({
        message: "Only officials can respond to petitions",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Response message is required" });
    }
    if (!petition.responses) {
      petition.responses = [];
    }
    petition.responses.push({
      message: message.trim(),
      respondedBy: user.id,
    });

    await petition.save();

    const updatedPetition = await Petition.findById(petitionId)
      .populate("creator", "fullName email")
      .populate("responses.respondedBy", "fullName email");

    res.status(200).json({
      message: "Response added successfully",
      petition: updatedPetition,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===================================================
   DELETE PETITION (SOFT DELETE)
=================================================== */
exports.deletePetition = async (req, res) => {
  try {
    const petitionId = req.params.id;
    const userId = req.user.id;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(petitionId)) {
      return res.status(400).json({ message: "Invalid Petition ID" });
    }

    const petition = await Petition.findById(petitionId);

    if (!petition || petition.isDeleted) {
      return res.status(404).json({ message: "Petition not found" });
    }

    const isOfficial = req.user.role === "official";
    const isCreator = petition.creator.toString() === userId;

    if (isOfficial) {
      // Officials can delete any petition
    } else if (isCreator && petition.status === "pending") {
      // Creator can only delete pending petitions
    } else if (isCreator) {
      return res.status(403).json({
        message: "You can only delete your petition while it is pending",
      });
    } else {
      return res.status(403).json({ message: "Not authorized to delete" });
    }

    petition.isDeleted = true;
    petition.deletedBy = userId;
    petition.deleteReason = reason || "";
    petition.deletedAt = new Date();

    await petition.save();

    res.status(200).json({
      message: "Petition deleted successfully",
      petition,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
