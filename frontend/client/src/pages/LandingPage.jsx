import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TiltedCard from "../components/TiltedCard";
import AnimatedList from "../components/AnimatedList";

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`lp-reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const FEATURES = [
  {
    icon: "📝",
    title: "Digital Petition Creation",
    description:
      "Citizens can draft, publish, and share petitions with structured issue categories and clear public goals.",
  },
  {
    icon: "📍",
    title: "Transparent Issue Tracking",
    description:
      "Track every petition from submission to resolution with status milestones, timelines, and updates.",
  },
  {
    icon: "📊",
    title: "Official Reports & Insights",
    description:
      "Generate actionable reports to monitor engagement, regional priorities, and response outcomes.",
  },
];

const STEPS = [
  {
    title: "Submit",
    description: "Citizens submit verified petitions with context, location, and supporting details.",
  },
  {
    title: "Review",
    description: "Authorized officials review submissions, validate information, and publish status updates.",
  },
  {
    title: "Act",
    description: "Departments coordinate resolution, document outcomes, and communicate progress clearly.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ctaLoading, setCtaLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add("landing-page-open");
    return () => document.body.classList.remove("landing-page-open");
  }, []);

  const handleGetStarted = () => {
    setCtaLoading(true);
    setTimeout(() => navigate("/login"), 420);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="landing-page" id="home">
      <div className="lp-content">
      <header className="lp-navbar-wrap">
        <nav className="lp-navbar" aria-label="Main navigation">
          <a href="#home" className="lp-brand" onClick={closeMenu}>
            <span className="lp-brand-mark" aria-hidden="true">⚖️</span>
            <div>
              <strong>Civix</strong>
              <span>Government Petition Management</span>
            </div>
          </a>

          <button
            type="button"
            className="lp-mobile-toggle"
            aria-expanded={mobileMenuOpen}
            aria-controls="lp-nav-links"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <span></span>
            <span></span>
            <span></span>
            <span className="sr-only">Toggle navigation menu</span>
          </button>

          <div id="lp-nav-links" className={`lp-nav-links ${mobileMenuOpen ? "open" : ""}`}>
            <a href="#features" onClick={closeMenu}>Features</a>
            <a href="#how-it-works" onClick={closeMenu}>How It Works</a>
            <a href="#cta" onClick={closeMenu}>Get Started</a>
            <Link to="/login" className="lp-login-btn" onClick={closeMenu}>Login</Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="lp-hero section-shell">
          <div className="lp-hero-grid">
            <Reveal className="lp-hero-content">
              <p className="lp-eyebrow">Trusted Civic Participation Platform</p>
              <h1>Drive transparent citizen-government collaboration at scale</h1>
              <p className="lp-hero-copy">
                A secure, modern petition management system that empowers citizens to raise issues and helps officials respond with speed, clarity, and accountability.
              </p>
              <div className="lp-hero-actions">
                <button
                  type="button"
                  className="lp-btn lp-btn-primary"
                  onClick={handleGetStarted}
                  disabled={ctaLoading}
                >
                  {ctaLoading ? (
                    <span className="lp-inline-loading" aria-live="polite">
                      <span className="lp-dot-loader" aria-hidden="true"></span>
                      Opening Portal...
                    </span>
                  ) : (
                    "Get Started"
                  )}
                </button>
                <a href="#how-it-works" className="lp-btn lp-btn-ghost">How it Works</a>
              </div>
            </Reveal>

            <Reveal className="lp-hero-tilt" delay={120}>
              <TiltedCard
                containerHeight="340px"
                containerWidth="100%"
                imageHeight="340px"
                imageWidth="100%"
                scaleOnHover={1.02}
                rotateAmplitude={8}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent
                overlayContent={
                  <section className="lp-hero-panel">
                    <h2>Live Governance Snapshot</h2>
                    <ul>
                      <li>
                        <span>Petitions Submitted</span>
                        <strong>24,680</strong>
                      </li>
                      <li>
                        <span>Issues Under Review</span>
                        <strong>1,042</strong>
                      </li>
                      <li>
                        <span>Official Responses Published</span>
                        <strong>8,910</strong>
                      </li>
                    </ul>
                    <p className="lp-hero-panel-note">Updated hourly for decision-ready insights.</p>
                  </section>
                }
              />
            </Reveal>
          </div>
        </section>

        <section id="features" className="section-shell lp-features-section">
          <Reveal className="lp-section-title-wrap">
            <p className="lp-eyebrow">Core Capabilities</p>
            <h2>Everything needed for modern petition governance</h2>
          </Reveal>
          <div className="lp-feature-grid">
            {FEATURES.map((feature, index) => (
              <Reveal key={feature.title} className="lp-feature-tilt" delay={index * 100}>
                <TiltedCard
                  containerHeight="240px"
                  containerWidth="100%"
                  imageHeight="240px"
                  imageWidth="100%"
                  scaleOnHover={1.03}
                  rotateAmplitude={10}
                  showMobileWarning={false}
                  showTooltip={false}
                  displayOverlayContent
                  overlayContent={
                    <article className="lp-feature-card">
                      <div className="lp-feature-icon" aria-hidden="true">{feature.icon}</div>
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </article>
                  }
                />
              </Reveal>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="section-shell lp-about-section">
          <div className="lp-about-grid">
            <Reveal>
              <p className="lp-eyebrow">How It Works</p>
              <h2>A simple, accountable workflow for public issues</h2>
              <p className="lp-about-copy">
                Built for real government processes, the system provides verified participation, transparent tracking, and measurable outcomes across departments.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <AnimatedList
                items={STEPS}
                className="lp-step-list"
                itemClassName="lp-step-item-shell"
                showGradients={false}
                displayScrollbar={false}
                enableArrowNavigation={false}
                initialSelectedIndex={0}
                renderItem={(step, index) => (
                  <article className="lp-step-card" role="listitem" aria-label={step.title}>
                    <span className="lp-step-index" aria-hidden="true">0{index + 1}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </article>
                )}
              />
            </Reveal>
          </div>
        </section>

        <section id="cta" className="section-shell lp-cta-section">
          <Reveal className="lp-cta-panel">
            <h2>Transform public issue resolution with a secure digital petition platform</h2>
            <p>Join departments and communities building transparent, responsive governance.</p>
            <div className="lp-cta-actions">
              <button type="button" className="lp-btn lp-btn-primary" onClick={() => navigate("/register/citizen")}>
                Create Citizen Account
              </button>
              <button type="button" className="lp-btn lp-btn-secondary" onClick={() => navigate("/register/official")}>
                Register as Official
              </button>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-footer-inner section-shell">
          <p>© {new Date().getFullYear()} Civix Government Petition Management System</p>
        </div>
      </footer>
      </div>
    </div>
  );
}
