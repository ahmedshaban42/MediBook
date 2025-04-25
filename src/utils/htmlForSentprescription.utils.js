


export const generatePrescriptionHTML = (data) => `
  <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f4f4;
          padding: 40px;
        }
        .container {
          background-color: #fff;
          border-radius: 12px;
          padding: 30px;
          max-width: 700px;
          margin: auto;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
          border: 1px solid #ddd;
        }
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #3498db;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .clinic-info {
          font-size: 14px;
          color: #555;
        }
        h1 {
          color: #3498db;
          margin: 0;
        }
        .section {
          margin: 20px 0;
        }
        .label {
          font-weight: bold;
          color: #2c3e50;
        }
        ul {
          padding-left: 20px;
          margin-top: 5px;
        }
        .footer {
          margin-top: 30px;
          text-align: right;
          font-size: 14px;
          color: #888;
        }
        .signature {
          margin-top: 50px;
          text-align: right;
          font-style: italic;
          color: #2c3e50;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <div>
            <h1>Medical Prescription</h1>
            <div class="clinic-info">
              Dr. ${data.doctorName}<br/>
              ${data.doctorspecialization}<br/>
              ${data.doctorphone}
            </div>
          </div>
          <div>
            <img src="https://i.imgur.com/U4tFfTg.png" alt="clinic logo" width="80" />
          </div>
        </header>

        <div class="section"><span class="label">Date:</span> ${new Date().toLocaleDateString()}</div>
        <div class="section"><span class="label">Appointment ID:</span> ${data.appointmentID}</div>
        <div class="section"><span class="label">Patient Name:</span> ${data.patientName}</div>
        <div class="section"><span class="label">Diagnosis:</span> ${data.diagnosis}</div>

        <div class="section">
          <span class="label">Medications:</span>
          <ul>
            ${data.medications.map(med => `<li>${med}</li>`).join("")}
          </ul>
        </div>

        <div class="section">
          <span class="label">requestedTests:</span>
          <ul>
            ${data.requestedTests.map(req => `<li>${req}</li>`).join("")}
          </ul>
        </div>

        <div class="section"><span class="label">Notes:</span> ${data.notes}</div>

        <div class="signature">Dr. ${data.doctorName}</div>

        <div class="footer">This prescription is computer-generated and does not require a physical signature.</div>
      </div>
    </body>
  </html>
`;
