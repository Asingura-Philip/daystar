const express = require ('express')
const router = express.Router()
const connection = require('../models/db')
const bcrypt = require('bcrypt');


router.post('/register', async (req, res) => {
    console.log(req.body);
    const { 
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        role,
        phoneNumber,
        address,
        emergencyContact,
        emergencyPhone,
        position,
        experience,
        qualifications,
        childrenCount,
        specialNeeds,
     } = req.body;
  
    try {
      // Check if user already exists
      const existingUser = await new Promise((resolve, reject) => {
        connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
  
      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Convert empty string to NULL for childrenCount
      const finalChildrenCount = childrenCount === '' ? null : childrenCount;

  
      // Insert new user into the database
      const sql = `
  INSERT INTO users (
    firstName, 
    lastName, 
    email, 
    password, 
    role, 
    phoneNumber, 
    address, 
    emergencyContact, 
    emergencyPhone, 
    position, 
    experience, 
    qualifications, 
    childrenCount, 
    specialNeeds
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const values = [
  firstName,
  lastName,
  email,
  hashedPassword,
  role,
  phoneNumber,
  address,
  emergencyContact,
  emergencyPhone,
  position,
  experience,
  qualifications,
  finalChildrenCount,
  specialNeeds
];

  
      await new Promise((resolve, reject) => {
        connection.query(sql, values, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
  
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  module.exports = router;