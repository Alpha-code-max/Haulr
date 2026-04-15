import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  MONGO_URI: z.string().url("MONGO_URI must be a valid connection string"),
  JWT_SECRET: z.string().min(10, "JWT_SECRET is required and must be long enough"),
  PORT: z.coerce.number().default(5000),
  PAYSTACK_SECRET_KEY: z.string().default("sk_test_placeholder"),
  PAYSTACK_PUBLIC_KEY: z.string().default("pk_test_placeholder"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  process.exit(1);
}

export const env = _env.data;
