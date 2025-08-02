import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { insertProductSchema, insertVideoSchema, insertHashtagSchema } from "@shared/schema";
import { z } from "zod";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
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

  app.post("/api/products", upload.single('image'), async (req, res) => {
    try {
      console.log("Received product data:", req.body);
      
      // Parse price safely
      let price = 0;
      if (req.body.price) {
        const priceStr = req.body.price.toString().replace(/[^\d]/g, "");
        price = parseInt(priceStr) || 0;
        console.log("Parsed price:", price);
      }

      // Parse features safely
      let features: string[] = [];
      if (req.body.features) {
        try {
          features = typeof req.body.features === 'string' 
            ? JSON.parse(req.body.features) 
            : req.body.features;
        } catch {
          features = [];
        }
      }

      const productData = {
        name: req.body.name?.trim() || "",
        price: price,
        description: req.body.description?.trim() || undefined,
        imageUrl: (req as any).file ? `/uploads/${(req as any).file.filename}` : undefined,
        category: req.body.category || "general",
        features: features.length > 0 ? features : undefined,
        targetAudience: req.body.targetAudience || undefined,
      };

      console.log("Product data before validation:", productData);

      // Basic validation before Zod
      if (!productData.name) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: [{ path: ["name"], message: "Tên sản phẩm không được để trống" }] 
        });
      }

      if (productData.price <= 0) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: [{ path: ["price"], message: "Giá phải lớn hơn 0" }] 
        });
      }

      const validatedData = insertProductSchema.parse(productData);
      const product = await storage.createProduct(validatedData);
      console.log("Created product:", product);
      res.status(201).json(product);
    } catch (error) {
      console.error("Product creation error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create product", error: (error as Error).message });
      }
    }
  });

  app.put("/api/products/:id", upload.single('image'), async (req, res) => {
    try {
      const updateData: any = {};
      
      // Parse price safely
      if (req.body.price) {
        const priceStr = req.body.price.toString().replace(/[^\d]/g, "");
        let price = parseInt(priceStr) || 0;
        // Always convert to cents for storage
        if (price > 0) {
          price = price < 10000 ? price * 100 : price; // Convert to cents if value seems to be in VND
        }
        updateData.price = price;
      }

      // Parse other fields
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.description) updateData.description = req.body.description;
      if (req.body.category) updateData.category = req.body.category;
      if (req.body.targetAudience) updateData.targetAudience = req.body.targetAudience;
      
      // Parse features safely
      if (req.body.features) {
        try {
          updateData.features = typeof req.body.features === 'string' 
            ? JSON.parse(req.body.features) 
            : req.body.features;
        } catch {
          updateData.features = [];
        }
      }

      if ((req as any).file) {
        updateData.imageUrl = `/uploads/${(req as any).file.filename}`;
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

  app.delete("/api/products/:id", async (req, res) => {
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

  // TikTok Analysis routes
  app.post("/api/tiktok/analyze", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ message: "URL is required" });
      }

      // Simulate TikTok analysis with realistic data extraction
      const simulatedAnalysis = {
        productName: extractProductNameFromTikTok(url),
        estimatedPrice: generateEstimatedPrice(),
        description: generateProductDescription(url),
        hashtags: extractTrendingHashtags(),
        audience: analyzeTargetAudience(url),
        engagementScore: Math.floor(Math.random() * 100) + 1,
      };

      res.json(simulatedAnalysis);
    } catch (error) {
      console.error("TikTok analysis error:", error);
      res.status(500).json({ message: "Failed to analyze TikTok video" });
    }
  });

  // Helper functions for TikTok analysis
  function extractProductNameFromTikTok(url: string): string {
    const productTypes = [
      "Áo thun unisex cao cấp", "Quần jogger nam nữ", "Váy maxi vintage", 
      "Giày sneaker trending", "Túi xách mini cute", "Đồng hồ thông minh",
      "Serum vitamin C", "Cushion che khuyết điểm", "Son tint lâu trôi",
      "Tai nghe bluetooth", "Ốp lưng iPhone", "Powerbank dung lượng cao"
    ];
    return productTypes[Math.floor(Math.random() * productTypes.length)];
  }

  function generateEstimatedPrice(): string {
    const prices = ["99000", "149000", "199000", "299000", "399000", "499000"];
    return prices[Math.floor(Math.random() * prices.length)];
  }

  function generateProductDescription(url: string): string {
    const descriptions = [
      "Sản phẩm hot trend trên TikTok, chất lượng cao, giá cả phải chăng. Được nhiều KOL review tích cực.",
      "Item viral được hàng triệu người xem, thiết kế độc đáo, phù hợp mọi lứa tuổi.",
      "Trending product với engagement cao, đã bán được hàng nghìn đơn qua TikTok Shop.",
      "Sản phẩm được influencer top đầu giới thiệu, chất lượng đảm bảo, ship toàn quốc.",
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  function extractTrendingHashtags(): string[] {
    const hashtags = [
      "#fyp", "#viral", "#trending", "#xuhuong", "#vietnam", "#shopping", 
      "#review", "#unisex", "#fashion", "#beauty", "#tech", "#lifestyle"
    ];
    return hashtags.slice(0, Math.floor(Math.random() * 6) + 4);
  }

  function analyzeTargetAudience(url: string): string {
    const audiences = ["Gen Z (18-25)", "Millennials (26-35)", "Gen X (36-45)", "All ages"];
    return audiences[Math.floor(Math.random() * audiences.length)];
  }

  // Videos routes
  app.get("/api/videos", async (req, res) => {
    try {
      const videos = await storage.getVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  app.get("/api/videos/product/:productId", async (req, res) => {
    try {
      const videos = await storage.getVideosByProduct(req.params.productId);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch videos for product" });
    }
  });

  app.post("/api/videos/generate", async (req, res) => {
    try {
      const { productId, style } = req.body;
      
      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // AI-powered video generation with trending analysis
      const trendingHashtags = await storage.getTrendingHashtags(8);
      const hashtags = trendingHashtags.map(h => h.tag);
      
      // Generate comprehensive video script
      const videoScript = generateAdvancedVideoScript(product, style, hashtags);
      const videoTitle = generateEngagingTitle(product, style);
      
      const videoData = {
        productId,
        title: videoTitle,
        description: videoScript.description,
        script: videoScript.fullScript,
        hashtags: [...hashtags, `#${product.category || 'shopping'}`, '#trending', '#viral'],
        style,
        salesLink: `https://tiktok.com/@tikcreator/product/${productId}?utm_source=ai_video`,
        tiktokUrl: `https://www.tiktok.com/@tikcreator/video/${Date.now()}${Math.floor(Math.random() * 1000)}`,
        views: Math.floor(Math.random() * 50000) + 10000,
        likes: Math.floor(Math.random() * 8000) + 1500,
      };

      const video = await storage.createVideo(videoData);
      res.status(201).json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to generate video" });
      }
    }
  });

  app.put("/api/videos/:id", async (req, res) => {
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

  app.delete("/api/videos/:id", async (req, res) => {
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

  // Hashtags routes
  app.get("/api/hashtags", async (req, res) => {
    try {
      const hashtags = await storage.getHashtags();
      res.json(hashtags);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hashtags" });
    }
  });

  app.get("/api/hashtags/trending", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const hashtags = await storage.getTrendingHashtags(limit);
      res.json(hashtags);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending hashtags" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/stats", async (req, res) => {
    try {
      const products = await storage.getProducts();
      const videos = await storage.getVideos();
      
      const totalViews = videos.reduce((sum, video) => sum + (video.views || 0), 0);
      const totalLikes = videos.reduce((sum, video) => sum + (video.likes || 0), 0);
      
      // Mock revenue calculation
      const mockRevenue = totalViews * 0.005; // $0.005 per view
      
      const stats = {
        totalProducts: products.length,
        videosCreated: videos.length,
        totalViews: totalViews > 1000000 ? `${(totalViews / 1000000).toFixed(1)}M` : `${Math.floor(totalViews / 1000)}K`,
        revenue: `$${mockRevenue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
        rawStats: {
          totalProducts: products.length,
          videosCreated: videos.length,
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

  app.get("/api/analytics/recent-videos", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const videos = await storage.getVideos();
      const recentVideos = videos.slice(0, limit);
      
      res.json(recentVideos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent videos" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    res.sendFile(path.join(process.cwd(), 'uploads', req.path));
  });

  const httpServer = createServer(app);
  return httpServer;
}
