const Product = require('../models/Product');
const format = require('../joi_request_format');

function createProduct(req, res)
{
	const isBodyCorrect = format.postBodyFormat.validate(req.body);
	if(isBodyCorrect.error)
		return res.status(400).json({message: isBodyCorrect.error.details[0].message});

	const product = new Product({
		name: req.body.name,
		description: req.body.description,
		price: req.body.price
	});
	product.save()
		.then(() => res.status(200).json(product))
		.catch(error => res.status(500).json({error: error}));
}

function getAllProducts(req, res)
{
	Product.find()
		.then(products => res.status(200).json(products))
		.catch(error => res.status(500).json({error: error}));
}

function getProductById(req, res)
{
	Product.findById(req.params.id)
		.then(product => {
			if(product === null)
				return res.status(404).json({error: "Id not found"});
			res.status(200).json(product)
		})
		.catch(error => res.status(500).json({error: error}));
};

function modifyProduct(req, res)
{
	const isBodyCorrect = format.putBodyFormat.validate(req.body);
	if(isBodyCorrect.error)
		return res.status(400).json({message: isBodyCorrect.error.details[0].message});

	let update = {};
	if(req.body.name != null)
		update.name = req.body.name;
	if(req.body.description != null)
		update.description = req.body.description;
	if(req.body.price != null)
		update.price = req.body.price;
	Product.findByIdAndUpdate(req.params.id, update, {new: true})
		.then(product => {
			if(product === null)
				return res.status(404).json({error: "Id not found"});
			res.status(200).json(product)
		})
		.catch(error => res.status(500).json({error: error}));
}

function deleteProduct(req, res)
{
	Product.findByIdAndDelete(req.params.id)
		.then(product => {
			if(product === null)
				return res.status(404).json({error: "Id not found"});
			res.status(200).json(product)
		})
		.catch(error => res.status(500).json({error: error}));
}

module.exports = {getAllProducts: getAllProducts,
					getProductById:getProductById,
					createProduct: createProduct,
					modifyProduct : modifyProduct,
					deleteProduct: deleteProduct};