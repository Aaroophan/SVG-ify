#!/usr/bin/env bash
cd server
uvicorn main:app --host 0.0.0.0 --port $PORT 