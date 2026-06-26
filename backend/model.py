from sqlalchemy import Column,String,DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from database import Base
import uuid

class Blog(Base):
    __tablename__="blogs"

    id=Column(UUID(as_uuid=True),primary_key=True,default=uuid.uuid4)
    title=Column(String,nullable=False)
    content=Column(String,nullable=False)
    created_at= Column(DateTime(timezone=True),server_default=func.now())
