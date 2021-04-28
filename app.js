const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config');

const app = express();
app.use(express.json());

//Import routes
const productsRoutes = require('./routes/productsRoutes');
const userRoutes = require('./routes/userRoutes');
app.use('/api/products', productsRoutes);
app.use('/api/auth', userRoutes);

app.get('/', (req, res) => {
    res.send("Welcome to the bakery.");
});

mongoose.set('useFindAndModify', false);
//Connect to DB
mongoose.connect(
    process.env.DB_ADDRESS,
    { useNewUrlParser : true , useUnifiedTopology: true})
    .then(() => console.log("Connected"))
    .catch(error => console.log(error));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => `Listening on http://localhost:${PORT} ...`);