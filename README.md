# Smart Harbor

Smart Harbor is a multi-agent logistics assistant designed to log shipping manifests, track cargo routes, and analyze operational disruptions. 

It uses a multi-agent AI system to calculate disruption severity, recommend alternative paths, and draft notice communications for clients and carriers.

## Project Preview

![Smart Harbor Live Dashboard](./giphy.mp4)

## Project Structure

The project is structured as a monorepo containing three main components:

* **frontend**: A React application built with Vite and Tailwind CSS.
* **node-backend**: An Express API gateway that handles authentication (JWT stored in HttpOnly cookies), analytics, and route security.
* **python-backend**: A FastAPI service running a LangGraph workflow that orchestrates the AI researcher, router, and communicator agents.

## Getting Started

Make sure you have Node.js and Python installed locally, and set up your `.env` variables using the `.env.example` templates in the respective backend folders.

### 1. Express Gateway (Port 5000)
```bash
cd node-backend
npm install
npm run dev
```

### 2. Python AI Service (Port 8000)
```bash
cd python-backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Frontend Client (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
