const express = require('express');
const router = express.Router();
const {createColor, getColors, updateColor, deleteColor, getAllColors, getProductColors} = require('../controllers/color');

router.post("/", createColor)
router.get("/", getColors)
router.get("/product/:productId", getProductColors)
router.get("/all", getAllColors)
router.patch("/:id", updateColor)
router.delete("/:id", deleteColor)

module.exports = router;