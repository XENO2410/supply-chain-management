from flask import Flask, jsonify, request, redirect, url_for, send_from_directory, Response, send_file
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import pickle
import io

app = Flask(__name__, static_folder='supply-chain-visibility-frontend/build')
app.secret_key = 'a_random_string_with_numbers_1234567890_and_symbols_!@#$%^&*()'
CORS(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# Database connection setup
def get_db_connection():
    conn = psycopg2.connect(
        host="aws-0-ap-south-1.pooler.supabase.com",
        database="postgres",
        user="postgres.mmnmntijjtvnuqrkbcof",
        password="JBFz2L?GPn%-_Xs",
        port="6543"
    )
    return conn

# User class for flask-login
class User(UserMixin):
    def __init__(self, id, username):
        self.id = id
        self.username = username

@login_manager.user_loader
def load_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    conn.close()
    if user:
        return User(user['id'], user['username'])
    return None

@app.route('/')
def home():
    return "Welcome to the Real-Time Supply Chain Visibility API!"

@app.route('/register', methods=['POST'])
def register():
    conn = get_db_connection()
    cursor = conn.cursor()

    username = request.json.get('username')
    password = request.json.get('password')
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    try:
        cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, hashed_password))
        conn.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except psycopg2.IntegrityError:
        conn.rollback()
        return jsonify({"error": "Username already exists"}), 400
    finally:
        cursor.close()
        conn.close()

@app.route('/login', methods=['POST'])
def login():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    username = request.json.get('username')
    password = request.json.get('password')

    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()
    conn.close()

    if user and bcrypt.check_password_hash(user['password'], password):
        login_user(User(user['id'], user['username']))
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"error": "Invalid username or password"}), 401

@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    email = request.json.get('email')
    return jsonify({"message": "If your email is registered, you will receive a password reset link."}), 200

