from flask import Blueprint, request, jsonify
from backend.database.db import db
from backend.Models.scenerio_model import Scenerio

scenerio_bp = Blueprint("scenerio_bp", __name__)

# ➤ CREATE
@scenerio_bp.route("/scenerio", methods=["POST"])
def create_scenerio():
    try:
        data = request.get_json()

        new_scenerio = Scenerio(
            title=data.get("title"),
            description=data.get("description"),
            difficulty_level=data.get("difficulty_level")
        )

        db.session.add(new_scenerio)
        db.session.commit()

        return jsonify({"message": "Scenerio created"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ➤ GET ALL
@scenerio_bp.route("/scenerio", methods=["GET"])
def get_all_scenerios():
    scenerios = Scenerio.query.all()
    return jsonify([s.to_dict() for s in scenerios])


# ➤ GET BY ID
@scenerio_bp.route("/scenerio/<int:id>", methods=["GET"])
def get_scenerio(id):
    scenerio = Scenerio.query.get(id)

    if not scenerio:
        return jsonify({"error": "Not found"}), 404

    return jsonify(scenerio.to_dict())


# ➤ UPDATE
@scenerio_bp.route("/scenerio/<int:id>", methods=["PUT"])
def update_scenerio(id):
    scenerio = Scenerio.query.get(id)

    if not scenerio:
        return jsonify({"error": "Not found"}), 404

    data = request.get_json()

    scenerio.title = data.get("title", scenerio.title)
    scenerio.description = data.get("description", scenerio.description)
    scenerio.difficulty_level = data.get("difficulty_level", scenerio.difficulty_level)

    db.session.commit()

    return jsonify({"message": "Updated successfully"})


# ➤ DELETE
@scenerio_bp.route("/scenerio/<int:id>", methods=["DELETE"])
def delete_scenerio(id):
    scenerio = Scenerio.query.get(id)

    if not scenerio:
        return jsonify({"error": "Not found"}), 404

    db.session.delete(scenerio)
    db.session.commit()

    return jsonify({"message": "Deleted successfully"})