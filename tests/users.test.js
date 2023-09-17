const { makeApp } = require("../app");
const request = require("supertest");
const bcrypt = require("bcrypt");

let validUser = {email: "test@test.com", password: "testpwd"};
let validUserWrongPwd = {email: "test@test.com", password: "testpwdvzrgzg"};
let wrongEmailUser = {email: "testnotanemail.com", password: "testpwd"};
let wrongPwdUser = {email: "testnotanemail.com", password: "test"};

const getUser = jest.fn();
const createUser = jest.fn();

const app = makeApp({
	getUser,
	createUser
});

describe("**USERS MODULE**", () => {

	test("SIGNUP Wrong email", async () => {
		createUser.mockReset();
		const response = await request(app).post('/api/auth/signup').send(wrongEmailUser);
		expect(response.statusCode).toBe(400);
		expect(response.body.error).toBeDefined();
		expect(response.body.user).toBeUndefined();
		expect(createUser.mock.calls.length).toBe(0);
	});

	test("SIGNUP wrong pwd", async () => {
		createUser.mockReset();
		const response = await request(app).post('/api/auth/signup').send(wrongPwdUser);
		expect(response.statusCode).toBe(400);
		expect(response.body.error).toBeDefined();
		expect(response.body.user).toBeUndefined();
		expect(createUser.mock.calls.length).toBe(0);
	});

	test("SIGNUP ok", async () => {
		createUser.mockReset();
		getUser.mockReset();
		getUser.mockReturnValueOnce({});
		createUser.mockReturnValueOnce({user: validUser});
		const response = await request(app).post('/api/auth/signup').send(validUser);
		expect(response.statusCode).toBe(200);
		expect(response.body.error).toBeUndefined();
		expect(response.body.user).toEqual(validUser);
		expect(createUser.mock.calls.length).toBe(1);
		expect(getUser.mock.calls.length).toBe(1);
	});

	test("SIGNUP already exists", async () => {
		createUser.mockReset();
		getUser.mockReset();
		getUser.mockReturnValueOnce({user: validUser});
		const response = await request(app).post('/api/auth/signup').send(validUser);
		expect(response.statusCode).toBe(401);
		expect(response.body.error).toBeDefined();
		expect(response.body.user).toBeUndefined();
		expect(createUser.mock.calls.length).toBe(0);
		expect(getUser.mock.calls.length).toBe(1);
	});

	test("LOGIN wrong email format", async() => {
		getUser.mockReset();
		const response = await request(app).post('/api/auth/login').send(wrongEmailUser);
		expect(response.statusCode).toBe(400);
		expect(response.body.error).toBeDefined();
		expect(response.body.user).toBeUndefined();
		expect(getUser.mock.calls.length).toBe(0);
	});

	test("LOGIN email not found", async() => {
		getUser.mockReset();
		getUser.mockReturnValueOnce({user:  {}});
		const response = await request(app).post('/api/auth/login').send(validUser);
		expect(response.statusCode).toBe(404);
		expect(response.body.error).toBeDefined();
		expect(response.body.user).toBeUndefined();
		expect(getUser.mock.calls.length).toBe(1);
	});

	test("LOGIN wrong pwd format", async() => {
		getUser.mockReset();
		const response = await request(app).post('/api/auth/login').send(wrongPwdUser);
		expect(response.statusCode).toBe(400);
		expect(response.body.error).toBeDefined();
		expect(response.body.user).toBeUndefined();
		expect(getUser.mock.calls.length).toBe(0);
	});
	
	test("LOGIN ok", async() => {
		let hash = await bcrypt.hash(validUser.password, 5);
		getUser.mockReset();
		getUser.mockReturnValueOnce({user: {_id: "27", email: validUser.email, password: hash}});
		response = await request(app).post('/api/auth/login').send(validUser);
		expect(response.statusCode).toBe(200);
		expect(response.body.error).toBeUndefined();
		expect(response.body.userId).toBeDefined();
		expect(response.body.token).toBeDefined();
		expect(getUser.mock.calls.length).toBe(1);
	});
	
	test("LOGIN wrong pwd correspondance", async() => {
		getUser.mockReset();
		getUser.mockReturnValueOnce({user: validUser});
		response = await request(app).post('/api/auth/login').send(validUserWrongPwd);
		expect(response.statusCode).toBe(400);
		expect(response.body.error).toBeDefined();
		expect(response.body.userId).toBeUndefined();
		expect(response.body.token).toBeUndefined();
		expect(getUser.mock.calls.length).toBe(1);
	});

});