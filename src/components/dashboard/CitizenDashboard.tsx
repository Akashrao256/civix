import { motion } from "framer-motion";
import { FileText, CheckCircle, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { mockPetitions } from "@/data/mockData";
import StatsCard from "./StatsCard";
import PetitionCard from "./PetitionCard";

const CitizenDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Welcome back, <span className="gradient-text">{user?.name}</span>
        </h1>
        <p className="text-muted-foreground mt-1">{user?.city}, {user?.state}</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title="My Petitions" value={3} icon={FileText} delay={0.1} color="primary" />
        <StatsCard title="Successful Petitions" value={1} icon={CheckCircle} delay={0.2} color="success" />
        <StatsCard title="Polls Participated" value={7} icon={BarChart3} delay={0.3} color="accent" />
      </div>

      {/* Active Issues */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <h2 className="text-xl font-semibold text-foreground mb-4">Active Issues Near You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockPetitions.map((p, i) => (
            <PetitionCard key={p.id} petition={p} index={i} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CitizenDashboard;
