const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ahmed123',
    database: 'store_db'
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
        `CREATE TABLE IF NOT EXISTS categories (id int AUTO_INCREMENT, name VARCHAR(255), createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id))`,
        `CREATE TABLE IF NOT EXISTS products (id int AUTO_INCREMENT, name VARCHAR(255), price INT, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, categoryId INT, FOREIGN KEY (categoryId) REFERENCES categories(id), PRIMARY KEY (id))`,
        `CREATE TABLE IF NOT EXISTS product_sizes (id int AUTO_INCREMENT, productId INT, sizeId INT, FOREIGN KEY (productId) REFERENCES products(id), FOREIGN KEY (sizeId) REFERENCES sizes(id), PRIMARY KEY (id))`,
        `CREATE TABLE IF NOT EXISTS product_colors (id int AUTO_INCREMENT, productId INT, colorId INT, FOREIGN KEY (productId) REFERENCES products(id), FOREIGN KEY (colorId) REFERENCES colors(id), PRIMARY KEY (id))`
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