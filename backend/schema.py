from pydantic import BaseModel

class BlogInput(BaseModel):
    id:str
    title:str
    content:str