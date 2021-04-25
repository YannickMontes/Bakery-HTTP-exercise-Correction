const express = require('express');
const format = require('../joi_request_format');
const Product = require('../models/Product');
const router = express.Router();

router.get('/', async (req, res) => {
    try{
        const products = await Product.find();
        res.status(200).json(products);
    }
    catch(error)
    {
        res.status(500).json({message:error})
    }
});

router.get('/:id', async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        if(product === null)
        {
            return res.status(404).json({message:'Id not found.'});
        }
        res.status(200).json(product);
    }
    catch(error)
    {
        res.status(500).json({message:error})
    }
});

router.post('/', async (req, res) => {
    const isBodyCorrect = format.postBodyFormat.validate(req.body);
    if(isBodyCorrect.error)
        return res.status(400).json({message: isBodyCorrect.error.details[0].message});

    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    });
    try
    {
        const savedProduct = await product.save();
        res.status(200).json(savedProduct);
    }
    catch(error)
    {
        res.status(500).json({message: error});
    }
});

router.put('/:id', async (req, res) => {
    try
    {
        let update = {name:req.body.name, price:req.body.price};
        const product = await Product.findByIdAndUpdate(req.params.id, update);
        if(product === null)
        {
            return res.status(404).json({message:'Id not found.'});
        }
        res.status(200).json(product);
    }
    catch(error)
    {
        res.status(500).json({message: error});
    }
});

router.delete('/:id', async (req, res) => {
    try
    {
        const product = await Product.findByIdAndDelete(req.params.id);
        if(product === null)
        {
            return res.status(404).json({message:'Id not found.'});
        }
        res.status(200).json(product);
    }
    catch(error)
    {
        res.status(500).json({message: error});
    }
});

module.exports = router;