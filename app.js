const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config');

const app = express();
app.use(express.json());

//Import routes
const productsRoutes = require('./routes/products');
app.use('/api/products', productsRoutes);


app.get('/', (req, res) => {
    res.send("Welcome to the bakery.");
});

//Connect to DB
mongoose.connect(
    process.env.DB_ADDRESS,
    { useNewUrlParser : true},
    () => console.log('Connected !'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => `Listening on http://localhost:${PORT} ...`);