const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/',async(req,res)=>{
    try{
        res.json('WELCOME TO HR API')
    }catch(err){
        res.status(500).json({Error:err.message})
    }
});

app.get('/region',async(req,res)=>{
    try{
        const result= await pool.query('select * from regions');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message})
    }
});


app.get('/country',async(req,res)=>{
    try{
        const result= await pool.query('select * from countries');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message})
    }
});

app.get('/jobs',async(req,res)=>{
    try{
        const result= await pool.query('select * from jobs');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message})
    }
});

app.get('/NoOfJobs',async(req,res)=>{
    try{
        const result= await pool.query('select count(job_id) from jobs');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message})
    }
});

app.get('/departments',async(req,res)=>{
    try{
        const result= await pool.query('select * from departments');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message})
    }
});

app.get('/NoOfDepartments',async(req,res)=>{
    try{
        const result= await pool.query('select count(department_id) from departments');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message})
    }
});

app.get('/locations',async(req,res)=>{
    try{
        const result= await pool.query('select * from locations');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message})
    }
});

app.get('/NoOfLocations',async(req,res)=>{
    try{
        const result= await pool.query('select count(location_id) from locations');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message})
    }
});

app.get('/no of employee',async(req,res)=>{
    try{
        const result= await pool.query('select count(employee_id) from employees');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message})
    }
});

app.get('/employee',async(req,res)=>{
    try{
        const result= await pool.query('select * from employees');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message})
    }
});

app.get('/employee-location-country', async (req, res) => {
    try {
      res.json((await pool.query(`SELECT e.employee_id, e.first_name || ' ' || e.last_name AS full_name, c.country_name FROM employees e JOIN departments d ON e.department_id = d.department_id JOIN locations l ON d.location_id = l.location_id JOIN countries c ON l.country_id = c.country_id`)).rows);
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  });

  app.get('/min-salary-by-dept', async (req, res) => {
    try {
      res.json((await pool.query(`SELECT first_name, last_name, salary, department_id FROM employees WHERE salary IN (SELECT MIN(salary) FROM employees GROUP BY department_id)`)).rows);
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  });
  
  app.get('/third-highest-salary', async (req, res) => {
    try {
      res.json((await pool.query(`SELECT * FROM employees WHERE salary = (SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 2)`)).rows);
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  });
 
  app.get('/above-avg-salary-with-j-name', async (req, res) => {
    try {
      res.json((await pool.query(`SELECT employee_id, first_name || ' ' || last_name AS name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees) AND department_id IN (SELECT department_id FROM employees WHERE first_name LIKE '%J%' OR last_name LIKE '%J%')`)).rows);
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  });

  app.get('/employees-in-toronto', async (req, res) => {
    try {
      res.json((await pool.query(`SELECT e.first_name || ' ' || e.last_name AS name, e.employee_id, j.job_title FROM employees e JOIN departments d ON e.department_id = d.department_id JOIN locations l ON d.location_id = l.location_id JOIN jobs j ON e.job_id = j.job_id WHERE l.city = 'Toronto'`)).rows);
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  });
  
  app.get('/total-salary-by-dept', async (req, res) => {
    try {
      res.json((await pool.query(`SELECT department_id, SUM(salary) AS total_salary FROM employees GROUP BY department_id`)).rows);
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  });
 
  app.get('/salary-status', async (req, res) => {
    try {
      res.json((await pool.query(`SELECT employee_id, first_name || ' ' || last_name AS name, salary, CASE WHEN salary > (SELECT AVG(salary) FROM employees) THEN 'HIGH' ELSE 'LOW' END AS Salary_Status FROM employees`)).rows);
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  });

  app.get('/employees-in-uk', async (req, res) => {
    try {
      res.json((await pool.query(`SELECT e.* FROM employees e JOIN departments d ON e.department_id = d.department_id JOIN locations l ON d.location_id = l.location_id JOIN countries c ON l.country_id = c.country_id WHERE c.country_name = 'United Kingdom'`)).rows);
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  });

  app.get('/high-salary-share', async (req, res) => {
    try {
      res.json((await pool.query(`SELECT e.* FROM employees e JOIN (SELECT department_id, SUM(salary) AS total_salary FROM employees GROUP BY department_id) dept_salary ON e.department_id = dept_salary.department_id WHERE e.salary > 0.5 * dept_salary.total_salary`)).rows);
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  });
  
  app.get('/managers', async (req, res) => {
    try {
      res.json((await pool.query(`SELECT e.* FROM employees e WHERE e.employee_id IN (SELECT DISTINCT manager_id FROM departments WHERE manager_id IS NOT NULL)`)).rows);
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  });
  
  app.get('/max-salary-2002-2003', async (req, res) => {
    try {
      res.json((await pool.query(`SELECT e.employee_id, e.first_name || ' ' || e.last_name AS name, e.salary, d.department_name, l.city FROM employees e JOIN departments d ON e.department_id = d.department_id JOIN locations l ON d.location_id = l.location_id WHERE e.salary = (SELECT MAX(salary) FROM employees WHERE hire_date BETWEEN '2002-01-01' AND '2003-12-31')`)).rows);
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  });
  
  app.get('/laura-dept-low-salary', async (req, res) => {
    try {
      res.json((await pool.query(`SELECT e.first_name, e.last_name, e.salary, e.department_id FROM employees e WHERE e.salary < (SELECT AVG(salary) FROM employees) AND e.department_id = (SELECT department_id FROM employees WHERE first_name = 'Laura' LIMIT 1)`)).rows);
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  });
  
  app.get('/depts-multi-job-7000plus', async (req, res) => {
    try {
      res.json((await pool.query(`SELECT d.* FROM departments d JOIN employees e ON d.department_id = e.department_id JOIN jobs j ON e.job_id = j.job_id WHERE j.max_salary >= 7000 AND e.employee_id IN (SELECT employee_id FROM job_history GROUP BY employee_id HAVING COUNT(*) > 1)`)).rows);
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  });
  
  app.get('/min-postal-length-region', async (req, res) => {
    try {
      res.json((await pool.query(`SELECT r.region_id, MIN(LENGTH(l.postal_code)) AS min_postal_length FROM regions r JOIN countries c ON r.region_id = c.region_id JOIN locations l ON c.country_id = l.country_id GROUP BY r.region_id`)).rows);
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  });
  
  app.get('/employees-by-hire-date-desc', async (req, res) => {
    try {
      res.json((await pool.query(`SELECT * FROM employees ORDER BY hire_date DESC`)).rows);
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  });
  
const PORT =process.env.PORT || 6005;
app.listen(PORT,()=>{
    console.log(`Connected Successfully...on PORT ${PORT}`)
});