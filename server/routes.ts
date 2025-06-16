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

  // Mock Coinbase API endpoints with varied portfolios
  app.get("/api/coinbase/portfolio/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Different portfolio configurations based on user
      const portfolios = {
        1: {
          totalValue: "$2,847,650.32",
          change24h: "+14.7%",
          holdings: [
            {
              symbol: "ETH",
              name: "Ethereum",
              amount: "1,250.5",
              value: "$2,708,583",
              change: "+16.2%",
              icon: "ethereum"
            },
            {
              symbol: "BTC",
              name: "Bitcoin",
              amount: "2.1",
              value: "$90,825",
              change: "+8.1%",
              icon: "bitcoin"
            },
            {
              symbol: "UNI",
              name: "Uniswap",
              amount: "5,000",
              value: "$48,242",
              change: "+22.5%",
              icon: "uniswap"
            }
          ],
          recentTransactions: [
            {
              type: "Staked ETH",
              amount: "500.0 ETH",
              value: "$1,082,750",
              time: "3 hours ago",
              direction: "buy"
            },
            {
              type: "Received UNI",
              amount: "2,000 UNI",
              value: "$19,296",
              time: "1 day ago",
              direction: "buy"
            }
          ]
        },
        2: {
          totalValue: "$1,456,890.50",
          change24h: "+9.3%",
          holdings: [
            {
              symbol: "BTC",
              name: "Bitcoin",
              amount: "28.5",
              value: "$1,232,625",
              change: "+8.1%",
              icon: "bitcoin"
            },
            {
              symbol: "USDC",
              name: "USD Coin",
              amount: "150,000",
              value: "$150,000",
              change: "0.0%",
              icon: "usdc"
            },
            {
              symbol: "LINK",
              name: "Chainlink",
              amount: "5,250",
              value: "$74,265",
              change: "+12.8%",
              icon: "chainlink"
            }
          ],
          recentTransactions: [
            {
              type: "Bought BTC",
              amount: "5.0 BTC",
              value: "$216,250",
              time: "1 hour ago",
              direction: "buy"
            },
            {
              type: "Converted USDC",
              amount: "50,000 USDC",
              value: "$50,000",
              time: "6 hours ago",
              direction: "sell"
            }
          ]
        },
        3: {
          totalValue: "$892,340.75",
          change24h: "+18.9%",
          holdings: [
            {
              symbol: "SOL",
              name: "Solana",
              amount: "8,500",
              value: "$639,550",
              change: "+19.7%",
              icon: "solana"
            },
            {
              symbol: "ETH",
              name: "Ethereum",
              amount: "85.2",
              value: "$184,458",
              change: "+16.2%",
              icon: "ethereum"
            },
            {
              symbol: "RAY",
              name: "Raydium",
              amount: "12,000",
              value: "$68,332",
              change: "+25.4%",
              icon: "raydium"
            }
          ],
          recentTransactions: [
            {
              type: "Swapped SOL",
              amount: "2,000 SOL",
              value: "$150,460",
              time: "30 minutes ago",
              direction: "buy"
            },
            {
              type: "Provided Liquidity",
              amount: "25.0 ETH",
              value: "$54,125",
              time: "2 days ago",
              direction: "buy"
            }
          ]
        }
      };

      const mockPortfolio = portfolios[userId as keyof typeof portfolios] || {
        totalValue: "$43,250.00",
        change24h: "+5.2%",
        holdings: [
          {
            symbol: "BTC",
            name: "Bitcoin",
            amount: "1.0",
            value: "$43,250",
            change: "+5.2%",
            icon: "bitcoin"
          }
        ],
        recentTransactions: [
          {
            type: "Bought BTC",
            amount: "1.0 BTC",
            value: "$43,250",
            time: "1 week ago",
            direction: "buy"
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
