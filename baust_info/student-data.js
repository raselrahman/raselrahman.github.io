const toggleBtn = document.getElementById("toggle-btn");
const section = document.getElementById("student-section");
const studentTable = document.getElementById("student-table");

toggleBtn.addEventListener("click", () => {
  const isHidden = section.classList.contains("hidden");
  section.classList.toggle("hidden");
  toggleBtn.textContent = isHidden ? "Hide Student Details" : "Show Student Details";

  if (!isHidden && !studentTable.innerHTML.includes('SL')) {
    loadStudentData();
  }
});

function loadStudentData() {
  const url = 'baust_info/student_data/_19batch_2_I.xlsx';
  fetch(url)
    .then(response => response.arrayBuffer())
    .then(data => {
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      displayTable(jsonData);
    })
    .catch(err => {
      console.error("Error loading Excel file:", err);
      studentTable.innerHTML = "Failed to load data.";
    });
}

function displayTable(data) {
  let table = "<table><thead><tr>";
  data[0].forEach(header => {
    table += `<th>${header}</th>`;
  });
  table += "</tr></thead><tbody>";

  data.slice(1).forEach(row => {
    table += "<tr>";
    row.forEach(cell => {
      table += `<td>${cell}</td>`;
    });
    table += "</tr>";
  });

  table += "</tbody></table>";
  studentTable.innerHTML = table;
}
