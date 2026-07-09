from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from schema.blog import BlogInput,BlogResponse
from model.blog import Blog
from model.user import User
from database import get_db
from sqlalchemy import select
from auth import get_current_user
import uuid

router=APIRouter(prefix="/blogs",tags=["blogs"])

@router.post("/",status_code=201)
async def add_blog(new_blog:BlogInput,db:AsyncSession=Depends(get_db),current_user:dict=Depends(get_current_user)):
    user_details=await db.execute(select(User).filter(User.email==current_user["sub"]))
    user_details=user_details.scalars().first()
    if not user_details:
        raise HTTPException(status_code=404, detail="User not found")

    blog=Blog(title=new_blog.title,content=new_blog.content,user_id=user_details.id)
    try:
        db.add(blog)
        await db.commit()
        await db.refresh(blog)
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(status_code=400, detail="A blog with this title already exists") from exc

    return blog

@router.get("/",response_model=list[BlogResponse])
async def display_blogs(skip:int=0,limit:int=6,db:AsyncSession=Depends(get_db)):
    all_blogs= await db.execute(select(Blog).order_by(Blog.created_at.asc()).offset(skip).limit(limit))
    return all_blogs.scalars().all()


@router.get("/{blog_id}",response_model=BlogResponse)
async def display_particular_blog(blog_id:uuid.UUID,db:AsyncSession=Depends(get_db)):
    result= await db.execute(select(Blog).filter(Blog.id==blog_id))
    blog = result.scalars().first()

    if not blog:
        raise HTTPException(status_code=404,detail="Blog not found")
    return blog

@router.delete("/{blog_id}",status_code=204)
async def delete_particular_blog(blog_id:uuid.UUID,db:AsyncSession=Depends(get_db),current_user:dict=Depends(get_current_user)):
    this_user=await db.execute(select(User).filter(current_user["sub"]==User.email))
    this_user=this_user.scalars().first()
    if not this_user:
        raise HTTPException(status_code=403,detail="Login first")
    deletingblog=await db.execute(select(Blog).filter(Blog.id==blog_id))
    deletingblog=deletingblog.scalars().first()
    if not deletingblog:
        raise HTTPException(status_code=404, detail="Blog not found")
    if this_user.id==deletingblog.user_id:
        await db.delete(deletingblog)
        await db.commit()
    else:
        raise HTTPException(status_code=403,detail="You cant do this")

@router.put("/{blog_id}",response_model=BlogResponse)
async def update_blog(blog_id:uuid.UUID,new_update:BlogInput,db:AsyncSession=Depends(get_db),current_user:dict=Depends(get_current_user)):
    this_user=await db.execute(select(User).filter(User.email==current_user["sub"]))
    this_user=this_user.scalars().first()
    if not this_user:
        raise HTTPException(status_code=403,detail="Login first")
    result=await db.execute(select(Blog).filter(Blog.id==blog_id))
    updating_blog=result.scalars().first()   
    if not updating_blog:
        raise HTTPException(status_code=404,detail="Blog not found")  
    if this_user.id==updating_blog.user_id:
        updating_blog.title=new_update.title
        updating_blog.content=new_update.content
        await db.commit()
        await db.refresh(updating_blog)
        return updating_blog
    else:
        raise HTTPException(status_code=403,detail="You cant do this")