const express = require('express');
const fs = require('fs');
const format = require('../joi_request_format');

const DATABASE = './data/products.json';

const router = express.Router();

router.get('/', (req, res) =>{
    fs.readFile(DATABASE, (err, data) => {
        if(err)
            return res.status(500).send(err.message);

        res.status(200).send(JSON.parse(data));
    });
});

router.get('/', (req, res) => {
    fs.readFile(DATABASE, (err, data) => {
        if(err)
            return res.status(500).send(err.message);

        res.status(200).send(JSON.parse(data));
    });
});

router.get('/:id', (req, res) => {
    fs.readFile(DATABASE, (err, data) => {
        if(err)
            return res.status(500).send(err.message);

        let products = JSON.parse(data);
        let product = products.find(p => p.id === parseInt(req.params.id))
        if(!product)
            return res.status(400).send("Product not found");
        res.status(200).send(product);
    });
});


router.post('/', (req, res) => {
    const isBodyCorrect = format.postBodyFormat.validate(req.body);
    if(isBodyCorrect.error)
        return res.status(400).send(isBodyCorrect.error.details[0].message);

    fs.readFile(DATABASE, (err, data) => {
        if(err)
            return res.status(500).send(err.message);

        let products = JSON.parse(data);
        let id = -1;
        products.forEach(element => {
            if(element.id > id)
            {
                id = element.id;
            }
        });
        let product = {"id": id + 1, name:req.body.name, price: req.body.price};
        products.push(product);
        fs.writeFile(DATABASE, JSON.stringify(products), (err) => {
            if(err)
                return res.status(500).send(err.message);
            res.send(product);
        });
    });
});

router.put('/:id', (req, res) => {
    if(!req.params.id)
        return res.status(400).send("Incorrect id");
    const bodyCorrect = format.putBodyFormat.validate(req.body);
    if(bodyCorrect.error)
        return res.status(400).send(bodyCorrect.error.details[0].message);

    fs.readFile(DATABASE, (err, data) => {
        if(err)
            return res.status(500).send(err.message);

        let products = JSON.parse(data);
        let product = products.find(p => p.id === parseInt(req.params.id))
        if(!product)
            return res.status(404).send("Product not found");

        let index = products.indexOf(product);
        if(req.body.name)
            product['name'] = req.body.name;
        if(req.body.price)
            product['price'] = req.body.price;
        products[index] = product;
        fs.writeFile(DATABASE, JSON.stringify(products), (err) => {
            if(err)
                return res.status(500).send(err.message);
            res.send(product);
        });
    });
});

router.delete('/:id', (req, res) => {
    fs.readFile(DATABASE, (err, data) => {
        if(err)
            res.send(err.message);
        let products = JSON.parse(data);
        let product = products.find(p => p.id === parseInt(req.params.id));
        if(!product)
            return res.status(404).send("Product not found");
        let index = products.indexOf(product);
        products.splice(index, 1);
        fs.writeFile(DATABASE, JSON.stringify(products), (err) => {
            if(err)
                return res.status(500).send(err.message);
            res.send(product);
        });
    });
});

module.exports = router;