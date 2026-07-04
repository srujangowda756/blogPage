from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from schema.blog import BlogInput,BlogResponse
from model.blog import Blog
from database import get_db
from sqlalchemy import select
import uuid

router=APIRouter(prefix="/blogs",tags=["blogs"])

@router.post("/",status_code=201)
async def add_blog(new_blog:BlogInput,db:AsyncSession=Depends(get_db)):
    blog=Blog(title=new_blog.title,content=new_blog.content)
    db.add(blog)
    await db.commit()
    await db.refresh(blog)
    return {"status":"Blog added successfully"}

@router.get("/",response_model=list[BlogResponse])
async def display_blogs(skip:int=0,db:AsyncSession=Depends(get_db)):
    all_blogs= await db.execute(select(Blog).order_by(Blog.created_at.asc()).offset(skip).limit(8))
    return all_blogs.scalars().all()


@router.get("/{blog_id}",response_model=BlogResponse)
async def display_particular_blog(blog_id:uuid.UUID,db:AsyncSession=Depends(get_db)):
    result= await db.execute(select(Blog).filter(Blog.id==blog_id))
    blog = result.scalars().first()
    if not blog:
        raise HTTPException(status_code=404,detail="Blog not found")
    return blog

@router.delete("/{blog_id}",status_code=204)
async def delete_particular_blog(blog_id:uuid.UUID,db:AsyncSession=Depends(get_db)):
    deletingblog=await db.execute(select(Blog).filter(Blog.id==blog_id))
    deletingblog=deletingblog.scalars().first()
    if not deletingblog:
        raise HTTPException(status_code=404, detail="Blog not found")
    await db.delete(deletingblog)
    await db.commit()
    return {"status":"Delete Successfully"}

@router.put("/{blog_id}")
async def update_blog(blog_id:uuid.UUID,new_update:BlogInput,db:AsyncSession=Depends(get_db)):
    result=await db.execute(select(Blog).filter(Blog.id==blog_id))
    updating_blog=result.scalars().first()   
    if not updating_blog:
        raise HTTPException(status_code=404,detail="Blog not found")
    updating_blog.title=new_update.title
    updating_blog.content=new_update.content
    await db.commit()
    await db.refresh(updating_blog)
    return {"status":"Update Successfully"}