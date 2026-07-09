from fastapi import APIRouter,Depends,HTTPException
from schema.user import UserInput,UserResponse
from model.user import User
from database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select
from utlity import verify_password,hash_password
from auth import create_access_token


route=APIRouter(prefix="/user",tags=["user"])

@route.post("/register",status_code=201,response_model=UserResponse)
async def user_register(registeringUser:UserInput,db:AsyncSession=Depends(get_db)):
    new_hashed_password=hash_password(registeringUser.password)
    new_user=User(email=registeringUser.email,password=new_hashed_password)
    try:
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
    except IntegrityError:
        raise HTTPException(status_code=400,detail="user already exists")
    return new_user

@route.post("/login")
async def user_login(loggingUser:UserInput,db:AsyncSession=Depends(get_db)):
    result=await db.execute(select(User).filter(User.email==loggingUser.email))
    existing_user_details=result.scalars().first()
    if not existing_user_details:
        raise HTTPException(status_code=401,detail="wrong credntials")
    login=verify_password(loggingUser.password,existing_user_details.password)
    if login:
        return {"access_token": create_access_token({"sub": loggingUser.email}), "token_type": "bearer"}
    else:
        raise HTTPException(status_code=401,detail="wrong credentials")
