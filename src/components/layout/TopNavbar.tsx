import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface TopNavbarProps {
  onToggleSidebar: () => void;
}

const TopNavbar = ({ onToggleSidebar }: TopNavbarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bellAnimating, setBellAnimating] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initial = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors">
          <Menu className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold gradient-text hidden sm:block">🏛️ Civix India</h1>
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setBellAnimating(true)}
          onAnimationEnd={() => setBellAnimating(false)}
          className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <Bell className={`h-5 w-5 text-foreground ${bellAnimating ? "animate-bell" : ""}`} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
        </motion.button>

        <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
          {initial}
        </div>

        <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-secondary transition-colors" title="Logout">
          <LogOut className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;
