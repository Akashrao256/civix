const User = require("../models/User");

// Get pending officials
exports.getPendingOfficials = async (req, res) => {

  try {

    const officials = await User.find({
      role: "official",
      isApproved: false
    });

    res.json(officials);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


// Approve official
exports.approveOfficial = async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user || user.role !== "official") {
      return res.status(404).json({
        message: "Official not found"
      });
    }

    user.isApproved = true;

    await user.save();

    res.json({
      message: "Official approved successfully"
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};