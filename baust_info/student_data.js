document.addEventListener("DOMContentLoaded", function () {
  const tablesContainer = document.getElementById("tablesContainer");
  const tableButtons = document.getElementById("tableButtons");

  const files = [
    "student_data/_19batch_2_I.xlsx",
    "student_data/_20batch_1_A.xlsx",
    // Add more file paths as needed
  ];

  files.forEach((file, index) => {
    createTableToggleButton(file, index);
  });

  function createTableToggleButton(file, index) {
    const button = document.createElement("button");
    button.textContent = `Show Data from ${file.split('/').pop()}`;
    button.addEventListener("click", () => toggleTableVisibility(index));

    tableButtons.appendChild(button);
  }

  function toggleTableVisibility(index) {
    const tableContainer = document.getElementById(`table${index}`);
    if (tableContainer.style.display === "none") {
      tableContainer.style.display = "block";
    } else {
      tableContainer.style.display = "none";
    }
  }

  function loadExcelData(file, index) {
    fetch(file)
      .then((res) => res.arrayBuffer())
      .then((ab) => {
        const workbook = XLSX.read(ab, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (json.length === 0) {
          const errorContainer = document.getElementById(`table${index}`);
          errorContainer.innerHTML = "<p>No data found in Excel file.</p>";
          return;
        }

        let tableHTML = "<table border='1'><thead><tr>";
        json[0].forEach((heading) => {
          tableHTML += `<th>${heading}</th>`;
        });
        tableHTML += "</tr></thead><tbody>";

        for (let i = 1; i < json.length; i++) {
          tableHTML += "<tr>";
          json[i].forEach((cell) => {
            tableHTML += `<td>${cell ?? ""}</td>`;
          });
          tableHTML += "</tr>";
        }
        tableHTML += "</tbody></table>";

        const tableContainer = document.getElementById(`table${index}`);
        tableContainer.innerHTML = tableHTML;

        const downloadButton = document.createElement("button");
        downloadButton.textContent = "Download as CSV";
        downloadButton.addEventListener("click", () => downloadTableAsCSV(json));
        tableContainer.appendChild(downloadButton);
      })
      .catch((err) => {
        console.error(err);
        const errorContainer = document.getElementById(`table${index}`);
        errorContainer.innerHTML = "<p style='color:red;'>Error loading Excel file.</p>";
      });
  }

  function downloadTableAsCSV(json) {
    let csv = json.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "student_data.csv";
    link.click();
  }

  // Load data for each file and create individual containers
  files.forEach((file, index) => {
    const tableContainer = document.createElement("div");
    tableContainer.id = `table${index}`;
    tableContainer.style.display = "none";  // Initially hidden
    tablesContainer.appendChild(tableContainer);
    
    loadExcelData(file, index);
  });
});
