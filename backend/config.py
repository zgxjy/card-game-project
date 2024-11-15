# config.py
import os

class Config:
    # 连接数据库
    MONGO_URI = "mongodb://localhost:27017/card_game"
    # 定义集合名称
    COLLECTIONS = {
        'CARDS': 'cards',
        'USERS': 'users',
        'DECKS': 'decks',
        'GAME_RECORDS': 'game_records'
    }
    # 定义集合的唯一标识符
    COLLECTIONS_ID = {
        'CARDS': 'card_id',
        'USERS': 'user_id',
        'DECKS': 'deck_id',
        'GAME_RECORDS': 'record_id'
    }