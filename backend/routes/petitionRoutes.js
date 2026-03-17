const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  createPetition,
  signPetition,
  getPetitions,
  updatePetition,
  updateStatus,
  respondToPetition,
  deletePetition
} = require("../controllers/petitionController");


router.get("/", getPetitions);

router.post("/", protect, createPetition);

router.put("/:id", protect, updatePetition);
router.delete("/:id", protect, deletePetition);
router.post("/:id/respond", protect, respondToPetition);

router.post("/:id/sign", protect, signPetition);

router.patch("/:id/status", protect, updateStatus);

module.exports = router;
