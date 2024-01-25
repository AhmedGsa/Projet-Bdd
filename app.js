const express = require('express');
require('dotenv').config();
require('express-async-errors');
const app = express();
const {connectDB, createTable} = require('./db/connect');
const sizeRouter = require('./routes/size');
const colorRouter = require('./routes/color');
const productRouter = require('./routes/product');
const uploadsRouter = require('./routes/uploads');
const errorHandler = require('./middlewares/error-handler');

app.use(express.json());
app.use('/api/v1/sizes', sizeRouter);
app.use('/api/v1/colors', colorRouter);
app.use('/api/v1/products', productRouter);
app.use('/uploads', uploadsRouter);
app.use(errorHandler);


const start = async () => {
    const PORT = process.env.PORT || 3000;
    await connectDB();
    await createTable();
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}...`);
    });
}

start();