# app.py
from flask import Flask, jsonify, request # type: ignore
from flask_pymongo import PyMongo # type: ignore
from config import Config
from flask_cors import CORS  # type: ignore # 添加这行

app = Flask(__name__)
CORS(app)  # 数据跨域
app.config.from_object(Config)

mongo = PyMongo(app)

# 测试路由
@app.route('/')
def home():
    return jsonify(message="Hello, Flask and MongoDB!")

# ... 现有的导入语句 ...

@app.route('/add_cards', methods=['POST'])
def add_card():
    card_data = request.json
    # 使用配置中定义的集合名称
    mongo.db[Config.COLLECTIONS['CARDS']].insert_one(card_data)
    return jsonify(message="card added"), 201

@app.route('/get_cards', methods=['GET'])
def get_cards():
    # 使用配置中定义的集合名称
    cards = list(mongo.db[Config.COLLECTIONS['CARDS']].find())
    for card in cards:
        card["_id"] = str(card["_id"])
    return jsonify(cards=cards)

if __name__ == '__main__':
    app.run(debug=True)
