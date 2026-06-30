from sqlalchemy import Column,String,DateTime
from sqlalchemy.dialects.postgresql import UUID
from database import Base
import uuid
from datetime import datetime, timezone

class Blog(Base):
    __tablename__="blogs"

    id=Column(UUID,primary_key=True,default=uuid.uuid4)
    title=Column(String,nullable=False,unique=True)
    content=Column(String,nullable=False)
    created_at= Column(DateTime,default=lambda: datetime.now(timezone.utc))
