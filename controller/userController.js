const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

function signup(req, res)
{
	bcrypt.hash(req.body.password, 5)
		.then(hash => {
			const user = new User({
				email: req.body.email,
				password: hash
			});
			user.save()
				.then((savedUser) => res.status(200).json(savedUser))
				.catch(error => res.status(500).json({ error: error }));
		})
		.catch(error => res.status(500).json({ error:error }));
}

function login(req, res)
{
	User.findOne({ email: req.body.email })
		.then(user => {
			if (user === null) 
			{
				return res.status(404).json({ error: 'User not found !' });
			}
			bcrypt.compare(req.body.password, user.password)
				.then(valid => {
					if (!valid) 
					{
						return res.status(401).json({ error: 'Wrong password !' });
					}
					const token = jwt.sign({userId: user._id}, 'secret_key', {expiresIn: "1h"});
					res.status(200).json({userId: user._id, token: token});
				})
			.catch(error => res.status(500).json({ error }));
		})
		.catch(error => res.status(500).json({ error }));
}

module.exports = {signup: signup, 
					login: login};