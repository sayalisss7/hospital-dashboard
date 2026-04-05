# 🏥 Hospital Resource Utilization Analyzer

> A web-based system to analyze patient data and hospital resource usage.

---

## 👥 Team & File Ownership

| File | Owner |
|------|-------|
| `frontend/index.html` | Pair 1 – Member 1 |
| `frontend/css/style.css` | Pair 1 – Member 1 |
| `frontend/css/dashboard.css` | Pair 1 – Member 2 |
| `frontend/js/charts.js` | Pair 1 – Member 2 |
| `frontend/js/api.js` | Pair 1 – Member 1 |
| `backend/app.py` | Pair 2 – Member 3 |
| `backend/analysis.py` | Pair 2 – Member 4 |
| `backend/data_loader.py` | Pair 3 – Member 5 |
| `database/schema.sql` | Pair 3 – Member 6 |
| `database/db_connect.py` | Pair 3 – Member 6 |
| `cloud/setup_guide.md` | Pair 3 – Member 5 |

---

## 🚀 How to Run Locally

### Frontend (no setup needed)
Just open `frontend/index.html` in your browser.

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Database
```bash
mysql -u root -p < database/schema.sql
```

---

## 📦 Git Workflow

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/hospital-analyzer.git

# Create your branch (each pair uses their branch)
git checkout -b frontend/dashboard        # Pair 1
git checkout -b backend/flask-api         # Pair 2
git checkout -b cloud/aws-setup           # Pair 3

# After making changes
git add .
git commit -m "feat: add dashboard HTML layout"
git push origin your-branch-name
```

### PR Merge Order:
1. Pair 3 merges cloud/db setup first
2. Pair 2 merges backend next
3. Pair 1 merges frontend last

---

## 🎨 Color Theme

| Color | Hex | Used For |
|-------|-----|---------|
| Navy Blue | `#0f3460` | Sidebar, headings, primary |
| Medical Green | `#1a7f5a` | Accent, success, normal status |
| Light Gray | `#f4f6fb` | Background, cards |

---

## 📊 Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript, Chart.js
- **Backend**: Python 3, Flask
- **Database**: MySQL
- **Cloud**: AWS S3 (storage), AWS EC2 (hosting)
