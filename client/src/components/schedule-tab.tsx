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

  return (
    <div className="space-y-6">
      {/* Today's Schedule */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
          <CalendarDays className="text-purple-400 mr-2" size={20} />
          Today's Schedule
        </h3>
        
        <div className="space-y-3">
          {todayEvents.map(event => (
            <Card 
              key={event.id} 
              className={`backdrop-blur-sm border ${
                event.category === "DeFi" 
                  ? "bg-gradient-to-r from-purple-500/10 to-transparent border-purple-500/30"
                  : "bg-gradient-to-r from-cyan-500/10 to-transparent border-cyan-500/30"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    event.category === "DeFi" ? "bg-purple-500/20" : "bg-cyan-500/20"
                  }`}>
                    {event.speakers.length > 0 ? (
                      <Mic className={event.category === "DeFi" ? "text-purple-400" : "text-cyan-400"} size={20} />
                    ) : (
                      <Users className={event.category === "DeFi" ? "text-purple-400" : "text-cyan-400"} size={20} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-white">{event.title}</h4>
                        {event.speakers.length > 0 && (
                          <p className="text-sm text-slate-400 mb-2">
                            {event.speakers.join(", ")}
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
                        className={event.category === "DeFi" ? "text-purple-400" : "text-cyan-400"}
                      >
                        {event.isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tomorrow's Events */}
      {tomorrowEvents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Tomorrow</h3>
          <div className="space-y-3">
            {tomorrowEvents.map(event => (
              <Card key={event.id} className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">{event.title}</h4>
                      <p className="text-sm text-slate-400">
                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-slate-400">
                      <Bookmark size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
