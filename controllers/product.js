const {db} = require("../db/connect");

const createProduct = async (req, res) => {
    const image = req.file.filename;
    const {name, price, category, sizeIds, colorIds} = req.body;
    const imgUrl = `http://localhost:${process.env.PORT}/uploads/${image}`;
    const sizeIdsArr = JSON.parse(sizeIds);
    const colorIdsArr = JSON.parse(colorIds);
    const sql = `INSERT INTO products (name, price, imgUrl, category) VALUES (?, ?, ?, ?)`;
    db.query(sql, [name, +price, imgUrl, category], (err, result) => {
        if (err) {
            throw err;
        }
        const productId = result.insertId;
        const sizeSql = `INSERT INTO product_sizes (productId, sizeId) VALUES ?`;
        const sizeValues = sizeIdsArr.map(sizeId => [productId, sizeId]);
        db.query(sizeSql, [sizeValues], (err, result) => {
            if (err) {
                throw err;
            }
            const colorSql = `INSERT INTO product_colors (productId, colorId) VALUES ?`;
            const colorValues = colorIdsArr.map(colorId => [productId, colorId]);
            db.query(colorSql, [colorValues], (err, result) => {
                if (err) {
                    throw err;
                }
                res.status(201).json({
                    message: "Product created successfully"
                });
            });
        });
    });
}

const getProducts = async (req, res) => {

}

const updateProduct = async (req, res) => {

}

const deleteProduct = async (req, res) => {

}

module.exports = {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
}