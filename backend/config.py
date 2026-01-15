import os


class Config:
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    MONGO_DB_NAME: str = os.getenv("MONGO_DB_NAME", "artist_growth_assistant")
    DEBUG: bool = os.getenv("FLASK_DEBUG", "1") == "1"


config = Config()

