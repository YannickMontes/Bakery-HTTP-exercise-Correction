const express = require('express');
require('dotenv/config');

function makeApp(database, auth)
{
	const app = express();
	app.use(express.json());

	app.database = database;
	app.auth = auth;

	const productsRoutes = require('./routes/productsRoutes');
	const userRoutes = require('./routes/userRoutes');
	app.use('/api/products', productsRoutes);
	app.use('/api/auth', userRoutes);

	app.get('/', (req, res) => {
		res.send("Welcome to the bakery.");
	});

	app.PORT = process.env.PORT || 3000;
	
	return app;
}

module.exports = 
{
	makeApp
}