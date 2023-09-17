const { makeApp } = require("../app");
const request = require("supertest");
const { checkAuth } = require("../auth");
const bcrypt = require("bcrypt");

const fs = require("fs");
const path = require("path");

const DATABASE = path.resolve(__dirname, "./../data/products.json");
let products = null;

function readProducts()
{
	let data = fs.readFileSync(DATABASE);
	products = JSON.parse(data);
}

let validUser = {email: "test@test.com", password: "testpwd"};
let otherUser = {email: "testother@test.com", password: "testotherpwd"};

const createProduct = jest.fn();
const getAllProducts = jest.fn(() => products);
const getProduct = jest.fn();
const modifyProduct = jest.fn();
const deleteProduct = jest.fn();
const getUser = jest.fn();
const createUser = jest.fn();

const app = makeApp({
	createProduct,
	getAllProducts,
	getProduct,
	modifyProduct,
	deleteProduct,
	getUser, 
	createUser
}, { checkAuth });

let wrongToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTA0NDZkMjBiY2U5NzEyYWRlNDFmNGQiLCJpYXQiOjE2OTQ3OTQ0NDEsImV4cCI6MTY5NDc5NDQ1MX0.8QPDVi8-ocnxX8js04prowNI1fU_OOOXNcNvkCwGcSI";
let token = null;

describe("** AUTH TESTS**", () => {

	beforeAll(async () => {
		createUser.mockReset();
		getUser.mockReset();
		getUser.mockReturnValueOnce({});
		createUser.mockReturnValueOnce({user: validUser});
		await request(app).post('/api/auth/signup').send(validUser);
		let hash = await bcrypt.hash(validUser.password, 5);
		getUser.mockReturnValueOnce({user: {_id: "27", email: validUser.email, password: hash}});
		const response = await request(app).post('/api/auth/login').send(validUser);
		token = response.body.token;
	});

	test("No token", async() => 
	{
		getAllProducts.mockReset();
		const response = await request(app).get("/api/products/").send();
		expect(response.statusCode).toBe(401);
		expect(getAllProducts.mock.calls.length).toBe(0);
		expect(response.body.error).toBeDefined();
	});

	test("Expired token", async() => 
	{
		getAllProducts.mockReset();
		const response = await request(app).get("/api/products/").set({authorization: wrongToken}).send();
		expect(response.statusCode).toBe(401);
		expect(getAllProducts.mock.calls.length).toBe(0);
		expect(response.body.error).toBeDefined();
	});

	test("Good token", async() => 
	{
		getAllProducts.mockReset();
		getAllProducts.mockReturnValueOnce({products});
		const response = await request(app).get("/api/products/").set({authorization: token}).send();
		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({products});
		expect(getAllProducts.mock.calls.length).toBe(1);
		expect(response.body.error).toBeUndefined();
	});
});