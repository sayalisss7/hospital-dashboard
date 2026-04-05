// =============================================
// charts.js — All Chart.js Configurations
// Pair 1, Member 2 owns this file
// =============================================

// --- Set date in topbar ---
document.addEventListener('DOMContentLoaded', () => {
  const dateEl = document.getElementById('currentDate');
  if (dateEl) {
    const now = new Date();
    dateEl.textContent = now.toLocaleDateString('en-IN', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  initWeeklyChart();
  initResourceChart();
});

// =============================================
// Chart 1: Weekly Patient Load (Bar Chart)
// =============================================
function initWeeklyChart() {
  const ctx = document.getElementById('weeklyChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'ICU',
          data: [47, 46, 44, 43, 48, 30, 28],
          backgroundColor: 'rgba(231, 76, 60, 0.8)',
          borderRadius: 5,
        },
        {
          label: 'General Ward',
          data: [156, 150, 145, 140, 158, 100, 95],
          backgroundColor: 'rgba(15, 52, 96, 0.75)',
          borderRadius: 5,
        },
        {
          label: 'Emergency',
          data: [30, 28, 25, 24, 32, 18, 15],
          backgroundColor: 'rgba(26, 127, 90, 0.8)',
          borderRadius: 5,
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { family: 'Plus Jakarta Sans', size: 12 },
            padding: 16,
            usePointStyle: true,
          }
        },
        tooltip: {
          backgroundColor: '#0f3460',
          titleFont: { family: 'Plus Jakarta Sans', size: 13 },
          bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Plus Jakarta Sans', size: 12 } }
        },
        y: {
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { font: { family: 'Plus Jakarta Sans', size: 12 } }
        }
      }
    }
  });
}

// =============================================
// Chart 2: Resource Utilization (Doughnut)
// =============================================
function initResourceChart() {
  const ctx = document.getElementById('resourceChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Ventilators', 'MRI Machines', 'X-Ray', 'ICU Monitors', 'Unused'],
      datasets: [{
        data: [85, 60, 72, 90, 15],
        backgroundColor: [
          '#e74c3c',
          '#0f3460',
          '#1a7f5a',
          '#f39c12',
          '#e2e8f0'
        ],
        borderWidth: 0,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { family: 'Plus Jakarta Sans', size: 11 },
            padding: 10,
            usePointStyle: true,
            pointStyleWidth: 8
          }
        },
        tooltip: {
          backgroundColor: '#0f3460',
          titleFont: { family: 'Plus Jakarta Sans', size: 12 },
          bodyFont: { family: 'Plus Jakarta Sans', size: 11 },
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`
          }
        }
      }
    }
  });
}
