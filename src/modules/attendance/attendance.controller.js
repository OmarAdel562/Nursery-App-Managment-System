import { Attendance } from '../../../db/models/Attendance.model.js';
import { Student } from '../../../db/models/Student.model.js';
import { AppErorr } from '../../utils/appError.js';
import { message } from '../../utils/constant/messages.js';
 import axios from 'axios';



// ---------------------1-تسجيل الحضور---------------------------------
export const markAttendance = async (req, res) => {
  const response = await axios.get('http://localhost:5001/api/face-recognition');
  const recognizedId = response.data.recognized_name

  if (recognizedId === "Unknown") {
    return next( new AppErorr(message.student.notFound,404))
  }
   // check student existance
   const student = await Student.findOne({ userId: recognizedId }); 
   if (!student) {
    return next( new AppErorr(message.student.notFound,404))
   }
  const attendance = new Attendance({
    studentId: recognizedId,
    date: new Date(),
    status: 'present',
  })

  const createdattendance = await attendance.save()
  if(!createdattendance){
          return next( new AppErorr(message.attendance.fileToCreate,500))
       }

    return res.status(201).json({message:message.attendance.createsuccessfully,
         success:true,
         data:createdattendance})
 
 }

// --------------------------2-تسجيل الانصراف---------------------------------
export const leaveAttendance = async (req, res) => {
  const response = await axios.get('http://localhost:5001/api/face-recognition');
  const recognizedId = response.data.recognized_name
  if (recognizedId === "Unknown") {
    return next( new AppErorr(message.student.notFound,404))
  }
   // check student existance
   const student = await Student.findOne({ userId: recognizedId }); 
   if (!student) {
    return next( new AppErorr(message.student.notFound,404))
   }
  const attendance = new Attendance({
    studentId: recognizedId,
    date: new Date(),
    status: 'leave',
  })
  const createdleave=await attendance.save()
  if(!createdleave){
          return next( new AppErorr(message.attendance.fileToCreate,500))
       }
    return res.status(201).json({message:message.attendance.createsuccessfully,
         success:true,
         data:createdleave})
 }
