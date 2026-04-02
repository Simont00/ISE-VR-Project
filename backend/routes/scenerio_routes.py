from flask import Blueprint, request, jsonify
from backend.database.db import db
from backend.Models.scenerio_model import Scenerio

scenerio_bp = Blueprint("scenerio_bp", __name__)

# ➤ CREATE
@scenerio_bp.route("/", methods=["POST"])
def create_scenerio():
    try:
        data = request.get_json(silent=True)

        # ❌ Invalid JSON
        if not data:
            return jsonify({"error": "Invalid JSON format"}), 400

        # ❌ Missing fields
        if not data.get("title") or not data.get("steps"):
            return jsonify({"error": "Title and steps are required"}), 400

        # ❌ Steps must be list
        if not isinstance(data.get("steps"), list):
            return jsonify({"error": "Steps must be a list"}), 400

        steps = data.get("steps")

        # ✅ NEW: Steps Validation
        for index, step in enumerate(steps):

            # ❌ Step must be dict
            if not isinstance(step, dict):
                return jsonify({
                    "error": f"Step {index+1} must be an object"
                }), 400

            # ❌ Missing fields inside step
            if not step.get("question"):
                return jsonify({
                    "error": f"Step {index+1}: 'question' is required"
                }), 400

            if not step.get("options"):
                return jsonify({
                    "error": f"Step {index+1}: 'options' is required"
                }), 400

            if not isinstance(step.get("options"), list):
                return jsonify({
                    "error": f"Step {index+1}: 'options' must be a list"
                }), 400

            if not step.get("correct"):
                return jsonify({
                    "error": f"Step {index+1}: 'correct' is required"
                }), 400

            # ❌ Correct must be inside options
            if step.get("correct") not in step.get("options"):
                return jsonify({
                    "error": f"Step {index+1}: correct answer must be in options"
                }), 400

        # ✅ Create scenario
        new_scenerio = Scenerio(
            title=data.get("title"),
            description=data.get("description"),
            difficulty_level=data.get("difficulty_level"),
            steps=steps
        )

        db.session.add(new_scenerio)
        db.session.commit()

        return jsonify({"message": "Scenerio created"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ➤ GET ALL
@scenerio_bp.route("/", methods=["GET"])
def get_all_scenerios():
    scenerios = Scenerio.query.all()
    return jsonify([s.to_dict() for s in scenerios])


# ➤ GET BY ID
@scenerio_bp.route("/<int:id>", methods=["GET"])
def get_scenerio(id):
    scenerio = Scenerio.query.get(id)

    if not scenerio:
        return jsonify({"error": "Scenerio not found"}), 404

    return jsonify(scenerio.to_dict())


# ➤ UPDATE
@scenerio_bp.route("/<int:id>", methods=["PUT"])
def update_scenerio(id):
    scenerio = Scenerio.query.get(id)

    if not scenerio:
        return jsonify({"error": "Scenerio not found"}), 404

    data = request.get_json(silent=True)

    # ❌ Invalid JSON
    if not data:
        return jsonify({"error": "Invalid JSON format"}), 400

    # ✅ OPTIONAL: Validate steps if provided
    if "steps" in data:
        if not isinstance(data.get("steps"), list):
            return jsonify({"error": "Steps must be a list"}), 400

        for index, step in enumerate(data.get("steps")):

            if not isinstance(step, dict):
                return jsonify({"error": f"Step {index+1} must be an object"}), 400

            if not step.get("question"):
                return jsonify({"error": f"Step {index+1}: 'question' is required"}), 400

            if not step.get("options") or not isinstance(step.get("options"), list):
                return jsonify({"error": f"Step {index+1}: valid 'options' list required"}), 400

            if not step.get("correct"):
                return jsonify({"error": f"Step {index+1}: 'correct' is required"}), 400

            if step.get("correct") not in step.get("options"):
                return jsonify({
                    "error": f"Step {index+1}: correct answer must be in options"
                }), 400

    # ✅ Update fields
    scenerio.title = data.get("title", scenerio.title)
    scenerio.description = data.get("description", scenerio.description)
    scenerio.difficulty_level = data.get("difficulty_level", scenerio.difficulty_level)
    scenerio.steps = data.get("steps", scenerio.steps)

    db.session.commit()

    return jsonify({"message": "Updated successfully"})


# ➤ DELETE
@scenerio_bp.route("/<int:id>", methods=["DELETE"])
def delete_scenerio(id):
    scenerio = Scenerio.query.get(id)

    if not scenerio:
        return jsonify({"error": "Scenerio not found"}), 404

    db.session.delete(scenerio)
    db.session.commit()

    return jsonify({"message": "Deleted successfully"})