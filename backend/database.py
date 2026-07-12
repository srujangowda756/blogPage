from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from features.config import settings
import ssl

DATABASE_URL = settings.DATABASE_URL

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is not set.")

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
elif DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

if "sslmode" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.split("?")[0]
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    connect_args = {"ssl": ssl_context}
else:
    connect_args = {}

engine = create_async_engine(DATABASE_URL, connect_args=connect_args)
Async_sessionLocal = async_sessionmaker(
    autocommit=False,
    class_=AsyncSession,
    autoflush=False,
    bind=engine,
    expire_on_commit=False
)
Base = declarative_base()

async def get_db():
    async with Async_sessionLocal() as db:
        yield db