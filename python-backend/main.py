from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import router
from config import settings

app = FastAPI(
    title="Smart Harbor Multi-Agent Logistics API",
    description="Professional modular microservice orchestrating LLM agents.",
    version="1.0.0"
)

# CORS Setup: Allows requests from other origins (such as the Express gateway)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes modularly
app.include_router(router)

@app.get("/")
def read_root():
    return {"message": "Smart Harbor Python Backend is running."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
