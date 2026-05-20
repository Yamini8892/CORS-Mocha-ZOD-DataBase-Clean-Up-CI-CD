/*🧪 Purpose: This is a test file that checks whether your backend APIs behave correctly without
using a browser. Includes database cleanup before and after tests
It tests: ✅ POST /order    ✅ GET /orders   ✅ Validation errors */

/** Order API.
 * It uses:
 *  - Mocha   → test runner (runs the tests)
 *  - Chai    → assertions (expectations)
 *  - Supertest → simulate HTTP requests to Express app
 */

//Import required tools. This allows test code to call your API.
import request from "supertest"; // Used to send fake HTTP requests
import { expect } from "chai"; // Used to write readable assertions
import app from "../server.js"; // Import Express app (NOT listen)
import { pool } from "../db.js";

/* ------------------------------------------------
   DATABASE CLEANUP BEFORE & AFTER TESTS
------------------------------------------------- */

// Runs ONCE before all tests
before(async () => {
  // Remove all existing orders
  await pool.query("DELETE FROM orders;");
});

// Runs ONCE after all tests
after(async () => {
  // Clean up again (optional, but good practice)
  await pool.query("DELETE FROM orders;");

  // Close DB connection
  await pool.end();
});

// -----------------------------
// TEST: POST /order (SUCCESS)
// -----------------------------
/*✅ Tests: API works   ||  Validation passes   ||  Correct response returned
 */
console.log("order -  Success case is running");
describe("POST /order -  Success case", () => {
  it("should create an order when valid data is sent", async () => {
    // Send a fake POST request to /order
    const res = await request(app).post("/order").send({
      customerName: "Test User",
      food: "Burger",
      quantity: 1,
    });

    expect(res.status).to.equal(200); // Check HTTP status code
    expect(res.body.success).to.equal(true); // Check response structure
    // Check returned order data
    expect(res.body.order).to.have.property("id");
    expect(res.body.order.food).to.equal("Burger");
    expect(res.body.order.quantity).to.equal(1);
  });
});

// ------------------------------------
// TEST: POST /order (VALIDATION ERROR) - ✅ Confirms Zod backend validation works.
// ------------------------------------

describe("POST /order Validation failure", () => {
  it("should return 400 when request body is empty or for invalid input", async () => {
    // Send POST request with NO data
    const res = await request(app).post("/order").send({}); // empty input
    expect(res.status).to.equal(400); // Expect validation error
  });
});

// -----------------------------
// TEST: GET /orders - ✅ Confirms read API works.
// -----------------------------

describe("GET /orders", () => {
  it("should return all orders as an array", async () => {
    const res = await request(app).get("/orders"); // Send GET request to fetch all orders

    // Expect success
    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);

    // Orders should be an array
    expect(res.body.orders).to.be.an("array");
  });
});


