import numpy as np


def get_feature_importance(model, feature_names):
    """
    Extract feature importance from trained model
    """

    try:
        # Tree-based models (RandomForest, XGBoost)
        if hasattr(model, "feature_importances_"):
            importance = model.feature_importances_

        # Linear models (Logistic Regression)
        elif hasattr(model, "coef_"):
            importance = np.abs(model.coef_).flatten()

        # Unsupported models (SVM, Neural Network)
        else:
            return None

        # Normalize importance
        importance = importance / np.sum(importance)

        # Map feature names
        feature_importance = {
            feature_names[i]: float(importance[i])
            for i in range(len(feature_names))
        }

        # Sort descending
        feature_importance = dict(
            sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)
        )

        return feature_importance

    except Exception:
        return None