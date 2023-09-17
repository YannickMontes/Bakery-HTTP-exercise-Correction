const format = require('../joi_request_format');

async function createProduct(req, res)
{
	const isBodyCorrect = format.postBodyFormat.validate(req.body);
	if(isBodyCorrect.error)
		return res.status(400).json({error: isBodyCorrect.error.details[0].message});

	let {product, error} = await req.app.database.createProduct(req.body.name, req.body.description, req.body.price);
	if(error)
		return res.status(500).json({error});
	else
		return res.status(200).json({product});
}

async function getAllProducts(req, res)
{
	let {products, error } = await req.app.database.getAllProducts();
	if(error)
		return res.status(500).json({error});
	else
		return res.status(200).json({products});
}

async function getProductById(req, res)
{
	let { product, error } = await req.app.database.getProduct(req.params.id);
	if(error)
		return res.status(500).json({error});
	else if(product)
		return res.status(200).json({product});
	else 
		return res.status(404).json({error: "Product not found."});
}

async function modifyProduct(req, res)
{
	const isBodyCorrect = format.putBodyFormat.validate(req.body);
	if(isBodyCorrect.error)
		return res.status(400).json({error: isBodyCorrect.error.details[0].message});

	let { product, error} = await req.app.database.modifyProduct(req.params.id, req.body);
	if(error)
		return res.status(500).json({error});
	else if(product)
		return res.status(200).json({product});
	else 
		return res.status(404).json({error: "Product not found."});
}

async function deleteProduct(req, res)
{
	let {product, error} = await req.app.database.deleteProduct(req.params.id);
	if(error)
		return res.status(500).json({error});
	else
		return res.status(200).json({product});
}

module.exports = 
{
	getAllProducts,
	getProductById,
	createProduct,
	modifyProduct,
	deleteProduct
};