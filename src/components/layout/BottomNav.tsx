import { Home, FileText, Plus, BarChart3, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const items = [
  { label: "Home", icon: Home, path: "/dashboard" },
  { label: "Petitions", icon: FileText, path: "/dashboard/petitions" },
  { label: "Create", icon: Plus, path: "/dashboard/create", accent: true },
  { label: "Polls", icon: BarChart3, path: "/dashboard/polls" },
  { label: "Profile", icon: User, path: "/dashboard/settings" },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-md border-t border-border z-40 safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const active = location.pathname === item.path;
          if (item.accent) {
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center -mt-4 shadow-lg"
                >
                  <Plus className="h-6 w-6 text-primary-foreground" />
                </motion.div>
              </Link>
            );
          }
          return (
            <Link key={item.path} to={item.path} className="flex flex-col items-center gap-0.5">
              <item.icon className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
