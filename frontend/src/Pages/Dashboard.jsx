import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Dashboard.css";
import {
  uploadDataset,
  downloadModel,
  downloadPreprocessor,
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
  const [copied, setCopied] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Select CSV file");
    setLoading(true);
    setResult(null); 
    try {
      const res = await uploadDataset(file);
      if (res.error) {
        alert(res.error);
      } else {
        setResult(res);
        
        // ✅ THE FIX: Use feature_columns from your routes.py
        // This list specifically excludes the target column.
        if (res.feature_columns) {
          localStorage.setItem("features", JSON.stringify(res.feature_columns));
          window.dispatchEvent(new Event("storage"));
        }
      }
    } catch {
      alert("Error uploading");
    }
    setLoading(false);
  };

  const handleCopy = () => {
    if (!finalCode) return;
    navigator.clipboard.writeText(finalCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
    ? Object.entries(result.initial_scores).map(([k, v]) => ({ name: k, value: v }))
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
          <button className="train-btn" onClick={handleUpload} disabled={loading}>
            {loading ? "Optimizing Engine..." : "Launch Training"}
          </button>
        </motion.div>

        {loading && <div className="loader"><div className="spinner"></div><p>Analyzing architecture & weights...</p></div>}

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
                    {result.problem_type === "classification" ? "OPTIMIZED ACCURACY" : "R² SCORE"}
                  </span>
                  <h3 className="highlight">
                    {result.problem_type === "classification" 
                      ? `${(result.optimized_score * 100).toFixed(2)}%`
                      : Number(result.optimized_score).toFixed(3)}
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
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10}/>
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

              <motion.div className="download-section" variants={itemVariants}>
                <button className="action-btn model" onClick={downloadModel}><span className="icon">📦</span> Deploy Model (.pkl)</button>
                <button className="action-btn pre" onClick={downloadPreprocessor}><span className="icon">⚙️</span> Preprocessor</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}