const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

const connectDB = () => {
    db.connect((err) => {
        if (err) {
            throw err;
        }
        console.log('MySQL connected...');
    });
}

const createTable = () => {
    const sqlArr = [
        `CREATE TABLE IF NOT EXISTS colors (id int AUTO_INCREMENT, name VARCHAR(255), value VARCHAR(255), createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id))`,
        `CREATE TABLE IF NOT EXISTS products (id int AUTO_INCREMENT, name VARCHAR(255), price INT, imgUrl VARCHAR(255), createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, category VARCHAR(255), PRIMARY KEY (id))`,
        `CREATE TABLE IF NOT EXISTS product_sizes (productId INT, sizeId INT, FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE, FOREIGN KEY (sizeId) REFERENCES sizes(id) ON DELETE CASCADE, PRIMARY KEY (productId, sizeId))`,
        `CREATE TABLE IF NOT EXISTS product_colors (productId INT, colorId INT, FOREIGN KEY (productId) REFERENCES products(id)ON DELETE CASCADE, FOREIGN KEY (colorId) REFERENCES colors(id) ON DELETE CASCADE, PRIMARY KEY (productId, colorId))`,
    ];
    for (let i = 0; i < sqlArr.length; i++) {
        db.query(sqlArr[i], (err, result) => {
            if (err) {
                throw err;
            }
            console.log('Table created...');
        });
    }
}

module.exports = {connectDB, createTable, db};