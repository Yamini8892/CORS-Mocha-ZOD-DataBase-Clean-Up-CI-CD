import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

/*
 * Environment schema
 * This protects your app from:
 * - Missing env vars
 * - Wrong types
 */
const EnvSchema = z.object({
  PORT: z.string().transform(Number),
  DATABASE_URL: z.string().url(),
});

// Validate env variables
export const env = EnvSchema.parse(process.env);
