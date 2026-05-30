import pandas as pd

def analyze_data(df):
    """
    Analyze dataset and return key insights
    """

    # Basic info
    num_rows, num_cols = df.shape

    # Detect target column (assume last column for now)
    target_column = df.columns[-1]

    # Detect problem type
    if df[target_column].dtype == "object":
        problem_type = "classification"
    else:
        # If numeric → check unique values
        unique_values = df[target_column].nunique()

        if unique_values < 10:
            problem_type = "classification"
        else:
            problem_type = "regression"

    # Missing values
    missing_values = df.isnull().sum().to_dict()

    # Column details for UI
    column_details = []
    for col in df.columns:
        missing_count = int(df[col].isnull().sum())
        missing_pct = round((missing_count / num_rows) * 100, 2) if num_rows > 0 else 0
        column_details.append({
            "name": col,
            "type": "Numeric" if pd.api.types.is_numeric_dtype(df[col]) else "Categorical",
            "missing_count": missing_count,
            "missing_pct": missing_pct,
            "unique_values": int(df[col].nunique())
        })

    return {
        "rows": num_rows,
        "columns": num_cols,
        "target_column": target_column,
        "problem_type": problem_type,
        "missing_values": missing_values,
        "column_details": column_details
    }