from flask import jsonify, request # type: ignore
from bson import ObjectId # type: ignore

def register_routes(app, mongo):

    # 测试路由
    @app.route('/')
    def home():
        return jsonify(message="Hello, Flask and MongoDB!")

    # 批量添加卡片
    @app.route('/api/add_cards', methods=['POST'])
    def add_cards():
        cards_data = request.json
        # 检查 cards_data 是否是非空数组
        if not isinstance(cards_data, list) or len(cards_data) == 0:
            return jsonify(message="Invalid data format or empty list"), 400        
        print(f"Received cards data: {cards_data}")  # 打印数据检查
        
        # 批量插入数据
        mongo.db[app.config['COLLECTIONS']['CARDS']].insert_many(cards_data)
        return jsonify(message="Cards added"), 200


    # 获取所有卡片
    @app.route('/api/get_cards', methods=['GET'])
    def get_cards():
        # 获取所有卡片
        cards = list(mongo.db[app.config['COLLECTIONS']['CARDS']].find())
        for card in cards:
            # 将 ObjectId 转为字符串
            card["_id"] = str(card["_id"])  
        return jsonify(cards=cards)

    # 批量删除卡片
    @app.route('/api/delete_cards', methods=['DELETE'])
    def delete_cards():
        # 从请求中获取要删除的卡片 ID 列表
        card_ids = request.json.get("card_ids", [])
        # print("收到的card_ids:",card_ids)
        # 将 card_ids 转换为 ObjectId 类型
        card_ids = [ObjectId(card_id) for card_id in card_ids]

        # 批量删除卡片
        result = mongo.db[app.config['COLLECTIONS']['CARDS']].delete_many(
            {"_id": {"$in": card_ids}}
        )
        if result.deleted_count > 0:
            return jsonify(message=f"{result.deleted_count} card(s) deleted successfully"), 200
        else:
            return jsonify(message="No cards found to delete"), 404

    # 批量更新卡片
    @app.route('/api/update_cards', methods=['PATCH'])
    def update_cards():
        # 获取批量更新数据
        update_data = request.json
        card_ids = update_data.get("card_ids", [])
        update_fields = update_data.get("update_fields", {})

        if not card_ids or not update_fields:
            return jsonify(message="Missing card_ids or update_fields"), 400

        # 将 card_ids 转换为 ObjectId 类型
        card_ids = [ObjectId(card_id) for card_id in card_ids]

        # 批量更新卡片
        result = mongo.db[app.config['COLLECTIONS']['CARDS']].update_many(
            {"_id": {"$in": card_ids}},
            {"$set": update_fields}
        )

        if result.matched_count > 0:
            return jsonify(message=f"{result.matched_count} card(s) updated successfully"), 200
        else:
            return jsonify(message="No cards found to update"), 404

# 查询卡片
    @app.route('/api/find_cards', methods=['POST'])
    def find_cards():
        # 从请求中获取要删除的卡片 ID 列表
        card_ids = request.json.get("card_ids", [])
        # print("收到的card_ids:",card_ids)
                # 将 card_ids 转换为 ObjectId 类型
        card_ids = [ObjectId(card_id) for card_id in card_ids]
        # 批量查找卡片
        cards = list(mongo.db[app.config['COLLECTIONS']['CARDS']].find({"_id": {"$in": card_ids}}))
        if len(cards)>0:
            for card in cards:
                # 将 ObjectId 转为字符串
                card["_id"] = str(card["_id"])  
            return jsonify(cards=cards), 200
        else:
            return jsonify(message="No cards found to delete"), 404
