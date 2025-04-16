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
  const url = 'baust_info/student_data/_19batch_2_I.xlsx'; // path to your Excel file
  fetch(url)
    .then(response => response.arrayBuffer())
    .then(data => {
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0]; // Assuming the data is in the first sheet
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Read as an array of arrays

      displayTable(jsonData); // Pass the data to display function
    })
    .catch(err => {
      console.error("Error loading Excel file:", err);
      studentTable.innerHTML = "Failed to load data.";
    });
}

function displayTable(data) {
  let table = "<table><thead><tr>";
  // Add table headers (the first row of the data)
  data[0].forEach(header => {
    table += `<th>${header}</th>`;
  });
  table += "</tr></thead><tbody>";

  // Add rows for each student
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
