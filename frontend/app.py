# =============================================
# app.py — Flask Main Application
# Pair 2, Member 3 owns this file
# =============================================

from flask import Flask, jsonify, request
from flask_cors import CORS
from data_loader import load_data_from_s3
from analysis import (
    calculate_utilization,
    detect_peak_times,
    find_understaffing,
    predict_trends
)
from database.db_connect import get_db_connection

app = Flask(__name__)
CORS(app)  # Allow frontend to talk to backend


# =============================================
# ROUTE 1: Health Check
# GET /
# =============================================
@app.route('/')
def index():
    return jsonify({"message": "MediTrack API is running ✓", "status": "ok"})


# =============================================
# ROUTE 2: Dashboard Summary
# GET /api/dashboard
# Returns KPIs, alerts, and trends
# =============================================
@app.route('/api/dashboard', methods=['GET'])
def get_dashboard():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Get all departments with their utilization
        cursor.execute("SELECT * FROM utilization ORDER BY date DESC LIMIT 50")
        rows = cursor.fetchall()

        utilization = calculate_utilization(rows)
        alerts = find_understaffing(rows)
        trends = predict_trends(rows)

        conn.close()

        return jsonify({
            "status": "success",
            "departments": utilization,
            "alerts": alerts,
            "trends": trends
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# =============================================
# ROUTE 3: Peak Time Data
# GET /api/peak-times
# =============================================
@app.route('/api/peak-times', methods=['GET'])
def get_peak_times():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM patients")
        rows = cursor.fetchall()

        peak_data = detect_peak_times(rows)
        conn.close()

        return jsonify({"status": "success", "peak_times": peak_data})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# =============================================
# ROUTE 4: Upload CSV trigger from S3
# POST /api/upload
# =============================================
@app.route('/api/upload', methods=['POST'])
def trigger_upload():
    try:
        filename = request.json.get('filename')
        if not filename:
            return jsonify({"status": "error", "message": "No filename given"}), 400

        data = load_data_from_s3(filename)
        return jsonify({"status": "success", "rows_loaded": len(data)})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# =============================================
# RUN THE APP
# =============================================
if __name__ == '__main__':
    app.run(debug=True, port=5000)
