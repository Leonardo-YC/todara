import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Cargamos las variables locales para que Drizzle Kit pueda usarlas
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle", // Aquí se guardarán los historiales de migración
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});