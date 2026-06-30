from pydantic import BaseModel
from datetime import datetime
import uuid

class BlogBase(BaseModel):
    title:str
    content:str

class BlogInput(BlogBase):
    pass

class BlogResponse(BlogBase):
    id: uuid.UUID
    created_at: datetime

    model_config={"from_attributes":True}