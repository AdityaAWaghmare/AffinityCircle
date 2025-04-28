# Imports
from db_connection import create_connection_pool
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import recommend

# loading environment variables
load_dotenv()

# Initialize the connection pool
connection_pool = create_connection_pool()

# Initialize Flask app
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
    try:
        user = int(user)
        success = recommend.recommend_friends(connection_pool, user)
        if success == 204:
            return jsonify({'message': 'No content to recommend'}), 204
        elif success == 500:
            return jsonify({'error': 'Error in recommendation process'}), 500
        return jsonify({'message': 'Recommendation process completed successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/recommend_groups', methods=['POST'])
def recommend_groups():
    data = request.get_json()
    user = data.get('user')
    if not user:
        return jsonify({'error': 'User is required'}), 400
    try:
        user = int(user)
        success = recommend.recommend_groups(connection_pool, user)
        if success == 204:
            return jsonify({'message': 'No content to recommend'}), 204
        elif success == 500:
            return jsonify({'error': 'Error in recommendation process'}), 500
        return jsonify({'message': 'Recommendation process completed successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/create_group', methods=['POST'])
def create_group():
    data = request.get_json()
    group_name = data.get('group_name')
    if not group_name:
        return jsonify({'error': 'Group name is required'}), 400
    try:
        success = recommend.create_new_group(connection_pool, group_name)
        if success == 500:
            return jsonify({'error': 'Error in creating group'}), 500
        return jsonify({'message': 'Group created successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True) # For testing purposes