const dateInput = document.getElementById("date");
const locationInput = document.getElementById("location");
const inspectorInput = document.getElementById("inspector");
const chassisInput = document.getElementById("chassis");
const notesInput = document.getElementById("notes");
const output = document.getElementById("output");

dateInput.value = new Date().toISOString().split("T")[0];

function generateReport() {
  const date = dateInput.value;
  const location = locationInput.value.trim();
  const inspector = inspectorInput.value.trim();
  const chassis = chassisInput.value.trim();
  const notes = notesInput.value.trim();

  const report = `End of Day Report

Date: ${date}

End of Day Report for:
${location}

Inspector:
${inspector}

CHASSIS
${chassis}

OTHER NOTES
${notes}`;

  output.textContent = report;
}

function copyReport() {
  if (!output.textContent.trim()) {
    generateReport();
  }

  navigator.clipboard.writeText(output.textContent)
    .then(() => {
      alert("Report copied!");
    })
    .catch(() => {
      alert("Unable to copy automatically. Please select and copy the report.");
    });
}

function clearForm() {
  locationInput.value = "";
  inspectorInput.value = "";
  chassisInput.value = "";
  notesInput.value = "";
  output.textContent = "";
}

document.addEventListener("DOMContentLoaded", () => {
  const generateButton = document.querySelector(
    'button[onclick="generateReport()"]'
  );

  const copyButton = document.querySelector(
    'button[onclick="copyReport()"]'
  );

  if (generateButton) {
    generateButton.addEventListener("click", generateReport);
  }

  if (copyButton) {
    copyButton.addEventListener("click", copyReport);
  }
});