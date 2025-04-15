const express = require ('express')
const router = express.Router()
// const connection = require('../models/db')
const mysql = require('mysql2/promise'); 

const pool = mysql.createPool({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.MARIADBPASSWORD,
  database: process.env.DB_NAME,
});


router.get('/children', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM children ORDER BY id DESC');
      res.json(Array.isArray(rows) ? rows : []);
    } catch (err) {
      console.error('Error fetching children:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.delete('/children/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const [result] = await pool.query('DELETE FROM children WHERE id = ?', [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Child not found' });
      }
  
      res.json({ message: 'Child deleted successfully' });
    } catch (err) {
      console.error('Error deleting child:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
router.post('/children', async (req, res) => {
    const { firstName, lastName, dateOfBirth, gender, parentName, parentPhone, parentEmail, address, emergencyContact, medicalInfo, enrollmentDate, status } = req.body;

    try {
        // Insert new child (assuming you're inserting new rows)
        const [result] = await pool.query(
        'INSERT INTO children (firstName, lastName, dateOfBirth, gender, parentName, parentPhone, parentEmail, address, emergencyContact, medicalInfo, enrollmentDate, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [firstName, lastName, dateOfBirth, gender, parentName, parentPhone, parentEmail, address, emergencyContact, medicalInfo, enrollmentDate, status]
        );

        res.status(201).json({ id: result.insertId, message: 'Child added successfully' });
    } catch (err) {
        console.error('Error saving child:', err);
        res.status(500).json({ error: 'Failed to save child' });
    }
});

// Function to format the date into MySQL-compatible format (YYYY-MM-DD)
function formatDateForMySQL(isoDate) {
    return isoDate.split('T')[0]; // Get only the date part (YYYY-MM-DD)
  }
  
  // Function to format the date into MySQL-compatible DATETIME format (YYYY-MM-DD HH:MM:SS)
function formatDateTimeForMySQL(isoDate) {
    const date = new Date(isoDate);
    return date.toISOString().slice(0, 19).replace('T', ' '); // Format as 'YYYY-MM-DD HH:MM:SS'
}

router.put('/children/:id', async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, dateOfBirth, gender, parentName, parentPhone, parentEmail, address, emergencyContact, medicalInfo, enrollmentDate, status } = req.body;
  
    // Format the date fields for MySQL compatibility
    const dateOfBirthFormatted = formatDateForMySQL(dateOfBirth);
    const enrollmentDateFormatted = formatDateForMySQL(enrollmentDate);  // Assuming it's also in ISO format
  
    try {
      const [result] = await pool.query(
        'UPDATE children SET firstName = ?, lastName = ?, dateOfBirth = ?, gender = ?, parentName = ?, parentPhone = ?, parentEmail = ?, address = ?, emergencyContact = ?, medicalInfo = ?, enrollmentDate = ?, status = ? WHERE id = ?',
        [firstName, lastName, dateOfBirthFormatted, gender, parentName, parentPhone, parentEmail, address, emergencyContact, medicalInfo, enrollmentDateFormatted, status, id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Child not found' });
      }
  
      res.json({ message: 'Child updated successfully' });
    } catch (err) {
      console.error('Error updating child:', err);
      res.status(500).json({ error: 'Failed to update child', details: err.message });
    }
  });
  


module.exports = router;