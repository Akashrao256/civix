import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User as UserIcon, Mail, Lock, MapPin, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { indianStates } from "@/data/mockData";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [role, setRole] = useState<"citizen" | "official">("citizen");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({ name, email, city, state, role });
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden flex-col justify-center px-16"
      >
        <div className="floating-shape w-64 h-64 bg-primary-foreground top-10 -left-20" />
        <div className="floating-shape w-40 h-40 bg-accent top-1/3 right-10" style={{ animationDelay: "5s" }} />
        <div className="floating-shape w-32 h-32 bg-primary-foreground bottom-20 left-1/4" style={{ animationDelay: "10s" }} />

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-primary-foreground mb-2">🏛️ Civix India</h1>
          <p className="text-xl text-primary-foreground/90 font-medium mt-4">
            Join the Movement.
          </p>
          <p className="text-primary-foreground/70 mt-6 max-w-md leading-relaxed">
            Whether you're a citizen seeking change or a public official driving action — Civix India connects you to your community.
          </p>
        </div>
      </motion.div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-8">
            <div className="lg:hidden mb-6">
              <h1 className="text-2xl font-bold gradient-text">🏛️ Civix India</h1>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Create Account</h2>
            <p className="text-muted-foreground mb-6">Start making a difference today</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
                <select value={state} onChange={(e) => setState(e.target.value)} required
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
                  <option value="">State</option>
                  {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">I am a</label>
                <div className="flex gap-4">
                  {(["citizen", "official"] as const).map((r) => (
                    <label key={r}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border cursor-pointer transition-all ${
                        role === r ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      <input type="radio" name="role" value={r} checked={role === r} onChange={() => setRole(r)} className="sr-only" />
                      <span className="text-sm font-medium capitalize">{r === "official" ? "Public Official" : "Citizen"}</span>
                    </label>
                  ))}
                </div>
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                className="w-full py-3 rounded-lg gradient-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 btn-ripple transition-all">
                Create Account <ArrowRight className="h-4 w-4" />
              </motion.button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
