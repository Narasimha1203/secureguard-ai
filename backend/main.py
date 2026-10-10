from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(
    title="SecureGuard AI API",
    description="Backend API for SecureGuard AI",
    version="1.0.0",
)

# Allowed frontend addresses
frontend_url = os.getenv("FRONTEND_URL", "").strip().rstrip("/")

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://secureguard-3u08dybyn-narasimha1203.vercel.app",
]

if frontend_url and frontend_url not in allowed_origins:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "app": "SecureGuard AI",
        "status": "running",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }