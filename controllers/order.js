const {db} = require('../db/connect');

const createOrder = async (req, res) => {
    const {phone, address, productId, sizeId, colorId} = req.body;
    const sql = `INSERT INTO orders (phone, address, productId, sizeId, colorId) VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [phone, address, productId, sizeId, colorId], (err, result) => {
        if (err) {
            throw err;
        }
        const sql = `UPDATE products SET quantity = quantity - 1 WHERE id = ?`;
        db.query(sql, [productId], (err, result) => {
            if (err) {
                throw err;
            }
            res.status(201).json({message: 'Order created successfully'});
        });
    });
}

const getOrders = async (req, res) => {
    const {page, pageSize} = req.query;
    const sql = `SELECT * FROM orders LIMIT ? OFFSET ?`;
    db.query(sql, [parseInt(pageSize), (parseInt(page) - 1) * parseInt(pageSize)], (err, result) => {
        if (err) {
            throw err;
        }
        const sql = `SELECT COUNT(*) AS count FROM orders`;
        db.query(sql, async (err, count) => {
            if (err) {
                throw err;
            }
            const productInfo = await Promise.all(result.map(order => {
                const sql = `SELECT products.name, products.price, products.imgUrl, sizes.name AS size, colors.name AS color FROM products INNER JOIN product_sizes ON products.id = product_sizes.productId INNER JOIN sizes ON product_sizes.sizeId = sizes.id INNER JOIN product_colors ON products.id = product_colors.productId INNER JOIN colors ON product_colors.colorId = colors.id WHERE products.id = ? AND sizes.id = ? AND colors.id = ?`;
                return new Promise((resolve, reject) => {
                    db.query(sql, [order.productId, order.sizeId, order.colorId], (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        resolve({...result[0], ...order});
                    });
                }
                );
            }));
            res.status(200).json({orders: productInfo, count: count[0].count});
        });
    });
}

const deleteOrder = async (req, res) => {
    const {id} = req.params;
    const orderExistsSql = `SELECT * FROM orders WHERE id = ?`;
    db.query(orderExistsSql, [id], (err, result) => {
        if (err) {
            throw err;
        }
        if (!result.length) {
            return res.status(404).json({message: 'Order not found'});
        } else {
            const sql = `DELETE FROM orders WHERE id = ?`;
            db.query(sql, [id], (err, result) => {
                if (err) {
                    throw err;
                }
                res.status(200).json({message: 'Order deleted successfully'});
            });
        }
    });
}

module.exports = {createOrder, getOrders, deleteOrder};