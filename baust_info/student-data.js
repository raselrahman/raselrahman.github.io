document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("toggleButton");
  const container = document.getElementById("studentDataContainer");
  let isDataLoaded = false;

  toggleButton.addEventListener("click", () => {
    if (container.style.display === "none") {
      container.style.display = "block";
      toggleButton.textContent = "Hide Student Details";

      if (!isDataLoaded) {
        loadExcelData();
        isDataLoaded = true;
      }
    } else {
      container.style.display = "none";
      toggleButton.textContent = "Show Student Details";
    }
  });

  function loadExcelData() {
    fetch("student_data/_19batch_2_I.xlsx")
      .then((res) => res.arrayBuffer())
      .then((ab) => {
        const workbook = XLSX.read(ab, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (json.length === 0) {
          container.innerHTML = "<p>No data found in Excel file.</p>";
          return;
        }

        let table = "<table border='1'><thead><tr>";
        json[0].forEach((heading) => {
          table += `<th>${heading}</th>`;
        });
        table += "</tr></thead><tbody>";

        for (let i = 1; i < json.length; i++) {
          table += "<tr>";
          json[i].forEach((cell) => {
            table += `<td>${cell ?? ""}</td>`;
          });
          table += "</tr>";
        }
        table += "</tbody></table>";

        container.innerHTML = table;
      })
      .catch((err) => {
        container.innerHTML = "<p style='color:red;'>Error loading Excel file.</p>";
        console.error(err);
      });
  }
});
