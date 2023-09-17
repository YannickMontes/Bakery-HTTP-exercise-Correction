const express = require('express');
const router = express.Router();

const productController = require('../controller/productController');

async function checkAuth(req, res, next)
{
	req.app.auth.checkAuth(req, res, next);
}

router.get('/', checkAuth, productController.getAllProducts);
router.get('/:id', checkAuth, productController.getProductById);
router.post('/', checkAuth,productController.createProduct);
router.put('/:id', checkAuth, productController.modifyProduct);
router.delete('/:id', checkAuth, productController.deleteProduct);

module.exports = router;