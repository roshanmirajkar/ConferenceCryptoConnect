import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from "lucide-react";
import { useCoinbasePortfolio } from "@/hooks/use-coinbase-portfolio";

export default function PortfolioTab() {
  const { data: portfolio, isLoading } = useCoinbasePortfolio(1); // Mock user ID

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-4 animate-pulse">
          <div className="h-24 bg-slate-600/50 rounded"></div>
        </div>
        <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 animate-pulse">
          <div className="h-32 bg-slate-600/50 rounded"></div>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-slate-400 mb-4">No portfolio data available</p>
          <p className="text-sm text-slate-500">Connect your Coinbase account to see your portfolio</p>
        </div>
      </div>
    );
  }

  const isPositiveChange = portfolio.change24h.startsWith('+');

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <Card className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-sm border-slate-600/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Portfolio Overview</h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{portfolio.totalValue}</div>
              <div className={`text-sm flex items-center ${
                isPositiveChange ? "text-emerald-400" : "text-red-400"
              }`}>
                {isPositiveChange ? (
                  <TrendingUp className="mr-1" size={16} />
                ) : (
                  <TrendingDown className="mr-1" size={16} />
                )}
                <span>{portfolio.change24h}</span>
              </div>
            </div>
          </div>
          
          {/* Holdings */}
          <div className="space-y-3">
            {portfolio.holdings.map((holding, index) => {
              const isPositive = holding.change.startsWith('+');
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      holding.symbol === "BTC" 
                        ? "bg-orange-500" 
                        : holding.symbol === "ETH" 
                        ? "bg-blue-500" 
                        : "bg-green-500"
                    }`}>
                      <span className="text-white text-xs font-bold">
                        {holding.symbol === "BTC" ? "₿" : holding.symbol === "ETH" ? "Ξ" : holding.symbol}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-white">{holding.name}</div>
                      <div className="text-xs text-slate-400">{holding.amount} {holding.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-white">{holding.value}</div>
                    <div className={`text-xs ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                      {holding.change}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4 text-white">Recent Activity</h3>
          <div className="space-y-3">
            {portfolio.recentTransactions.map((tx, index) => {
              const isBuy = tx.direction === "buy";
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isBuy ? "bg-emerald-500/20" : "bg-red-500/20"
                    }`}>
                      {isBuy ? (
                        <ArrowDown className="text-emerald-400" size={14} />
                      ) : (
                        <ArrowUp className="text-red-400" size={14} />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white">{tx.type}</div>
                      <div className="text-xs text-slate-400">{tx.time}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-white">{tx.amount}</div>
                    <div className="text-xs text-slate-400">{tx.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
