import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  price: integer("price").notNull(), // in cents
  description: text("description"),
  imageUrl: text("image_url"),
  category: text("category"),
  features: json("features").$type<string[]>(),
  targetAudience: text("target_audience"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const videos = pgTable("videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id),
  title: text("title").notNull(),
  description: text("description"),
  script: text("script"),
  hashtags: json("hashtags").$type<string[]>(),
  style: text("style"), // trendy, professional, fun, simple
  status: text("status").default("generated"), // generated, uploaded, viral
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  tiktokUrl: text("tiktok_url"),
  salesLink: text("sales_link"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const hashtags = pgTable("hashtags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tag: text("tag").notNull().unique(),
  views: integer("views").default(0),
  trending: integer("trending").default(0), // trending score
  category: text("category"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
}).extend({
  price: z.number().positive("Giá phải lớn hơn 0"),
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  category: z.string().optional(),
  features: z.array(z.string()).optional(),
  targetAudience: z.string().optional(),
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
});

export const insertHashtagSchema = createInsertSchema(hashtags).omit({
  id: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;

export type InsertHashtag = z.infer<typeof insertHashtagSchema>;
export type Hashtag = typeof hashtags.$inferSelect;
