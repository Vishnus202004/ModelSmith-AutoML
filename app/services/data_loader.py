import pandas as pd

def load_csv(file):
    """
    Reads uploaded CSV file and returns DataFrame
    """

    df = pd.read_csv(file.file)
    return df