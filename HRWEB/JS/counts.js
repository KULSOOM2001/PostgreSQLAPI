const Link = "https://stunning-disco-jj9vrjgx64q53pg4w-5005.app.github.dev/totalcounts";

fetch(Link).then(response=>{
    if (!response.ok) {
            throw new Error("Failed To Fetch Data");
    }
    return response.json();
}).then(data=>{
        document.getElementById('employeeBox').innerHTML = `Total Employees: ${data.employees}`;
        document.getElementById('countryBox').innerHTML = `Total Countries: ${data.countries}`;
        document.getElementById('jobBox').innerHTML = `Total Jobs: ${data.jobs}`;
        document.getElementById('deptBox').innerHTML = `Total Dept: ${data.dept}`;
        document.getElementById('locationBox').innerHTML = `Total Locations: ${data.location}`;
        document.getElementById('regionBox').innerHTML = `Total Regions: ${data.regions}`;
        document.getElementById('job_historyBox').innerHTML = `Total Job_Histories: ${data.job_history}`;
    })
    .catch(err => {
        console.log(err.message);
    });