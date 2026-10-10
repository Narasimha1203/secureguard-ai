import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="SecureGuard AI API",
    description="Backend API for SecureGuard AI",
    version="1.0.1",
)

# Frontend domains allowed to call this backend
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://secureguard-ai-lake.vercel.app",
    "https://secureguard-ai-git-main-narasimha1203.vercel.app",
    "https://secureguard-35ych18ub-narasimha1203.vercel.app",
    "https://secureguard-3u08dybyn-narasimha1203.vercel.app",
]

# Optional production frontend URL from Render environment variables
frontend_url = os.getenv("FRONTEND_URL", "").strip().rstrip("/")

if frontend_url and frontend_url not in allowed_origins:
    allowed_origins.append(frontend_url)

# Configure CORS before handling requests
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