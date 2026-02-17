import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import TopNavbar from "@/components/layout/TopNavbar";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import CitizenDashboard from "@/components/dashboard/CitizenDashboard";
import OfficialDashboard from "@/components/dashboard/OfficialDashboard";

const Dashboard = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-h-screen">
          <TopNavbar onToggleSidebar={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 md:p-8 pb-24 lg:pb-8">
            {user.role === "citizen" ? <CitizenDashboard /> : <OfficialDashboard />}
          </main>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
