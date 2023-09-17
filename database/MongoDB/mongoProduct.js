const Product = require('../../models/Product');

async function getAllProducts()
{
	try
	{
		let products = await Product.find();
		return {products};
	}
	catch(error)
	{
		return {error};
	}
}

async function getProduct(id)
{
	try
	{
		let product = await Product.findById(id);
		if(product === null)
			return {error: "Id not found"};
		return {product};
	}
	catch(error)
	{
		return {error};
	}
}

async function createProduct(name, description, price)
{
	try
	{
		const product = new Product({
			name: name,
			description: description,
			price: price
		});
		await product.save();
		return {product};
	} 
	catch(error)
	{
		return {error};
	}
}

async function deleteProduct(id)
{
	try
	{
		let product = await Product.findByIdAndDelete(id);
		if(product === null)
			return {error: "Id not found"};
		else
			return {product};
	}
	catch(error)
	{
		return {error};
	}
}

async function modifyProduct(id, {name, description, price})
{
	let update = {};
	if(name != null)
		update.name = name;
	if(description != null)
		update.description = description;
	if(price != null)
		update.price = price;
	try
	{
		let product = await Product.findByIdAndUpdate(id, update, {new: true})
		if(product === null)
			return {error: "Id not found"};
		else
			return {product};
	}
	catch(error)
	{
		return {error};
	}
}

module.exports = 
{
	getAllProducts,
	getProduct,
	createProduct,
	deleteProduct,
	modifyProduct
}