var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import multer from "multer";
import path from "path";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  hashtags: () => hashtags,
  insertHashtagSchema: () => insertHashtagSchema,
  insertProductSchema: () => insertProductSchema,
  insertUserSchema: () => insertUserSchema,
  insertVideoSchema: () => insertVideoSchema,
  products: () => products,
  users: () => users,
  videos: () => videos
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  // in cents
  description: text("description"),
  imageUrl: text("image_url"),
  category: text("category"),
  features: json("features").$type(),
  targetAudience: text("target_audience"),
  createdAt: timestamp("created_at").defaultNow()
});
var videos = pgTable("videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id),
  title: text("title").notNull(),
  description: text("description"),
  script: text("script"),
  hashtags: json("hashtags").$type(),
  style: text("style"),
  // trendy, professional, fun, simple
  status: text("status").default("generated"),
  // generated, uploaded, viral
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  tiktokUrl: text("tiktok_url"),
  salesLink: text("sales_link"),
  createdAt: timestamp("created_at").defaultNow()
});
var hashtags = pgTable("hashtags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tag: text("tag").notNull().unique(),
  views: integer("views").default(0),
  trending: integer("trending").default(0),
  // trending score
  category: text("category"),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true
}).extend({
  price: z.number().positive("Gi\xE1 ph\u1EA3i l\u1EDBn h\u01A1n 0"),
  name: z.string().min(1, "T\xEAn s\u1EA3n ph\u1EA9m kh\xF4ng \u0111\u01B0\u1EE3c \u0111\u1EC3 tr\u1ED1ng"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  category: z.string().optional(),
  features: z.array(z.string()).optional(),
  targetAudience: z.string().optional()
});
var insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true
});
var insertHashtagSchema = createInsertSchema(hashtags).omit({
  id: true,
  updatedAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc } from "drizzle-orm";
var DatabaseStorage = class {
  constructor() {
    this.initializeTrendingHashtags();
  }
  async initializeTrendingHashtags() {
    try {
      const existingHashtags = await db.select().from(hashtags).limit(1);
      if (existingHashtags.length > 0) return;
      const trendingTags = [
        { tag: "#fyp", views: 21e5, trending: 100, category: "general" },
        { tag: "#viral", views: 18e5, trending: 95, category: "general" },
        { tag: "#trending", views: 15e5, trending: 90, category: "general" },
        { tag: "#xuhuong", views: 98e4, trending: 85, category: "vietnam" },
        { tag: "#vietnam", views: 75e4, trending: 80, category: "location" },
        { tag: "#fashion", views: 65e4, trending: 75, category: "fashion" },
        { tag: "#unisex", views: 42e4, trending: 70, category: "fashion" },
        { tag: "#skincare", views: 38e4, trending: 65, category: "beauty" },
        { tag: "#shopping", views: 34e4, trending: 60, category: "commerce" },
        { tag: "#review", views: 29e4, trending: 55, category: "content" }
      ];
      await db.insert(hashtags).values(trendingTags);
    } catch (error) {
      console.error("Failed to initialize trending hashtags:", error);
    }
  }
  // User operations
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  // Product operations
  async getProducts() {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }
  async getProduct(id) {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || void 0;
  }
  async createProduct(insertProduct) {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }
  async updateProduct(id, updateData) {
    const [updated] = await db.update(products).set(updateData).where(eq(products.id, id)).returning();
    return updated || void 0;
  }
  async deleteProduct(id) {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount > 0;
  }
  // Video operations
  async getVideos() {
    return await db.select().from(videos).orderBy(desc(videos.createdAt));
  }
  async getVideosByProduct(productId) {
    return await db.select().from(videos).where(eq(videos.productId, productId)).orderBy(desc(videos.createdAt));
  }
  async getVideo(id) {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video || void 0;
  }
  async createVideo(insertVideo) {
    const [video] = await db.insert(videos).values(insertVideo).returning();
    return video;
  }
  async updateVideo(id, updateData) {
    const [updated] = await db.update(videos).set(updateData).where(eq(videos.id, id)).returning();
    return updated || void 0;
  }
  async deleteVideo(id) {
    const result = await db.delete(videos).where(eq(videos.id, id));
    return result.rowCount > 0;
  }
  // Hashtag operations
  async getHashtags() {
    return await db.select().from(hashtags);
  }
  async getTrendingHashtags(limit = 10) {
    return await db.select().from(hashtags).orderBy(desc(hashtags.trending)).limit(limit);
  }
  async getHashtag(id) {
    const [hashtag] = await db.select().from(hashtags).where(eq(hashtags.id, id));
    return hashtag || void 0;
  }
  async createHashtag(insertHashtag) {
    const [hashtag] = await db.insert(hashtags).values(insertHashtag).returning();
    return hashtag;
  }
  async updateHashtag(id, updateData) {
    const [updated] = await db.update(hashtags).set({ ...updateData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(hashtags.id, id)).returning();
    return updated || void 0;
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { z as z2 } from "zod";
var upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024
    // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});
async function registerRoutes(app2) {
  app2.get("/api/products", async (req, res) => {
    try {
      const products2 = await storage.getProducts();
      res.json(products2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  app2.post("/api/products", upload.single("image"), async (req, res) => {
    try {
      console.log("Received product data:", req.body);
      let price = 0;
      if (req.body.price) {
        const priceStr = req.body.price.toString().replace(/[^\d]/g, "");
        price = parseInt(priceStr) || 0;
        console.log("Parsed price:", price);
      }
      let features = [];
      if (req.body.features) {
        try {
          features = typeof req.body.features === "string" ? JSON.parse(req.body.features) : req.body.features;
        } catch {
          features = [];
        }
      }
      const productData = {
        name: req.body.name?.trim() || "",
        price,
        description: req.body.description?.trim() || void 0,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : void 0,
        category: req.body.category || "general",
        features: features.length > 0 ? features : void 0,
        targetAudience: req.body.targetAudience || void 0
      };
      console.log("Product data before validation:", productData);
      if (!productData.name) {
        return res.status(400).json({
          message: "Validation error",
          errors: [{ path: ["name"], message: "T\xEAn s\u1EA3n ph\u1EA9m kh\xF4ng \u0111\u01B0\u1EE3c \u0111\u1EC3 tr\u1ED1ng" }]
        });
      }
      if (productData.price <= 0) {
        return res.status(400).json({
          message: "Validation error",
          errors: [{ path: ["price"], message: "Gi\xE1 ph\u1EA3i l\u1EDBn h\u01A1n 0" }]
        });
      }
      const validatedData = insertProductSchema.parse(productData);
      const product = await storage.createProduct(validatedData);
      console.log("Created product:", product);
      res.status(201).json(product);
    } catch (error) {
      console.error("Product creation error:", error);
      if (error instanceof z2.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create product", error: error.message });
      }
    }
  });
  app2.put("/api/products/:id", upload.single("image"), async (req, res) => {
    try {
      const updateData = {};
      if (req.body.price) {
        const priceStr = req.body.price.toString().replace(/[^\d]/g, "");
        let price = parseInt(priceStr) || 0;
        if (price > 0) {
          price = price < 1e4 ? price * 100 : price;
        }
        updateData.price = price;
      }
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.description) updateData.description = req.body.description;
      if (req.body.category) updateData.category = req.body.category;
      if (req.body.targetAudience) updateData.targetAudience = req.body.targetAudience;
      if (req.body.features) {
        try {
          updateData.features = typeof req.body.features === "string" ? JSON.parse(req.body.features) : req.body.features;
        } catch {
          updateData.features = [];
        }
      }
      if (req.file) {
        updateData.imageUrl = `/uploads/${req.file.filename}`;
      }
      const product = await storage.updateProduct(req.params.id, updateData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Product update error:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });
  app2.delete("/api/products/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });
  app2.post("/api/tiktok/analyze", async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ message: "URL is required" });
      }
      const simulatedAnalysis = {
        productName: extractProductNameFromTikTok(url),
        estimatedPrice: generateEstimatedPrice(),
        description: generateProductDescription(url),
        hashtags: extractTrendingHashtags(),
        audience: analyzeTargetAudience(url),
        engagementScore: Math.floor(Math.random() * 100) + 1
      };
      res.json(simulatedAnalysis);
    } catch (error) {
      console.error("TikTok analysis error:", error);
      res.status(500).json({ message: "Failed to analyze TikTok video" });
    }
  });
  function extractProductNameFromTikTok(url) {
    const productTypes = [
      "\xC1o thun unisex cao c\u1EA5p",
      "Qu\u1EA7n jogger nam n\u1EEF",
      "V\xE1y maxi vintage",
      "Gi\xE0y sneaker trending",
      "T\xFAi x\xE1ch mini cute",
      "\u0110\u1ED3ng h\u1ED3 th\xF4ng minh",
      "Serum vitamin C",
      "Cushion che khuy\u1EBFt \u0111i\u1EC3m",
      "Son tint l\xE2u tr\xF4i",
      "Tai nghe bluetooth",
      "\u1ED0p l\u01B0ng iPhone",
      "Powerbank dung l\u01B0\u1EE3ng cao"
    ];
    return productTypes[Math.floor(Math.random() * productTypes.length)];
  }
  function generateEstimatedPrice() {
    const prices = ["99000", "149000", "199000", "299000", "399000", "499000"];
    return prices[Math.floor(Math.random() * prices.length)];
  }
  function generateProductDescription(url) {
    const descriptions = [
      "S\u1EA3n ph\u1EA9m hot trend tr\xEAn TikTok, ch\u1EA5t l\u01B0\u1EE3ng cao, gi\xE1 c\u1EA3 ph\u1EA3i ch\u0103ng. \u0110\u01B0\u1EE3c nhi\u1EC1u KOL review t\xEDch c\u1EF1c.",
      "Item viral \u0111\u01B0\u1EE3c h\xE0ng tri\u1EC7u ng\u01B0\u1EDDi xem, thi\u1EBFt k\u1EBF \u0111\u1ED9c \u0111\xE1o, ph\xF9 h\u1EE3p m\u1ECDi l\u1EE9a tu\u1ED5i.",
      "Trending product v\u1EDBi engagement cao, \u0111\xE3 b\xE1n \u0111\u01B0\u1EE3c h\xE0ng ngh\xECn \u0111\u01A1n qua TikTok Shop.",
      "S\u1EA3n ph\u1EA9m \u0111\u01B0\u1EE3c influencer top \u0111\u1EA7u gi\u1EDBi thi\u1EC7u, ch\u1EA5t l\u01B0\u1EE3ng \u0111\u1EA3m b\u1EA3o, ship to\xE0n qu\u1ED1c."
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }
  function extractTrendingHashtags() {
    const hashtags2 = [
      "#fyp",
      "#viral",
      "#trending",
      "#xuhuong",
      "#vietnam",
      "#shopping",
      "#review",
      "#unisex",
      "#fashion",
      "#beauty",
      "#tech",
      "#lifestyle"
    ];
    return hashtags2.slice(0, Math.floor(Math.random() * 6) + 4);
  }
  function analyzeTargetAudience(url) {
    const audiences = ["Gen Z (18-25)", "Millennials (26-35)", "Gen X (36-45)", "All ages"];
    return audiences[Math.floor(Math.random() * audiences.length)];
  }
  app2.get("/api/videos", async (req, res) => {
    try {
      const videos2 = await storage.getVideos();
      res.json(videos2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });
  app2.get("/api/videos/product/:productId", async (req, res) => {
    try {
      const videos2 = await storage.getVideosByProduct(req.params.productId);
      res.json(videos2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch videos for product" });
    }
  });
  app2.post("/api/videos/generate", async (req, res) => {
    try {
      const { productId, style } = req.body;
      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const trendingHashtags = await storage.getTrendingHashtags(8);
      const hashtags2 = trendingHashtags.map((h) => h.tag);
      const videoScript = generateAdvancedVideoScript(product, style, hashtags2);
      const videoTitle = generateEngagingTitle(product, style);
      const videoData = {
        productId,
        title: videoTitle,
        description: videoScript.description,
        script: videoScript.fullScript,
        hashtags: [...hashtags2, `#${product.category || "shopping"}`, "#trending", "#viral"],
        style,
        salesLink: `https://tiktok.com/@tikcreator/product/${productId}?utm_source=ai_video`,
        tiktokUrl: `https://www.tiktok.com/@tikcreator/video/${Date.now()}${Math.floor(Math.random() * 1e3)}`,
        views: Math.floor(Math.random() * 5e4) + 1e4,
        likes: Math.floor(Math.random() * 8e3) + 1500
      };
      const video = await storage.createVideo(videoData);
      res.status(201).json(video);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to generate video" });
      }
    }
  });
  app2.put("/api/videos/:id", async (req, res) => {
    try {
      const video = await storage.updateVideo(req.params.id, req.body);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: "Failed to update video" });
    }
  });
  app2.delete("/api/videos/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteVideo(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete video" });
    }
  });
  app2.get("/api/hashtags", async (req, res) => {
    try {
      const hashtags2 = await storage.getHashtags();
      res.json(hashtags2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hashtags" });
    }
  });
  app2.get("/api/hashtags/trending", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const hashtags2 = await storage.getTrendingHashtags(limit);
      res.json(hashtags2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending hashtags" });
    }
  });
  app2.get("/api/analytics/stats", async (req, res) => {
    try {
      const products2 = await storage.getProducts();
      const videos2 = await storage.getVideos();
      const totalViews = videos2.reduce((sum, video) => sum + (video.views || 0), 0);
      const totalLikes = videos2.reduce((sum, video) => sum + (video.likes || 0), 0);
      const mockRevenue = totalViews * 5e-3;
      const stats = {
        totalProducts: products2.length,
        videosCreated: videos2.length,
        totalViews: totalViews > 1e6 ? `${(totalViews / 1e6).toFixed(1)}M` : `${Math.floor(totalViews / 1e3)}K`,
        revenue: `$${mockRevenue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
        rawStats: {
          totalProducts: products2.length,
          videosCreated: videos2.length,
          totalViews,
          totalLikes,
          revenue: mockRevenue
        }
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });
  app2.get("/api/analytics/recent-videos", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 5;
      const videos2 = await storage.getVideos();
      const recentVideos = videos2.slice(0, limit);
      res.json(recentVideos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent videos" });
    }
  });
  app2.use("/uploads", (req, res, next) => {
    res.sendFile(path.join(process.cwd(), "uploads", req.path));
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
