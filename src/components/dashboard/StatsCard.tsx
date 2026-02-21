import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  delay?: number;
  color?: "primary" | "accent" | "success" | "warning";
}

const colorMap = {
  primary: "from-primary/10 to-primary/5 text-primary",
  accent: "from-accent/10 to-accent/5 text-accent",
  success: "from-success/10 to-success/5 text-success",
  warning: "from-warning/10 to-warning/5 text-warning",
};

const iconBgMap = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};

const StatsCard = ({ title, value, icon: Icon, delay = 0, color = "primary" }: StatsCardProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="hover-lift"
    >
      <div className={`glass-card p-6 bg-gradient-to-br ${colorMap[color]}`}>
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBgMap[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="text-3xl font-bold text-foreground">{count}</div>
        <div className="text-sm text-muted-foreground mt-1">{title}</div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
