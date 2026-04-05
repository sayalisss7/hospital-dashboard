# =============================================
# analysis.py — All Analysis Logic
# Pair 2, Member 4 owns this file
# =============================================


# =============================================
# FUNCTION 1: Calculate Utilization %
# Formula: (used_beds / total_beds) * 100
# Input: list of DB rows
# Output: list of dicts with utilization %
# =============================================
def calculate_utilization(rows):
    """
    Groups rows by department and calculates
    average utilization percentage.

    Example output:
    [
      {"department": "ICU", "occupancy": 94, "used": 47, "total": 50},
      ...
    ]
    """
    dept_data = {}

    for row in rows:
        dept = row['department']
        if dept not in dept_data:
            dept_data[dept] = {'used': 0, 'total': 0, 'count': 0}

        dept_data[dept]['used']  += row.get('beds_used', 0)
        dept_data[dept]['total'] += row.get('total_beds', 0)
        dept_data[dept]['count'] += 1

    result = []
    for dept, values in dept_data.items():
        if values['total'] > 0:
            occupancy = round((values['used'] / values['total']) * 100, 1)
        else:
            occupancy = 0

        result.append({
            "department": dept,
            "occupancy": occupancy,
            "used": values['used'] // values['count'],
            "total": values['total'] // values['count']
        })

    return result


# =============================================
# FUNCTION 2: Detect Peak Times
# Finds which day has highest patient count
# =============================================
def detect_peak_times(rows):
    """
    Groups patients by day of week.
    Returns load percentage per day.

    Example output:
    {"Monday": 90, "Tuesday": 85, ...}
    """
    day_counts = {
        "Monday": 0, "Tuesday": 0, "Wednesday": 0,
        "Thursday": 0, "Friday": 0, "Saturday": 0, "Sunday": 0
    }
    day_totals = dict(day_counts)

    for row in rows:
        day = row.get('day_of_week', '')
        if day in day_counts:
            day_counts[day] += row.get('patient_count', 0)
            day_totals[day] += 1

    peak_data = {}
    for day, total in day_counts.items():
        count = day_totals[day] if day_totals[day] > 0 else 1
        peak_data[day] = round(total / count, 1)

    return peak_data


# =============================================
# FUNCTION 3: Find Understaffing
# Compares staff available vs patients
# =============================================
def find_understaffing(rows):
    """
    Checks if staff count is enough for patient load.
    Rule: 1 nurse for every 5 ICU patients
          1 doctor for every 15 patients

    Returns list of alerts.
    """
    alerts = []

    for row in rows:
        dept = row.get('department', '')
        patients = row.get('beds_used', 0)
        nurses = row.get('nurses_on_duty', 0)
        doctors = row.get('doctors_on_duty', 0)

        # ICU rule: 1 nurse per 5 patients
        if dept == 'ICU':
            needed_nurses = patients // 5
            if nurses < needed_nurses:
                shortage = needed_nurses - nurses
                alerts.append({
                    "department": dept,
                    "level": "critical",
                    "dotColor": "red",
                    "message": f"Needs +{shortage} nurses"
                })

        # General: 1 doctor per 15 patients
        needed_doctors = patients // 15
        if doctors < needed_doctors:
            shortage = needed_doctors - doctors
            alerts.append({
                "department": dept,
                "level": "warning",
                "dotColor": "orange",
                "message": f"Needs +{shortage} doctors"
            })

    # Remove duplicates by department
    seen = set()
    unique_alerts = []
    for alert in alerts:
        if alert['department'] not in seen:
            unique_alerts.append(alert)
            seen.add(alert['department'])

    return unique_alerts


# =============================================
# FUNCTION 4: Simple Trend Prediction
# Compares this week vs last week
# =============================================
def predict_trends(rows):
    """
    Splits data into recent vs older.
    Compares averages to find % change.

    Example output:
    [{"department": "ICU", "change": +5.0, "direction": "up"}]
    """
    if len(rows) < 2:
        return []

    # Split rows: first half = older, second half = recent
    mid = len(rows) // 2
    older_rows = rows[:mid]
    recent_rows = rows[mid:]

    def avg_occupancy(data):
        totals = {}
        counts = {}
        for row in data:
            dept = row['department']
            occupancy = row.get('beds_used', 0)
            totals[dept] = totals.get(dept, 0) + occupancy
            counts[dept] = counts.get(dept, 0) + 1
        return {d: totals[d] / counts[d] for d in totals}

    older_avg = avg_occupancy(older_rows)
    recent_avg = avg_occupancy(recent_rows)

    trends = []
    for dept in recent_avg:
        if dept in older_avg and older_avg[dept] > 0:
            change = round(recent_avg[dept] - older_avg[dept], 1)
            direction = "up" if change > 0 else ("down" if change < 0 else "stable")
            trends.append({
                "department": dept,
                "change": abs(change),
                "direction": direction
            })

    return trends
