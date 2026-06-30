from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine,Base
from routes.blog import router


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://blog-page-seven-rho.vercel.app"],
    allow_headers=["*"],
    allow_methods=["*"]
)

Base.metadata.create_all(bind=engine)
app.include_router(router)

@app.get("/")
def home():
    return {"status":"working"}
