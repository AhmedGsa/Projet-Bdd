const {db} = require("../db/connect");

const createProduct = async (req, res) => {
    const image = req.file.filename;
    const {name, price, category, sizeIds, colorIds} = req.body;
    if(!name || !price || !category || !sizeIds || !colorIds) {
        return res.status(400).json({message: 'All fields are required'});
    }
    const imgUrl = `http://localhost:${process.env.PORT}/uploads/${image}`;
    const sizeIdsArr = JSON.parse(sizeIds);
    const colorIdsArr = JSON.parse(colorIds);
    // check if sizes exists
    const sizeSql = 'SELECT * FROM sizes WHERE id IN (?)';
    db.query(sizeSql, [sizeIdsArr], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length !== sizeIdsArr.length) {
            res.status(404).json({message: 'Size not found'});
        } else {
            const colorSql = 'SELECT * FROM colors WHERE id IN (?)';
            db.query(colorSql, [colorIdsArr], (err, result) => {
                if (err) {
                    throw err;
                }
                if (result.length !== colorIdsArr.length) {
                    res.status(404).json({message: 'Color not found'});
                } else {
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
            });
        }
    });
}

const getProducts = async (req, res) => {
    const {page, pageSize} = req.query
    const sql = `SELECT * FROM products LIMIT ? OFFSET ?`;
    db.query(sql, [+pageSize, (page - 1) * pageSize], (err, result) => {
        if (err) {
            throw err;
        }
        res.status(200).json(result);
    });
}

const updateProduct = async (req, res) => {
    const {id} = req.params;
    const {name, price, category, sizeIds, colorIds} = req.body;
    if(!name || !price || !category || !sizeIds || !colorIds) {
        return res.status(400).json({message: 'All fields are required'});
    }
    const sizeIdsArr = JSON.parse(sizeIds);
    const colorIdsArr = JSON.parse(colorIds);
    // check if exists
    let sql = 'SELECT * FROM products WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            throw err;
        }
        if (!result.length) {
            return res.status(404).json({message: 'Product not found'});
        } else {
            let imgUrl = result[0].imgUrl;
            if(req.file) {
                const image = req.file.filename;
                imgUrl = `http://localhost:${process.env.PORT}/uploads/${image}`;
            }
            sql = `UPDATE products SET name = ?, price = ?, imgUrl = ?, category = ? WHERE id = ?`;
            db.query(sql, [name, +price, imgUrl, category, id], (err, result) => {
                if (err) {
                    throw err;
                }
                const sizeSql = `DELETE FROM product_sizes WHERE productId = ?`;
                db.query(sizeSql, [id], (err, result) => {
                    if (err) {
                        throw err;
                    }
                    const sizeSql = `INSERT INTO product_sizes (productId, sizeId) VALUES ?`;
                    const sizeValues = sizeIdsArr.map(sizeId => [id, sizeId]);
                    db.query(sizeSql, [sizeValues], (err, result) => {
                        if (err) {
                            throw err;
                        }
                        const colorSql = `DELETE FROM product_colors WHERE productId = ?`;
                        db.query(colorSql, [id], (err, result) => {
                            if (err) {
                                throw err;
                            }
                            const colorSql = `INSERT INTO product_colors (productId, colorId) VALUES ?`;
                            const colorValues = colorIdsArr.map(colorId => [id, colorId]);
                            db.query(colorSql, [colorValues], (err, result) => {
                                if (err) {
                                    throw err;
                                }
                                res.status(200).json({message: 'Product updated successfully'});
                            });
                        });
                    });
                });
            });
        }
    });
}

const deleteProduct = async (req, res) => {
    const {id} = req.params;
    // check if exists
    let sql = 'SELECT * FROM products WHERE id = ?';
    const result = db.query(sql, [id], (err, result) => {
        if (err) {
            throw err;
        }
        if (!result.length) {
            return res.status(404).json({message: 'Product not found'});
        } else {
            sql = `DELETE FROM products WHERE id = ?`;
            db.query(sql, [id], (err, result) => {
                if (err) {
                    throw err;
                }
                res.status(200).json({message: 'Product deleted successfully'});
            });
        }
    });
}

module.exports = {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
}