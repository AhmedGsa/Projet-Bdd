const express = require('express');
const router = express.Router();
const {createColor, getColors, updateColor, deleteColor} = require('../controllers/color');

router.post("/", createColor)
router.get("/", getColors)
router.patch("/:id", updateColor)
router.delete("/:id", deleteColor)

module.exports = router;