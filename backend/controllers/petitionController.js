const mongoose = require("mongoose");
const Petition = require("../models/Petition");
const Signature = require("../models/Signature");

exports.createPetition = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({
        message: "title, description, category, and location are required"
      });
    }

    const petition = await Petition.create({
      title,
      description,
      category,
      location,
      creator: req.user.id
    });

    res.status(201).json({
      message: "Petition created successfully",
      petition
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



//SIGN PETITION


exports.signPetition = async (req, res) => {
  try {
    const petitionId = req.params.id;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(petitionId)) {
      return res.status(400).json({ message: "Invalid Petition ID" });
    }

    const petition = await Petition.findById(petitionId);
    if (!petition) {
      return res.status(404).json({ message: "Petition not found" });
    }

    const alreadySigned = await Signature.findOne({
      petition: petitionId,
      user: userId
    });

    if (alreadySigned) {
      return res.status(400).json({
        message: "You have already signed this petition"
      });
    }

    await Signature.create({
      petition: petitionId,
      user: userId
    });

    const signatureCount = await Signature.countDocuments({
      petition: petitionId
    });

    res.status(201).json({
      message: "Petition signed successfully",
      signatureCount
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




exports.getPetitions = async (req, res) => {
  try {
    const {
      location,
      category,
      status,
      page = 1,
      limit = 10
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const filter = {};

    if (location) filter.location = location;
    if (category) filter.category = category;
    if (status) filter.status = status;

    const petitions = await Petition.find(filter)
      .populate("creator", "fullName email")
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    const petitionsWithCount = await Promise.all(
      petitions.map(async (petition) => {
        const count = await Signature.countDocuments({
          petition: petition._id
        });

        return {
          ...petition.toObject(),
          signatureCount: count
        };
      })
    );

    const total = await Petition.countDocuments(filter);

    res.status(200).json({
      total,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      petitions: petitionsWithCount
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};