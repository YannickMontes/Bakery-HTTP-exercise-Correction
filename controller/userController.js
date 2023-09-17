const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const format = require('../joi_request_format');
require("dotenv").config();

async function signup(req, res)
{
	const isBodyCorrect = format.userBodyFormat.validate(req.body);
	if(isBodyCorrect.error)
		return res.status(400).json({error: isBodyCorrect.error.details[0].message});

	let {user, error} = await req.app.database.getUser(req.body.email);

	if(user && user.email)
		return res.status(401).json({error: "Email is already existing in database."});

	if(error)
		return res.status(500).json({error});

	try
	{
		let hash = await bcrypt.hash(req.body.password, 5);
		let {user, error} = await req.app.database.createUser(req.body.email, hash);
		if(error)
			return res.status(500).json({error})
		return res.status(200).json({user});
	}
	catch(error)
	{
		return res.status(500).json({error});
	}
}

async function login(req, res)
{
	const isBodyCorrect = format.userBodyFormat.validate(req.body);
	if(isBodyCorrect.error)
		return res.status(400).json({error: isBodyCorrect.error.details[0].message});

	let {user, error} = await req.app.database.getUser(req.body.email);

	if(error)
		return res.status(500).json({error});

	if(!user || !user.email)
		return res.status(404).json({error: "User not found."});

	try
	{
		let pwdCorrect = await bcrypt.compare(req.body.password, user.password);

		if(!pwdCorrect)
			return res.status(400).json({error: "Incorrect password."});

		const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: process.env.TOKEN_EXP});
		res.status(200).json({userId: user._id, token: token});
	}
	catch(error)
	{
		return res.status(500).json({error});
	}
}

module.exports = 
{
	signup: signup, 
	login: login
};