import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Mic, Users, Bookmark, BookmarkCheck } from "lucide-react";
import type { Event } from "@shared/schema";

export default function ScheduleTab() {
  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 animate-pulse">
            <div className="h-20 bg-slate-600/50 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.startTime);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === today.getTime();
  });

  const tomorrowEvents = events.filter(event => {
    const eventDate = new Date(event.startTime);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === tomorrow.getTime();
  });

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Keynote": { bg: "from-amber-500/10", border: "border-amber-500/30", icon: "bg-amber-500/20", text: "text-amber-400" },
      "Bitcoin": { bg: "from-orange-500/10", border: "border-orange-500/30", icon: "bg-orange-500/20", text: "text-orange-400" },
      "Ethereum": { bg: "from-blue-500/10", border: "border-blue-500/30", icon: "bg-blue-500/20", text: "text-blue-400" },
      "Solana": { bg: "from-green-500/10", border: "border-green-500/30", icon: "bg-green-500/20", text: "text-green-400" },
      "Security": { bg: "from-red-500/10", border: "border-red-500/30", icon: "bg-red-500/20", text: "text-red-400" },
      "Infrastructure": { bg: "from-cyan-500/10", border: "border-cyan-500/30", icon: "bg-cyan-500/20", text: "text-cyan-400" },
      "NFTs": { bg: "from-pink-500/10", border: "border-pink-500/30", icon: "bg-pink-500/20", text: "text-pink-400" },
      "Research": { bg: "from-indigo-500/10", border: "border-indigo-500/30", icon: "bg-indigo-500/20", text: "text-indigo-400" },
      "Institutional": { bg: "from-purple-500/10", border: "border-purple-500/30", icon: "bg-purple-500/20", text: "text-purple-400" },
      "Networking": { bg: "from-emerald-500/10", border: "border-emerald-500/30", icon: "bg-emerald-500/20", text: "text-emerald-400" }
    };
    return colors[category as keyof typeof colors] || colors["Infrastructure"];
  };

  return (
    <div className="space-y-6">
      {/* Today's Schedule */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
          <CalendarDays className="text-purple-400 mr-2" size={20} />
          Today's Schedule
        </h3>
        
        <div className="space-y-3">
          {todayEvents.map(event => {
            const colors = getCategoryColor(event.category);
            return (
              <Card 
                key={event.id} 
                className={`backdrop-blur-sm border bg-gradient-to-r ${colors.bg} to-transparent ${colors.border}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.icon}`}>
                      {event.speakers.length > 0 ? (
                        <Mic className={colors.text} size={20} />
                      ) : (
                        <Users className={colors.text} size={20} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-2">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-white">{event.title}</h4>
                            <span className={`text-xs px-2 py-1 rounded-md ${colors.icon} ${colors.text}`}>
                              {event.category}
                            </span>
                          </div>
                          {event.speakers.length > 0 && (
                            <p className="text-sm text-slate-400 mb-2">
                              {event.speakers.slice(0, 3).join(", ")}
                              {event.speakers.length > 3 && ` +${event.speakers.length - 3} more`}
                            </p>
                          )}
                          {event.description && (
                            <p className="text-xs text-slate-500 mb-2 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 text-xs text-slate-400">
                            <span>
                              {formatTime(event.startTime)} - {formatTime(event.endTime)}
                            </span>
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={colors.text}
                        >
                          {event.isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Tomorrow's Events */}
      {tomorrowEvents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Tomorrow</h3>
          <div className="space-y-3">
            {tomorrowEvents.map(event => {
              const colors = getCategoryColor(event.category);
              return (
                <Card key={event.id} className={`backdrop-blur-sm border bg-gradient-to-r ${colors.bg} to-transparent ${colors.border}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 pr-2">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-white">{event.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded-md ${colors.icon} ${colors.text}`}>
                            {event.category}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400">
                          {formatTime(event.startTime)} - {formatTime(event.endTime)} • {event.location}
                        </p>
                        {event.speakers.length > 0 && (
                          <p className="text-xs text-slate-500 mt-1">
                            {event.speakers.slice(0, 2).join(", ")}
                            {event.speakers.length > 2 && ` +${event.speakers.length - 2} more`}
                          </p>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" className={colors.text}>
                        <Bookmark size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
