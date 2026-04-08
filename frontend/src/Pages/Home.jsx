import "./Home.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import hero from "../assets/trd.jpg";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    { title: "Neural Architecture", desc: "Automated deep learning selection.", icon: "🧠" },
    { title: "Hyper-Optimization", desc: "Bayesian search for peak performance.", icon: "⚡" },
    { title: "Explainable AI", desc: "Understand every decision your model makes.", icon: "🔍" },
  ];

  return (
    <div className="home-container">
      {/* BACKGROUND DECOR */}
      <div className="bg-glow top-left"></div>
      <div className="bg-glow bottom-right"></div>

      <div className="home-content">
        {/* HERO SECTION */}
        <section className="hero">
          <motion.div
            className="hero-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="badge-premium">✦ NEXT-GEN AUTOML</div>
            <h1>
              The Future of <br />
              <span className="gradient-text">AI Development</span>
            </h1>

            <p className="hero-subtitle">
              Upload your data and let our engine handle the heavy lifting. 
              Train, optimize, and deploy industrial-grade models in seconds.
            </p>

            <div className="hero-actions">
              <button className="btn-primary" onClick={() => navigate("/dashboard")}>
                Get Started Free <span className="arrow">→</span>
              </button>
              <button className="btn-secondary">View Documentation</button>
            </div>
            
            <div className="trust-footer">
              <p>Trusted by data teams at</p>
              <div className="trust-icons">
                <span>⚡ EnergyCo</span> <span>✦ TechNova</span> <span>◈ CloudScale</span>
              </div>
            </div>
          </motion.div>

          <div className="hero-right">
            <motion.div 
              className="img-wrapper"
              initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
            >
              <motion.img
                src={hero}
                alt="AI Visualization"
                className="hero-img"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="glass-overlay-card">
                <div className="status-dot"></div>
                <p>Model Optimizing... 98%</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FEATURES GRID SECTION */}
        <motion.section 
          className="features-section"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
          <div className="section-header">
            <h2>Engineered for Precision</h2>
            <p>Powerful features that simplify complex machine learning workflows.</p>
          </div>

          <div className="features-grid">
            {features.map((f, i) => (
              <motion.div 
                key={i} 
                className="feature-card"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* STATS SECTION */}
        <section className="stats-strip">
          <div className="stat-item">
            <h3>10x</h3>
            <p>Faster Training</p>
          </div>
          <div className="divider"></div>
          <div className="stat-item">
            <h3>99.9%</h3>
            <p>Model Uptime</p>
          </div>
          <div className="divider"></div>
          <div className="stat-item">
            <h3>2k+</h3>
            <p>Datasets Processed</p>
          </div>
        </section>

        <footer className="home-footer">
          <p>© 2026 MSmith AutoML Intelligence. Built for the modern web.</p>
        </footer>
      </div>
    </div>
  );
}