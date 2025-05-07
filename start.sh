#!/usr/bin/env bash
# Run from project root directory
uvicorn server.main:app --host 0.0.0.0 --port $PORT 