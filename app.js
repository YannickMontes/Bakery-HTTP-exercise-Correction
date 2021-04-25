const fs = require('fs');
const express = require('express');

const format = require('./joi_request_format');
const DATABASE = './data/products.json';

const app = express();
app.use(express.json());


app.get('/', (req, res) => {
    res.send("Welcome to the bakery.");
});

app.get('/api/products', (req, res) => {
    fs.readFile(DATABASE, (err, data) => {
        if(err)
            return res.status(500).send(err.message);

        res.status(200).send(JSON.parse(data));
    });
});

app.get('/api/products/:id', (req, res) => {
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

app.post('/api/products', (req, res) => {
    const isBodyCorrect = format.postBodyFormat.validate(req.body);
    if(isBodyCorrect.error)
        return res.status(400).send(isBodyCorrect.error.details[0].message);

    fs.readFile(DATABASE, (err, data) => {
        if(err)
            return res.status(500).send(err.message);

        let products = JSON.parse(data);
        let product = {"id": products.length +1, name:req.body.name, price: req.body.price};
        products.push(product);
        fs.writeFile(DATABASE, JSON.stringify(products), (err) => {
            if(err)
                return res.status(500).send(err.message);
            res.send(product);
        });
    });
});

app.put('/api/products/:id', (req, res) => {
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

app.delete('/api/products/:id', (req, res) => {
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

app.listen(3000, () => 'Listening on port 3000...');