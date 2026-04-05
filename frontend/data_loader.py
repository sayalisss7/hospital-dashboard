# =============================================
# data_loader.py — Load CSV from AWS S3
# Pair 3, Member 5 owns this file
# =============================================

import boto3
import pandas as pd
import io
import mysql.connector
from database.db_connect import get_db_connection

# ---- S3 Configuration ----
S3_BUCKET_NAME = 'hospital-analyzer-data'   # Change to your bucket name
AWS_REGION     = 'ap-south-1'               # Mumbai region (closest to India)


# =============================================
# FUNCTION: Load CSV from S3
# Steps: Connect → Download → Read → Return
# =============================================
def load_data_from_s3(filename):
    """
    Downloads a CSV file from S3 and returns
    it as a list of dictionaries.

    Usage: data = load_data_from_s3('patients_march.csv')
    """
    s3_client = boto3.client('s3', region_name=AWS_REGION)

    # Step 1: Download the file from S3
    response = s3_client.get_object(Bucket=S3_BUCKET_NAME, Key=filename)
    file_content = response['Body'].read()

    # Step 2: Read CSV into pandas DataFrame
    df = pd.read_csv(io.BytesIO(file_content))

    # Step 3: Clean the data
    df = clean_data(df)

    # Step 4: Save to MySQL
    save_to_database(df, filename)

    # Step 5: Return as list of dicts
    return df.to_dict(orient='records')


# =============================================
# FUNCTION: Clean Data
# Remove empty rows, fix column names
# =============================================
def clean_data(df):
    """
    Cleans the raw CSV data:
    - Removes completely empty rows
    - Fills missing numbers with 0
    - Strips spaces from text columns
    """
    df = df.dropna(how='all')           # Remove fully empty rows
    df = df.fillna(0)                   # Fill empty numbers with 0

    # Strip whitespace from string columns
    str_cols = df.select_dtypes(include='object').columns
    for col in str_cols:
        df[col] = df[col].astype(str).str.strip()

    return df


# =============================================
# FUNCTION: Save Processed Data to MySQL
# =============================================
def save_to_database(df, source_file):
    """
    Saves cleaned DataFrame rows into the
    MySQL 'utilization' table.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    for _, row in df.iterrows():
        cursor.execute("""
            INSERT INTO utilization
              (department, beds_used, total_beds, nurses_on_duty, doctors_on_duty, source_file)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
              beds_used = VALUES(beds_used),
              total_beds = VALUES(total_beds)
        """, (
            row.get('department', 'Unknown'),
            int(row.get('beds_used', 0)),
            int(row.get('total_beds', 0)),
            int(row.get('nurses_on_duty', 0)),
            int(row.get('doctors_on_duty', 0)),
            source_file
        ))

    conn.commit()
    conn.close()
    print(f"✓ Saved {len(df)} rows from {source_file} to database")
