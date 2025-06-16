import { Users, PieChart, Calendar, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: "discover", label: "Discover", icon: Users },
    { id: "portfolio", label: "Portfolio", icon: PieChart },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "messages", label: "Messages", icon: MessageCircle },
  ];

  return (
    <nav className="relative z-10 px-4 py-3 border-b border-slate-700/50">
      <div className="flex space-x-1 bg-slate-700/30 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`tab-button flex-1 py-2 px-3 rounded-md text-sm font-medium ${
                activeTab === tab.id ? "active" : ""
              }`}
              variant="ghost"
            >
              <Icon className="mr-2" size={16} />
              {tab.label}
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
