from flask import Flask, request, jsonify

import recommend

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return jsonify({'status': 'ok'}), 200

@app.route('/recommend_users', methods=['POST'])
def recommend_users():
    data = request.get_json()
    user = data.get('user')
    if not user:
        return jsonify({'error': 'User is required'}), 400
    # Simulate a recommendation process
    recommended_users = recommend.recommend_friends(user)
    return jsonify({'recommended_users': recommended_users}), 200

@app.route('/recommend_groups', methods=['POST'])
def recommend_groups():
    data = request.get_json()
    user = data.get('user')
    if not user:
        return jsonify({'error': 'User is required'}), 400
    # Simulate a recommendation process
    recommended_groups = recommend.recommend_groups(user)
    return jsonify({'recommended_groups': recommended_groups}), 200

@app.route('/create_group', methods=['POST'])
def create_group():
    data = request.get_json()
    group_name = data.get('group_name')
    if not group_name:
        return jsonify({'error': 'Group name is required'}), 400
    # Simulate group creation
    
if __name__ == '__main__':
    app.run(debug=True)
