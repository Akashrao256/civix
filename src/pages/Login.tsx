import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const statsVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.8 + i * 0.15,
      type: "spring",
      stiffness: 120,
      damping: 10,
    },
  }),
};

// Counter component for animated numbers
const AnimatedCounter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  return <>{count}{suffix}</>;
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const formControls = useAnimation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Animate form exit
    await formControls.start({
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3 },
    });

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
        transition={{ duration: 0.6, ease: "easeOut" }}
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
            <motion.h1 
              className="text-4xl font-bold text-primary-foreground mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              🏛️ Civix India
            </motion.h1>
            <motion.p 
              className="text-xl text-primary-foreground/90 font-medium mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Empowering Citizens.<br />Strengthening Democracy.
            </motion.p>
            <motion.p 
              className="text-primary-foreground/70 mt-6 max-w-md leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Join India's premier digital civic engagement platform. Create petitions, participate in polls, and make your voice heard in shaping the future of your community.
            </motion.p>
          </motion.div>

          <div className="mt-10 flex gap-8 text-primary-foreground/80 text-sm">
            {[
              { value: 10, suffix: "K+", label: "Active Petitions" },
              { value: 50, suffix: "L+", label: "Citizens Engaged" },
              { value: 500, suffix: "+", label: "Issues Resolved" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={statsVariants}
              >
                <div className="text-2xl font-bold text-primary-foreground">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.5, 
            delay: 0.2,
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
          className="w-full max-w-md"
        >
          <motion.div 
            className="glass-card p-8"
            animate={formControls}
          >
            <motion.div 
              className="lg:hidden mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-2xl font-bold gradient-text">🏛️ Civix India</h1>
            </motion.div>
            
            <motion.h2 
              className="text-2xl font-bold text-foreground mb-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Welcome back
            </motion.h2>
            <motion.p 
              className="text-muted-foreground mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Sign in to your account
            </motion.p>

            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-5"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="space-y-2" variants={itemVariants}>
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <motion.div
                    animate={{
                      color: emailFocused ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                      scale: emailFocused ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                  </motion.div>
                  <motion.input
                    type="email"
                    placeholder="citizen@civix.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </motion.div>

              <motion.div className="space-y-2" variants={itemVariants}>
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <motion.div
                    animate={{
                      color: passwordFocused ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                      scale: passwordFocused ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                  </motion.div>
                  <motion.input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </motion.div>

              <motion.button
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 8px 24px hsla(333, 71%, 50%, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 rounded-lg gradient-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 btn-ripple transition-all relative overflow-hidden group"
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  Sign In <ArrowRight className="h-4 w-4" />
                </span>
              </motion.button>
            </motion.form>

            <motion.p 
              className="text-center text-sm text-muted-foreground mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Create Account
              </Link>
            </motion.p>

            <motion.div 
              className="mt-6 p-3 rounded-lg bg-secondary text-xs text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <p className="font-medium text-foreground mb-1">Demo Accounts:</p>
              <p>Citizen: citizen@civix.in</p>
              <p>Official: official@civix.in</p>
              <p className="mt-1 italic">Any password works</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
