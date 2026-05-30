import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Dashboard.css";
import {
  uploadDataset,
  profileDataset,
  downloadModel,
  downloadPreprocessor,
  downloadMicroservice,
} from "../services/api";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell, AreaChart, Area, PieChart, Pie
} from "recharts";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const downloadCodeFile = (codeStr, filename) => {
  const blob = new Blob([codeStr], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const CodeBlock = ({ code, language, title }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="code-wrapper" style={{ margin: "20px 0" }}>
      <div className="code-top">
        <div className="code-dots"><span></span><span></span><span></span></div>
        <span className="lang-tag">{title || language || "code"}</span>
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? "✓ Copied" : "Copy Code"}
        </button>
        <button className="copy-btn" style={{ marginLeft: "10px", background: "rgba(16, 185, 129, 0.2)", borderColor: "rgba(16, 185, 129, 0.4)", color: "#10b981" }} onClick={() => downloadCodeFile(code, title || "model_code.py")}>
          Download .py
        </button>
      </div>
      <SyntaxHighlighter language={language || "python"} style={oneDark} customStyle={{ background: "transparent", padding: "20px", margin: 0 }}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [profile, setProfile] = useState(null);
  const [config, setConfig] = useState({ drop_columns: [], impute_strategies: {}, target_column: "" });

  const handleAnalyze = async () => {
    if (!file) return alert("Select CSV file");
    setLoading(true);
    setResult(null); 
    setProfile(null);
    try {
      const res = await profileDataset(file);
      if (res.error) {
        alert(res.error);
      } else {
        setProfile(res);
        setConfig(prev => ({...prev, target_column: res.analysis.target_column}));
      }
    } catch {
      alert("Error profiling");
    }
    setLoading(false);
  };

  const handleTrain = async () => {
    setLoading(true);
    setResult(null); 
    try {
      const res = await uploadDataset(file, config);
      if (res.error) {
        alert(res.error);
      } else {
        setResult(res);
        setProfile(null);
        if (res.feature_columns) {
          localStorage.setItem("features", JSON.stringify(res.feature_columns));
          window.dispatchEvent(new Event("storage"));
        }
      }
    } catch {
      alert("Error training");
    }
    setLoading(false);
  };

  const finalExplanation = typeof result?.llm_explanation === "object"
      ? result.llm_explanation?.explanation
      : result?.llm_explanation;

  const finalCode = (typeof result?.llm_explanation === "object"
      ? result.llm_explanation?.code
      : null) || result?.generated_code || "";

  const featureData = result?.feature_importance
    ? Object.entries(result.feature_importance).map(([k, v]) => ({ name: k, value: v }))
    : [];

  const modelData = result?.initial_scores
    ? Object.entries(result.initial_scores)
        .map(([k, v]) => ({ name: k, value: v }))
        .sort((a, b) => b.value - a.value)
    : [];

  return (
    <div className="dashboard">
      <div className="content">
        <motion.div className="dash-hero" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1>AutoML <span className="hp">Intelligence</span></h1>
          <p>Train. Optimize. Understand your models with industrial precision.</p>
        </motion.div>

        <motion.div className="upload-panel" whileHover={{ scale: 1.01 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="upload-icon">+</div>
          <p>Drag & Drop CSV Dataset</p>
          <label className="custom-file">
            <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
            Browse Files
          </label>
          {file && <p className="file-name">Selected: {file.name}</p>}
          {(!profile && !result) && (
            <button className="train-btn" onClick={handleAnalyze} disabled={loading}>
              {loading ? "Analyzing Data..." : "Analyze Data"}
            </button>
          )}
        </motion.div>

        {loading && <div className="loader"><div className="spinner"></div><p>Processing data and optimizing architecture...</p></div>}
        
        {/* Data Health Studio */}
        {profile && !result && (
          <motion.div className="glass-card wide studio-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="card-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3>🧹 Data Health Studio</h3>
                <button className="train-btn small" onClick={handleTrain} disabled={loading}>
                    {loading ? "Training..." : "Launch Training 🚀"}
                </button>
            </div>
            
            <div className="studio-controls" style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px'}}>
                <label>Target Column (Prediction Target):</label>
                <select 
                    value={config.target_column} 
                    onChange={e => setConfig({...config, target_column: e.target.value})}
                    className="modern-select"
                >
                    {profile.columns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <div className="table-container" style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Type</th>
                    <th>Missing</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.analysis.column_details.map(col => (
                    <tr key={col.name}>
                      <td style={{padding: '10px', borderTop: '1px solid #1e293b'}}>{col.name}</td>
                      <td style={{padding: '10px', borderTop: '1px solid #1e293b'}}>
                        <span className={`badge ${col.type.toLowerCase()}`}>{col.type}</span>
                      </td>
                      <td style={{padding: '10px', borderTop: '1px solid #1e293b'}}>
                        {col.missing_pct > 0 ? (
                            <span style={{color: '#ef4444', fontWeight: 'bold'}}>{col.missing_pct}% ({col.missing_count})</span>
                        ) : (
                            <span style={{color: '#10b981'}}>0%</span>
                        )}
                      </td>
                      <td style={{padding: '10px', borderTop: '1px solid #1e293b'}}>
                          <select 
                            className="modern-select"
                            value={
                                config.drop_columns.includes(col.name) 
                                ? "drop" 
                                : config.impute_strategies[col.name] || "auto"
                            }
                            onChange={(e) => {
                                const val = e.target.value;
                                let newDrops = [...config.drop_columns];
                                let newImputes = {...config.impute_strategies};
                                
                                if (val === "drop") {
                                    if (!newDrops.includes(col.name)) newDrops.push(col.name);
                                    delete newImputes[col.name];
                                } else if (val === "auto") {
                                    newDrops = newDrops.filter(c => c !== col.name);
                                    delete newImputes[col.name];
                                } else {
                                    newDrops = newDrops.filter(c => c !== col.name);
                                    newImputes[col.name] = val;
                                }
                                setConfig({...config, drop_columns: newDrops, impute_strategies: newImputes});
                            }}
                          >
                              <option value="auto">Auto (Pipeline)</option>
                              <option value="drop">Drop Column</option>
                              {col.type === "Numeric" && <option value="mean">Impute Mean</option>}
                              {col.type === "Numeric" && <option value="median">Impute Median</option>}
                              <option value="most_frequent">Impute Most Frequent</option>
                          </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {result && (
            <motion.div className="results-container" variants={containerVariants} initial="hidden" animate="visible">
              <div className="top-cards">
                <motion.div className="glass-card big" variants={itemVariants}>
                  <span className="card-label">BEST PERFORMING ARCHITECTURE</span>
                  <h3 className="highlight">{result.best_model}</h3>
                </motion.div>
                <motion.div className="glass-card big" variants={itemVariants}>
                  <span className="card-label">
                    {result.problem_type === "classification" ? "FINAL TEST ACCURACY" : "FINAL TEST R² SCORE"}
                  </span>
                  <h3 className="highlight">
                    {result.problem_type === "classification" 
                      ? `${(result.metrics?.accuracy * 100).toFixed(2)}%`
                      : Number(result.metrics?.r2 || result.optimized_score).toFixed(3)}
                  </h3>
                </motion.div>
              </div>

              {result.metrics && (
                <motion.div className="metrics-grid" variants={itemVariants}>
                  {Object.entries(result.metrics).map(([k, v], i) => (
                    <div key={k} className={`metric-card color-${i % 4}`}>
                      <h4>{k.toUpperCase()}</h4>
                      <p>{Number(v).toFixed(3)}</p>
                    </div>
                  ))}
                </motion.div>
              )}

              <div className="charts-grid">
                {featureData.length > 0 && (
                  <motion.div className="glass-card" variants={itemVariants}>
                    <h3>📊 Feature Impact</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={featureData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
                        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}

                {/* Algorithmic Benchmarks */}
                {modelData.length > 0 && (
                  <motion.div className="glass-card" variants={itemVariants}>
                    <h3>📈 Algorithm Benchmarks</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={modelData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} interval={0} angle={-25} textAnchor="end" height={60} />
                        <YAxis stroke="#64748b" fontSize={12}/>
                        <Bar dataKey="value">
                          {modelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#334155'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}
              </div>

              {/* Data Preview (Uses full columns) */}
              {result.preview && (
                <motion.div className="glass-card wide" variants={itemVariants}>
                  <h3>📄 Dataset Preview</h3>
                  <div className="table-container" style={{overflowX: 'auto'}}>
                    <table style={{width: '100%', borderCollapse: 'collapse'}}>
                      <thead>
                        <tr>
                          {result.columns.map((col, i) => <th key={i} style={{textAlign: 'left', padding: '10px', color: '#94a3b8'}}>{col}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {result.preview.map((row, i) => (
                          <tr key={i}>
                            {result.columns.map((col, j) => <td key={j} style={{padding: '10px', borderTop: '1px solid #1e293b'}}>{row[col]}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              <motion.div className="glass-card wide explanation-card" variants={itemVariants}>
                <div className="card-header"><h3>Explanation And Code</h3><div className="pulse-icon"></div></div>
                <div className="explanation" style={{ textAlign: "left", lineHeight: "1.6" }}>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline ? (
                          <CodeBlock 
                            code={String(children).replace(/\n$/, "")} 
                            language={match ? match[1] : null} 
                          />
                        ) : (
                          <code className="inline-code" {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {finalExplanation ? finalExplanation.replace(/\\n/g, "\n") : ""}
                  </ReactMarkdown>
                </div>
              </motion.div>

              <motion.div className="code-section" variants={itemVariants}>
                <CodeBlock 
                  code={finalCode.replace(/\\n/g, "\n")} 
                  language="python" 
                  title="python_generated_model.py" 
                />
              </motion.div>

              <motion.div className="download-section">
                <div className="action-buttons">
                  <button className="btn-secondary" onClick={downloadModel}>
                    💾 Download Model (.pkl)
                  </button>
                  <button className="btn-secondary" onClick={downloadPreprocessor}>
                    ⚙️ Download Preprocessor
                  </button>
                  <button className="btn-primary highlight-btn" onClick={downloadMicroservice} style={{background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none'}}>
                    🚢 Download API (Docker)
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info & Tech Stack Section */}
        {!loading && !result && !profile && (
          <motion.div 
            className="info-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="glass-card about-card">
              <h3>🚀 About ModelSmith AutoML</h3>
              <p>ModelSmith is an enterprise-grade automated machine learning platform designed to bridge the gap between raw data and deployable intelligence. Simply upload your dataset, and our engine automatically profiles the data, imputes missing values, trains a diverse array of advanced algorithms, and utilizes Optuna to find the absolute optimal hyperparameters.</p>
            </div>
            
            <div className="glass-card stack-card">
              <h3>🛠️ Technology Stack</h3>
              <div className="stack-grid">
                <div className="stack-item">⚛️ React & Framer Motion</div>
                <div className="stack-item">⚡ FastAPI</div>
                <div className="stack-item">🧠 TensorFlow & Keras</div>
                <div className="stack-item">🌳 XGBoost & LightGBM</div>
                <div className="stack-item">🎯 Optuna HPT</div>
                <div className="stack-item">🤖 Groq LLM</div>
              </div>
            </div>

            <div className="glass-card stack-card">
              <h3>🤖 Machine Learning Arsenal</h3>
              <div className="stack-grid">
                <div className="stack-item">🌲 Random Forest</div>
                <div className="stack-item">🚀 XGBoost</div>
                <div className="stack-item">💡 LightGBM</div>
                <div className="stack-item">📈 Logistic Regression</div>
                <div className="stack-item">⚔️ Support Vector Machines (SVM)</div>
                <div className="stack-item">🧠 Deep Neural Networks</div>
              </div>
            </div>

            <div className="glass-card about-card">
              <h3>🌍 Why AutoML Matters Today</h3>
              <p>In the modern data-driven landscape, building robust AI models often takes weeks of tedious manual tuning, feature engineering, and algorithm selection. ModelSmith democratizes this process by instantly discovering the most powerful architectures for your specific data, empowering businesses to deploy high-accuracy predictive intelligence in seconds rather than months.</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}