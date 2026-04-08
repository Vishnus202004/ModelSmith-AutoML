from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    mean_squared_error,
    mean_absolute_error,
    r2_score
)
from sklearn.model_selection import cross_val_score
from app.services.model_registry import get_models


def train_models(X_train, X_test, y_train, y_test, problem_type):

    input_dim = X_train.shape[1]
    models = get_models(problem_type, input_dim=input_dim)

    results = {}

    for name, model in models.items():
        try:
            # -------------------------------
            # 1. Cross-validation (NEW 🔥)
            # -------------------------------
            if problem_type == "classification":
                cv_scores = cross_val_score(
                    model, X_train, y_train,
                    cv=3,
                    scoring="accuracy"
                )
                score = cv_scores.mean()

            else:
                cv_scores = cross_val_score(
                    model, X_train, y_train,
                    cv=3,
                    scoring="r2"
                )
                score = cv_scores.mean()

            # -------------------------------
            # 2. Train on full training data
            # -------------------------------
            model.fit(X_train, y_train)

            # -------------------------------
            # 3. Final test evaluation
            # -------------------------------
            predictions = model.predict(X_test)

            if problem_type == "classification":
                acc = accuracy_score(y_test, predictions)
                precision = precision_score(y_test, predictions, average="weighted", zero_division=0)
                recall = recall_score(y_test, predictions, average="weighted", zero_division=0)
                f1 = f1_score(y_test, predictions, average="weighted", zero_division=0)

                metrics = {
                    "accuracy": acc,
                    "precision": precision,
                    "recall": recall,
                    "f1_score": f1
                }

            else:
                mse = mean_squared_error(y_test, predictions)
                rmse = mse ** 0.5
                mae = mean_absolute_error(y_test, predictions)
                r2 = r2_score(y_test, predictions)

                metrics = {
                    "mse": mse,
                    "rmse": rmse,
                    "mae": mae,
                    "r2_score": r2
                }

            # -------------------------------
            # 4. Store results
            # -------------------------------
            results[name] = {
                "model": model,
                "cv_score": score,   # 🔥 NEW
                "metrics": metrics
            }

        except Exception as e:
            results[name] = {
                "model": None,
                "cv_score": None,
                "error": str(e)
            }

    # -------------------------------
    # 5. Filter valid models
    # -------------------------------
    valid_results = {
        k: v for k, v in results.items() if v["cv_score"] is not None
    }

    if not valid_results:
        raise ValueError("No valid models trained")

    # -------------------------------
    # 6. Select best model (based on CV)
    # -------------------------------
    best_model = max(valid_results, key=lambda x: valid_results[x]["cv_score"])

    return best_model, results