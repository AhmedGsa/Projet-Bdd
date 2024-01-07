const express = require('express');
const router = express.Router();
const {createSize, getSizes, updateSize, deleteSize} = require('../controllers/size');

router.post("/", createSize)
router.get("/", getSizes)
router.patch("/:id", updateSize)
router.delete("/:id", deleteSize)

module.exports = router;