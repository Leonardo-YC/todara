import {
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
    boolean,
    pgEnum,
  } from "drizzle-orm/pg-core";
  import type { AdapterAccountType } from "next-auth/adapters";
  
  // --- ENUMS (Tipos estrictos) ---
  export const priorityEnum = pgEnum("priority", ["low", "medium", "high"]);
  
  // --- TABLAS DE AUTH.JS (Seguridad) ---
  export const users = pgTable("user", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
  });
  
  export const accounts = pgTable("account", {
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  }, (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]);
  
  export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  });
  
  export const verificationTokens = pgTable("verificationToken", {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  }, (verificationToken) => [
    primaryKey({ columns: [verificationToken.identifier, verificationToken.token] }),
  ]);
  
  // --- TABLAS DEL CORE BUSINESS (Todara) ---
  export const categories = pgTable("category", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(), // Ej: "ALTO GRADO", "Estudios"
    color: text("color").notNull().default("#3b82f6"), // Color visual en el dashboard
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt").defaultNow(),
  });
  
  export const tasks = pgTable("task", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull(),
    description: text("description"),
    priority: priorityEnum("priority").default("medium"),
    dueDate: timestamp("dueDate", { mode: "date" }),
    isCompleted: boolean("isCompleted").default(false),
    categoryId: text("categoryId").references(() => categories.id, { onDelete: "set null" }), // Si borro la carpeta, la tarea no se borra, solo queda sin carpeta
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }), // Si borro al usuario, borro sus tareas
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
  });