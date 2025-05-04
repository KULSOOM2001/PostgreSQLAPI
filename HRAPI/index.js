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
app.get('/job-history-details', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT jh.*, e.first_name, e.last_name, j.job_title, c.country_name
            FROM job_history jh
            JOIN employees e ON jh.employee_id = e.employee_id
            JOIN jobs j ON jh.job_id = j.job_id
            JOIN departments d ON jh.department_id = d.department_id
            JOIN locations l ON d.location_id = l.location_id
            JOIN countries c ON l.country_id = c.country_id
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
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

app.get('/employee',async(req,res)=>{
    try{
        const result= await pool.query('select count(employee_id) from employees');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message})
    }
});

const PORT =process.env.PORT || 6005;
app.listen(PORT,()=>{
    console.log(`Connected Successfully...on PORT ${PORT}`)
});