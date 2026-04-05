// =============================================
// api.js — Connects Frontend to Flask Backend
// Pair 1, Member 1 owns this file
// =============================================

// Change this to your EC2 IP when deployed
const API_BASE_URL = 'http://127.0.0.1:5000';

// =============================================
// FETCH: Dashboard Summary Data
// GET /api/dashboard
// =============================================
async function fetchDashboardData() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard`);
    if (!response.ok) throw new Error('Server error');
    const data = await response.json();
    updateKPICards(data.departments);
    updateAlerts(data.alerts);
  } catch (error) {
    console.log('Using sample data (backend not connected yet):', error.message);
    // Sample data works while backend is not ready
  }
}

// =============================================
// UPDATE: KPI Cards from API data
// =============================================
function updateKPICards(departments) {
  if (!departments) return;
  // Each department updates its card dynamically
  // Example: { name: "ICU", occupancy: 94, used: 47, total: 50 }
  departments.forEach(dept => {
    console.log(`${dept.name}: ${dept.occupancy}% full`);
  });
}

// =============================================
// UPDATE: Alert list from API data
// =============================================
function updateAlerts(alerts) {
  if (!alerts) return;
  const alertList = document.getElementById('alertList');
  if (!alertList) return;

  // Uncomment when backend is ready:
  // alertList.innerHTML = '';
  // alerts.forEach(alert => {
  //   alertList.innerHTML += `
  //     <div class="alert-item ${alert.level}-item">
  //       <div class="alert-dot ${alert.dotColor}"></div>
  //       <div>
  //         <div class="alert-dept">${alert.department}</div>
  //         <div class="alert-msg">${alert.message}</div>
  //       </div>
  //     </div>`;
  // });
}

// =============================================
// REFRESH Button Logic
// =============================================
function refreshData() {
  const btn = document.querySelector('.refresh-btn');
  if (btn) {
    btn.textContent = 'Refreshing...';
    btn.disabled = true;
  }

  fetchDashboardData().finally(() => {
    setTimeout(() => {
      if (btn) {
        btn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
          </svg>
          Refresh`;
        btn.disabled = false;
      }
    }, 800);
  });
}

// =============================================
// Run on page load
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  fetchDashboardData();
});
