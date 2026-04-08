import json
from datetime import datetime
from app.db.database import get_connection


def log_experiment(data):
    conn = get_connection()
    cursor = conn.cursor()

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    cursor.execute("""
        INSERT INTO experiments (
            timestamp,
            problem_type,
            best_model,
            optimized_score,
            initial_scores,
            feature_importance
        )
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        timestamp,
        data["problem_type"],
        data["best_model"],
        data["optimized_score"],
        json.dumps(data["initial_scores"]),
        json.dumps(data["feature_importance"])
    ))

    conn.commit()
    conn.close()