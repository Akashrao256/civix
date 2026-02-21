import { motion } from "framer-motion";
import { FileText, Clock, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { mockPetitions } from "@/data/mockData";
import StatsCard from "./StatsCard";
import PetitionCard from "./PetitionCard";

const OfficialDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Welcome back, <span className="gradient-text">{user?.name}</span>
        </h1>
        <p className="text-muted-foreground mt-1">Public Official • {user?.city}, {user?.state}</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title="Petitions in Constituency" value={12} icon={FileText} delay={0.1} color="primary" />
        <StatsCard title="Under Review" value={4} icon={Clock} delay={0.2} color="warning" />
        <StatsCard title="Closed Issues" value={8} icon={XCircle} delay={0.3} color="accent" />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <h2 className="text-xl font-semibold text-foreground mb-4">Issues Requiring Action</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockPetitions.filter(p => p.status !== "Closed").map((p, i) => (
            <PetitionCard key={p.id} petition={p} index={i} showRespond />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default OfficialDashboard;
