import { useState } from "react";
import Header from "@/components/header";
import TabNavigation from "@/components/tab-navigation";
import DiscoverTab from "@/components/discover-tab";
import PortfolioTab from "@/components/portfolio-tab";
import ScheduleTab from "@/components/schedule-tab";
import MessagesTab from "@/components/messages-tab";
import BottomNavigation from "@/components/bottom-navigation";

export default function Home() {
  const [activeTab, setActiveTab] = useState("discover");

  return (
    <div className="max-w-md mx-auto bg-slate-850 min-h-screen relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 crypto-gradient-bg pointer-events-none"></div>
      
      <Header />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content Area */}
      <main className="relative z-10 p-4 space-y-4 pb-20">
        {activeTab === "discover" && <DiscoverTab />}
        {activeTab === "portfolio" && <PortfolioTab />}
        {activeTab === "schedule" && <ScheduleTab />}
        {activeTab === "messages" && <MessagesTab />}
      </main>

      <BottomNavigation />
    </div>
  );
}
