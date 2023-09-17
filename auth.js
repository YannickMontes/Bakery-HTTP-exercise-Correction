const jwt = require('jsonwebtoken');
require('dotenv').config();

function checkAuth(req, res, next)
{
	const token = req.headers.authorization;
	if(!token)
	{
		return res.status(401).json({error:'Need a token!'});
	}
	try
	{
		
		const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
		const userId = decodedToken.userId;
		if (req.body.userId && req.body.userId !== userId) 
		{
			return res.status(401).json({error:'Invalid token!'});
		} 
	}
	catch(error)
	{
		return res.status(401).json({error:'Expired token!'});
	}
	next();
}

module.exports = 
{
	checkAuth: checkAuth
};