// =============================================
// department.js — Department Page Logic
// Pair 1, Member 2 owns this file
// =============================================

// =============================================
// SAMPLE DEPARTMENT DATA
// Will be replaced with API calls to backend
// =============================================
const departmentData = [
  {
    id: 'icu',
    name: 'ICU',
    occupancy: 94,
    occupancyStatus: 'critical',
    bedUsed: 47,
    bedTotal: 50,
    staffCount: 32,
    patientsPerStaff: 1.47,
    availableBeds: 3,
    equipmentStatus: 95,
    avgStay: 8.2
  },
  {
    id: 'general',
    name: 'General Ward',
    occupancy: 78,
    occupancyStatus: 'warning',
    bedUsed: 156,
    bedTotal: 200,
    staffCount: 48,
    patientsPerStaff: 3.25,
    availableBeds: 44,
    equipmentStatus: 92,
    avgStay: 5.8
  },
  {
    id: 'emergency',
    name: 'Emergency',
    occupancy: 61,
    occupancyStatus: 'good',
    bedUsed: 30,
    bedTotal: 49,
    staffCount: 24,
    patientsPerStaff: 1.25,
    availableBeds: 19,
    equipmentStatus: 98,
    avgStay: 3.5
  },
  {
    id: 'wardB',
    name: 'Ward B',
    occupancy: 40,
    occupancyStatus: 'low',
    bedUsed: 60,
    bedTotal: 150,
    staffCount: 32,
    patientsPerStaff: 1.88,
    availableBeds: 90,
    equipmentStatus: 91,
    avgStay: 6.4
  },
  {
    id: 'surgery',
    name: 'Surgery',
    occupancy: 55,
    occupancyStatus: 'good',
    bedUsed: 22,
    bedTotal: 40,
    staffCount: 28,
    patientsPerStaff: 0.79,
    availableBeds: 18,
    equipmentStatus: 99,
    avgStay: 4.1
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    occupancy: 52,
    occupancyStatus: 'good',
    bedUsed: 26,
    bedTotal: 50,
    staffCount: 18,
    patientsPerStaff: 1.44,
    availableBeds: 24,
    equipmentStatus: 94,
    avgStay: 3.2
  }
];

let allDepartments = [...departmentData];
let filteredDepartments = [...departmentData];
let currentFilter = 'all';
let currentSort = 'occupancy';

// =============================================
// PAGE INITIALIZATION
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  setCurrentDate();
  initializeCharts();
  renderDepartments(filteredDepartments);
});

