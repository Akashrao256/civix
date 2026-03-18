const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  createPoll,
  getPolls,
  votePoll,
  getPollResults
} = require("../controllers/pollController");


// Create poll (protected)
router.post("/", protect, createPoll);

// Get polls
router.get("/", getPolls);

// Vote
router.post("/:id/vote", protect, votePoll);

// Results
router.get("/:id/results", getPollResults);

module.exports = router;