import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertConnectionSchema, insertMessageSchema, insertPortfolioSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Users
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Connections
  app.get("/api/connections/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const connections = await storage.getConnectionsByUserId(userId);
      res.json(connections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch connections" });
    }
  });

  app.post("/api/connections", async (req, res) => {
    try {
      const connectionData = insertConnectionSchema.parse(req.body);
      
      // Check if connection already exists
      const existing = await storage.getConnection(connectionData.fromUserId, connectionData.toUserId);
      if (existing) {
        return res.status(400).json({ message: "Connection already exists" });
      }
      
      const connection = await storage.createConnection(connectionData);
      res.status(201).json(connection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid connection data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create connection" });
    }
  });

  app.put("/api/connections/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!["accepted", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const connection = await storage.updateConnectionStatus(id, status);
      if (!connection) {
        return res.status(404).json({ message: "Connection not found" });
      }
      res.json(connection);
    } catch (error) {
      res.status(500).json({ message: "Failed to update connection status" });
    }
  });

  // Messages
  app.get("/api/conversations/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const conversations = await storage.getConversations(userId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.get("/api/messages/:userId1/:userId2", async (req, res) => {
    try {
      const userId1 = parseInt(req.params.userId1);
      const userId2 = parseInt(req.params.userId2);
      const messages = await storage.getMessagesBetweenUsers(userId1, userId2);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  // Events
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  // Portfolios
  app.get("/api/portfolio/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const portfolio = await storage.getPortfolio(userId);
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  app.post("/api/portfolio", async (req, res) => {
    try {
      const portfolioData = insertPortfolioSchema.parse(req.body);
      const portfolio = await storage.createOrUpdatePortfolio(portfolioData);
      res.json(portfolio);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid portfolio data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to save portfolio" });
    }
  });

  // Mock Coinbase API endpoints
  app.get("/api/coinbase/portfolio/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Mock Coinbase portfolio data
      const mockPortfolio = {
        totalValue: "$127,450.32",
        change24h: "+12.4%",
        holdings: [
          {
            symbol: "BTC",
            name: "Bitcoin",
            amount: "2.85",
            value: "$123,250",
            change: "+8.2%",
            icon: "bitcoin"
          },
          {
            symbol: "ETH",
            name: "Ethereum",
            amount: "15.2",
            value: "$32,890",
            change: "-2.1%",
            icon: "ethereum"
          },
          {
            symbol: "SOL",
            name: "Solana",
            amount: "250",
            value: "$18,750",
            change: "+15.7%",
            icon: "solana"
          }
        ],
        recentTransactions: [
          {
            type: "Bought ETH",
            amount: "5.0 ETH",
            value: "$10,850",
            time: "2 hours ago",
            direction: "buy"
          },
          {
            type: "Sold BTC",
            amount: "0.5 BTC",
            value: "$21,625",
            time: "1 day ago",
            direction: "sell"
          }
        ]
      };

      // Save to storage
      await storage.createOrUpdatePortfolio({
        userId,
        holdings: mockPortfolio.holdings,
        totalValue: mockPortfolio.totalValue,
        change24h: mockPortfolio.change24h
      });

      res.json(mockPortfolio);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Coinbase portfolio" });
    }
  });

  app.get("/api/coinbase/prices", async (req, res) => {
    try {
      // Mock current crypto prices
      const mockPrices = {
        BTC: "$43,250.32",
        ETH: "$2,165.50",
        SOL: "$75.23",
        lastUpdated: new Date().toISOString()
      };
      
      res.json(mockPrices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch crypto prices" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
