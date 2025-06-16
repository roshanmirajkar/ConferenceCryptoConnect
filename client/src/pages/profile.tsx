import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, Share } from "lucide-react";
import { useLocation } from "wouter";

export default function Profile() {
  const [, setLocation] = useLocation();

  return (
    <div className="max-w-md mx-auto bg-slate-850 min-h-screen relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 crypto-gradient-bg pointer-events-none"></div>
      
      {/* Header */}
      <header className="relative z-10 p-4 border-b border-slate-700/50 backdrop-blur-sm bg-slate-850/80">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="text-white hover:bg-slate-700/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold">Profile</h1>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-slate-700/50">
              <Share className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-slate-700/50">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <main className="relative z-10 p-4 space-y-6">
        <Card className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">JD</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">John Doe</h2>
              <p className="text-cyan-400 mb-4">Senior Developer @ CryptoLabs</p>
              
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-md">DeFi</span>
                <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-md">Web3</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md">Development</span>
              </div>
              
              <p className="text-slate-400 text-sm">
                Passionate about building the future of decentralized finance. 
                Always looking to connect with fellow builders and innovators.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">23</div>
              <div className="text-xs text-slate-400">Connections</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">5</div>
              <div className="text-xs text-slate-400">Events</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-400">12</div>
              <div className="text-xs text-slate-400">Matches</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
