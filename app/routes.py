from fastapi import APIRouter, UploadFile, Form
from typing import Optional
import joblib
import pandas as pd
import numpy as np
import json

from app.services.data_loader import load_csv
from app.services.profiler import analyze_data
from app.services.preprocessor import preprocess_data
from app.services.model_trainer import train_models
from app.services.optimizer import optimize_model
from app.services.final_model import build_final_model, train_and_save_model
from app.services.feature_importance import get_feature_importance
from app.services.experiment_tracker import log_experiment
from app.services.code_generator import generate_training_code
from app.services.llm_service import generate_explanation
from app.models.schemas import PredictionRequest
from fastapi.responses import FileResponse, StreamingResponse
from app.services.mlops_generator import generate_microservice_zip

router = APIRouter()

def sanitize_data(data):
    """Recursively replace NaN/Infinity with None for JSON compliance."""
    if isinstance(data, dict):
        return {k: sanitize_data(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [sanitize_data(v) for v in data]
    elif isinstance(data, float):
        if np.isnan(data) or np.isinf(data):
            return None
    return data

@router.get("/api/download-model")
def download_model():
    try:
        return FileResponse(
            path="final_model.pkl",
            filename="trained_model.pkl",
            media_type="application/octet-stream"
        )
    except Exception as e:
        return {"error": str(e)}

@router.get("/api/download-api")
def download_api():
    try:
        zip_buffer = generate_microservice_zip()
        return StreamingResponse(
            zip_buffer,
            media_type="application/zip",
            headers={"Content-Disposition": "attachment; filename=microservice.zip"}
        )
    except Exception as e:
        return {"error": str(e)}

@router.post("/api/profile")
async def profile_dataset(file: UploadFile):
    try:
        df = load_csv(file)
        analysis = analyze_data(df)
        
        return sanitize_data({
            "message": "Profiling complete",
            "analysis": analysis,
            "preview": df.head(5).to_dict(orient="records"),
            "columns": list(df.columns)
        })
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return {"error": str(e)}

@router.post("/api/upload")
async def upload_file(
    file: UploadFile, 
    target_column: Optional[str] = Form(None),
    drop_columns: Optional[str] = Form(None),
    impute_strategies: Optional[str] = Form(None)
):
    try:
        df = load_csv(file)
        analysis = analyze_data(df)
        # Override target column if user provided it
        if target_column:
            # Re-evaluate problem type if target column changed manually
            if df[target_column].dtype == "object":
                problem_type = "classification"
            else:
                unique_values = df[target_column].nunique()
                problem_type = "classification" if unique_values < 10 else "regression"
        else:
            target_column = analysis["target_column"]
            problem_type = analysis["problem_type"]
            
        # Parse configs
        drops = json.loads(drop_columns) if drop_columns else []
        imputes = json.loads(impute_strategies) if impute_strategies else {}
        
        # Apply manual preprocessing
        from app.services.preprocessor import apply_manual_preprocessing
        df = apply_manual_preprocessing(df, drops, imputes)

        X_train, X_test, y_train, y_test, preprocessor = preprocess_data(
            df, target_column
        )

        best_model, results = train_models(
            X_train, X_test, y_train, y_test, problem_type
        )

        best_params, best_score = optimize_model(
            best_model, X_train, y_train, problem_type
        )

        input_dim = X_train.shape[1]

        final_model = build_final_model(
            best_model, best_params, problem_type, input_dim=input_dim
        )

        train_and_save_model(
            final_model, X_train, y_train, preprocessor
        )

        from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score
        from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

        y_pred = final_model.predict(X_test)

        if problem_type == "classification":
            metrics = {
                "accuracy": float(accuracy_score(y_test, y_pred)),
                "f1_score": float(f1_score(y_test, y_pred, average="weighted")),
                "precision": float(precision_score(y_test, y_pred, average="weighted")),
                "recall": float(recall_score(y_test, y_pred, average="weighted")),
            }
        else:
            metrics = {
                "mae": float(mean_absolute_error(y_test, y_pred)),
                "rmse": float(np.sqrt(mean_squared_error(y_test, y_pred))),
                "r2": float(r2_score(y_test, y_pred)),
            }

        feature_names = list(df.drop(columns=[target_column]).columns)
        
        with open("features.json", "w") as f:
            json.dump(feature_names, f)
            
        feature_importance = get_feature_importance(final_model, feature_names)

        generated_code = generate_training_code(best_model, best_params, problem_type)
        llm_output = generate_explanation({
            "best_model": best_model,
            "score": best_score,
            "feature_importance": feature_importance
        })

        explanation = llm_output.get("explanation", "")
        llm_code = llm_output.get("code", "")

        log_experiment({
            "problem_type": problem_type,
            "best_model": best_model,
            "optimized_score": best_score,
            "initial_scores": {
                model_name: info["cv_score"]
                for model_name, info in results.items()
                if info["cv_score"] is not None
            },
            "feature_importance": feature_importance
        })

        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        hist_data = []

        if numeric_cols:
            first_num = numeric_cols[0]
            counts, bins = np.histogram(df[first_num].dropna(), bins=10)
            hist_data = [
                {"bin": f"{bins[i]:.1f}", "count": int(counts[i])}
                for i in range(len(counts))
            ]

        target_dist = df[target_column].value_counts().to_dict()

        stats = df.describe().to_dict()

        stats_summary = {
            col: {
                "min": float(stats[col]["min"]),
                "q1": float(stats[col]["25%"]),
                "median": float(stats[col]["50%"]),
                "q3": float(stats[col]["75%"]),
                "max": float(stats[col]["max"])
            }
            for col in numeric_cols[:5]
        }

        numeric_df = df.select_dtypes(include=['int64', 'float64'])
        correlation_matrix = numeric_df.corr().to_dict()

        response_payload = {
            "message": "AutoML pipeline completed successfully 🚀",
            "problem_type": problem_type,
            "best_model": best_model,
            "optimized_score": best_score,
            "initial_scores": {
                model_name: info["cv_score"]
                for model_name, info in results.items()
                if info["cv_score"] is not None
            },
            "feature_importance": feature_importance,
            "feature_columns": feature_names,
            "target_column": target_column,
            "preview": df.head(5).to_dict(orient="records"),
            "missing_values": df.isnull().sum().to_dict(),
            "columns": list(df.columns),
            "histogram": hist_data,
            "target_distribution": target_dist,
            "stats_summary": stats_summary,
            "correlation_matrix": correlation_matrix,
            "llm_explanation": explanation,
            "generated_code": llm_code if llm_code else generated_code,
            "metrics": metrics
        }

        return sanitize_data(response_payload)

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return {"error": str(e)}

@router.post("/api/predict")
async def predict(request: PredictionRequest):
    try:
        model = joblib.load("final_model.pkl")
        preprocessor = joblib.load("preprocessor.pkl")

        input_df = pd.DataFrame([request.features])
        input_processed = preprocessor.transform(input_df)

        prediction = model.predict(input_processed)

        return {
            "prediction": prediction.tolist(),
            "input_features": request.features
        }

    except Exception as e:
        return {"error": str(e)}

@router.get("/api/experiments")
def get_experiments():
    from app.db.database import get_connection

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM experiments")

        rows = cursor.fetchall()

        conn.close()

        results = []

        for row in rows:
            results.append({
                "id": row[0],
                "timestamp": row[1],
                "problem_type": row[2],
                "best_model": row[3],
                "optimized_score": row[4],
                "initial_scores": row[5],
                "feature_importance": row[6]
            })

        return {"experiments": results}

    except Exception as e:
        return {"error": str(e)}
