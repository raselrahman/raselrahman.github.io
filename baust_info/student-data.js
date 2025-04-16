document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".toggle-btn");

  buttons.forEach(button => {
    button.addEventListener("click", async function () {
      const tableContainer = this.nextElementSibling;
      const filePath = "baust_info/" + this.getAttribute("data-file");

      if (tableContainer.style.display === "none") {
        this.textContent = "Hide Student Details";
        tableContainer.innerHTML = "Loading student data...";

        try {
          const response = await fetch(filePath);
          const arrayBuffer = await response.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: "array" });

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

          if (jsonData.length === 0) {
            tableContainer.innerHTML = "No data found in Excel.";
            return;
          }

          // Create table
          const table = document.createElement("table");
          const headerRow = document.createElement("tr");

          Object.keys(jsonData[0]).forEach(key => {
            const th = document.createElement("th");
            th.textContent = key;
            headerRow.appendChild(th);
          });
          table.appendChild(headerRow);

          jsonData.forEach(row => {
            const tr = document.createElement("tr");
            Object.values(row).forEach(cell => {
              const td = document.createElement("td");
              td.textContent = cell;
              tr.appendChild(td);
            });
            table.appendChild(tr);
          });

          tableContainer.innerHTML = "";
          tableContainer.appendChild(table);
          tableContainer.style.display = "block";

        } catch (error) {
          console.error(error);
          tableContainer.innerHTML = "Error loading Excel file.";
        }
      } else {
        this.textContent = "Show Student Details";
        tableContainer.style.display = "none";
      }
    });
  });
});
