import optuna
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.svm import SVC, SVR
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from xgboost import XGBClassifier, XGBRegressor
from lightgbm import LGBMClassifier, LGBMRegressor

# 🔥 For Neural Network
from app.services.model_registry import KerasClassifierWrapper, KerasRegressorWrapper


def optimize_model(model_name, X_train, y_train, problem_type):
    """
    Dynamically optimize the selected best model using Optuna
    """

    input_dim = X_train.shape[1]

    def objective(trial):

        # -------------------------------
        # RANDOM FOREST
        # -------------------------------
        if model_name == "random_forest":

            n_estimators = trial.suggest_int("n_estimators", 50, 300)
            max_depth = trial.suggest_int("max_depth", 3, 20)

            if problem_type == "classification":
                model = RandomForestClassifier(
                    n_estimators=n_estimators,
                    max_depth=max_depth
                )
            else:
                model = RandomForestRegressor(
                    n_estimators=n_estimators,
                    max_depth=max_depth
                )

        # -------------------------------
        # SVM
        # -------------------------------
        elif model_name == "svm":

            C = trial.suggest_float("C", 0.1, 10.0)
            kernel = trial.suggest_categorical("kernel", ["linear", "rbf"])

            if problem_type == "classification":
                model = SVC(C=C, kernel=kernel)
            else:
                model = SVR(C=C, kernel=kernel)

        # -------------------------------
        # LOGISTIC REGRESSION
        # -------------------------------
        elif model_name == "logistic_regression":

            C = trial.suggest_float("C", 0.01, 10.0)

            model = LogisticRegression(
                C=C,
                max_iter=1000
            )

        # -------------------------------
        # 🔥 XGBOOST
        # -------------------------------
        elif model_name == "xgboost":

            n_estimators = trial.suggest_int("n_estimators", 50, 300)
            max_depth = trial.suggest_int("max_depth", 3, 10)
            learning_rate = trial.suggest_float("learning_rate", 0.01, 0.3)

            if problem_type == "classification":
                model = XGBClassifier(
                    n_estimators=n_estimators,
                    max_depth=max_depth,
                    learning_rate=learning_rate,
                    eval_metric="logloss"
                )
            else:
                model = XGBRegressor(
                    n_estimators=n_estimators,
                    max_depth=max_depth,
                    learning_rate=learning_rate
                )

        # -------------------------------
        # 🔥 LIGHTGBM
        # -------------------------------
        elif model_name == "lightgbm":

            n_estimators = trial.suggest_int("n_estimators", 50, 300)
            max_depth = trial.suggest_int("max_depth", 3, 10)
            learning_rate = trial.suggest_float("learning_rate", 0.01, 0.3)
            num_leaves = trial.suggest_int("num_leaves", 20, 100)

            if problem_type == "classification":
                model = LGBMClassifier(
                    n_estimators=n_estimators,
                    max_depth=max_depth,
                    learning_rate=learning_rate,
                    num_leaves=num_leaves,
                    verbose=-1
                )
            else:
                model = LGBMRegressor(
                    n_estimators=n_estimators,
                    max_depth=max_depth,
                    learning_rate=learning_rate,
                    num_leaves=num_leaves,
                    verbose=-1
                )

        # -------------------------------
        # 🔥 NEURAL NETWORK
        # -------------------------------
        elif model_name == "neural_network":

            epochs = trial.suggest_int("epochs", 20, 60)
            batch_size = trial.suggest_categorical("batch_size", [16, 32, 64])
            learning_rate = trial.suggest_float("learning_rate", 1e-4, 1e-2, log=True)
            dropout_rate = trial.suggest_float("dropout_rate", 0.0, 0.5)

            if problem_type == "classification":
                model = KerasClassifierWrapper(
                    input_dim=input_dim,
                    epochs=epochs,
                    batch_size=batch_size,
                    learning_rate=learning_rate,
                    dropout_rate=dropout_rate
                )
            else:
                model = KerasRegressorWrapper(
                    input_dim=input_dim,
                    epochs=epochs,
                    batch_size=batch_size,
                    learning_rate=learning_rate,
                    dropout_rate=dropout_rate
                )

        # -------------------------------
        # ERROR
        # -------------------------------
        else:
            raise ValueError(f"Model {model_name} not supported")

        # -------------------------------
        # EVALUATION
        # -------------------------------
        try:
            if problem_type == "classification":
                scores = cross_val_score(model, X_train, y_train, cv=3, scoring="accuracy")
                return scores.mean()
            else:
                scores = cross_val_score(model, X_train, y_train, cv=3, scoring="r2")
                return scores.mean()  # maximize R2


        except Exception as e:
            return float("-inf")  # avoid crash

    # -------------------------------
    # CREATE STUDY
    # -------------------------------
    study = optuna.create_study(direction="maximize")

    # -------------------------------
    # RUN OPTIMIZATION
    # -------------------------------
    study.optimize(objective, n_trials=5)

    # -------------------------------
    # RETURN BEST RESULTS
    # -------------------------------
    return study.best_params, study.best_value