const express = require('express');
const router = express.Router();
const {createSize, getSizes, updateSize, deleteSize, getAllSizes, getProductSizes} = require('../controllers/size');

router.post("/", createSize)
router.get("/", getSizes)
router.get("/product/:productId", getProductSizes)
router.get("/all", getAllSizes)
router.patch("/:id", updateSize)
router.delete("/:id", deleteSize)

module.exports = router;