document.addEventListener("DOMContentLoaded", () => {
  const excelUrl = "https://raselrahman.github.io/baust_info/student_data/_19batch_2_I.xlsx";

  fetch(excelUrl)
    .then(res => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.arrayBuffer();
    })
    .then(data => {
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.SheetNames[0];
      const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { header: 1 });

      let html = "<table><thead><tr>";
      rows[0].forEach(h => html += `<th>${h}</th>`);
      html += "</tr></thead><tbody>";

      for (let i = 1; i < rows.length; i++) {
        html += "<tr>";
        rows[i].forEach(c => html += `<td>${c !== undefined ? c : ''}</td>`);
        html += "</tr>";
      }
      html += "</tbody></table>";

      document.getElementById('student-table').innerHTML = html;
    })
    .catch(err => {
      document.getElementById('student-table').innerHTML = "<p>Error loading Excel file.</p>";
      console.error("Fetch error:", err);
    });
});
