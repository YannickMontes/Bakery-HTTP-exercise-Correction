const { makeApp } = require("../app");
const request = require("supertest");

const fs = require("fs");
const path = require("path");

const DATABASE = path.resolve(__dirname, "./../data/products.json");
let products = null;

function readProducts()
{
	let data = fs.readFileSync(DATABASE);
	products = JSON.parse(data);
}

const createProduct = jest.fn();
const getAllProducts = jest.fn(() => products);
const getProduct = jest.fn();
const modifyProduct = jest.fn();
const deleteProduct = jest.fn();
const authFunc = jest.fn((req, res, next) => { next(); });

const app = makeApp({
	createProduct,
	getAllProducts,
	getProduct,
	modifyProduct,
	deleteProduct,
}, { checkAuth: authFunc });

describe("**PRODUCTS MODULE**", () => {

	beforeEach(() => {
		readProducts();
	});

	test("CREATE product success", async() => {
		createProduct.mockReset();
		let product = {name: "Pain aux raisins", price:60, description:"Un peu cher"};
		createProduct.mockReturnValueOnce({product});
		const response = await request(app).post('/api/products').send(product).timeout(1000);
		expect(response.statusCode).toBe(200);
		expect(response.body.product).toEqual(product);
		expect(createProduct.mock.calls.length).toBe(1);
	});

	test("CREATE product failed", async() => {
		createProduct.mockReset();
		let product = {name: "Pain aux raisins", price:60, desc:"Failed desc"};
		const response = await request(app).post('/api/products').send(product);
		expect(response.statusCode).toBe(400);
		expect(response.body.product).toBeUndefined();
		expect(response.body.error).toBeDefined();
		expect(createProduct.mock.calls.length).toBe(0);
	});

	test("GET all products success", async () => {
		getAllProducts.mockReset();
		getAllProducts.mockReturnValueOnce({products});
		const response = await request(app).get("/api/products/").send();
		expect(response.statusCode).toBe(200);
		expect(getAllProducts.mock.calls.length).toBe(1);
		expect(response.body).toEqual({products});
	});

	test("GET all products failed", async () => {
		getAllProducts.mockReset();
		getAllProducts.mockReturnValueOnce({error: "Some error"});
		const response = await request(app).get("/api/products/").send();
		expect(response.statusCode).toBe(500);
		expect(getAllProducts.mock.calls.length).toBe(1);
		expect(response.body).toEqual({error: "Some error"});
	});

	test("GET existing product", async () => {
		
		for(let i=1; i<=3; i++)
		{
			getProduct.mockReset();
			getProduct.mockReturnValueOnce({product: products[i-1]});
			const response = await request(app).get("/api/products/"+ i).send();
			expect(response.statusCode).toBe(200);
			expect(getProduct.mock.calls.length).toBe(1);
			expect(response.body).toEqual({product: products[i-1]});
		}
	});

	test("GET unexisting product", async () => {
		
		for(let i=1; i<=3; i++)
		{
			getProduct.mockReset();
			getProduct.mockReturnValueOnce({});
			const response = await request(app).get("/api/products/6000").send();
			expect(response.statusCode).toBe(404);
			expect(getProduct.mock.calls.length).toBe(1);
			expect(response.body.error).toBeDefined();
			expect(response.body.product).toBeUndefined();
		}
	});

	test("MODIFY product success", async() => {
		modifyProduct.mockReset();
		let product = products[0];
		product.name = "New Chocolatine";
		product.description = "New chocolatine desc";
		product.price = 77;
		modifyProduct.mockReturnValueOnce({product});
		const response = await request(app).put(`/api/products/${product.id}`).send({name: product.name, description: product.description, price: product.price});
		expect(response.statusCode).toBe(200);
		expect(modifyProduct.mock.calls.length).toBe(1);
		expect(response.body.product).toEqual(product);
	});

	test("MODIFY empty product failed", async() => {
		modifyProduct.mockReset();
		const response = await request(app).put(`/api/products/1`).send({});
		expect(response.statusCode).toBe(400);
		expect(modifyProduct.mock.calls.length).toBe(0);
		expect(response.body.product).toBeUndefined();
		expect(response.body.error).toBeDefined();
	});

	test("MODIFY non existing product", async() => {
		modifyProduct.mockReset();
		let product = products[0];
		product.name = "New Chocolatine";
		product.description = "New chocolatine desc";
		product.price = 77;
		modifyProduct.mockReturnValueOnce({error: "Id not found"});
		const response = await request(app).put(`/api/products/6000`).send({name: product.name, description: product.description, price: product.price});
		expect(response.statusCode).toBe(500);
		expect(modifyProduct.mock.calls.length).toBe(1);
		expect(response.body.product).toBeUndefined();
		expect(response.body.error).toBeDefined();
	});

	test("DELETE product", async() => {
		deleteProduct.mockReset();
		deleteProduct.mockReturnValueOnce({});
		const response = await request(app).delete("/api/products/1").send();
		expect(response.statusCode).toBe(200);
		expect(deleteProduct.mock.calls.length).toBe(1);
		expect(response.body).toEqual({});
	});
});