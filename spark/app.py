from flask import Flask, jsonify, request, session, redirect, url_for
import sqlite3
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user

app = Flask(__name__)
app.secret_key = 'a_random_string_with_numbers_1234567890_and_symbols_!@#$%^&*()'  # Replace with your actual secret key
CORS(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# User class for flask-login
class User(UserMixin):
    def __init__(self, id, username):
        self.id = id
        self.username = username

@login_manager.user_loader
def load_user(user_id):
    conn = sqlite3.connect('supply_chain.db')
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = c.fetchone()
    conn.close()
    if user:
        return User(user[0], user[1])
    return None

@app.route('/')
def home():
    return "Welcome to the Real-Time Supply Chain Visibility API!"

@app.route('/register', methods=['POST'])
def register():
    conn = sqlite3.connect('supply_chain.db')
    c = conn.cursor()

    username = request.json.get('username')
    password = request.json.get('password')
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    try:
        c.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed_password))
        conn.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username already exists"}), 400
    finally:
        conn.close()

@app.route('/login', methods=['POST'])
def login():
    conn = sqlite3.connect('supply_chain.db')
    c = conn.cursor()

    username = request.json.get('username')
    password = request.json.get('password')

    c.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = c.fetchone()
    conn.close()

    if user and bcrypt.check_password_hash(user[2], password):
        login_user(User(user[0], user[1]))
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"error": "Invalid username or password"}), 401

@app.route('/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200

# Example protected route
@app.route('/protected', methods=['GET'])
@login_required
def protected():
    return jsonify({"message": f"Hello, {current_user.username}!"})

# Shipment API endpoints

@app.route('/api/shipments', methods=['GET'])
def get_shipments():
    conn = sqlite3.connect('supply_chain.db')
    c = conn.cursor()
    c.execute("SELECT * FROM shipments")
    shipments = c.fetchall()
    conn.close()

    shipment_list = []
    for shipment in shipments:
        shipment_data = {
            "id": shipment[0],
            "shipment_id": shipment[1],
            "origin": shipment[2],
            "destination": shipment[3],
            "current_location": shipment[4],
            "status": shipment[5],
            "eta": shipment[6]
        }
        shipment_list.append(shipment_data)

    return jsonify(shipment_list)

@app.route('/api/shipments/<int:shipment_id>', methods=['GET'])
def get_shipment(shipment_id):
    conn = sqlite3.connect('supply_chain.db')
    c = conn.cursor()
    c.execute("SELECT * FROM shipments WHERE id = ?", (shipment_id,))
    shipment = c.fetchone()
    conn.close()

    if shipment:
        shipment_data = {
            "id": shipment[0],
            "shipment_id": shipment[1],
            "origin": shipment[2],
            "destination": shipment[3],
            "current_location": shipment[4],
            "status": shipment[5],
            "eta": shipment[6]
        }
        return jsonify(shipment_data)
    else:
        return jsonify({"error": "Shipment not found"}), 404

@app.route('/api/shipments', methods=['POST'])
def add_shipment():
    conn = sqlite3.connect('supply_chain.db')
    c = conn.cursor()

    new_shipment = request.json
    c.execute('''
        INSERT INTO shipments (shipment_id, origin, destination, current_location, status, eta)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        new_shipment['shipment_id'],
        new_shipment['origin'],
        new_shipment['destination'],
        new_shipment.get('current_location', ''),
        new_shipment['status'],
        new_shipment.get('eta', '')
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Shipment added successfully"}), 201

@app.route('/api/shipments/<int:shipment_id>', methods=['PUT'])
def update_shipment(shipment_id):
    conn = sqlite3.connect('supply_chain.db')
    c = conn.cursor()

    new_status = request.json.get('status')
    new_location = request.json.get('current_location')
    new_eta = request.json.get('eta')

    c.execute("UPDATE shipments SET status = ?, current_location = ?, eta = ? WHERE id = ?",
              (new_status, new_location, new_eta, shipment_id))
    conn.commit()
    conn.close()

    return jsonify({"message": "Shipment updated successfully"})

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True)
