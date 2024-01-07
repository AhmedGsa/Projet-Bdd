const express = require('express');
const app = express();
const {connectDB, createTable} = require('./db/connect');
const sizeRouter = require('./routes/size');
const colorRouter = require('./routes/color');

app.use(express.json());
app.use('/api/v1/sizes', sizeRouter);
app.use('/api/v1/colors', colorRouter);


const start = async () => {
    await connectDB();
    await createTable();
    app.listen(3000, () => {
        console.log('Server is listening on port 3000...');
    });
}

start();