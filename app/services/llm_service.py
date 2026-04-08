import os
import json
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_explanation(data):
    try:
        prompt = f"""You are an expert data scientist.

Given the AutoML results:
Best Model: {data['best_model']}
Score: {data['score']}
Feature Importance: {data['feature_importance']}

Explain:
1. Why this model performed best
2. Key insights from the features
3. Any recommendations
4. give the full code to train the this model of sklearn with the best parameters and the preprocessor used in the training.

Keep it simple and professional.
"""

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        content = response.choices[0].message.content

        # 🔥 PARSE JSON SAFELY
        try:
            parsed = json.loads(content)
            explanation = parsed.get("explanation", "")
            code = parsed.get("code", "")
        except Exception:
            # fallback if LLM messes up
            explanation = content
            code = ""

        return {
            "explanation": explanation,
            "code": code
        }

    except Exception as e:
        return {
            "explanation": f"LLM Error: {str(e)}",
            "code": ""
        }