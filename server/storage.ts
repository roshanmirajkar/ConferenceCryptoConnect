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
    // Seed real crypto industry professionals attending Permissionless
    const sampleUsers = [
      {
        username: "vitalik_buterin",
        email: "vitalik@ethereum.org",
        name: "Vitalik Buterin",
        title: "Co-founder",
        company: "Ethereum Foundation",
        bio: "Creator of Ethereum, working on scaling and sustainability solutions",
        interests: ["Ethereum", "Scaling", "Research"],
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        isAttending: true,
        coinbaseConnected: true,
        createdAt: new Date(),
      },
      {
        username: "brian_armstrong",
        email: "brian@coinbase.com",
        name: "Brian Armstrong",
        title: "CEO & Co-founder",
        company: "Coinbase",
        bio: "Building the cryptoeconomy for everyone",
        interests: ["Infrastructure", "Regulation", "Adoption"],
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        isAttending: true,
        coinbaseConnected: true,
        createdAt: new Date(),
      },
      {
        username: "anatoly_yakovenko",
        email: "anatoly@solana.com",
        name: "Anatoly Yakovenko",
        title: "Founder & CEO",
        company: "Solana Labs",
        bio: "Building high-performance blockchain infrastructure",
        interests: ["Solana", "Performance", "Consensus"],
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        isAttending: true,
        coinbaseConnected: true,
        createdAt: new Date(),
      },
      {
        username: "hayden_adams",
        email: "hayden@uniswap.org",
        name: "Hayden Adams",
        title: "Founder",
        company: "Uniswap",
        bio: "Pioneering automated market makers and DeFi innovation",
        interests: ["DeFi", "AMMs", "MEV"],
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        isAttending: true,
        coinbaseConnected: true,
        createdAt: new Date(),
      },
      {
        username: "elizabeth_stark",
        email: "elizabeth@lightning.engineering",
        name: "Elizabeth Stark",
        title: "CEO & Co-founder",
        company: "Lightning Labs",
        bio: "Scaling Bitcoin with the Lightning Network",
        interests: ["Bitcoin", "Lightning", "Payments"],
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        isAttending: true,
        coinbaseConnected: false,
        createdAt: new Date(),
      },
      {
        username: "samczsun",
        email: "sam@paradigm.xyz",
        name: "samczsun",
        title: "Research Partner",
        company: "Paradigm",
        bio: "Security researcher and white hat hacker",
        interests: ["Security", "Research", "MEV"],
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        isAttending: true,
        coinbaseConnected: true,
        createdAt: new Date(),
      },
      {
        username: "naval_ravikant",
        email: "naval@angellist.com",
        name: "Naval Ravikant",
        title: "Chairman & Co-founder",
        company: "AngelList",
        bio: "Angel investor and philosopher of technology",
        interests: ["Investing", "Philosophy", "Startups"],
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        isAttending: true,
        coinbaseConnected: true,
        createdAt: new Date(),
      },
      {
        username: "balaji_srinivasan",
        email: "balaji@1729.com",
        name: "Balaji Srinivasan",
        title: "Former CTO",
        company: "Coinbase",
        bio: "Entrepreneur, investor, and technologist",
        interests: ["Network States", "Crypto", "Technology"],
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        isAttending: true,
        coinbaseConnected: true,
        createdAt: new Date(),
      }
    ];

    sampleUsers.forEach((userData) => {
      const user: User = { ...userData, id: this.currentUserId++ };
      this.users.set(user.id, user);
    });

    // Seed real Permissionless conference events
    const sampleEvents = [
      {
        id: this.currentEventId++,
        title: "Opening Keynote: The Future of Decentralized Finance",
        description: "Join industry leaders as they discuss the evolution of DeFi and what's coming next in the permissionless economy",
        speakers: ["Vitalik Buterin", "Brian Armstrong", "Hayden Adams"],
        startTime: new Date("2025-06-16T09:00:00Z"),
        endTime: new Date("2025-06-16T10:00:00Z"),
        location: "Main Stage",
        category: "Keynote",
        isBookmarked: false,
      },
      {
        id: this.currentEventId++,
        title: "Building on Bitcoin: Lightning Network & Beyond",
        description: "Exploring the latest developments in Bitcoin's Layer 2 ecosystem and upcoming innovations",
        speakers: ["Elizabeth Stark", "Jack Mallers", "Adam Back"],
        startTime: new Date("2025-06-16T10:30:00Z"),
        endTime: new Date("2025-06-16T11:30:00Z"),
        location: "Bitcoin Stage",
        category: "Bitcoin",
        isBookmarked: false,
      },
      {
        id: this.currentEventId++,
        title: "DeFi Security: Lessons from the Trenches",
        description: "Protocol security experts share real-world attack vectors and defensive strategies",
        speakers: ["Samczsun", "Dan Robinson", "Georgios Konstantopoulos"],
        startTime: new Date("2025-06-16T14:00:00Z"),
        endTime: new Date("2025-06-16T15:00:00Z"),
        location: "Security Theater",
        category: "Security",
        isBookmarked: false,
      },
      {
        id: this.currentEventId++,
        title: "The State of Ethereum: Roadmap to 2030",
        description: "Core developers discuss Ethereum's scaling roadmap, including sharding, rollups, and beyond",
        speakers: ["Danny Ryan", "Justin Drake", "Dankrad Feist"],
        startTime: new Date("2025-06-16T15:30:00Z"),
        endTime: new Date("2025-06-16T16:30:00Z"),
        location: "Ethereum Hall",
        category: "Ethereum",
        isBookmarked: false,
      },
      {
        id: this.currentEventId++,
        title: "Solana Breakout: High-Performance Blockchain Applications",
        description: "Building scalable applications on Solana with real-world case studies",
        speakers: ["Anatoly Yakovenko", "Raj Gokal", "Kyle Samani"],
        startTime: new Date("2025-06-16T17:00:00Z"),
        endTime: new Date("2025-06-16T18:00:00Z"),
        location: "Solana Pavilion",
        category: "Solana",
        isBookmarked: false,
      },
      {
        id: this.currentEventId++,
        title: "Permissionless Networking Happy Hour",
        description: "Connect with founders, developers, and investors in the permissionless space",
        speakers: [],
        startTime: new Date("2025-06-16T18:30:00Z"),
        endTime: new Date("2025-06-16T20:30:00Z"),
        location: "Rooftop Terrace",
        category: "Networking",
        isBookmarked: false,
      },
      {
        id: this.currentEventId++,
        title: "Cross-Chain Infrastructure: Bridges & Interoperability",
        description: "Technical deep-dive into cross-chain protocols and the future of blockchain interoperability",
        speakers: ["Hart Montgomery", "Dmitry Mishunin", "Preston Van Loon"],
        startTime: new Date("2025-06-17T09:30:00Z"),
        endTime: new Date("2025-06-17T10:30:00Z"),
        location: "Infrastructure Track",
        category: "Infrastructure",
        isBookmarked: false,
      },
      {
        id: this.currentEventId++,
        title: "NFTs Beyond Art: Utility, Gaming, and Real-World Assets",
        description: "Exploring practical applications of NFTs in gaming, identity, and tokenizing real-world assets",
        speakers: ["Punk6529", "Gabby Dizon", "Will Papper"],
        startTime: new Date("2025-06-17T11:00:00Z"),
        endTime: new Date("2025-06-17T12:00:00Z"),
        location: "NFT Gallery",
        category: "NFTs",
        isBookmarked: false,
      },
      {
        id: this.currentEventId++,
        title: "MEV: Understanding and Mitigating Maximal Extractable Value",
        description: "Researchers and builders discuss MEV, its impact on users, and solutions being developed",
        speakers: ["Phil Daian", "Robert Miller", "Stephane Gosselin"],
        startTime: new Date("2025-06-17T13:30:00Z"),
        endTime: new Date("2025-06-17T14:30:00Z"),
        location: "Research Lab",
        category: "Research",
        isBookmarked: false,
      },
      {
        id: this.currentEventId++,
        title: "Institutional DeFi: TradFi Meets Crypto",
        description: "How traditional financial institutions are integrating with DeFi protocols",
        speakers: ["Lex Sokolin", "Calvin Liu", "Martha Reyes"],
        startTime: new Date("2025-06-17T15:00:00Z"),
        endTime: new Date("2025-06-17T16:00:00Z"),
        location: "Institutional Track",
        category: "Institutional",
        isBookmarked: false,
      },
      {
        id: this.currentEventId++,
        title: "The Merge to PoS: Lessons Learned and What's Next",
        description: "Ethereum core developers reflect on The Merge and discuss upcoming protocol upgrades",
        speakers: ["Tim Beiko", "Mikhail Kalinin", "Terence Tsao"],
        startTime: new Date("2025-06-17T16:30:00Z"),
        endTime: new Date("2025-06-17T17:30:00Z"),
        location: "Ethereum Hall",
        category: "Ethereum",
        isBookmarked: false,
      },
      {
        id: this.currentEventId++,
        title: "Closing Keynote: Building the Permissionless Economy",
        description: "Visionary leaders share their perspectives on the future of decentralized systems",
        speakers: ["Naval Ravikant", "Balaji Srinivasan", "Laura Shin"],
        startTime: new Date("2025-06-17T18:00:00Z"),
        endTime: new Date("2025-06-17T19:00:00Z"),
        location: "Main Stage",
        category: "Keynote",
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
