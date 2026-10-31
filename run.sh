#!/usr/bin/env bash
set -e

# Chronicle CMS Run Script
# Starts both the FastAPI Python Backend and the TypeScript Frontend

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

echo "=========================================="
echo "    Starting Chronicle CMS & Website      "
echo "=========================================="

# Check Python virtualenv
if [ ! -d "$BACKEND_DIR/.venv" ]; then
    echo "Creating Python virtualenv..."
    python3 -m venv "$BACKEND_DIR/.venv"
    source "$BACKEND_DIR/.venv/bin/activate"
    pip install -r "$BACKEND_DIR/requirements.txt"
else
    source "$BACKEND_DIR/.venv/bin/activate"
fi

# Ensure database is seeded
echo "Ensuring initial mock data is seeded..."
PYTHONPATH="$BACKEND_DIR" python3 "$BACKEND_DIR/seed_data.py"

# Function to clean up background processes on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# Start FastAPI backend
echo "Starting Python FastAPI backend on http://127.0.0.1:8000..."
cd "$BACKEND_DIR"
PYTHONPATH="$BACKEND_DIR" python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload &
BACKEND_PID=$!

# Start Vite React frontend
echo "Starting TypeScript frontend on http://localhost:3000..."
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "================================================================"
echo "🚀 Chronicle CMS is live!"
echo "   Public Website:     http://localhost:3000"
echo "   CMS Admin Studio:   http://localhost:3000/admin"
echo "   Swagger API Docs:   http://127.0.0.1:8000/docs"
echo "   ReDoc API:          http://127.0.0.1:8000/redoc"
echo ""
echo "🔐 Mock Demo Accounts:"
echo "   Admin:  username: admin  | password: admin123"
echo "   Editor: username: editor | password: editor123"
echo "================================================================"
echo "Press Ctrl+C to stop both servers."

wait
