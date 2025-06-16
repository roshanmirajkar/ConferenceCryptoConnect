import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, CalendarPlus } from "lucide-react";

interface Conversation {
  user: {
    id: number;
    name: string;
    avatar: string;
    interests: string[];
  };
  lastMessage: {
    content: string;
    createdAt: Date;
  };
  unreadCount: number;
}

export default function MessagesTab() {
  const { data: conversations = [], isLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations/1"], // Mock current user ID
  });

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

  // Mock conversations for demo
  const mockConversations = [
    {
      user: {
        id: 1,
        name: "Sarah Chen",
        avatar: "https://pixabay.com/get/g75e35c25071dda2b5abbbffa5c183ffbb98c7d4cc3db478821c7586a1f6c670ccd2c36dba041b464d94706ff5cd2fb47bdadd197c87485978ad0c47441966613_1280.jpg",
        interests: ["DeFi"]
      },
      lastMessage: {
        content: "Thanks for connecting! Looking forward to discussing DeFi protocols...",
        createdAt: new Date(Date.now() - 2 * 60 * 1000) // 2 minutes ago
      },
      unreadCount: 1
    },
    {
      user: {
        id: 2,
        name: "Marcus Rodriguez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50",
        interests: ["Trading"]
      },
      lastMessage: {
        content: "Great talk today! Would love to continue our conversation about scaling...",
        createdAt: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
      },
      unreadCount: 0
    }
  ];

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Conversations */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Messages</h3>
        
        <div className="space-y-3">
          {mockConversations.map(conversation => (
            <Card 
              key={conversation.user.id} 
              className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30 hover:border-purple-500/50 transition-colors cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={conversation.user.avatar}
                    alt={conversation.user.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-white">{conversation.user.name}</h4>
                      <span className="text-xs text-slate-400">
                        {formatTime(conversation.lastMessage.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-2">
                      {conversation.lastMessage.content}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      {conversation.user.interests.length > 0 && (
                        <span className={`text-xs px-2 py-1 rounded-md ${
                          conversation.user.interests[0] === "DeFi"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-emerald-500/20 text-emerald-400"
                        }`}>
                          {conversation.user.interests[0]}
                        </span>
                      )}
                      {conversation.unreadCount > 0 && (
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 backdrop-blur-sm border-slate-600/30">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3 text-white">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              className="bg-purple-500/20 hover:bg-purple-500/30 p-3 rounded-lg transition-colors text-purple-400 flex flex-col items-center space-y-2"
              variant="ghost"
            >
              <QrCode size={20} />
              <span className="text-sm font-medium">Share Contact</span>
            </Button>
            <Button 
              className="bg-cyan-500/20 hover:bg-cyan-500/30 p-3 rounded-lg transition-colors text-cyan-400 flex flex-col items-center space-y-2"
              variant="ghost"
            >
              <CalendarPlus size={20} />
              <span className="text-sm font-medium">Schedule Meet</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
