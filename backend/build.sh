#!/usr/bin/env bash
set -e  # exit on first error

# Pick the best python executable we can find.
PYTHON=python3.11         # try the Home-brew install first
command -v $PYTHON >/dev/null 2>&1 || PYTHON=python3  # fall back

echo "Using $PYTHON"

echo "Creating virtual environment..."
$PYTHON -m venv backend/.venv

echo "Activating virtual environment..."
source backend/.venv/bin/activate

echo "Installing Python deps..."
pip install --upgrade pip
pip install -r backend/requirements.txt

echo "Installing Node deps for backend..."
npm install --prefix backend

echo "✅  Python and Node dependencies installed."
