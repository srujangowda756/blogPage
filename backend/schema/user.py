from pydantic import BaseModel
import uuid
from datetime import datetime

class UserBase(BaseModel):
    email:str

class UserInput(UserBase):
    password:str 

class UserResponse(UserBase):
    id:uuid.UUID
    created_at:datetime

    model_config={"from_attributes":True}