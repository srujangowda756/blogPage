from sqlalchemy import Column,String,DateTime
from sqlalchemy.dialects.postgresql import UUID
from database import Base
import uuid
from datetime import datetime

class Blog(Base):
    __tablename__="blogs"

    id=Column(UUID,primary_key=True,default=uuid.uuid4)
    title=Column(String,nullable=False)
    content=Column(String,nullable=False)
    created_at= Column(DateTime,default=datetime.now())
