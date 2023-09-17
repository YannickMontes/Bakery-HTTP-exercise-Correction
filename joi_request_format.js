const joi = require('joi');

const pwdMinSize = 5;
const pwdMaxSize = 15;

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

const userBodyFormat = joi.object({
	email: joi.string().email().required(),
	password: joi.string().min(pwdMinSize).max(pwdMaxSize).required()
});


module.exports.joi = joi;
module.exports.postBodyFormat = postBodyFormat;
module.exports.putBodyFormat = putBodyFormat;
module.exports.userBodyFormat = userBodyFormat;