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


# 删除卡片
@app.route('/delete_card/<card_id>', methods=['DELETE'])
def delete_card(card_id):
    # 删除指定 ID 的卡片
    result = mongo.db[Config.COLLECTIONS['CARDS']].delete_one({'_id': mongo.db.ObjectId(card_id)})
    
    if result.deleted_count == 1:
        return jsonify(message="Card deleted successfully"), 200
    else:
        return jsonify(message="Card not found"), 404
    
# 更新卡片的部分信息
@app.route('/update_card/<card_id>', methods=['PATCH'])
def update_card(card_id):
    update_data = request.json
    # 查找并更新指定卡片的部分信息
    result = mongo.db[Config.COLLECTIONS['CARDS']].update_one(
        {'_id': mongo.db.ObjectId(card_id)},
        {'$set': update_data}  # 只更新传入的数据字段
    )

    if result.matched_count == 1:
        return jsonify(message="Card updated successfully"), 200
    else:
        return jsonify(message="Card not found"), 404
    
    
if __name__ == '__main__':
    app.run(debug=True)
