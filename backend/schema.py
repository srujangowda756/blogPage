from pydantic import BaseModel
from datetime import datetime
import uuid

class BlogInput(BaseModel):
    title:str
    content:str


class BlogResponse(BlogInput):
    id: uuid.UUID
    created_at: datetime

    # class Config:
    #     from_attributes = True