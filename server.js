import express from "express";
import cors from "cors";
import { z } from "zod";
import { env } from "./env.js";
import { pool, OrderRowSchema } from "./db.js";

const app = express();

/* ---------- Middleware ---------- */
app.use(cors());
app.use(express.json());

/* ---------- Zod schema: incoming API request ---------- */
const CreateOrderSchema = z.object({
  customerName: z.string().trim().min(2),
  food: z.string().trim().min(2),
  quantity: z.number().min(1),
});

/* ---------- POST /order (Create order) ---------- 
* 1. Validate request (Zod)
* 2. Insert into DB
* 3. Validate DB response (Zod) */
app.post("/order", async (req, res) => {
  try {
    // Validate request body
    const parsed = CreateOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error.errors);
    }

    const { customerName, food, quantity } = parsed.data;

    // Insert into DB
    const result = await pool.query(
      `INSERT INTO orders (customer_name, food, quantity)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [customerName, food, quantity],
    );

    // Validate DB response
    const order = OrderRowSchema.parse(result.rows[0]);
    res.json({
      success: true,
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
});
console.log("This is starting");
/* ---------- GET /orders (Read all orders) ---------- */
app.get("/orders", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM orders ORDER BY created_at DESC`,
    );

    // Validate array of DB rows
    const orders = OrderRowSchema.array().parse(result.rows);

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
});

/* ---------- Server start ---------- */
console.log("This is starting11");
if (process.env.NODE_ENV !== "test") {
  app.listen(env.PORT, () => {
    console.log(`Server running at http://localhost:${env.PORT}`);
  });
}

export default app;
