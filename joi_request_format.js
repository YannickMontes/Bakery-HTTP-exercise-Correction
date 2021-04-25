const joi = require('joi');

const postBodyFormat = joi.object({
    name: joi.string().min(3).max(30).required(),
    price: joi.number().min(0).required()
});

const putBodyFormat = joi.object({
    name: joi.string().min(3).max(30),
    price: joi.number().min(0)
}).or('name', 'price');


module.exports.joi = joi;
module.exports.postBodyFormat = postBodyFormat;
module.exports.putBodyFormat = putBodyFormat;