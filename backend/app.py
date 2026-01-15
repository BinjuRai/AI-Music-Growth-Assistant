# from flask import Flask, jsonify
# from flask_cors import CORS

# # from backend.config import config
# # from backend.routes.analytics import analytics_bp
# # from backend.routes.artists import artists_bp
# from .config import config
# from .routes.analytics import analytics_bp

# def create_app() -> Flask:
#     app = Flask(__name__)
#     app.config["JSON_SORT_KEYS"] = False
#     CORS(app)

#     app.register_blueprint(artists_bp)
#     app.register_blueprint(analytics_bp)

#     @app.get("/api/health")
#     def health():
#         return jsonify({"status": "ok"})

#     return app


# if __name__ == "__main__":
#     app = create_app()
#     app.run(host="0.0.0.0", port=5000, debug=config.DEBUG)




from flask import Flask, jsonify
from flask_cors import CORS

from backend.config import config            # <- fully qualified
from .routes.analytics import analytics_bp  # <- relative import works
from .routes.artists import artists_bp  


def create_app() -> Flask:
    app = Flask(__name__)
    app.config["JSON_SORT_KEYS"] = False
    CORS(app)

    # Register Blueprints
    app.register_blueprint(artists_bp)
    app.register_blueprint(analytics_bp)

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"})

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5001, debug=config.DEBUG)
