const User = require('../../models/User');

async function getUser(email)
{
	try
	{
		let user = await User.findOne({email});
		return { user };
	}
	catch(error)
	{
		return { error };
	}
}

async function createUser(email, hashedPassword)
{
	try
	{
		let user = new User({
			email, 
			password: hashedPassword
		});
		await user.save();
		return { user };
	}
	catch(error)
	{
		return { error };
	}
}

module.exports = {
	getUser,
	createUser
}