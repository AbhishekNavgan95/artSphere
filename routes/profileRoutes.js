const express = require("express");
const router = express.Router();

const { authenticateUser, isArtist } = require("../middleware/authMiddleware");
const { getArtistDetails } = require("../controllers/auth.controller");

router.get('/details', authenticateUser, isArtist, getArtistDetails);

module.exports = router;
