import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Predict.css";

export default function Predict() {
  const [features, setFeatures] = useState([]);
  const [inputs, setInputs] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFeatures = () => {
      const saved = JSON.parse(localStorage.getItem("features"));
      if (saved) {
        setFeatures(saved);
        const initialInputs = {};
        saved.forEach(f => initialInputs[f] = "");
        setInputs(initialInputs);
      }
    };

    loadFeatures();
    window.addEventListener("storage", loadFeatures);
    return () => window.removeEventListener("storage", loadFeatures);
  }, []);

  const handleChange = (key, value) => {
    // Stores raw input exactly as typed (allows letters and numbers)
    setInputs({ ...inputs, [key]: value });
  };

  const handlePredict = async (e) => {
    if (e) e.preventDefault(); 
    if (Object.values(inputs).some(v => v === "")) return alert("Please fill all fields");
    
    setLoading(true);
    setPrediction(null);

    // Smart data-type conversion for the API
    const processedInputs = {};
    Object.keys(inputs).forEach(key => {
      const val = inputs[key].trim();
      // If it looks like a number, send it as a float/int. If not, send it as a string.
      processedInputs[key] = (!isNaN(val) && val !== "") ? Number(val) : val;
    });

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: processedInputs }),
      });
      const data = await res.json();
      
      const resultVal = Array.isArray(data.prediction) ? data.prediction[0] : data.prediction;
      setPrediction(resultVal);
    } catch {
      alert("Inference engine offline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="predict-container">
      <div className="glow-orb p-top"></div>
      <div className="predict-content">
        <motion.div className="predict-header" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="status-pill">LIVE INFERENCE MODE</div>
          <h1>Deployment <span className="gradient-text">Console</span></h1>
        </motion.div>

        <div className="predict-main">
          <motion.form className="input-card" onSubmit={handlePredict}>
            <div className="card-label">Feature Vector Inputs</div>
            <div className="inputs-grid">
              {features.length > 0 ? (
                features.map((feature, i) => (
                  <div key={i} className="input-group">
                    <label>{feature.replace(/_/g, " ")}</label>
                    <input
                      type="text" // Changed to text to support strings and numbers
                      value={inputs[feature] || ""}
                      placeholder="Enter value..."
                      onChange={(e) => handleChange(feature, e.target.value)}
                      required
                    />
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No model found. Train on the Dashboard first.</p>
                </div>
              )}
            </div>
            <button type="submit" className="predict-run-btn" disabled={loading || !features.length}>
              {loading ? "Calculating..." : "Execute Prediction ⚡"}
            </button>
          </motion.form>

          <div className="result-card">
            <div className="card-label">Inference Output</div>
            <div className="result-viewer">
              <AnimatePresence mode="wait">
                {prediction !== null ? (
                  <motion.div className="prediction-display" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                    <div className="res-circle">
                      <span className="res-val">
                        {typeof prediction === 'number' ? prediction.toFixed(2) : prediction}
                      </span>
                    </div>
                    <h4>Prediction Confirmed</h4>
                  </motion.div>
                ) : (
                  <div className="waiting-state">🧠 {loading ? "Neural engine is thinking..." : "Ready for input"}</div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}