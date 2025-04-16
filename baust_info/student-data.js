document.getElementById('showDataBtn').addEventListener('click', function () {
  const filePath = 'baust_info/student_data/_19batch_2_I.xlsx'; // Adjust this if hosted elsewhere
  const studentDetailsDiv = document.getElementById('studentDetails');
  const showButton = document.getElementById('showDataBtn');
  
  // Show loading message before data load
  studentDetailsDiv.innerHTML = '<p>Loading student data...</p>';
  
  // Make sure the file path is correct and the file is accessible
  fetch(filePath)
      .then(response => response.blob())
      .then(blob => {
          const reader = new FileReader();
          reader.onload = function (event) {
              const data = event.target.result;
              
              // Parse the Excel data here
              const workbook = XLSX.read(data, { type: 'binary' });

              // Assuming you want to display data from the first sheet
              const sheet = workbook.Sheets[workbook.SheetNames[0]];

              // Convert the sheet to JSON
              const jsonData = XLSX.utils.sheet_to_json(sheet);
              displayStudentData(jsonData);
          };
          reader.readAsBinaryString(blob);
      })
      .catch(error => {
          studentDetailsDiv.innerHTML = `<p>Error loading student data: ${error.message}</p>`;
      });

  // Function to display student data
  function displayStudentData(data) {
      let tableHTML = '<table><tr><th>SL</th><th>Roll</th><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Class Attendance</th><th>Status</th></tr>';
      
      data.forEach(student => {
          tableHTML += `<tr>
              <td>${student['SL']}</td>
              <td>${student['Roll']}</td>
              <td>${student['Name']}</td>
              <td>${student['Email']}</td>
              <td>${student['Phone']}</td>
              <td>${student['Address']}</td>
              <td>${student['Class Attendance(dd/mm/yyyy)']}</td>
              <td>${student['Status']}</td>
          </tr>`;
      });

      tableHTML += '</table>';
      
      // Update the page with the data
      studentDetailsDiv.innerHTML = tableHTML;
      showButton.textContent = 'Hide Student Details'; // Change the button text to 'Hide'
      studentDetailsDiv.style.display = 'block'; // Make the student details visible
  }
});
