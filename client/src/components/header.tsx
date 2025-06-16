import { Bell, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export default function Header() {
  const { data: prices } = useQuery({
    queryKey: ["/api/coinbase/prices"],
    refetchInterval: 30000, // Update every 30 seconds
  });

  return (
    <header className="relative z-10 p-4 border-b border-slate-700/50 backdrop-blur-sm bg-slate-850/80">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 crypto-gradient rounded-lg flex items-center justify-center">
            <Network className="text-white text-sm" size={16} />
          </div>
          <h1 className="text-xl font-bold text-white">CryptoConnect</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-xs bg-slate-700/50 px-2 py-1 rounded-md">
            <span className="text-cyan-400">BTC</span>{" "}
            <span className="text-white">{prices?.BTC || "$43,250"}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center hover:bg-slate-600/50 text-white"
          >
            <Bell size={14} />
          </Button>
        </div>
      </div>
    </header>
  );
}
