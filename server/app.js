require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const connection = require('./db')

const userRoutes = require('./routes/userRoutes')
const twoFARouter = require('./routes/twoFARouter')
const accountRoutes = require('./routes/accountRoutes')

// Middlewares
connection()
app.use(express.json())
app.use(cors())

// Routes
app.use('/api', userRoutes)
app.use('/api', twoFARouter)
app.use('/api', accountRoutes)

// Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})