import fakeredis.aioredis
import json

redis = fakeredis.aioredis.FakeRedis()

async def get_cache(key: str):
    data = await redis.get(key)
    if data:
        return json.loads(data)
    return None

async def set_cache(key: str, value, ttl: int = 0.1):
    await redis.set(key, json.dumps(value), ex=ttl)