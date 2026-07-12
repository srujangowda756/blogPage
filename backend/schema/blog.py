from pydantic import BaseModel
from datetime import datetime
import uuid

class BlogBase(BaseModel):
    title:str
    content:str

class BlogInput(BlogBase):
    pass

class AuthorInfo(BaseModel):
    email:str 
    model_config={"from_attributes":True}

class BlogResponse(BlogBase):
    id: uuid.UUID
    created_at: datetime
    author : AuthorInfo

    model_config={"from_attributes":True}