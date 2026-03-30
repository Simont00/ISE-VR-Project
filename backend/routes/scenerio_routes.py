from flask import Blueprint, request, jsonify
from Models.scenario_model import db, Scenario

scenario_bp = Blueprint('scenario', __name__, url_prefix='/scenarios')

@scenario_bp.route('/', methods=['POST'])
def create_scenario():
    data = request.get_json()
    scenario = Scenario(
        title=data['title'],
        description=data['description'],
        difficulty_level=data['difficulty_level'],
        skills_targeted=data.get('skills_targeted')
    )
    db.session.add(scenario)
    db.session.commit()
    return jsonify(scenario.to_dict()), 201

@scenario_bp.route('/', methods=['GET'])
def get_scenarios():
    scenarios = Scenario.query.all()
    return jsonify([s.to_dict() for s in scenarios])
