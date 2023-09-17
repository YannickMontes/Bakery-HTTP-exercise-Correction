const mongoose = require("mongoose");
const { getAllProducts, getProduct, createProduct, deleteProduct, modifyProduct } = require("./mongoProduct");
const { getUser, createUser } = require("./mongoUser");
require('dotenv/config');

mongoose.connect(
    process.env.DB_ADDRESS)
    .then(() => console.log("DB Connected"))
    .catch(error => console.log(error));

module.exports = 
{
	getAllProducts,
	getProduct,
	createProduct,
	deleteProduct,
	modifyProduct,
	getUser,
	createUser
}