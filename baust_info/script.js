// Accordion toggle
document.querySelector('.accordion-button').addEventListener('click', () => {
    const content = document.querySelector('.accordion-content');
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
  });
  
  // Load Excel data
  fetch('_19batch_2_I.xlsx')
    .then(res => res.arrayBuffer())
    .then(ab => {
      const workbook = XLSX.read(ab, { type: "array" });
      const firstSheet = workbook.SheetNames[0];
      const data = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], { header: 1 });
  
      let html = "<table><thead><tr>";
      data[0].forEach(header => {
        html += `<th>${header}</th>`;
      });
      html += "</tr></thead><tbody>";
  
      for (let i = 1; i < data.length; i++) {
        html += "<tr>";
        data[i].forEach(cell => {
          html += `<td>${cell !== undefined ? cell : ''}</td>`;
        });
        html += "</tr>";
      }
  
      html += "</tbody></table>";
      document.getElementById("student-table").innerHTML = html;
    })
    .catch(err => {
      document.getElementById("student-table").innerHTML = `<p>Error loading Excel file.</p>`;
      console.error(err);
    });
  