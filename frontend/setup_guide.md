# cloud/setup_guide.md — AWS Setup Steps
# Pair 3 follows this guide

---

## STEP 1: Create S3 Bucket

1. Go to AWS Console → S3
2. Click "Create Bucket"
3. Name: `hospital-analyzer-data`
4. Region: `ap-south-1` (Mumbai)
5. Uncheck "Block all public access" → Confirm
6. Click "Create Bucket"

Upload sample CSV files here.

---

## STEP 2: Launch EC2 Instance

1. Go to AWS Console → EC2
2. Click "Launch Instance"
3. Choose: **Ubuntu 22.04 LTS** (Free Tier)
4. Instance type: `t2.micro`
5. Create a Key Pair → Download `.pem` file
6. Security Group: Allow ports 22 (SSH), 5000 (Flask), 80 (HTTP)
7. Launch!

---

## STEP 3: Connect to EC2 via SSH

```bash
# On your computer terminal:
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

---

## STEP 4: Install Python & Dependencies on EC2

```bash
sudo apt update
sudo apt install python3 python3-pip git mysql-server -y
git clone https://github.com/YOUR_USERNAME/hospital-analyzer.git
cd hospital-analyzer/backend
pip3 install -r requirements.txt
```

---

## STEP 5: Set Up MySQL on EC2

```bash
sudo mysql
```
```sql
CREATE USER 'hospital_user'@'localhost' IDENTIFIED BY 'YourPassword123';
GRANT ALL PRIVILEGES ON hospital_db.* TO 'hospital_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```
```bash
mysql -u hospital_user -p hospital_db < ../database/schema.sql
```

---

## STEP 6: Run Flask App on EC2

```bash
cd hospital-analyzer/backend
python3 app.py
```

App is live at: `http://YOUR_EC2_IP:5000`

---

## STEP 7: Update Frontend API URL

Open `frontend/js/api.js` and change:
```js
const API_BASE_URL = 'http://YOUR_EC2_IP:5000';
```

---

## STEP 8: Configure AWS Credentials (for S3 access)

```bash
pip3 install awscli
aws configure
# Enter: Access Key, Secret Key, Region: ap-south-1
```
