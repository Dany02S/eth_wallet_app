require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const connection = require('./db')

// Routes
const loginRouter = require('./routes/loginUser')
const registerRouter = require('./routes/registerUser')
const pageRouter = require('./routes/pageUser')
const accountRouter = require('./routes/pageAccount')
const transactionRouter = require('./routes/pageTransaction')


// Middlewares
connection()
app.use(express.json())
app.use(cors())

// Routes
app.use('/api/login', loginRouter)
app.use('/api/register', registerRouter)
app.use('/api/user', pageRouter)
app.use('/api/account', accountRouter)
app.use('/api/transaction', transactionRouter)

// Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})