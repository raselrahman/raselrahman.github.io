document.querySelector('.accordion-button').addEventListener('click', () => {
  const content = document.querySelector('.accordion-content');
  content.style.display = content.style.display === 'block' ? 'none' : 'block';
});

document.getElementById('file-input').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    const data = new Uint8Array(evt.target.result);
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
  };
  reader.readAsArrayBuffer(file);
});
