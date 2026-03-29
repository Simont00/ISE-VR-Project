from flask import Blueprint, jsonify
from backend.models.scenario_model import Scenario, db

scenario_bp = Blueprint('scenario_bp', __name__)

@scenario_bp.route('/')
def get_scenarios():
    scenarios = Scenario.query.all()
    data = [{"id": s.id, "name": s.name, "description": s.description} for s in scenarios]
    return jsonify(data)