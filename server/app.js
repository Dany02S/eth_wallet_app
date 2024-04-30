require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const connection = require('./db')

connection()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})