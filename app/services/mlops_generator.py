import io
import zipfile
import json
import os

def generate_microservice_zip():
    # 1. Read features
    try:
        with open("features.json", "r") as f:
            features = json.load(f)
    except FileNotFoundError:
        features = ["feature1", "feature2"] # fallback

    # 2. Generate main.py
    main_py_content = f"""from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI(title="ModelSmith AutoML Microservice", version="1.0.0")

# Load assets
model = joblib.load("final_model.pkl")
preprocessor = joblib.load("preprocessor.pkl")

class PredictionRequest(BaseModel):
"""
    # Sanitize feature names for Python attributes
    import re
    def sanitize_var_name(name):
        # Replace non-alphanumeric with underscore and prepend if starts with number
        clean = re.sub(r'\W|^(?=\d)', '_', name)
        return clean

    original_to_clean = {}
    for feature in features:
        clean = sanitize_var_name(feature)
        original_to_clean[clean] = feature
        main_py_content += f"    {clean}: float = 0.0\n"
        
    main_py_content += f"""
@app.post("/predict")
def predict(request: PredictionRequest):
    # Convert back to original names for Pandas DataFrame
    clean_dict = request.model_dump()
    original_dict = {{}}
"""
    for clean, orig in original_to_clean.items():
        main_py_content += f'    original_dict["{orig}"] = clean_dict["{clean}"]\n'

    main_py_content += """
    input_data = pd.DataFrame([original_dict])
    input_processed = preprocessor.transform(input_data)
    prediction = model.predict(input_processed)
    
    # If prediction is 2D (like Keras), get the scalar value
    if hasattr(prediction, "shape") and len(prediction.shape) > 1:
        prediction = prediction[0][0]
    elif isinstance(prediction, (list, tuple)) or hasattr(prediction, "__iter__"):
        prediction = prediction[0]
        
    return {"prediction": float(prediction)}
    
@app.get("/health")
def health():
    return {"status": "healthy"}
"""

    # 3. Generate requirements.txt
    req_content = """fastapi
uvicorn
pydantic
scikit-learn
pandas
joblib
xgboost
lightgbm
tensorflow
scipy
"""

    # 4. Generate Dockerfile
    dockerfile_content = """FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
"""

    # 5. Create ZIP file in memory
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        zip_file.writestr("main.py", main_py_content)
        zip_file.writestr("requirements.txt", req_content)
        zip_file.writestr("Dockerfile", dockerfile_content)
        
        # Add actual model files if they exist
        if os.path.exists("final_model.pkl"):
            zip_file.write("final_model.pkl", "final_model.pkl")
        if os.path.exists("preprocessor.pkl"):
            zip_file.write("preprocessor.pkl", "preprocessor.pkl")
            
    zip_buffer.seek(0)
    return zip_buffer
