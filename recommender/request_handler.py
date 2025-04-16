from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return jsonify({'status': 'ok'}), 200

@app.route('/recommend_users', methods=['POST'])
def recommend_users():
    data = request.get_json()
    user = data.get('user')
    # Simulate a recommendation process
    recommended_users = [f"User{i}" for i in range(1, 6)]
    return jsonify({'recommended_users': recommended_users}), 200

if __name__ == '__main__':
    app.run(debug=True)