@app.route('/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200

@app.route('/protected', methods=['GET'])
@login_required
def protected():
    return jsonify({"message": f"Hello, {current_user.username}!"})

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Shipment API endpoints
@app.route('/api/shipments', methods=['GET'])
def get_shipments():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM shipments")
    shipments = cursor.fetchall()
    conn.close()

    return jsonify(shipments)

@app.route('/api/shipments/<int:shipment_id>', methods=['GET'])
def get_shipment(shipment_id):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM shipments WHERE id = %s", (shipment_id,))
    shipment = cursor.fetchone()
    conn.close()

    if shipment:
        return jsonify(shipment)
    else:
        return jsonify({"error": "Shipment not found"}), 404

@app.route('/api/shipments', methods=['POST'])
def add_shipment():
    conn = get_db_connection()
    cursor = conn.cursor()

    new_shipment = request.json
    cursor.execute('''
        INSERT INTO shipments (shipment_id, origin, destination, current_location, status, eta)
        VALUES (%s, %s, %s, %s, %s, %s)
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
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM shipments WHERE id = %s", (shipment_id,))
    current_shipment = cursor.fetchone()

    if not current_shipment:
        return jsonify({"error": "Shipment not found"}), 404

    new_status = request.json.get('status')
    new_location = request.json.get('current_location')
    new_eta = request.json.get('eta')

    cursor.execute('''
        UPDATE shipments SET status = %s, current_location = %s, eta = %s WHERE id = %s
    ''', (new_status, new_location, new_eta, shipment_id))

    cursor.execute('''
        INSERT INTO shipment_history (shipment_id, previous_status, new_status, previous_location, new_location, updated_by)
        VALUES (%s, %s, %s, %s, %s, %s)
    ''', (
        shipment_id,
        current_shipment[5],  # previous status
        new_status,           # new status
        current_shipment[4],  # previous location
        new_location,         # new location
        current_user.username if current_user.is_authenticated else 'System'  # who updated
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Shipment updated successfully"})

@app.route('/api/shipments/<int:shipment_id>/history', methods=['GET'])
def get_shipment_history(shipment_id):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("SELECT * FROM shipment_history WHERE shipment_id = %s", (shipment_id,))
    history_entries = cursor.fetchall()
    conn.close()

    return jsonify(history_entries)

# ETA Prediction Endpoint
@app.route('/api/predict_eta', methods=['POST'])
def predict_eta():
    data = request.json
    origin = data.get('origin')
    destination = data.get('destination')
    current_location = data.get('current_location')
    status = data.get('status')

    try:
        # Encode inputs
        origin_encoded = encode_label(label_encoder, origin)
        destination_encoded = encode_label(label_encoder, destination)
        current_location_encoded = encode_label(label_encoder, current_location)
        status_encoded = encode_label(label_encoder, status)

        features = np.array([[origin_encoded, destination_encoded, current_location_encoded, status_encoded]])
        predicted_days = model.predict(features)[0]

        return jsonify({
            "predicted_eta_days": predicted_days,
            "predicted_eta_date": (pd.Timestamp.now() + pd.Timedelta(days=predicted_days)).strftime('%Y-%m-%d')
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def encode_label(encoder, value):
    try:
        return encoder.transform([value])[0]
    except ValueError:
        encoder.classes_ = np.append(encoder.classes_, value)
        return encoder.transform([value])[0]

# Load Data
def load_data():
    conn = get_db_connection()
    df = pd.read_sql_query("SELECT * FROM shipments", conn)
    conn.close()
    return df

# Train Model
def train_model():
    df = load_data()

    # Feature Engineering
    le = LabelEncoder()
    df['origin_encoded'] = le.fit_transform(df['origin'])
    df['destination_encoded'] = le.fit_transform(df['destination'])
    df['current_location_encoded'] = le.fit_transform(df['current_location'])
    df['status_encoded'] = le.fit_transform(df['status'])

    df['eta_days'] = pd.to_datetime(df['eta']).apply(lambda x: (x - pd.Timestamp.now()).days)

    features = df[['origin_encoded', 'destination_encoded', 'current_location_encoded', 'status_encoded']]
    target = df['eta_days']

    X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=0.2, random_state=42)

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    return model, le

model, label_encoder = train_model()

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("SELECT origin, destination, current_location, status, eta FROM shipments")
    shipments = cursor.fetchall()
    conn.close()

    average_delivery_time = []
    delayed_shipments_count = []
    status_distribution = {}

    for shipment in shipments:
        eta_date = pd.to_datetime(shipment['eta'])
        delivery_days = (eta_date - pd.Timestamp.now()).days

        if delivery_days >= 0:
            average_delivery_time.append({"date": eta_date.strftime('%Y-%m-%d'), "days": delivery_days})

        if shipment['status'].lower() == 'delayed':
            delayed_shipments_count.append({"date": eta_date.strftime('%Y-%m-%d'), "count": 1})

        if shipment['status'] in status_distribution:
            status_distribution[shipment['status']] += 1
        else:
            status_distribution[shipment['status']] = 1

    status_distribution_list = [{"status": k, "value": v} for k, v in status_distribution.items()]

    analytics_data = {
        "averageDeliveryTime": average_delivery_time,
        "delayedShipmentsCount": delayed_shipments_count,
        "statusDistribution": status_distribution_list,
    }

    return jsonify(analytics_data)

# Data Export Endpoint
@app.route('/api/export_shipments', methods=['GET'])
@login_required
def export_shipments():
    conn = get_db_connection()
    df = pd.read_sql_query("SELECT * FROM shipments", conn)
    conn.close()

    export_format = request.args.get('format', 'csv')

    if export_format == 'csv':
        csv_data = df.to_csv(index=False)
        return Response(
            csv_data,
            mimetype="text/csv",
            headers={"Content-disposition": "attachment; filename=shipments.csv"}
        )
    elif export_format == 'excel':
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Shipments')
        output.seek(0)
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name='shipments.xlsx'
        )
    else:
        return jsonify({"error": "Unsupported format"}), 400

# Reporting Endpoint
@app.route('/api/report', methods=['GET'])
@login_required
def generate_report():
    conn = get_db_connection()
    df = pd.read_sql_query("SELECT * FROM shipments", conn)
    conn.close()

    status_summary = df['status'].value_counts().to_frame().reset_index()
    status_summary.columns = ['Status', 'Count']

    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        status_summary.to_excel(writer, index=False, sheet_name='Status Summary')
    output.seek(0)

    return send_file(
        output,
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        as_attachment=True,
        download_name='shipment_report.xlsx'
    )

if __name__ == '__main__':
    app.run(debug=True)
