
const e = require('express');
const {db} = require('../db/connect');

const createSize = async (req, res) => {
    const {name, value} = req.body;
    const sql = `INSERT INTO sizes (name, value) VALUES (?, ?)`;
    db.query(sql, [name, value], (err, result) => {
        if (err) {
            throw err;
        }
        res.status(201).json({message: 'Size created successfully'});
    });
}

const getSizes = async (req, res) => {
    const {page, pageSize} = req.query;
    const sql = `SELECT * FROM sizes LIMIT ? OFFSET ?`;
    db.query(sql, [+pageSize, (page - 1) * pageSize], (err, result) => {
        if (err) {
            throw err;
        }
        const sql = `SELECT COUNT(*) AS count FROM sizes`;
        db.query(sql, (err, count) => {
            if (err) {
                throw err;
            }
            res.status(200).json({sizes: result, count: count[0].count});
        });
    });
}

const getAllSizes = async (req, res) => {
    const sql = `SELECT * FROM sizes`;
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        res.status(200).json(result);
    });
}

const getProductSizes = async (req, res) => {
    const {productId} = req.params;
    const sql = `SELECT sizes.id, sizes.name, sizes.value FROM sizes INNER JOIN product_sizes ON sizes.id = product_sizes.sizeId WHERE product_sizes.productId = ?`;
    db.query(sql, [productId], (err, result) => {
        if (err) {
            throw err;
        }
        res.status(200).json(result);
    });

}

const updateSize = async (req, res) => {
    const {id} = req.params;
    const {name, value} = req.body;
    // check if exists
    let sql = 'SELECT * FROM sizes WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            throw err;
        }
        if (!result.length) {
            return res.status(404).json({message: 'Size not found'});
        } else {
            sql = `UPDATE sizes SET name = ?, value = ? WHERE id = ?`;
            db.query(sql, [name, value, id], (err, result) => {
                if (err) {
                    throw err;
                }
                res.status(200).json({message: 'Size updated successfully'});
            });
        }
    });
    
}

const deleteSize = async (req, res) => {
    const {id} = req.params;
    // check if exists
    let sql = 'SELECT * FROM sizes WHERE id = ?';
    const result = db.query(sql, [id], (err, result) => {
        if (err) {
            throw err;
        }
        if (!result.length) {
            return res.status(404).json({message: 'Size not found'});
        } else {
            sql = `DELETE FROM sizes WHERE id = ?`;
            db.query(sql, [id], (err, result) => {
                if (err) {
                    throw err;
                }
                res.status(200).json({message: 'Size deleted successfully'});
            });
        }
    });
}

module.exports = {createSize, getSizes, updateSize, deleteSize, getAllSizes, getProductSizes};