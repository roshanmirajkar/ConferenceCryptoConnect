import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, MessageCircle, Sparkles } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

export default function DiscoverTab() {
  const [selectedInterests, setSelectedInterests] = useState(["DeFi"]);
  const { toast } = useToast();

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const connectMutation = useMutation({
    mutationFn: async (toUserId: number) => {
      return apiRequest("POST", "/api/connections", {
        fromUserId: 1, // Mock current user
        toUserId,
        status: "pending"
      });
    },
    onSuccess: () => {
      toast({
        title: "Connection request sent!",
        description: "Your connection request has been sent successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/connections"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send connection request.",
        variant: "destructive",
      });
    },
  });

  const interests = ["DeFi", "NFTs", "Trading", "Web3", "AI"];

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const filteredUsers = users.filter(user =>
    selectedInterests.some(interest =>
      user.interests.includes(interest)
    )
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 animate-pulse">
            <div className="h-16 bg-slate-600/50 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-cyan-400">{users.length}</div>
            <div className="text-xs text-slate-400">Attendees</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-emerald-400">23</div>
            <div className="text-xs text-slate-400">Connections</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-amber-400">12</div>
            <div className="text-xs text-slate-400">Matches</div>
          </CardContent>
        </Card>
      </div>

      {/* Interest Filter */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-slate-300">Filter by Interest</h3>
        <div className="flex flex-wrap gap-2">
          {interests.map(interest => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`interest-tag ${selectedInterests.includes(interest) ? "active" : ""}`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Connections */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
          <Sparkles className="text-purple-400 mr-2" size={20} />
          Recommended for You
        </h3>
        
        <div className="space-y-3">
          {filteredUsers.slice(0, 2).map(user => (
            <Card key={user.id} className="mobile-card bg-gradient-to-r from-slate-700/40 to-slate-600/40">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`}
                    alt={user.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-white">{user.name}</h4>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => connectMutation.mutate(user.id)}
                          disabled={connectMutation.isPending}
                          className="action-button w-10 h-10 crypto-gradient rounded-xl flex items-center justify-center"
                        >
                          <UserPlus size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="action-button w-10 h-10 bg-slate-600/60 rounded-xl flex items-center justify-center text-white"
                        >
                          <MessageCircle size={14} />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-cyan-400 mb-2">
                      {user.title} {user.company && `@${user.company}`}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {user.interests.slice(0, 2).map(interest => (
                        <span
                          key={interest}
                          className={`text-xs px-2 py-1 rounded-md ${
                            interest === "DeFi"
                              ? "bg-purple-500/20 text-purple-400"
                              : interest === "Trading"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-cyan-500/20 text-cyan-400"
                          }`}
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400">5 mutual connections</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* All Attendees */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">All Attendees</h3>
        <div className="grid grid-cols-2 gap-3">
          {filteredUsers.slice(2).map(user => (
            <Card key={user.id} className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30">
              <CardContent className="p-3">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`}
                  alt={user.name}
                  className="w-full h-24 object-cover rounded-lg mb-2"
                />
                <h4 className="font-medium text-sm text-white">{user.name}</h4>
                <p className="text-xs text-slate-400 mb-2">{user.company}</p>
                <div className="flex justify-between items-center">
                  {user.interests.length > 0 && (
                    <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-md">
                      {user.interests[0]}
                    </span>
                  )}
                  <Button
                    size="sm"
                    onClick={() => connectMutation.mutate(user.id)}
                    disabled={connectMutation.isPending}
                    className="w-6 h-6 bg-cyan-500/20 rounded-md flex items-center justify-center hover:bg-cyan-500/30 transition-colors"
                  >
                    <UserPlus className="text-xs text-cyan-400" size={12} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
