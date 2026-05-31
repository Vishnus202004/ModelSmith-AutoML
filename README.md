# <p align="center">🚀 ModelSmith AutoML</p>

<p align="center">
  <img src="https://img.shields.io/badge/Framework-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/ML-TensorFlow%20%26%20Scikit--Learn-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" />
  <img src="https://img.shields.io/badge/AI-Groq%20Llama%203.1-orange?style=for-the-badge" />
</p>

<p align="center">
  <b>ModelSmith AutoML</b> is a fully autonomous <b>"Human-in-the-Loop"</b> Machine Learning platform. It bridges the gap between Data Science and Software Engineering by transforming raw datasets into production-ready <b>FastAPI Docker microservices</b> in minutes.
</p>

---

## ✨ Core Features

### 🤖 1. Autonomous ML Pipeline
- **Smart Problem Detection**: Automatically classifies targets into **Classification** or **Regression**.
- **Automated Preprocessing**: Handles `StandardScaler` for numbers, `OneHotEncoding` for categories, and intelligent baseline imputation.
- **Top-Tier Arsenal**: Simutaneously trains 6 industry-standard architectures:
  - Deep Neural Networks (Keras/TensorFlow)
  - LightGBM & XGBoost
  - Random Forest & Support Vector Machines (SVM)
  - Logistic/Linear Regression

### 🛠️ 2. Human-in-the-Loop Data Studio
- **Interactive Profiling**: Deep-dive into missing values, data types, and distributions before hitting "Train."
- **Manual Overrides**: Explicitly drop high-variance columns or choose custom imputation strategies (Mean, Median, Most Frequent).

### 📈 3. Enterprise Optimization
- **Optuna Integration**: Bayesian Optimization to find the perfect learning rates, tree depths, and epochs.
- **Cross-Validation**: Robust K-Fold validation to ensure your models handle real-world data without overfitting.

### 📦 4. MLOps: One-Click Deployment
- **Instant API**: Generates a dynamic `main.py` using **Pydantic** schemas tailored to your specific dataset columns.
- **Dockerization**: One-click download of a `.zip` containing model binaries, the API script, and a `Dockerfile` ready for AWS/GCP/Kubernetes.

### 🧠 5. Explainable AI (XAI)
- **Llama-3.1 Insights**: Powered by **Groq**, the platform generates natural language explanations of model performance and feature importance.
- **Code Transparency**: View and export the exact Python code used to generate the model for local replication.

---

## 🛠️ Tech Stack

<table width="100%">
  <tr>
    <td width="50%" valign="top">
      <h4>Frontend</h4>
      <ul>
        <li><b>React.js & Vite</b> - High-performance UI</li>
        <li><b>Framer Motion</b> - Glassmorphism & Animations</li>
        <li><b>Recharts</b> - Interactive data visualization</li>
        <li><b>Vanilla CSS</b> - Premium custom dark-mode</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h4>Backend</h4>
      <ul>
        <li><b>FastAPI</b> - Asynchronous core engine</li>
        <li><b>Optuna</b> - Hyperparameter tuning</li>
        <li><b>Groq API</b> - LLM-powered XAI</li>
        <li><b>SQLite3</b> - Experiment tracking</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🚀 How It Works

1.  **Upload & Analyze**: Drag-and-drop a `.csv`. The backend generates a structural profile.
2.  **Pre-Process**: Clean your data and define your target in the Data Health Studio.
3.  **Train & Optimize**: The engine handles the heavy lifting, running the Optuna optimization loop on the best architecture.
4.  **Evaluate & Explain**: Review R²/Accuracy scores and AI-generated feature importance.
5.  **Deploy**: Test via "Live Inference" or download your **Dockerized API**.

---

## 💻 Local Setup

### 🔧 Backend Requirements
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn app.main:app --reload --port 8000
