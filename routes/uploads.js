const express = require('express');
const router = express.Router();

router.get("/:filename", (req, res) => {
    const {filename} = req.params;
    res.sendFile(`${process.cwd()}/uploads/${filename}`);
});

module.exports = router;