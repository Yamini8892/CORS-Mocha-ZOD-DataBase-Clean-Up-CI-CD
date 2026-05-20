//Database connection + response validation
import pkg from "pg";
import { z } from "zod";
import { env } from "./env.js";

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

/*
 * Zod schema for DB response
 * DB is NOT 100% reliable in real systems
 */
export const OrderRowSchema = z.object({
  id: z.number(),
  customer_name: z.string(),
  food: z.string(),
  quantity: z.number(),
});
