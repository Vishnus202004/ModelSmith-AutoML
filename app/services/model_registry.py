from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.svm import SVC, SVR
from xgboost import XGBClassifier, XGBRegressor
from lightgbm import LGBMClassifier, LGBMRegressor

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization, Input
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping

from sklearn.base import BaseEstimator
import numpy as np


# -------------------------------
# 🔥 KERAS CLASSIFIER WRAPPER
# -------------------------------
class KerasClassifierWrapper(BaseEstimator):
    def __init__(self, input_dim, epochs=100, batch_size=32, learning_rate=0.001, dropout_rate=0.2):
        self.input_dim = input_dim
        self.epochs = epochs
        self.batch_size = batch_size
        self.learning_rate = learning_rate
        self.dropout_rate = dropout_rate
        self.model = None

    def build_model(self):
        model = Sequential([
            Input(shape=(self.input_dim,)),
            Dense(64, activation="relu"),
            BatchNormalization(),
            Dropout(self.dropout_rate),
            Dense(32, activation="relu"),
            BatchNormalization(),
            Dropout(self.dropout_rate),
            Dense(1, activation="sigmoid")
        ])

        model.compile(
            optimizer=Adam(learning_rate=self.learning_rate),
            loss="binary_crossentropy",
            metrics=["accuracy"]
        )

        return model

    def fit(self, X, y):
        self.model = self.build_model()
        early_stopping = EarlyStopping(monitor="loss", patience=10, restore_best_weights=True)
        self.model.fit(
            X, y,
            epochs=self.epochs,
            batch_size=self.batch_size,
            callbacks=[early_stopping],
            verbose=0
        )
        return self  # IMPORTANT for sklearn compatibility

    def predict(self, X):
        preds = self.model.predict(X, verbose=0)
        return np.round(preds).astype(int).ravel()

    def get_params(self, deep=True):
        return {
            "input_dim": self.input_dim,
            "epochs": self.epochs,
            "batch_size": self.batch_size,
            "learning_rate": self.learning_rate,
            "dropout_rate": self.dropout_rate
        }

    def set_params(self, **params):
        for key, value in params.items():
            setattr(self, key, value)
        return self


# -------------------------------
# 🔥 KERAS REGRESSOR WRAPPER
# -------------------------------
class KerasRegressorWrapper(BaseEstimator):
    def __init__(self, input_dim, epochs=100, batch_size=32, learning_rate=0.001, dropout_rate=0.2):
        self.input_dim = input_dim
        self.epochs = epochs
        self.batch_size = batch_size
        self.learning_rate = learning_rate
        self.dropout_rate = dropout_rate
        self.model = None

    def build_model(self):
        model = Sequential([
            Input(shape=(self.input_dim,)),
            Dense(64, activation="relu"),
            BatchNormalization(),
            Dropout(self.dropout_rate),
            Dense(32, activation="relu"),
            BatchNormalization(),
            Dropout(self.dropout_rate),
            Dense(1)
        ])

        model.compile(
            optimizer=Adam(learning_rate=self.learning_rate),
            loss="mse"
        )

        return model

    def fit(self, X, y):
        self.model = self.build_model()
        early_stopping = EarlyStopping(monitor="loss", patience=10, restore_best_weights=True)
        self.model.fit(
            X, y,
            epochs=self.epochs,
            batch_size=self.batch_size,
            callbacks=[early_stopping],
            verbose=0
        )
        return self

    def predict(self, X):
        return self.model.predict(X, verbose=0).ravel()

    def get_params(self, deep=True):
        return {
            "input_dim": self.input_dim,
            "epochs": self.epochs,
            "batch_size": self.batch_size,
            "learning_rate": self.learning_rate,
            "dropout_rate": self.dropout_rate
        }

    def set_params(self, **params):
        for key, value in params.items():
            setattr(self, key, value)
        return self


# -------------------------------
# 🔥 MODEL REGISTRY
# -------------------------------
def get_models(problem_type, input_dim):

    if input_dim is None:
        raise ValueError("input_dim must be provided for neural network")

    if problem_type == "classification":
        return {
            "logistic_regression": LogisticRegression(max_iter=1000),
            "random_forest": RandomForestClassifier(),
            "svm": SVC(),
            "xgboost": XGBClassifier(eval_metric="logloss"),
            "lightgbm": LGBMClassifier(),

            # 🔥 Neural Network
            "neural_network": KerasClassifierWrapper(input_dim=input_dim)
        }

    else:
        return {
            "random_forest": RandomForestRegressor(),
            "svm": SVR(),
            "xgboost": XGBRegressor(),
            "lightgbm": LGBMRegressor(),

            # 🔥 Neural Network
            "neural_network": KerasRegressorWrapper(input_dim=input_dim)
        }