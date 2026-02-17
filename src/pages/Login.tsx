import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate("/dashboard");
    }
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
        {/* Floating shapes */}
        <div className="floating-shape w-64 h-64 bg-primary-foreground top-10 -left-20" />
        <div className="floating-shape w-40 h-40 bg-accent top-1/3 right-10" style={{ animationDelay: "5s" }} />
        <div className="floating-shape w-32 h-32 bg-primary-foreground bottom-20 left-1/4" style={{ animationDelay: "10s" }} />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-primary-foreground mb-2">🏛️ Civix India</h1>
            <p className="text-xl text-primary-foreground/90 font-medium mt-4">
              Empowering Citizens.<br />Strengthening Democracy.
            </p>
            <p className="text-primary-foreground/70 mt-6 max-w-md leading-relaxed">
              Join India's premier digital civic engagement platform. Create petitions, participate in polls, and make your voice heard in shaping the future of your community.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-10 flex gap-8 text-primary-foreground/80 text-sm"
          >
            <div>
              <div className="text-2xl font-bold text-primary-foreground">10K+</div>
              <div>Active Petitions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-foreground">50L+</div>
              <div>Citizens Engaged</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-foreground">500+</div>
              <div>Issues Resolved</div>
            </div>
          </motion.div>
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
            <h2 className="text-2xl font-bold text-foreground mb-1">Welcome back</h2>
            <p className="text-muted-foreground mb-8">Sign in to your account</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="citizen@civix.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 rounded-lg gradient-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 btn-ripple transition-all"
              >
                Sign In <ArrowRight className="h-4 w-4" />
              </motion.button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Create Account
              </Link>
            </p>

            <div className="mt-6 p-3 rounded-lg bg-secondary text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Demo Accounts:</p>
              <p>Citizen: citizen@civix.in</p>
              <p>Official: official@civix.in</p>
              <p className="mt-1 italic">Any password works</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
