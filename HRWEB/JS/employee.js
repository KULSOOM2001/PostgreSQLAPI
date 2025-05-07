

const Link = "https://stunning-disco-jj9vrjgx64q53pg4w-5005.app.github.dev/employee";
fetch(Link).then(response=>{
    if(!response.ok){
        throw new Error("failed to fetch");
    }
    return response.json();
}).then(data=>{
const tbody=document.querySelector("#EmployeeTable tbody");
data.forEach(c=>{
    const row=document.createElement("tr");
    row.innerHTML=`
    <td>${c.employee_id}</td>
    <td>${c.first_name}</td>
    <td>${c.last_name}</td>
    <td>${c.email}</td>
    <td>${c.phone_number}</td>
    
    `;
    tbody.appendChild(row);
});
}
).catch(error=>{
    console.log(error.message);
});