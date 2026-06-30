from fastapi import APIRouter,Depends,HTTPException
from schema.blog import BlogInput,BlogResponse
from model.blog import Blog
from sqlalchemy.orm import Session
from database import get_db
import uuid

router=APIRouter(prefix="/blogs",tags=["blogs"])

@router.post("/",status_code=201)
def add_blog(new_blog:BlogInput,db:Session=Depends(get_db)):
    blog=Blog(title=new_blog.title,content=new_blog.content)
    db.add(blog)
    db.commit()
    db.refresh(blog)
    return {"status":"Blog added successfully"}

@router.get("/",response_model=list[BlogResponse])
def display_blogs(skip:int=0,db:Session=Depends(get_db)):
    return db.query(Blog).order_by(Blog.created_at.asc()).offset(skip).limit(8).all()


@router.delete("/{blog_id}",status_code=204)
def delete_particular_blog(blog_id:uuid.UUID,db:Session=Depends(get_db)):
    deletingblog=db.query(Blog).filter(Blog.id==blog_id).first()
    if not deletingblog:
        raise HTTPException(status_code=404, detail="Blog not found")
    db.delete(deletingblog)
    db.commit()

@router.put("/{blog_id}")
def update_blog(blog_id:uuid.UUID,new_update:BlogInput,db:Session=Depends(get_db)):
    updating_blog=db.query(Blog).filter(Blog.id==blog_id).first()
    if not updating_blog:
        raise HTTPException(status_code=404,detail="Blog not found")
    updating_blog.title=new_update.title
    updating_blog.content=new_update.content
    db.commit()
    db.refresh(updating_blog)
    return {"status":"Update Successfully"}