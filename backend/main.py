from fastapi import FastAPI,Depends
from schema import BlogInput,BlogResponse
from model import Blog
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from database import engine,Base,get_db


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_headers=["*"],
    allow_methods=["*"]
)

Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"status":"working"}

@app.post("/add-blog",response_model=BlogResponse)
def add_blog(new_blog:BlogInput,db:Session=Depends(get_db)):
    blog=Blog(title=new_blog.title,content=new_blog.content)
    db.add(blog)
    db.commit()
    db.refresh(blog)
    return blog

@app.get("/get-blogs",response_model=list[BlogResponse])
def display_blogs(skip:int=0,db:Session=Depends(get_db)):
    return db.query(Blog).offset(skip).limit(10).all()
