import { users, products, videos, hashtags, type User, type InsertUser, type Product, type InsertProduct, type Video, type InsertVideo, type Hashtag, type InsertHashtag } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Video operations
  getVideos(): Promise<Video[]>;
  getVideosByProduct(productId: string): Promise<Video[]>;
  getVideo(id: string): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: string, video: Partial<InsertVideo>): Promise<Video | undefined>;
  deleteVideo(id: string): Promise<boolean>;

  // Hashtag operations
  getHashtags(): Promise<Hashtag[]>;
  getTrendingHashtags(limit?: number): Promise<Hashtag[]>;
  getHashtag(id: string): Promise<Hashtag | undefined>;
  createHashtag(hashtag: InsertHashtag): Promise<Hashtag>;
  updateHashtag(id: string, hashtag: Partial<InsertHashtag>): Promise<Hashtag | undefined>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeTrendingHashtags();
  }

  private async initializeTrendingHashtags() {
    try {
      const existingHashtags = await db.select().from(hashtags).limit(1);
      if (existingHashtags.length > 0) return; // Already initialized

      const trendingTags = [
        { tag: "#fyp", views: 2100000, trending: 100, category: "general" },
        { tag: "#viral", views: 1800000, trending: 95, category: "general" },
        { tag: "#trending", views: 1500000, trending: 90, category: "general" },
        { tag: "#xuhuong", views: 980000, trending: 85, category: "vietnam" },
        { tag: "#vietnam", views: 750000, trending: 80, category: "location" },
        { tag: "#fashion", views: 650000, trending: 75, category: "fashion" },
        { tag: "#unisex", views: 420000, trending: 70, category: "fashion" },
        { tag: "#skincare", views: 380000, trending: 65, category: "beauty" },
        { tag: "#shopping", views: 340000, trending: 60, category: "commerce" },
        { tag: "#review", views: 290000, trending: 55, category: "content" },
      ];

      await db.insert(hashtags).values(trendingTags);
    } catch (error) {
      console.error("Failed to initialize trending hashtags:", error);
    }
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: string, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db.update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount > 0;
  }

  // Video operations
  async getVideos(): Promise<Video[]> {
    return await db.select().from(videos).orderBy(desc(videos.createdAt));
  }

  async getVideosByProduct(productId: string): Promise<Video[]> {
    return await db.select().from(videos)
      .where(eq(videos.productId, productId))
      .orderBy(desc(videos.createdAt));
  }

  async getVideo(id: string): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video || undefined;
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const [video] = await db.insert(videos).values(insertVideo).returning();
    return video;
  }

  async updateVideo(id: string, updateData: Partial<InsertVideo>): Promise<Video | undefined> {
    const [updated] = await db.update(videos)
      .set(updateData)
      .where(eq(videos.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteVideo(id: string): Promise<boolean> {
    const result = await db.delete(videos).where(eq(videos.id, id));
    return result.rowCount > 0;
  }

  // Hashtag operations
  async getHashtags(): Promise<Hashtag[]> {
    return await db.select().from(hashtags);
  }

  async getTrendingHashtags(limit: number = 10): Promise<Hashtag[]> {
    return await db.select().from(hashtags)
      .orderBy(desc(hashtags.trending))
      .limit(limit);
  }

  async getHashtag(id: string): Promise<Hashtag | undefined> {
    const [hashtag] = await db.select().from(hashtags).where(eq(hashtags.id, id));
    return hashtag || undefined;
  }

  async createHashtag(insertHashtag: InsertHashtag): Promise<Hashtag> {
    const [hashtag] = await db.insert(hashtags).values(insertHashtag).returning();
    return hashtag;
  }

  async updateHashtag(id: string, updateData: Partial<InsertHashtag>): Promise<Hashtag | undefined> {
    const [updated] = await db.update(hashtags)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(hashtags.id, id))
      .returning();
    return updated || undefined;
  }
}

export const storage = new DatabaseStorage();
