const joi = require('joi');

const postBodyFormat = joi.object({
    name: joi.string().min(3).max(30).required(),
    description: joi.string().max(200),
    price: joi.number().min(0).required()
});

const putBodyFormat = joi.object({
    name: joi.string().min(3).max(30),
    description: joi.string().min(0).max(200),
    price: joi.number().min(0)
}).or('name', 'description', 'price');


module.exports.joi = joi;
module.exports.postBodyFormat = postBodyFormat;
module.exports.putBodyFormat = putBodyFormat;