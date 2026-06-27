from fastapi import FastAPI,Depends
from schema import BlogInput,BlogResponse
from model import Blog
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from database import engine,Base,get_db
import uuid

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

@app.post("/add-blog")
def add_blog(new_blog:BlogInput,db:Session=Depends(get_db)):
    blog=Blog(title=new_blog.title,content=new_blog.content)
    db.add(blog)
    db.commit()
    db.refresh(blog)
    return {"status":"Blog added successfully"}

@app.get("/get-blogs",response_model=list[BlogResponse])
def display_blogs(skip:int=0,db:Session=Depends(get_db)):
    return db.query(Blog).offset(skip).limit(8).all()


@app.delete("/delete-blog/{blog_id}")
def delete_particular_blog(blog_id:uuid.UUID,db:Session=Depends(get_db)):
    deletingblog=db.query(Blog).filter(Blog.id==blog_id).first()
    db.delete(deletingblog)
    db.commit()
    #db.refresh(deletingblog)
    return {"status":"Blog deleted successfully"}

@app.put("/changecontent/{blog_id}")
def update_blog(blog_id:uuid.UUID,new_update:BlogInput,db:Session=Depends(get_db)):
    updating_blog=db.query(Blog).filter(Blog.id==blog_id).first()
    yield updating_blog
    updating_blog.title=new_update.title
    updating_blog.content=new_update.content

    db.commit()
    db.refresh(updating_blog)
    return {"status":"Update Successfully"}
    
