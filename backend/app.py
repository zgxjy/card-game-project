from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
from config import Config

# 初始化应用和配置
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000", "methods": ["GET", "POST", "DELETE", "PATCH", "PUT"]}})
app.config.from_object(Config)
mongo = PyMongo(app)

# 将 mongo 实例传递给 API 路由
from api import register_routes
register_routes(app, mongo)

if __name__ == '__main__':
    app.run(debug=True)
