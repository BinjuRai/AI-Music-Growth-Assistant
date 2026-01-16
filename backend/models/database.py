# from typing import Any

# from pymongo import MongoClient

# from backend.config import config


# class MongoConnection:
#     """Singleton-style MongoDB connection helper."""

#     _client: MongoClient | None = None

#     @classmethod
#     def get_client(cls) -> MongoClient:
#         if cls._client is None:
#             cls._client = MongoClient(config.MONGO_URI)
#         return cls._client

#     @classmethod
#     def get_db(cls) -> Any:
#         client = cls.get_client()
#         return client[config.MONGO_DB_NAME]


from typing import Any, Optional

from pymongo import MongoClient

from config import config


class MongoConnection:
    """Singleton-style MongoDB connection helper."""

    _client: Optional[MongoClient] = None

    @classmethod
    def get_client(cls) -> MongoClient:
        if cls._client is None:
            cls._client = MongoClient(config.MONGO_URI)
        return cls._client

    @classmethod
    def get_db(cls) -> Any:
        client = cls.get_client()
        return client[config.MONGO_DB_NAME]
