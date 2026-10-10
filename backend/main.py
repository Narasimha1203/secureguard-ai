from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(
    title="SecureGuard AI API",
    description="Backend API for SecureGuard AI",
    version="1.0.0",
)

# Add your Vercel frontend URL to the FRONTEND_URL
frontend_url = os.getenv("FRONTEND_URL", "").rstrip("/")

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

if frontend_url:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
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