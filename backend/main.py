from fastapi import FastAPI
from schema import BlogInput
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_headers=["*"],
    allow_methods=["*"]
)

data=[{"id":"1","title":"first","content":"asdfghj","created_at":"23-05-2026"}]

@app.get("/")
def home():
    return {"status":"working"}

@app.post("/add-blog")
def add_blog(new_blog:BlogInput):
    temp={"id":new_blog.id,"title":new_blog.title,"content":new_blog.content,"created_at": datetime.now()}
    data.append(temp)
    return {"status":"ok"}

@app.get("/get-blogs")
def display_blogs():
    return data
