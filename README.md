```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ModelSmith AutoML</title>

<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

<style>
*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:'Poppins',sans-serif;
scroll-behavior:smooth;
}

body{
background:#0b1120;
color:white;
line-height:1.7;
}

header{
min-height:100vh;
display:flex;
flex-direction:column;
justify-content:center;
align-items:center;
text-align:center;
padding:40px;
background:
linear-gradient(rgba(11,17,32,.8),rgba(11,17,32,.9)),
radial-gradient(circle at top right,#2563eb,#0b1120);
}

header h1{
font-size:5rem;
margin-bottom:20px;
}

header span{
color:#38bdf8;
}

header p{
max-width:1000px;
font-size:1.2rem;
color:#cbd5e1;
}

.btn{
margin-top:30px;
display:inline-block;
padding:15px 35px;
background:#38bdf8;
color:#000;
font-weight:700;
text-decoration:none;
border-radius:10px;
}

section{
padding:90px 10%;
}

.title{
font-size:3rem;
text-align:center;
margin-bottom:60px;
color:#38bdf8;
}

.grid{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
gap:25px;
}

.card{
background:#172033;
padding:25px;
border-radius:18px;
border:1px solid rgba(255,255,255,.08);
transition:.3s;
}

.card:hover{
transform:translateY(-8px);
}

.card h3{
color:#38bdf8;
margin-bottom:15px;
}

.workflow-step{
background:#172033;
padding:25px;
margin-bottom:20px;
border-left:5px solid #38bdf8;
border-radius:10px;
}

.tech{
display:flex;
flex-wrap:wrap;
gap:15px;
justify-content:center;
}

.tech span{
background:#172033;
padding:12px 22px;
border-radius:30px;
}

footer{
padding:50px;
text-align:center;
background:#020617;
}

.code{
background:#111827;
padding:20px;
border-radius:10px;
overflow:auto;
margin-top:15px;
}
</style>
</head>
<body>

<header>

<h1>🚀 <span>ModelSmith</span> AutoML</h1>

<p>
Advanced Human-in-the-Loop Machine Learning Platform that bridges
Data Science and Software Engineering by transforming raw datasets
into optimized AI models and production-ready FastAPI Docker
microservices.
</p>

<a href="#features" class="btn">Explore Platform</a>

</header>

<section id="features">

<h2 class="title">✨ Core Features</h2>

<div class="grid">

<div class="card">
<h3>🧠 Autonomous ML Pipeline</h3>
<ul>
<li>Smart Problem Detection</li>
<li>Classification & Regression Auto Detection</li>
<li>StandardScaler Integration</li>
<li>OneHotEncoding Support</li>
<li>Automatic Imputation</li>
<li>Dataset Understanding</li>
</ul>
</div>

<div class="card">
<h3>⚡ Industry Model Arsenal</h3>
<ul>
<li>TensorFlow / Keras DNN</li>
<li>XGBoost</li>
<li>LightGBM</li>
<li>Random Forest</li>
<li>SVM</li>
<li>Logistic / Linear Regression</li>
</ul>
</div>

<div class="card">
<h3>👨‍💻 Human-in-the-Loop Studio</h3>
<ul>
<li>Missing Value Profiling</li>
<li>Distribution Analysis</li>
<li>Feature Inspection</li>
<li>Manual Overrides</li>
<li>Drop High Variance Columns</li>
<li>Mean / Median / Most Frequent Imputation</li>
</ul>
</div>

<div class="card">
<h3>🎯 Hyperparameter Optimization</h3>
<ul>
<li>Optuna Bayesian Optimization</li>
<li>Learning Rate Search</li>
<li>Epoch Optimization</li>
<li>Tree Depth Optimization</li>
<li>K-Fold Cross Validation</li>
<li>Overfitting Prevention</li>
</ul>
</div>

<div class="card">
<h3>🚀 MLOps Automation</h3>
<ul>
<li>FastAPI Generation</li>
<li>Pydantic Schema Creation</li>
<li>main.py Generation</li>
<li>Docker Packaging</li>
<li>AWS Deployment</li>
<li>GCP & Kubernetes Support</li>
</ul>
</div>

<div class="card">
<h3>🤖 Explainable AI</h3>
<ul>
<li>Groq Llama 3.1 Integration</li>
<li>Performance Explanations</li>
<li>Feature Importance Analysis</li>
<li>Training Code Generation</li>
<li>Human Readable Insights</li>
</ul>
</div>

</div>

</section>

<section>

<h2 class="title">🛠️ Technology Stack</h2>

<h3 style="text-align:center;margin-bottom:25px;">Frontend</h3>

<div class="tech">
<span>React.js</span>
<span>Vite</span>
<span>Framer Motion</span>
<span>Recharts</span>
<span>Vanilla CSS</span>
</div>

<br><br>

<h3 style="text-align:center;margin-bottom:25px;">Backend</h3>

<div class="tech">
<span>FastAPI</span>
<span>Scikit-Learn</span>
<span>TensorFlow</span>
<span>XGBoost</span>
<span>LightGBM</span>
<span>Optuna</span>
<span>Pandas</span>
<span>NumPy</span>
<span>SQLite3</span>
<span>Groq API</span>
</div>

</section>

<section>

<h2 class="title">🚀 How It Works</h2>

<div class="workflow-step">
<h3>1️⃣ Upload & Analyze</h3>
<p>
Upload a raw CSV dataset. The platform profiles missing values,
data types, distributions, and returns a complete Data Health Report.
</p>
</div>

<div class="workflow-step">
<h3>2️⃣ Pre-Process</h3>
<p>
Select target columns, drop irrelevant features, and define
custom imputation strategies through the Human-in-the-Loop Studio.
</p>
</div>

<div class="workflow-step">
<h3>3️⃣ Train & Optimize</h3>
<p>
ModelSmith trains six ML models simultaneously, selects the
best performer, and launches an Optuna optimization cycle.
</p>
</div>

<div class="workflow-step">
<h3>4️⃣ Evaluate & Explain</h3>
<p>
View Accuracy, R² Score, Feature Importance, Histograms,
and AI-generated explanations powered by Groq Llama 3.1.
</p>
</div>

<div class="workflow-step">
<h3>5️⃣ Deploy</h3>
<p>
Generate Dockerized FastAPI microservices and deploy instantly
to AWS, GCP, Kubernetes, or any cloud platform.
</p>
</div>

</section>

<section>

<h2 class="title">📦 Generated Deployment Package</h2>

<div class="code">
deployment.zip<br><br>
├── main.py<br>
├── model.pkl<br>
├── requirements.txt<br>
├── Dockerfile<br>
├── schema.py<br>
└── README.md
</div>

</section>

<section>

<h2 class="title">💻 Local Setup</h2>

<div class="code">
Backend:<br><br>
python -m venv venv<br>
source venv/bin/activate<br>
pip install -r requirements.txt<br>
uvicorn app.main:app --reload --port 8000
</div>

<br>

<div class="code">
Frontend:<br><br>
cd frontend<br>
npm install<br>
npm run dev
</div>

</section>

<footer>

<h2>🚀 ModelSmith AutoML</h2>

<p>
Upload → Analyze → Train → Optimize → Explain → Deploy
</p>

<br>

<p>
Built with FastAPI, React, TensorFlow, XGBoost, LightGBM,
Optuna, SQLite, Framer Motion and Groq AI.
</p>

</footer>

</body>
</html>
```

