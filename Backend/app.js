import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './src/routes/authRoutes.js'
import signupRoutes from './src/routes/signupRoutes.js'
import internshipRoutes from './src/routes/internshipRoutes.js'
import applicationRoutes from './src/routes/applicationRoutes.js'
import notificationRoutes from './src/routes/notificationRoutes.js'
import internProfileRoutes from './src/routes/internProfileRoutes.js'
import companyProfileRoutes from './src/routes/companyProfileRoutes.js'
import messageRoutes from './src/routes/messageRoutes.js'
import adminRoutes from './src/routes/adminRoutes.js'

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
app.use('/api/internships', internshipRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/intern', internProfileRoutes)
app.use('/api/company', companyProfileRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/admin', adminRoutes)


app.listen(PORT, () => console.log(`Backend server is running on http://localhost:${PORT}`))