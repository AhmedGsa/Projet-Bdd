const {db} = require("../db/connect");

const createProduct = async (req, res) => {
    const image = req.file.filename;
    const {name, price, quantity, sizeIds, colorIds} = req.body;
    if(!name || !price || !quantity || !sizeIds || !colorIds) {
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
                    const sql = `INSERT INTO products (name, price, imgUrl, quantity) VALUES (?, ?, ?, ?)`;
                    db.query(sql, [name, +price, imgUrl, +quantity], (err, result) => {
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
        const sql = `SELECT COUNT(*) AS count FROM products`;
        db.query(sql, (err, count) => {
            if (err) {
                throw err;
            }
            res.status(200).json({products: result, count: count[0].count});
        });
    });
}

const updateProduct = async (req, res) => {
    const {id} = req.params;
    const {name, price, quantity, sizeIds, colorIds} = req.body;
    if(!name || !price || !quantity || !sizeIds || !colorIds) {
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
            const colorSql = 'SELECT * FROM colors WHERE id IN (?)';
            db.query(colorSql, [colorIdsArr], (err, result) => {
                if (err) {
                    throw err;
                }
                if (result.length !== colorIdsArr.length) {
                    res.status(404).json({message: 'Color not found'});
                } else {
                    const sizeSql = 'SELECT * FROM sizes WHERE id IN (?)';
                    db.query(sizeSql, [sizeIdsArr], (err, result) => {
                        if (err) {
                            throw err;
                        }
                        if (result.length !== sizeIdsArr.length) {
                            res.status(404).json({message: 'Size not found'});
                        } else {
                            const sql = 'SELECT * FROM products WHERE id = ?';
                            db.query(sql, [id], (err, result) => {
                                if (err) {
                                    throw err;
                                }
                                const image = req.file ? req.file.filename : result[0].imgUrl?.split('/')?.pop();
                                const imgUrl = `http://localhost:${process.env.PORT}/uploads/${image}`;
                                const sql = `UPDATE products SET name = ?, price = ?, imgUrl = ?, quantity = ? WHERE id = ?`;
                                db.query(sql, [name, +price, imgUrl, +quantity, id], (err, result) => {
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
                            });
                        }
                    });
                }
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

const getAvailableProducts = async (req, res) => {
    const sql = `SELECT * FROM products WHERE quantity > 0`;
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        res.status(200).json(result);
    });
}

module.exports = {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    getAvailableProducts
}