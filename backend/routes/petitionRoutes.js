const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  createPetition,
  signPetition,
  getPetitions
} = require("../controllers/petitionController");


router.get("/", getPetitions);
router.post("/", protect, createPetition);

router.post("/:id/sign", protect, signPetition);

module.exports = router;