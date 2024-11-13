# config.py
import os

class Config:
    MONGO_URI = "mongodb://localhost:27017/card_game"
    # 定义集合名称
    COLLECTIONS = {
        'CARDS': 'cards',
        'USERS': 'users',
        'DECKS': 'decks',
        'GAME_RECORDS': 'game_records'
    }