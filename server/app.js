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
const qrcodeRouter = require('./routes/qrcodeUser')
const verifyRouter = require('./routes/verifyUser')
const change2faRouter = require('./routes/change2faUser')
const restoreAccountRouter = require('./routes/restoreAccount')
const getAIAnswer = require('./routes/aiChatResponse')



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
app.use('/api/qrcode', qrcodeRouter)
app.use('/api/verify', verifyRouter)
app.use('/api/change2fa', change2faRouter)
app.use('/api/restoreaccount', restoreAccountRouter)
app.use('/api/aiAnswer', getAIAnswer)


// Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})