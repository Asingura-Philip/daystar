const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()




app.use(cors());
app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

const auth = require('./routes/authroutes')


app.use('/',auth)


app.listen(4400,()=>{
    console.log(`server running on port 4400`)
})