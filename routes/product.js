const express = require('express');
const router = express.Router();
const multer = require('multer');
const {createProduct, getProducts, updateProduct, deleteProduct} = require('../controllers/product');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const fileExt = file.mimetype.split('/')[1];
        const newFileName = Date.now() + '.' + fileExt;
        cb(null, newFileName)
    }
})

const upload = multer({ storage: storage })

router.post("/", upload.single('image'), createProduct)
router.get("/", getProducts)
router.patch("/:id", updateProduct)
router.delete("/:id", deleteProduct)

module.exports = router;