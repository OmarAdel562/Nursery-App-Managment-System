import { Quiz } from "../../../db/models/Quiz.model.js"
import { QuizAttempts } from "../../../db/models/QuizAttempts.model.js"
import { Schedule } from "../../../db/models/Schedule.model.js"
import { Student } from "../../../db/models/Student.model.js"
import { Teacher } from "../../../db/models/Teacher.model.js"
import { User } from "../../../db/models/User.model.js"
import { AppErorr } from "../../utils/AppErrorr.js"
import { message } from "../../utils/constant/messages.js"


//-------------------------- Teacher----------------------
    //--------------------------1-add Teacher------------------------
    export const addTeacher=async(req,res,next) =>{
    //get data from req
    const {userId , classId,subjectes}=req.body
     if (!Array.isArray(subjectes) || subjectes.length === 0) {
        return res.status(400).json({ message: "subjectes must be a non-empty array", success: false });
    }
    //check existance
    const teacherExist=await Teacher.findOne({userId})
    if(teacherExist){
       return next( new AppErorr(message.teacher.alreadyExist,409))
    }
     //check userexistance
     const userExist=await User.findById(userId)
     if(!userExist){
        return next( new AppErorr(message.user.notFound,404))
     }
     
    //prepare data
    
     const teacher= new Teacher({
        userId,
        classId,
        subjectes,
        createdBy:req.authUser._id
     })
     //add to db
     const createdteacher=await teacher.save()
     if(!createdteacher){
        return next( new AppErorr(message.teacher.fileToCreate,500))
     }
     return res.status(201).json({message:message.teacher.createsuccessfully,
        success:true,
        data:createdteacher})

}
    //---------------2-update Teacher---------------
    export const updateTeacher= async (req,res,next) => {
        //get data from req
        let {userId , classId,subjectes }=req.body
        const { teacherId } =req.params
        
    
        //check existance
        const teachertExist= await Teacher.findById(teacherId)
        if(!teachertExist){
            return next( new AppErorr(message.teacher.notFound,404))
        }
        //check userexistance
          const userExist=await User.findById(userId)
           if(!userExist){
            return next( new AppErorr(message.user.notFound,404))
          }
        // prepare data
        teachertExist.userId = userId || teachertExist.userId;
        teachertExist.classId = classId || teachertExist.classId;
        teachertExist.subjectes = subjectes || teachertExist.subjectes;
        
    
        //update  to db
        const updateteacher= await teachertExist.save()
        if(!updateteacher){
            return next( new AppErorr(message.teacher.fileToUpdate,500))
        }
        //send response
        return res.status(200).json({
            message:message.teacher.updatesuccessfully,
            success:true,
            data:updateteacher })
}
   //---------------------3-getall Teacher----------------------------
    export const getallTeacher= async (req,res,next) => {
    //get data from req
    const teacher=await Teacher.find().populate("userId","name").select("name")
    res.status(200).json({message:"get successfully",success:true,data:teacher})      
}
   //---------------4-get specific Teacher-------------------------
   export const getspecificTeacher= async (req,res,next) => {
    //get data from req
    const { teacherId } =req.params
    const teacher=await Teacher.findById(teacherId).populate("userId","name").select("name")
    teacher?
    res.status(200).json({message:"get successfully", success:true,data:teacher})
        : next (new AppErorr(message.teacher.notFound,404))
}
   //-------------5-delete Teacher-------------------------------------
  export const DeleteTeacher= async (req,res,next) => {
    //get data from req
    const { teacherId } =req.params
        const teacher = await Teacher.findByIdAndDelete(teacherId).select("name")
        if (!teacher) {
          return next(new AppErorr(message.teacher.notFound, 404));
        }
       //send response
       return res.status(200).json({
        message:message.teacher.deletesuccessfully,
        success:true
    })
}
//---------------------6-get-Teacher-Data---------------
export const getTeacherData = async (req, res, next) => {
    const teacherId = req.authUser._id
    // get data
    const teacher = await Teacher.findOne({ userId: teacherId })
    .populate({path: 'userId',select: ' profilePic name email gander phone'})
    .populate({path: 'subjectes',select: 'name'})
    // check teacher existance
    if (!teacher) {
        return next( new AppErorr(message.teacher.notFound,404))
        }
    res.status(200).json({
        message:"get successfully",
        success: true,
        data: {
          profilePic: teacher.userId.profilePic?.secure_url || null,  
          teacherName: teacher.userId.name,
          gender: teacher.userId.gander,
          email: teacher.userId.email,
          phone: teacher.userId.phone,
          subjects: teacher.subjectes.map(subject => subject.name) } })
}
//----------------7-get-teacher-Schedule-----------
export const getTeacherSchedule = async (req, res, next) => {
    
    const teacherId = req.authUser._id;
    const teacher = await Teacher.findOne({ userId: teacherId })

    if (!teacher) {
        return next(new AppErorr(message.teacher.notFound, 404))
    }
    const teacherSchedule = await Schedule.findOne({ userId: teacherId }).select("image")

    if (!teacherSchedule) {
        return next(new AppErorr(message.schedule.notFound, 404))
    }
    // send response
    res.status(200).json({ message:"get successfully",success: true,
        data: {teacherSchedule: {image: teacherSchedule.image }}})
}
//------------------8-get-Class-For-Teacher--------
export const getClassForTeacher = async (req, res, next) => {
    const teacherId = req.authUser._id;
// check teacher existance
const teacher = await Teacher.findOne({ userId: teacherId }).populate('classId');
if (!teacher) {
  return next(new AppErorr(message.teacher.notFound, 404));
}

const classId = teacher.classId._id;

// get students in class
const studentsInClass = await Student.find({ classId })
  .populate("userId", "name");

if (studentsInClass.length === 0) {
  return next(new AppErorr(message.student.notFound, 404));
}

// extract student names
const studentNames = studentsInClass.map((student) => student.userId?.name).filter(Boolean);

// send response
res.status(200).json({
    message:"get successfully",
  success: true,
  data:{className: teacher.classId.name,
  students: studentNames,
}})
}
//--------------9-get-Teacher-Subjects------------
export const getTeacherSubjects = async (req, res, next) => {
    const teacherId = req.authUser._id

    // check teacher existance
    const teacher = await Teacher.findOne({ userId: teacherId }).populate("subjectes", "name");
    if (!teacher) {
        return next(new AppErorr(message.teacher.notFound, 404))
        }
    const subjects = teacher.subjectes.map(subject => ({
        name: subject.name
    }))
    // send response
    return res.status(200).json({message:"get successfully", success: true,data:subjects})
}
//----------------10-getQuizGradesForClass-----------
export const getQuizGradesForClass = async (req, res, next) => {
    const { classId, quizId } = req.params
    // check quiz existance
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        return next(new AppErorr(message.quiz.notFound, 404))
    }
    // get alluser in class
    const studentsInClass = await Student.find({ classId });
    if (!studentsInClass || studentsInClass.length === 0) {
      return res.status(404).json({ message: "No students found in this class." });
    }
    //  retrieve quiz attempts 
    const quizAttempts = await QuizAttempts.find({ quizId, studentId: { $in: studentsInClass.map(student => student.userId) } })
      .populate("studentId", "name ")  
      .populate("quizId", "title");  
  
    if (quizAttempts.length === 0) {
      return res.status(404).json({ message: "No quiz attempts found." });
    }
  
    //  return the quiz grades and student 
    return res.status(200).json({
      message:"get successfully",
      success: true,
      quiz: quiz.title,
      data:{classId,
      grades: quizAttempts.map(attempt => ({
        studentName: attempt.studentId.name,
        score: attempt.score,
      })),
 } })
}