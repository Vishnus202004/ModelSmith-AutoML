import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./History.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid
} from "recharts";

export default function History() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/experiments")
      .then((res) => res.json())
      .then((res) => {
        const fixed = (res.experiments || []).map((item) => {
          let parsedScores = {};
          try {
            parsedScores = typeof item.initial_scores === "string"
                ? JSON.parse(item.initial_scores)
                : item.initial_scores;
          } catch { parsedScores = {}; }
          return { ...item, initial_scores: parsedScores };
        });
        setData(fixed);
        setLoading(false);
      });
  }, []);

  return (
    <div className="history-container">
      {/* BACKGROUND DECOR */}
      <div className="history-bg-blur"></div>

      <div className="history-content">
        {/* HERO SECTION */}
        <motion.div
          className="history-hero"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="history-badge">ARCHIVE</div>
          <h1>Model <span className="gradient-text">Registry</span></h1>
          <p>Review and compare the experiments.</p>
          
          
        </motion.div>

        {/* LOADING STATE */}
        {loading && (
          <div className="history-loader">
            <div className="shimmer-card"></div>
            <div className="shimmer-card"></div>
            <div className="shimmer-card"></div>
          </div>
        )}

        {/* EXPERIMENT GRID */}
        <div className="history-grid">
          <AnimatePresence>
            {data.map((item, i) => {
              const chartData = Object.entries(item.initial_scores || {})
                .map(([k, v]) => ({ name: k, value: v }))
                .sort((a, b) => b.value - a.value);

              return (
                <motion.div
                  key={i}
                  className="history-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="card-top">
                    <div className="algo-info">
                      <span className="algo-tag">ID: {item.id || 'Exp-'+i}</span>
                      <h3>{item.best_model}</h3>
                    </div>
                    <div className={`prob-badge ${item.problem_type}`}>
                      {item.problem_type}
                    </div>
                  </div>

                  <div className="main-stat">
                    <div className="stat-label">
                      {item.problem_type === "classification" ? "OPTIMIZED ACCURACY" : "R² SCORE"}
                    </div>
                    <div className="stat-value-row">
                      <span className="big-score">
                        {item.problem_type === "classification" 
                          ? `${(item.optimized_score * 100).toFixed(2)}%`
                          : Number(item.optimized_score).toFixed(3)}
                      </span>
                      <div className="trend-up">▲ </div>
                    </div>
                  </div>

                  <div className="chart-section">
                    <div className="chart-header">Benchmark Comparison</div>
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart data={chartData}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="name" hide />
                        <Tooltip 
                           contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                           itemStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="value" fill="url(#colorScore)" radius={[4, 4, 0, 0]}>
                           {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.name === item.best_model ? '#3b82f6' : 'rgba(255,255,255,0.1)'} />
                           ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="card-footer">
                    <div className="footer-date">
                      <span className="clock-icon">🕒</span> {item.timestamp}
                    </div>
                    <button className="view-details-btn">Details →</button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}