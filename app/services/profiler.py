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

    return {
        "rows": num_rows,
        "columns": num_cols,
        "target_column": target_column,
        "problem_type": problem_type,
        "missing_values": missing_values
    }