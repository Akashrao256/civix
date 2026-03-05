const Poll = require("../models/Poll");
const Vote = require("../models/Vote");
const mongoose = require("mongoose");


/* ======================================
   CREATE POLL
====================================== */
exports.createPoll = async (req, res) => {
  try {
    const { question, options, targetLocation } = req.body;

    if (!question || !options || options.length < 2) {
      return res.status(400).json({
        message: "Poll must contain question and at least 2 options"
      });
    }

    const poll = await Poll.create({
      question,
      options,
      targetLocation,
      createdBy: req.user.id
    });

    res.status(201).json({
      message: "Poll created successfully",
      poll
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ======================================
   GET ALL POLLS
====================================== */
exports.getPolls = async (req, res) => {
  try {
    const { location } = req.query;

    const filter = {};
    if (location) filter.targetLocation = location;

    const polls = await Poll.find(filter)
      .populate("createdBy", "fullName email")
      .sort({ createdAt: -1 });

    res.json(polls);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ======================================
   VOTE IN POLL
====================================== */
exports.votePoll = async (req, res) => {
  try {
    const pollId = req.params.id;
    const userId = req.user.id;
    const { selectedOption } = req.body;

    if (!mongoose.Types.ObjectId.isValid(pollId)) {
      return res.status(400).json({ message: "Invalid Poll ID" });
    }

    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    if (!poll.options.includes(selectedOption)) {
      return res.status(400).json({ message: "Invalid poll option" });
    }

    const existingVote = await Vote.findOne({
      poll: pollId,
      user: userId
    });

    if (existingVote) {
      return res.status(400).json({
        message: "You have already voted in this poll"
      });
    }

    await Vote.create({
      poll: pollId,
      user: userId,
      selectedOption
    });

    res.status(201).json({
      message: "Vote submitted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ======================================
   GET POLL RESULTS (For Graph)
====================================== */
exports.getPollResults = async (req, res) => {
  try {
    const pollId = req.params.id;

    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    const results = await Vote.aggregate([
      {
        $match: { poll: new mongoose.Types.ObjectId(pollId) }
      },
      {
        $group: {
          _id: "$selectedOption",
          votes: { $sum: 1 }
        }
      }
    ]);

    const formattedResults = poll.options.map(option => {
      const found = results.find(r => r._id === option);
      return {
        option,
        votes: found ? found.votes : 0
      };
    });

    res.json({
      pollId,
      question: poll.question,
      results: formattedResults
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};