from app.db.database import get_connection


def create_table():
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


if __name__ == "__main__":
    create_table()