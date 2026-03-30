const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  createPetition,
  signPetition,
  getPetitions,
  getPetitionById,
  updatePetition,
  updateStatus,
  respondToPetition,
  deletePetition
} = require("../controllers/petitionController");


router.get("/", protect, getPetitions);
router.get("/:id", protect, getPetitionById);

router.post("/", protect, createPetition);

router.put("/:id", protect, updatePetition);
router.delete("/:id", protect, deletePetition);
router.post("/:id/respond", protect, respondToPetition);

router.post("/:id/sign", protect, signPetition);

router.patch("/:id/status", protect, updateStatus);

module.exports = router;
