# =============================================
# db_connect.py — MySQL Connection
# Pair 3, Member 6 owns this file
# =============================================

import mysql.connector

# ---- Database Configuration ----
# Update these values with your MySQL details
DB_CONFIG = {
    'host':     'localhost',        # or your EC2 public IP
    'user':     'hospital_user',    # MySQL username
    'password': 'YourPassword123',  # MySQL password
    'database': 'hospital_db'       # Database name
}


def get_db_connection():
    """
    Creates and returns a MySQL connection.

    Usage:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM patients")
        rows = cursor.fetchall()
        conn.close()
    """
    conn = mysql.connector.connect(**DB_CONFIG)
    return conn
