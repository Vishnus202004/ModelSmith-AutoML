import joblib
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.svm import SVC, SVR
from sklearn.linear_model import LogisticRegression
from xgboost import XGBClassifier, XGBRegressor
from lightgbm import LGBMClassifier, LGBMRegressor
from app.services.model_registry import KerasClassifierWrapper, KerasRegressorWrapper


def build_final_model(model_name, params, problem_type):
    """
    Build final model with best parameters
    """

    if model_name == "random_forest":
        if problem_type == "classification":
            return RandomForestClassifier(**params)
        else:
            return RandomForestRegressor(**params)

    elif model_name == "svm":
        if problem_type == "classification":
            return SVC(**params)
        else:
            return SVR(**params)

    elif model_name == "logistic_regression":
        return LogisticRegression(**params)

    elif model_name == "xgboost":
        if problem_type == "classification":
            return XGBClassifier(**params)
        else:
            return XGBRegressor(**params)

    elif model_name == "lightgbm":
        if problem_type == "classification":
            return LGBMClassifier(**params)
        else:
            return LGBMRegressor(**params)

    elif model_name == "neural_network":
        if problem_type == "classification":
            return KerasClassifierWrapper(**params)
        else:
            return KerasRegressorWrapper(**params)

    else:
        raise ValueError(f"Model {model_name} not supported")


def train_and_save_model(model, X_train, y_train, preprocessor):
    """
    Train and save model
    """

    model.fit(X_train, y_train)

    joblib.dump(model, "final_model.pkl")
    joblib.dump(preprocessor, "preprocessor.pkl")