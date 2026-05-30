import sqlite3

DB_NAME = "experiments.db"


def get_connection():
    return sqlite3.connect(DB_NAME)

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS experiments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            problem_type TEXT,
            best_model TEXT,
            optimized_score REAL,
            initial_scores TEXT,
            feature_importance TEXT
        )
    """)
    conn.commit()
    conn.close()