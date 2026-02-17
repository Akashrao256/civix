import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { Petition } from "@/data/mockData";

const statusClass: Record<string, string> = {
  Active: "status-active",
  "Under Review": "status-review",
  Closed: "status-closed",
};

const categoryColors: Record<string, string> = {
  Transportation: "bg-primary/10 text-primary",
  Infrastructure: "bg-warning/10 text-warning",
  "Public Safety": "bg-destructive/10 text-destructive",
  Environment: "bg-success/10 text-success",
};

interface PetitionCardProps {
  petition: Petition;
  index: number;
  showRespond?: boolean;
}

const PetitionCard = ({ petition, index, showRespond = false }: PetitionCardProps) => {
  const progress = Math.min((petition.currentSignatures / petition.signatureGoal) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.4 }}
      className="hover-lift"
    >
      <div className="glass-card p-5 h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[petition.category] || "bg-secondary text-secondary-foreground"}`}>
            {petition.category}
          </span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusClass[petition.status]}`}>
            {petition.status}
          </span>
        </div>

        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{petition.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">{petition.description}</p>

        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
          <MapPin className="h-3 w-3" />
          {petition.location}
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>{petition.currentSignatures} signatures</span>
            <span>Goal: {petition.signatureGoal}</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ delay: 0.3 + index * 0.1, duration: 1.2, ease: "easeOut" }}
              className={`h-full rounded-full ${progress >= 100 ? "bg-success" : "gradient-primary"}`}
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-2.5 rounded-lg border border-primary/20 text-primary text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors btn-ripple"
        >
          {showRespond ? "Respond" : "View Details"} <ArrowRight className="h-3.5 w-3.5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PetitionCard;
