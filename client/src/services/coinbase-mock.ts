export interface CoinbasePortfolio {
  totalValue: string;
  change24h: string;
  holdings: Array<{
    symbol: string;
    name: string;
    amount: string;
    value: string;
    change: string;
    icon: string;
  }>;
  recentTransactions: Array<{
    type: string;
    amount: string;
    value: string;
    time: string;
    direction: "buy" | "sell";
  }>;
}

export interface CryptoPrices {
  BTC: string;
  ETH: string;
  SOL: string;
  lastUpdated: string;
}

class CoinbaseMockService {
  async getPortfolio(userId: number): Promise<CoinbasePortfolio> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
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
  }

  async getCurrentPrices(): Promise<CryptoPrices> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate slight price variations
    const basePrice = 43250;
    const variation = (Math.random() - 0.5) * 1000;
    const btcPrice = Math.round(basePrice + variation);
    
    return {
      BTC: `$${btcPrice.toLocaleString()}`,
      ETH: `$${Math.round(2165 + (Math.random() - 0.5) * 100).toLocaleString()}`,
      SOL: `$${Math.round(75 + (Math.random() - 0.5) * 5).toFixed(2)}`,
      lastUpdated: new Date().toISOString()
    };
  }
}

export const coinbaseMockService = new CoinbaseMockService();
