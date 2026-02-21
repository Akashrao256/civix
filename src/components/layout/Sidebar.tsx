import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, FileText, BarChart3, FileBarChart, Settings, X } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Petitions", icon: FileText, path: "/dashboard/petitions" },
  { label: "Polls", icon: BarChart3, path: "/dashboard/polls" },
  { label: "Reports", icon: FileBarChart, path: "/dashboard/reports" },
  { label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const location = useLocation();

  const sidebarContent = (
    <nav className="flex flex-col gap-1 p-4">
      <div className="flex items-center justify-between mb-6 lg:mb-8">
        <h2 className="text-lg font-bold gradient-text">🏛️ Civix India</h2>
        <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-secondary">
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
      {navItems.map((item) => {
        const active = location.pathname === item.path;
        return (
          <Link key={item.path} to={item.path} onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              active
                ? "gradient-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block w-64 border-r border-border bg-card h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
