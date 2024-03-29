const {db} = require('../db/connect');

const createColor = async (req, res) => {
    const {name, value} = req.body;
    const sql = `INSERT INTO colors (name, value) VALUES (?, ?)`;
    db.query(sql, [name, value], (err, result) => {
        if (err) {
            throw err;
        }
        res.status(201).json({message: 'Color created successfully'});
    });
}

const getColors = async (req, res) => {
    const {page, pageSize} = req.query;
    const sql = `SELECT * FROM colors LIMIT ? OFFSET ?`;
    db.query(sql, [+pageSize, (page - 1) * pageSize], (err, result) => {
        if (err) {
            throw err;
        }
        const sql = `SELECT COUNT(*) AS count FROM colors`;
        db.query(sql, (err, count) => {
            if (err) {
                throw err;
            }
            res.status(200).json({colors: result, count: count[0].count});
        });
    });
}

const getProductColors = async (req, res) => {
    const {productId} = req.params;
    const sql = `SELECT colors.id, colors.name, colors.value FROM colors INNER JOIN product_colors ON colors.id = product_colors.colorId WHERE product_colors.productId = ?`;
    db.query(sql, [productId], (err, result) => {
        if (err) {
            throw err;
        }
        res.status(200).json(result);
    });
}

const getAllColors = async (req, res) => {
    const sql = `SELECT * FROM colors`;
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        res.status(200).json(result);
    });
}

const updateColor = async (req, res) => {
    const {id} = req.params;
    const {name, value} = req.body;
    // check if exists
    let sql = 'SELECT * FROM colors WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            throw err;
        }
        if (!result.length) {
            return res.status(404).json({message: 'Color not found'});
        } else {
            sql = `UPDATE colors SET name = ?, value = ? WHERE id = ?`;
            db.query(sql, [name, value, id], (err, result) => {
                if (err) {
                    throw err;
                }
                res.status(200).json({message: 'Color updated successfully'});
            });
        }
    });
    
}

const deleteColor = async (req, res) => {
    const {id} = req.params;
    // check if exists
    let sql = 'SELECT * FROM colors WHERE id = ?';
    const result = db.query(sql, [id], (err, result) => {
        if (err) {
            throw err;
        }
        if (!result.length) {
            return res.status(404).json({message: 'Color not found'});
        } else {
            sql = `DELETE FROM colors WHERE id = ?`;
            db.query(sql, [id], (err, result) => {
                if (err) {
                    throw err;
                }
                res.status(200).json({message: 'Color deleted successfully'});
            });
        }
    });
}

module.exports = {createColor, getColors, updateColor, deleteColor, getAllColors, getProductColors}