require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const connection = require('./db')
const authRouter = require('./routes/login')
const usersRouter = require('./routes/registerUser')

connection()
app.use(express.json())
app.use(cors())


app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})