"""GHARELU.BAKE — placeholder FastAPI stub.

This repository will use Laravel + MySQL as its production backend. This file
only exists to keep the platform's supervisor process healthy and expose a
simple health check. All real API endpoints will be implemented in Laravel.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="GHARELU.BAKE — placeholder")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health():
    return {"ok": True, "service": "placeholder", "note": "Laravel backend pending"}
