const urlParams = new URLSearchParams(window.location.search);
const batchFile = urlParams.get('batch');
const dataUrl = `student_data/${batchFile}.xlsx`;

const tableContainer = document.getElementById("tableContainer");
const searchInput = document.getElementById("searchInput");

async function loadStudentData() {
  try {
    const response = await fetch(dataUrl);
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet);

    renderTable(json);
    enableSearch();
  } catch (error) {
    tableContainer.innerHTML = "Failed to load data.";
    console.error("Error loading Excel file:", error);
  }
}

function renderTable(data) {
  const table = document.createElement("table");
  const thead = table.createTHead();
  const headerRow = thead.insertRow();

  // Create table headers
  Object.keys(data[0]).forEach((key) => {
    const th = document.createElement("th");
    th.textContent = key;
    headerRow.appendChild(th);
  });

  // Create table body
  const tbody = table.createTBody();
  data.forEach((row) => {
    const tr = tbody.insertRow();
    Object.values(row).forEach((val) => {
      const td = tr.insertCell();
      td.textContent = val;
    });
  });

  tableContainer.innerHTML = "";
  tableContainer.appendChild(table);
}

function enableSearch() {
  searchInput.addEventListener("keyup", () => {
    const filter = searchInput.value.toLowerCase();
    const rows = tableContainer.querySelectorAll("table tbody tr");

    rows.forEach(row => {
      const rowText = row.textContent.toLowerCase();
      row.style.display = rowText.includes(filter) ? "" : "none";
    });
  });
}

function downloadTable() {
  const table = tableContainer.querySelector("table");
  if (!table) return alert("No table found!");

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.table_to_sheet(table);
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${batchFile}_filtered.xlsx`);
}

loadStudentData();
