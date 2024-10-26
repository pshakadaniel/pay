let jobCount = 0;

// Function to load saved jobs from localStorage
function loadJobs() {
  const savedJobs = JSON.parse(localStorage.getItem("jobs")) || [];
  savedJobs.forEach((job) => {
    addJob(job.jobName, job.jobDate, job.rate, job.hours, job.status); // Include status
  });
}

// Function to save jobs to localStorage
function saveJobs() {
  const jobs = [];
  for (let i = 1; i <= jobCount; i++) {
    const jobName = document.getElementById(`job-name-${i}`).value;
    const jobDate = document.getElementById(`job-date-${i}`).value;
    const rate = document.getElementById(`rate-${i}`).value;
    const hours = document.getElementById(`hours-${i}`).value;
    const status = document.getElementById(`status-${i}`).value; // Capture status

    if (jobName && jobDate && rate && hours && status) {
      jobs.push({
        jobName: jobName,
        jobDate: jobDate,
        rate: parseFloat(rate),
        hours: parseFloat(hours),
        status: status, // Save status to localStorage
      });
    }
  }
  localStorage.setItem("jobs", JSON.stringify(jobs));
}

// Function to add a new job row to the table
function addJob(
  jobName = "",
  jobDate = "",
  rate = "",
  hours = "",
  status = ""
) {
  jobCount++;

  const jobContainer = document.getElementById("job-container");
  const jobRow = document.createElement("tr");
  jobRow.setAttribute("id", `job-${jobCount}`);

  jobRow.innerHTML = `
        <td><input type="text" id="job-name-${jobCount}" value="${jobName}" placeholder="Job name"></td>
        <td><input type="date" id="job-date-${jobCount}" value="${jobDate}"></td>
        <td><input type="number" id="rate-${jobCount}" value="${rate}" placeholder="Rate per hour"></td>
        <td><input type="number" id="hours-${jobCount}" value="${hours}" placeholder="Total hours"></td>
        <td>
          <select id="status-${jobCount}" class="status-dropdown">
            <option value="yes" ${
              status === "yes" ? "selected" : ""
            }>Yes</option>
            <option value="no" ${status === "no" ? "selected" : ""}>No</option>
          </select>
        </td>
        <td><button class="remove-btn" onclick="removeJob(${jobCount})">Remove</button></td>
    `;

  jobContainer.appendChild(jobRow);

  // Add event listeners to input fields to save on change
  attachInputListeners(jobCount); // Set initial color based on status
  const statusSelect = document.getElementById(`status-${jobCount}`);
  updateStatusColor(statusSelect);

  // Add event listener to change color when status changes
  statusSelect.addEventListener("change", () =>
    updateStatusColor(statusSelect)
  );

  saveJobs(); // Save jobs after adding a new one
}
function updateStatusColor(selectElement) {
  if (selectElement.value === "yes") {
    selectElement.style.backgroundColor = "#80ed99";
  } else if (selectElement.value === "no") {
    selectElement.style.backgroundColor = "#ad2831";
  }
}
// Attach input listeners to save data on change
function attachInputListeners(count) {
  const jobNameInput = document.getElementById(`job-name-${count}`);
  const jobDateInput = document.getElementById(`job-date-${count}`);
  const rateInput = document.getElementById(`rate-${count}`);
  const hoursInput = document.getElementById(`hours-${count}`);
  const statusSelect = document.getElementById(`status-${count}`);

  jobNameInput.addEventListener("change", saveJobs);
  jobDateInput.addEventListener("change", saveJobs);
  rateInput.addEventListener("change", saveJobs);
  hoursInput.addEventListener("change", saveJobs);
  statusSelect.addEventListener("change", saveJobs);
}

// Load saved jobs on page load
window.onload = loadJobs;

// Function to remove a specific job row and update localStorage
function removeJob(jobId) {
  const jobRow = document.getElementById(`job-${jobId}`);
  if (jobRow) {
    jobRow.remove();
  }

  // Update jobCount
  jobCount = document.getElementById("job-container").children.length;

  // Check if there are any jobs left, if not clear localStorage
  if (jobCount === 0) {
    localStorage.removeItem("jobs"); // Clear localStorage if no jobs remain
  } else {
    saveJobs(); // Otherwise, save the current jobs to localStorage
  }
}

// Function to clear all jobs and localStorage
function clearAllJobs() {
  document.getElementById("job-container").innerHTML = ""; // Remove all job elements from the DOM
  localStorage.removeItem("jobs"); // Clear jobs from localStorage
  jobCount = 0; // Reset the job count
}

// Function to calculate the total payment for all jobs
function calculateTotalPayment() {
  let totalPayment = 0;

  for (let i = 1; i <= jobCount; i++) {
    const rate = document.getElementById(`rate-${i}`);
    const hours = document.getElementById(`hours-${i}`);

    if (rate && hours) {
      const rateValue = parseFloat(rate.value);
      const hoursValue = parseFloat(hours.value);

      // Only calculate if valid numbers are entered
      if (!isNaN(rateValue) && !isNaN(hoursValue)) {
        totalPayment += rateValue * hoursValue;
      }
    }
  }

  // Display the total payment result
  document.getElementById(
    "total-result"
  ).innerHTML = `Total Payment: $${totalPayment.toFixed(2)}`;
  saveJobs(); // Save the jobs to localStorage whenever calculation is done
}

// Function to sort the jobs based on the selected option
function sortJobs() {
  const sortOption = document.getElementById("sort-options").value;

  const jobs = [];
  for (let i = 1; i <= jobCount; i++) {
    const jobName = document.getElementById(`job-name-${i}`).value;
    const jobDate = document.getElementById(`job-date-${i}`).value;
    const rate = document.getElementById(`rate-${i}`).value;
    const hours = document.getElementById(`hours-${i}`).value;
    const status = document.getElementById(`status-${i}`).value; // Capture status

    if (jobName && jobDate && rate && hours) {
      jobs.push({
        id: i,
        jobName: jobName,
        jobDate: jobDate,
        rate: parseFloat(rate),
        hours: parseFloat(hours),
        status: status, // Include status
      });
    }
  }

  // Sorting logic based on the selected option
  if (sortOption === "name") {
    jobs.sort((a, b) => a.jobName.localeCompare(b.jobName));
  } else if (sortOption === "date") {
    jobs.sort((a, b) => new Date(a.jobDate) - new Date(b.jobDate));
  } else if (sortOption === "rate") {
    jobs.sort((a, b) => a.rate - b.rate);
  } else if (sortOption === "hours") {
    jobs.sort((a, b) => a.hours - b.hours);
  } else if (sortOption === "status") {
    jobs.sort((a, b) => {
      // Define a custom order for sorting statuses
      const statusOrder = { yes: 1, no: 0 };
      return statusOrder[a.status] - statusOrder[b.status];
    });
  }

  // Clear the current job list and re-render sorted jobs
  document.getElementById("job-container").innerHTML = "";
  jobCount = 0; // Reset job count
  jobs.forEach((job) => {
    addJob(job.jobName, job.jobDate, job.rate, job.hours, job.status); // Include status
  });

  saveJobs(); // Save the sorted jobs to localStorage
}
