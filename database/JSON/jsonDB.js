const fs = require("fs");
const path = require("path");

const DATABASE = path.resolve(__dirname, "./../data/products.json");

console.log(DATABASE)

function getAllProducts()
{
	let data = fs.readFileSync(DATABASE);
	let products = JSON.parse(data);
	return {products};
}

function getProduct(id)
{
	let products = getAllProducts();
	let product = products.find(p => p.id === id);
	if(product == null)
		return {error: "Product not found."};
	else
		return {product};
}

function addProduct(name, price)
{
	let products = getAllProducts();
	let product = {"id": products.length +1, name, price};
	products.push(product);
	writeInFile(products);
	return {product};
}

function deleteProduct(id)
{
	let products = getAllProducts();
	let {product, error} = getProduct(id);
	if(product == null)
		return {error};

	let index = products.indexOf(product);
	products.splice(index, 1);
	writeInFile(products);
	return {product};
}

function modifyProduct(id, {name, description, price})
{
	let products = getAllProducts();
	let {product, error} = getProduct(id);
	if(product == null)
		return {error};

	let index = products.indexOf(product);
	if(name)
		product['name'] = req.body.name;
	if(price)
		product['price'] = req.body.price;
	products[index] = product;
	writeInFile(products);
	return {product};
}

function writeInFile(products)
{
	fs.writeFileSync(DATABASE, JSON.stringify(products));
	return  true;
}

module.exports = 
{
	getAllProducts,
	getProduct,
	addProduct,
	deleteProduct,
	modifyProduct
}