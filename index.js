//import modules
import cors from 'cors'
import path from 'path'
import express from 'express'
import { connectDB } from './db/connection.js'
import dotenv from 'dotenv'
import { globalErrorHandling } from './src/utils/AppError.js'
import userrouter from './src/modules/managment/managment.router.js'
import classrouter from './src/modules/classes/class.router.js'
import subjectrouter from './src/modules/subjectes/subject.router.js'
import schedulerouter from './src/modules/Schedules/Schedule.router.js'
import materialrouter from './src/modules/materials/material.router.js'
import assigmentrouter from './src/modules/assigments/assigment.router.js'
import linkrouter from './src/modules/linkes/link.router.js'
import reportrouter from './src/modules/reports/report.router.js'
import questionrouter from './src/modules/questiones/question.router.js'
import quizrouter from './src/modules/quizzes/quiz.router.js'
import graderouter from './src/modules/grades/grade.router.js'
import studentrouter from './src/modules/Students/student.router.js'
import parentrouter from './src/modules/Parents/parent.router.js'
import teacherrouter from './src/modules/Teachers/teacher.router.js'
import notificationrouter from './src/modules/notificationes/notification.router.js'
import attendancerouter from './src/modules/attendance/attendance.router.js'
import chatrouter from './src/modules/chat/chat.router.js'
import http from 'http'
import {Server} from 'socket.io'
import pronunciationrouter from './src/modules/pronunciation/pronunciation.router.js'


//create server
const app=express()
dotenv.config({ path:path.resolve('./config/.env') })
const port= process.env.PORT || 3000
connectDB()
//cors
const allowedOrigins = [
  "http://localhost:3000",
  "https://nursery-dash-board.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}))

//-----
// إنشاء سيرفر HTTP من Express
const server = http.createServer(app)

// إنشاء Socket.IO
const io = new Server(server)  
export { io };
// إعداد Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected')
})
//------------------
app.use(express.json())
app.use('/mana',userrouter)
app.use('/class',classrouter)
app.use('/subject',subjectrouter)
app.use('/schedule',schedulerouter)
app.use('/material',materialrouter)
app.use('/assigment',assigmentrouter)
app.use('/link',linkrouter)
app.use('/report',reportrouter)
app.use('/question',questionrouter)
app.use('/quiz',quizrouter)
app.use('/parent',parentrouter)
app.use('/student',studentrouter)
app.use('/teacher',teacherrouter)
app.use('/grade',graderouter)
app.use('/notification',notificationrouter)
app.use('/attendance', attendancerouter)
app.use('/chatbot',chatrouter)
app.use('/pronunciation',pronunciationrouter)

// global error
app.use(globalErrorHandling)
//listen server
server.listen(port,'0.0.0.0',()=>{
    console.log('server is running on port',port);  
})