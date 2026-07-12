from fastapi import FastAPI,Request,WebSocket
from fastapi.middleware.cors import CORSMiddleware
from routes.blog import router
from routes.user import route
from fastapi.responses import JSONResponse
import time
import logging
from features.manager_websocket import manager 


app = FastAPI()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_headers=["*"],
    allow_methods=["*"]
)


@app.websocket("/ws")
async def webSockets(websocket:WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except Exception:
        await manager.disconnect(websocket)


@app.middleware("http")
async def timing_middleware(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start
    logger.info(f"{request.method} {request.url.path} - {duration:.3f}s")
    return response

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc} on {request.method} {request.url.path}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

app.include_router(router)
app.include_router(route)

@app.get("/")
def home():
    return {"status": "working"}