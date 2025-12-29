import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './src/routes/authRoutes.js'
import signupRoutes from './src/routes/signupRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - body:`, req.body)
	next()
})

app.use('/api/auth', authRoutes)
app.use('/api', signupRoutes)

app.listen(PORT, () => console.log(`Backend server is running on http://localhost:${PORT}`))