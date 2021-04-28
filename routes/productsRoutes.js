const express = require('express');
const auth = require('../auth');
const router = express.Router();

const productController = require('../controller/productController');

router.get('/', auth.checkAuth, productController.getAllProducts);
router.get('/:id', auth.checkAuth, productController.getProductById);
router.post('/', auth.checkAuth,productController.createProduct);
router.put('/:id', auth.checkAuth, productController.modifyProduct);
router.delete('/:id', auth.checkAuth,productController.deleteProduct);

module.exports = router;