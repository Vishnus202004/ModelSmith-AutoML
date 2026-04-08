import { motion } from "framer-motion";
import "./About.css";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function About() {
  const pipeline = [
    { title: "Ingestion", desc: "Automated CSV analysis & target detection.", icon: "📥" },
    { title: "Preprocessing", desc: "Handling missing values & categorical encoding.", icon: "⚙️" },
    { title: "Optimization", desc: "Hyperparameter tuning via Optuna & Cross-Val.", icon: "🧪" },
    { title: "Inference", desc: "Real-time predictions via dynamic deployment.", icon: "⚡" },
  ];

  const techs = ["FastAPI", "React.js", "Vite", "Optuna", "Pandas", "Scikit-learn", "Tensorflow", "Groq AI", "SQLite", "Framer Motion"];

  return (
    <div className="about-container">
      {/* ATMOSPHERIC LAYER */}
      <div className="abstract-grid"></div>
      <div className="glow-sphere top-right"></div>
      <div className="glow-sphere bottom-left"></div>

      <div className="about-content">
        {/* HERO */}
        <motion.section 
          className="about-hero"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="version-tag">v2.0 STABLE RELEASE</div>
          <h1>Model<span className="gradient-text">Smith</span> Intelligence</h1>
          <p className="hero-sub">The end-to-end AutoML engine for the modern data era.</p>
        </motion.section>

        {/* THE MISSION */}
        <section className="about-mission">
          <motion.div 
            className="mission-box"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2>The Vision</h2>
            <p>
              ModelSmith is a high-performance AutoML platform designed to bridge the gap between 
              raw data and production-ready intelligence. By automating the entire <strong>Machine Learning pipeline</strong>, 
              we empower users to upload datasets and instantly generate explainable, optimized models 
              without writing a single line of boilerplate code.
            </p>
          </motion.div>
        </section>

        {/* PIPELINE VISUALIZER */}
        <section className="pipeline-section">
          <div className="section-label">THE PIPELINE</div>
          <motion.div 
            className="pipeline-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {pipeline.map((step, i) => (
              <motion.div key={i} className="pipeline-card" variants={itemVariants}>
                <div className="step-num">0{i + 1}</div>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* TECH STACK BENTO */}
        <section className="tech-stack-section">
          <h2>Engineered With</h2>
          <div className="tech-tags">
            {techs.map((t, i) => (
              <motion.span 
                key={i} 
                className="tech-pill"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
              >
                {t}
              </motion.span>
            ))}
          </div>
        </section>

        {/* THE CREATOR */}
        <motion.section 
          className="developer-section"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="dev-card">
            <div className="dev-avatar">V</div>
            <div className="dev-info">
              <h3>Vishnu</h3>
              <p>Full Stack AI Developer</p>
              <div className="dev-bio">
               AI and Full-Stack Developer building intelligent and scalable applications.
              </div>
            </div>
          </div>
        </motion.section>

        <footer className="about-footer">
          Built with precision. © 2026 ModelSmith.AI
        </footer>
      </div>
    </div>
  );
}