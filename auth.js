const jwt = require('jsonwebtoken');

function checkAuth(req, res, next)
{
	const token = req.headers.authorization;
	if(!token)
	{
		return res.status(401).json({error:'Need a token!'});
	}
	const decodedToken = jwt.verify(token, 'secret_key');
	const userId = decodedToken.userId;
	if (req.body.userId && req.body.userId !== userId) 
	{
		return res.status(401).json({error:'Invalid token!'});
	} 
	next();
}

module.exports = {checkAuth: checkAuth};