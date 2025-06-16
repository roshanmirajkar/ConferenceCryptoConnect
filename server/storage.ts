import { 
  users, 
  connections, 
  messages, 
  events, 
  portfolios,
  type User, 
  type InsertUser,
  type Connection,
  type InsertConnection,
  type Message,
  type InsertMessage,
  type Event,
  type InsertEvent,
  type Portfolio,
  type InsertPortfolio
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Connections
  createConnection(connection: InsertConnection): Promise<Connection>;
  getConnectionsByUserId(userId: number): Promise<Connection[]>;
  updateConnectionStatus(id: number, status: "accepted" | "rejected"): Promise<Connection | undefined>;
  getConnection(fromUserId: number, toUserId: number): Promise<Connection | undefined>;
  
  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesBetweenUsers(userId1: number, userId2: number): Promise<Message[]>;
  getConversations(userId: number): Promise<Array<{ user: User; lastMessage: Message; unreadCount: number }>>;
  
  // Events
  getAllEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  // Portfolios
  getPortfolio(userId: number): Promise<Portfolio | undefined>;
  createOrUpdatePortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private connections: Map<number, Connection>;
  private messages: Map<number, Message>;
  private events: Map<number, Event>;
  private portfolios: Map<number, Portfolio>;
  private currentUserId: number;
  private currentConnectionId: number;
  private currentMessageId: number;
  private currentEventId: number;
  private currentPortfolioId: number;

  constructor() {
    this.users = new Map();
    this.connections = new Map();
    this.messages = new Map();
    this.events = new Map();
    this.portfolios = new Map();
    this.currentUserId = 1;
    this.currentConnectionId = 1;
    this.currentMessageId = 1;
    this.currentEventId = 1;
    this.currentPortfolioId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Seed sample conference attendees
    const sampleUsers = [
      {
        username: "sarah_chen",
        email: "sarah@compound.finance",
        name: "Sarah Chen",
        title: "DeFi Protocol Lead",
        company: "Compound",
        bio: "Building the future of decentralized finance",
        interests: ["DeFi", "Lending", "Governance"],
        avatar: "https://pixabay.com/get/g75e35c25071dda2b5abbbffa5c183ffbb98c7d4cc3db478821c7586a1f6c670ccd2c36dba041b464d94706ff5cd2fb47bdadd197c87485978ad0c47441966613_1280.jpg",
        isAttending: true,
        coinbaseConnected: true,
        createdAt: new Date(),
      },
      {
        username: "marcus_rodriguez",
        email: "marcus@coinbase.com",
        name: "Marcus Rodriguez",
        title: "VP Engineering",
        company: "Coinbase",
        bio: "Scaling crypto infrastructure for the next billion users",
        interests: ["Trading", "Infrastructure", "Security"],
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        isAttending: true,
        coinbaseConnected: true,
        createdAt: new Date(),
      },
      {
        username: "alex_kim",
        email: "alex@solana.com",
        name: "Alex Kim",
        title: "Developer Relations",
        company: "Solana Labs",
        bio: "Helping developers build on Solana",
        interests: ["Web3", "Development", "NFTs"],
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        isAttending: true,
        coinbaseConnected: false,
        createdAt: new Date(),
      },
      {
        username: "lisa_zhang",
        email: "lisa@uniswap.org",
        name: "Lisa Zhang",
        title: "Product Manager",
        company: "Uniswap",
        bio: "Making DeFi accessible to everyone",
        interests: ["AMMs", "DeFi", "Product"],
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        isAttending: true,
        coinbaseConnected: true,
        createdAt: new Date(),
      }
    ];

    sampleUsers.forEach((userData) => {
      const user: User = { ...userData, id: this.currentUserId++ };
      this.users.set(user.id, user);
    });

    // Seed sample events
    const sampleEvents = [
      {
        id: this.currentEventId++,
        title: "DeFi Protocol Security Panel",
        description: "Deep dive into security best practices for DeFi protocols",
        speakers: ["Sarah Chen", "Marcus Rodriguez", "Alex Kim"],
        startTime: new Date("2025-06-16T14:00:00Z"),
        endTime: new Date("2025-06-16T15:30:00Z"),
        location: "Main Stage",
        category: "DeFi",
        isBookmarked: false,
      },
      {
        id: this.currentEventId++,
        title: "Networking Mixer: Web3 Builders",
        description: "Connect with fellow builders in the Web3 space",
        speakers: [],
        startTime: new Date("2025-06-16T18:00:00Z"),
        endTime: new Date("2025-06-16T20:00:00Z"),
        location: "Rooftop Lounge",
        category: "Networking",
        isBookmarked: false,
      },
      {
        id: this.currentEventId++,
        title: "Layer 2 Scaling Solutions",
        description: "Exploring the latest in L2 scaling technology",
        speakers: ["Alex Kim", "Lisa Zhang"],
        startTime: new Date("2025-06-17T09:00:00Z"),
        endTime: new Date("2025-06-17T10:30:00Z"),
        location: "Tech Stage",
        category: "Infrastructure",
        isBookmarked: false,
      }
    ];

    sampleEvents.forEach((event) => {
      this.events.set(event.id, event);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createConnection(insertConnection: InsertConnection): Promise<Connection> {
    const connection: Connection = {
      ...insertConnection,
      id: this.currentConnectionId++,
      createdAt: new Date(),
    };
    this.connections.set(connection.id, connection);
    return connection;
  }

  async getConnectionsByUserId(userId: number): Promise<Connection[]> {
    return Array.from(this.connections.values()).filter(
      conn => conn.fromUserId === userId || conn.toUserId === userId
    );
  }

  async updateConnectionStatus(id: number, status: "accepted" | "rejected"): Promise<Connection | undefined> {
    const connection = this.connections.get(id);
    if (!connection) return undefined;
    
    const updated = { ...connection, status };
    this.connections.set(id, updated);
    return updated;
  }

  async getConnection(fromUserId: number, toUserId: number): Promise<Connection | undefined> {
    return Array.from(this.connections.values()).find(
      conn => 
        (conn.fromUserId === fromUserId && conn.toUserId === toUserId) ||
        (conn.fromUserId === toUserId && conn.toUserId === fromUserId)
    );
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const message: Message = {
      ...insertMessage,
      id: this.currentMessageId++,
      createdAt: new Date(),
    };
    this.messages.set(message.id, message);
    return message;
  }

  async getMessagesBetweenUsers(userId1: number, userId2: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(msg => 
        (msg.fromUserId === userId1 && msg.toUserId === userId2) ||
        (msg.fromUserId === userId2 && msg.toUserId === userId1)
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getConversations(userId: number): Promise<Array<{ user: User; lastMessage: Message; unreadCount: number }>> {
    const userMessages = Array.from(this.messages.values())
      .filter(msg => msg.fromUserId === userId || msg.toUserId === userId);

    const conversationMap = new Map<number, { messages: Message[]; otherUserId: number }>();

    userMessages.forEach(msg => {
      const otherUserId = msg.fromUserId === userId ? msg.toUserId : msg.fromUserId;
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, { messages: [], otherUserId });
      }
      conversationMap.get(otherUserId)!.messages.push(msg);
    });

    const conversations = [];
    for (const [otherUserId, { messages }] of conversationMap) {
      const user = this.users.get(otherUserId);
      if (!user) continue;

      const sortedMessages = messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      const lastMessage = sortedMessages[0];
      const unreadCount = messages.filter(msg => msg.toUserId === userId).length;

      conversations.push({ user, lastMessage, unreadCount });
    }

    return conversations.sort((a, b) => b.lastMessage.createdAt.getTime() - a.lastMessage.createdAt.getTime());
  }

  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const event: Event = { ...insertEvent, id: this.currentEventId++ };
    this.events.set(event.id, event);
    return event;
  }

  async getPortfolio(userId: number): Promise<Portfolio | undefined> {
    return Array.from(this.portfolios.values()).find(p => p.userId === userId);
  }

  async createOrUpdatePortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const existing = await this.getPortfolio(insertPortfolio.userId);
    
    if (existing) {
      const updated: Portfolio = {
        ...existing,
        ...insertPortfolio,
        lastUpdated: new Date(),
      };
      this.portfolios.set(existing.id, updated);
      return updated;
    } else {
      const portfolio: Portfolio = {
        ...insertPortfolio,
        id: this.currentPortfolioId++,
        lastUpdated: new Date(),
      };
      this.portfolios.set(portfolio.id, portfolio);
      return portfolio;
    }
  }
}

export const storage = new MemStorage();
