// Mock Data for Active Alerts (matching dashboard trends)
const activeAlerts = [
  {
    id: 1,
    department: "ICU",
    type: "critical",
    message: "Critical shortage: Requires +3 Registered Nurses immediately to maintain 1:1 ratio. Current occupancy is 94%.",
    time: "10 mins ago",
    actionText: "Call in Backup"
  },
  {
    id: 2,
    department: "Emergency",
    type: "warning",
    message: "Approaching peak hours. Recommended to add +1 Attending Physician on standby.",
    time: "45 mins ago",
    actionText: "Assign Doctor"
  },
  {
    id: 3,
    department: "Ward B",
    type: "info",
    message: "Currently overstaffed by 2 Nurses (40% occupancy). Consider reallocating to ICU.",
    time: "1 hour ago",
    actionText: "Reallocate Staff"
  }
];

// Mock Data for Staff Roster
const staffData = [
  { id: "RN-409", name: "Sarah Jenkins", role: "Registered Nurse", dept: "ICU", status: "Active", fatigue: 85 },
  { id: "MD-112", name: "Dr. Marcus Cole", role: "Attending Physician", dept: "Emergency", status: "Active", fatigue: 60 },
  { id: "RN-332", name: "Emily Chen", role: "Registered Nurse", dept: "Ward B", status: "Active", fatigue: 20 },
  { id: "RN-334", name: "David Miller", role: "Registered Nurse", dept: "Ward B", status: "On Break", fatigue: 30 },
  { id: "MD-098", name: "Dr. Anita Patel", role: "Specialist", dept: "ICU", status: "Off Shift", fatigue: 10 },
  { id: "NA-221", name: "John Doe", role: "Nurse Assistant", dept: "General Ward", status: "Active", fatigue: 45 },
];

// Initialize Page
document.addEventListener("DOMContentLoaded", () => {
  renderAlerts();
  renderStaffTable(staffData);
});

// Render Alerts
function renderAlerts() {
  const grid = document.getElementById("activeAlertsGrid");
  grid.innerHTML = "";

  activeAlerts.forEach(alert => {
    const card = document.createElement("div");
    card.className = `alert-card ${alert.type}`;
    
    card.innerHTML = `
      <div class="alert-card-header">
        <span class="alert-card-dept">${alert.department}</span>
        <span class="alert-time">${alert.time}</span>
      </div>
      <div class="alert-card-msg">${alert.message}</div>
      <div class="alert-actions">
        <button class="btn-resolve" onclick="resolveAlert(${alert.id})">Dismiss</button>
        <button class="btn-reassign" onclick="handleAction('${alert.department}')">${alert.actionText}</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Render Staff Table
function renderStaffTable(data) {
  const tbody = document.getElementById("staffTableBody");
  tbody.innerHTML = "";

  data.forEach(staff => {
    // Determine status badge class
    let statusClass = "status-off";
    if (staff.status === "Active") statusClass = "status-active";
    if (staff.status === "On Break") statusClass = "status-break";

    // Determine fatigue color
    let fatigueClass = "fatigue-low";
    if (staff.fatigue > 50) fatigueClass = "fatigue-med";
    if (staff.fatigue > 80) fatigueClass = "fatigue-high";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div class="staff-profile">
          <div class="staff-avatar">${staff.name.charAt(0)}</div>
          <div>
            <span class="staff-name">${staff.name}</span>
            <span class="staff-id">${staff.id}</span>
          </div>
        </div>
      </td>
      <td>${staff.role}</td>
      <td><strong>${staff.dept}</strong></td>
      <td><span class="status-badge ${statusClass}">${staff.status}</span></td>
      <td>
        ${staff.fatigue}%
        <div class="fatigue-bar"><div class="fatigue-fill ${fatigueClass}" style="width: ${staff.fatigue}%"></div></div>
      </td>
      <td><a href="#" class="action-link" onclick="editStaff('${staff.id}')">Edit / Move</a></td>
    `;
    tbody.appendChild(tr);
  });
}

// Filtering Logic
function filterStaff() {
  const searchQuery = document.getElementById("staffSearch").value.toLowerCase();
  const deptFilter = document.getElementById("deptFilter").value;

  const filteredData = staffData.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery) || staff.id.toLowerCase().includes(searchQuery);
    const matchesDept = deptFilter === "All" || staff.dept === deptFilter;
    return matchesSearch && matchesDept;
  });

  renderStaffTable(filteredData);
}

// Interactive Handlers
function openReassignModal() {
  alert("Reassignment panel would open here. You can drag and drop staff between departments.");
}

function resolveAlert(id) {
  // In a real app, this would ping the database to mark as resolved
  const index = activeAlerts.findIndex(a => a.id === id);
  if (index > -1) {
    activeAlerts.splice(index, 1);
    renderAlerts();
  }
}

function handleAction(dept) {
  alert(`Opening allocation protocol for ${dept}...`);
  // Pre-fill the department filter to show current staff
  document.getElementById("deptFilter").value = dept;
  filterStaff();
}

function editStaff(id) {
  alert(`Opening profile and schedule for Staff ID: ${id}`);
}