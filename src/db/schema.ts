import { pgTable, uuid, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------- Tenants ----------
export const tenants = pgTable("tenants", {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 50 }).notNull().unique(), // acme / globex
    name: varchar("name", { length: 100 }).notNull(),
    plan: text("plan").notNull().default("free"), // free | pro
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- Users ----------
export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: text("role").notNull(), // admin | member
    tenantId: uuid("tenant_id")
        .notNull()
        .references(() => tenants.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- Notes ----------
export const notes = pgTable("notes", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    tenantId: uuid("tenant_id")
        .notNull()
        .references(() => tenants.id, { onDelete: "cascade" }),
    ownerId: uuid("owner_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
