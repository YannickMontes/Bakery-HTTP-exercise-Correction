const express = require('express');

const app = express();
app.use(express.json());

//Import routes
const productsRoutes = require('./routes/products');
app.use('/api/products', productsRoutes);


app.get('/', (req, res) => {
    res.send("Welcome to the bakery.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => `Listening on http://localhost:${PORT} ...`);