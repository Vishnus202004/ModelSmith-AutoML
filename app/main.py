from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv  # 🔥 ADD THIS
import os

# 🔥 LOAD ENV VARIABLES
load_dotenv()

from app.routes import router


app = FastAPI(
    title="MSMITH AutoML API",
    description="LLM-Powered Autonomous AutoML System",
    version="1.0.0"
)

# 🔥 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Welcome to MSMITH AutoML 🚀"
    }

app.include_router(router)