#!/usr/bin/env bash

# exit on error
set -o errexit

echo "----> cd frontend/"
cd frontend/

echo "----> npm install --legacy-peer-deps"
npm install --legacy-peer-deps

echo "----> cd .."
cd ..

echo "----> pip install --upgrade pip"
pip install --upgrade pip

echo "----> pip install -r requirements.txt"
pip install --no-cache-dir -r requirements.txt

echo "----> python manage.py collectstatic --no-input"
python manage.py collectstatic --no-input

echo "----> python manage.py migrate"
python manage.py migrate