// =============================================
// SET CURRENT DATE
// =============================================
function setCurrentDate() {
  const dateEl = document.getElementById('currentDate');
  if (!dateEl) return;

  const options = { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  const today = new Date();
  dateEl.textContent = today.toLocaleDateString('en-US', options);
}

// =============================================
// RENDER DEPARTMENT CARDS
// =============================================
function renderDepartments(departments) {
  const grid = document.getElementById('departmentsGrid');
  if (!grid) return;

  grid.innerHTML = departments.map(dept => `
    <div class="dept-card ${dept.occupancyStatus}">
      <div class="dept-header">
        <div class="dept-title-section">
          <h3 class="dept-name">${dept.name}</h3>
          <span class="dept-badge ${getBadgeClass(dept.occupancyStatus)}">${getBadgeText(dept.occupancyStatus)}</span>
        </div>
        <button class="dept-menu-btn" onclick="toggleMenu(this)">⋮</button>
      </div>

      <div class="dept-stats">
        <div class="stat-item">
          <span class="stat-label">Occupancy</span>
          <span class="stat-value">${dept.occupancy}%</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Beds</span>
          <span class="stat-value">${dept.bedUsed}/${dept.bedTotal}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Staff</span>
          <span class="stat-value">${dept.staffCount}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Patients/Staff</span>
          <span class="stat-value">${dept.patientsPerStaff.toFixed(2)}</span>
        </div>
      </div>

      <div class="dept-bar-section">
        <p class="dept-bar-label">Bed Capacity</p>
        <div class="dept-bar">
          <div class="dept-bar-fill ${getBarClass(dept.occupancyStatus)}" style="width:${dept.occupancy}%"></div>
        </div>
      </div>

      <div class="dept-details">
        <div class="detail-row">
          <span class="detail-label">Available Beds:</span>
          <span class="detail-value">${dept.availableBeds}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Equipment Status:</span>
          <span class="detail-value good">${dept.equipmentStatus}% Operational</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Avg. Stay:</span>
          <span class="detail-value">${dept.avgStay} days</span>
        </div>
      </div>

      <button class="dept-action-btn" onclick="showDepartmentDetail('${dept.id}')">View Details</button>
    </div>
  `).join('');

  // Re-initialize animations
  addCardAnimations();
}

// =============================================
// GET BADGE CLASS BASED ON STATUS
// =============================================
function getBadgeClass(status) {
  const map = {
    'critical': 'critical-badge',
    'warning': 'warning-badge',
    'good': 'good-badge',
    'low': 'low-badge'
  };
  return map[status] || '';
}

// =============================================
// GET BADGE TEXT
// =============================================
function getBadgeText(status) {
  const map = {
    'critical': 'Critical',
    'warning': 'High',
    'good': 'Normal',
    'low': 'Low'
  };
  return map[status] || 'Optimal';
}

// =============================================
// GET BAR FILL CLASS
// =============================================
function getBarClass(status) {
  const map = {
    'critical': 'critical-fill',
    'warning': 'warning-fill',
    'good': 'good-fill',
    'low': 'low-fill'
  };
  return map[status] || 'good-fill';
}

// =============================================
// FILTER DEPARTMENTS
// =============================================
function filterDepartments() {
  const filterSelect = document.getElementById('deptFilter');
  if (!filterSelect) return;

  currentFilter = filterSelect.value;
  applyFiltersAndSort();
}

// =============================================
// SORT DEPARTMENTS
// =============================================
function sortDepartments() {
  const sortSelect = document.getElementById('sortBy');
  if (!sortSelect) return;

  currentSort = sortSelect.value;
  applyFiltersAndSort();
}

// =============================================
// APPLY BOTH FILTER AND SORT
// =============================================
function applyFiltersAndSort() {
  // Step 1: Apply Filter
  if (currentFilter === 'all') {
    filteredDepartments = [...allDepartments];
  } else {
    filteredDepartments = allDepartments.filter(dept => dept.id === currentFilter);
  }

  // Step 2: Apply Sort
  if (currentSort === 'occupancy') {
    filteredDepartments.sort((a, b) => b.occupancy - a.occupancy);
  } else if (currentSort === 'name') {
    filteredDepartments.sort((a, b) => a.name.localeCompare(b.name));
  } else if (currentSort === 'staff') {
    filteredDepartments.sort((a, b) => a.patientsPerStaff - b.patientsPerStaff);
  }

  // Step 3: Re-render
  renderDepartments(filteredDepartments);
  updateCharts();
}

// =============================================
// TOGGLE MENU (for future context menu)
// =============================================
function toggleMenu(btn) {
  console.log('Menu toggle clicked for:', btn.closest('.dept-card').querySelector('.dept-name').textContent);
  // Placeholder for future menu functionality
}

// =============================================
// SHOW DEPARTMENT DETAIL (modal or detail page)
// =============================================
function showDepartmentDetail(deptId) {
  const dept = allDepartments.find(d => d.id === deptId);
  if (!dept) return;

  alert(`Detailed view for ${dept.name}:\n\nOccupancy: ${dept.occupancy}%\nStaff: ${dept.staffCount}\nPatients per Staff: ${dept.patientsPerStaff.toFixed(2)}\n\nFull detail modal would load here.`);
}

// =============================================
// ADD CARD ANIMATION
// =============================================
function addCardAnimations() {
  const cards = document.querySelectorAll('.dept-card');
  cards.forEach((card, idx) => {
    card.style.setProperty('--anim-delay', `${idx * 0.05}s`);
  });
}

// =============================================
// REFRESH DATA
// =============================================
function refreshData() {
  const btn = document.querySelector('.refresh-btn');
  if (!btn) return;

  btn.textContent = 'Refreshing...';
  btn.disabled = true;

  // Simulate API call delay
  setTimeout(() => {
    // In real app, fetch from API
    // For now, just update charts
    updateCharts();

    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="23 4 23 10 17 10"/>
        <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
      </svg>
      Refresh`;
    btn.disabled = false;
  }, 800);
}

// =============================================
// CHART INITIALIZATION & UPDATES
// =============================================
let occupancyChartInstance;
let staffChartInstance;

function initializeCharts() {
  initOccupancyChart();
  initStaffChart();
}

function initOccupancyChart() {
  const ctx = document.getElementById('occupancyChart');
  if (!ctx) return;

  const deptNames = departmentData.map(d => d.name);
  const occupancyRates = departmentData.map(d => d.occupancy);

  occupancyChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: deptNames,
      datasets: [
        {
          label: 'Occupancy %',
          data: occupancyRates,
          backgroundColor: [
            '#e74c3c', // ICU - critical
            '#f39c12', // General Ward - warning
            '#1a7f5a', // Emergency - good
            '#2980b9', // Ward B - low
            '#1a7f5a', // Surgery - good
            '#1a7f5a'  // Pediatrics - good
          ],
          borderRadius: 8,
          borderSkipped: false,
          borderColor: 'rgba(255, 255, 255, 0)',
          barThickness: 'flex',
          maxBarThickness: 50
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: { size: 13, weight: '600' },
          bodyFont: { size: 12 },
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return context.raw + '% occupied';
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function(value) {
              return value + '%';
            },
            font: { size: 11, weight: '500' },
            color: '#8a96a8'
          },
          grid: {
            drawBorder: false,
            color: '#e2e8f0',
            lineWidth: 1
          }
        },
        x: {
          ticks: {
            font: { size: 11, weight: '500' },
            color: '#4a5568'
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
}

function initStaffChart() {
  const ctx = document.getElementById('staffChart');
  if (!ctx) return;

  const deptNames = departmentData.map(d => d.name);
  const staffRatios = departmentData.map(d => d.patientsPerStaff);

  staffChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: deptNames,
      datasets: [
        {
          label: 'Patients per Staff',
          data: staffRatios,
          borderColor: '#0f3460',
          backgroundColor: 'rgba(26, 127, 90, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#1a7f5a',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { size: 11, weight: '500' },
            color: '#4a5568',
            padding: 12
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: { size: 13, weight: '600' },
          bodyFont: { size: 12 },
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return 'Ratio: ' + context.raw.toFixed(2);
            }
          }
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 4,
          ticks: {
            font: { size: 10, weight: '500' },
            color: '#8a96a8'
          },
          grid: {
            color: '#e2e8f0',
            lineWidth: 1
          },
          pointLabels: {
            font: { size: 11, weight: '600' },
            color: '#4a5568'
          }
        }
      }
    }
  });
}

function updateCharts() {
  if (occupancyChartInstance) {
    occupancyChartInstance.update();
  }
  if (staffChartInstance) {
    staffChartInstance.update();
  }
}