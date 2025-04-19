import { Assigment } from "../../../db/models/Assignment.model.js"
import { Grade } from "../../../db/models/Grade.model.js"
import { Link } from "../../../db/models/Link.model.js"
import { Material } from "../../../db/models/Material.models.js"
import { Notification } from "../../../db/models/Notification.model.js"
import { Quiz } from "../../../db/models/Quiz.model.js"
import { Schedule } from "../../../db/models/Schedule.model.js"
import { Student } from "../../../db/models/Student.model.js"
import { User } from "../../../db/models/User.model.js"
import { AppErorr } from "../../utils/AppError.js"
import { message } from "../../utils/constant/messages.js"


//-------------------------- Student----------------------
//--------------------------1-add Student------------------------
export const addStudent=async(req,res,next) =>{
    //get data from req
    const {userId , classId,subjectes}=req.body
     if (!Array.isArray(subjectes) || subjectes.length === 0) {
        return res.status(400).json({ message: "subjectes must be a non-empty array", success: false });
    }
    //check existance
    const studentExist=await Student.findOne({userId})
    if(studentExist){
       return next( new AppErorr(message.user.alreadyExist,409))
    }
     //check userexistance
     const userExist=await User.findById(userId)
     if(!userExist){
        return next( new AppErorr(message.user.notFound,404))
     }
     
    //prepare data
    
     const student= new Student({
        userId,
        classId,
        subjectes,
        createdBy:req.authUser._id
     })
     //add to db
     const createdstudent=await student.save()
     if(!createdstudent){
        return next( new AppErorr(message.student.fileToCreate,500))
     }
     return res.status(201).json({message:message.student.createsuccessfully,
        success:true,
        data:createdstudent})

}
//---------------2-update Student---------------
export const updateStudent= async (req,res,next) => {
        //get data from req
        let {userId , classId,subjectes }=req.body
        const { studentId } =req.params
        
    
        //check existance
        const studentExist= await Student.findById(studentId)
        if(!studentExist){
            return next( new AppErorr(message.student.notFound,404))
        }
        //check userexistance
          const userExist=await User.findById(userId)
           if(!userExist){
            return next( new AppErorr(message.user.notFound,404))
          }
        // prepare data
        if(userId){[
            
            studentExist.userId=userId,
            studentExist.classId=classId,
            studentExist.subjectes=subjectes, 
        ]}
    
        //update  to db
        const updatestudent= await studentExist.save()
        if(!updatestudent){
            return next( new AppErorr(message.student.fileToUpdate,500))
        }
        //send response
        return res.status(200).json({
            message:message.student.updatesuccessfully,
            success:true,
            data:updatestudent
        })
}
//---------------------3-getall Student----------------------------
        
export const getallStudent= async (req,res,next) => {
    //get data from req
    const student=await Student.find()
    res.status(200).json({success:true,data:student})      
}
//---------------4-get specific Student-------------------------
export const getspecificStudent= async (req,res,next) => {
    //get data from req
    const { studentId } =req.params
    const student=await Student.findById(studentId)
    student?
    res.status(200).json({ success:true,data:student})
        : next (new AppErorr(message.student.notFound,404))
}
//-------------5-delete Student-------------------------------------
export const DeleteStudent= async (req,res,next) => {
    //get data from req
    const { studentId } =req.params
        const student = await Student.findByIdAndDelete(studentId);
        if (!student) {
          return next(new AppErorr(message.student.notFound, 404));
        }
       //send response
       return res.status(200).json({
        message:message.student.deletesuccessfully,
        success:true
    })
}
//----------------6-get-Student-Data------------
export const getStudentData = async (req, res, next) => {
    const studentId = req.authUser._id
    // get data
    const student = await Student.findOne({ userId: studentId })
    .populate({path: 'userId', select: 'profilePic name email gander age'})
    .populate({ path: 'classId',select: 'name'})
    // check student existance
    if (!student) {
        return next( new AppErorr(message.student.notFound,404))
    }
     //send response
    res.status(200).json({
        success: true,
        data: {
          profilePic: student.userId.profilePic?.secure_url || null,
          name: student.userId.name,
          gender: student.userId.gander,
          age: student.userId.age,
          email: student.userId.email,
          class: student.classId.name }})
}
//----------------7-get-Student-Schedule--------------
export const getStudentSchedule = async (req, res, next) => {
    const studentId = req.authUser._id    
    const studentSchedule = await Schedule.findOne({ userId: studentId })
    // check schedule existance
    if (!studentSchedule) {
        return next(new AppErorr(message.schedule.notFound, 404))
    }
     //send response
    res.status(200).json({
        success: true,
        data: studentSchedule,
    })
}
//------------------8-get-student-grades----------------
export const getStudentGrades = async (req, res, next) => {
    const studentId = req.authUser._id;
    // اcheck student existance
    const student = await Student.findOne({ userId: studentId });
    if (!student) {
        return next(new AppErorr(message.student.notFound, 404));
    }
    // get data
    const grades = await Grade.find({ studentId: student._id })
        .populate("subjectId", "name")
        .populate("quizId", "title")
        .populate("assigmentId", "name")
        .select("score max_score subjectId quizId  assigmentId ");
    if (grades.length === 0) {
        return next(new AppErorr(message.grade.notFound, 404));
    }
    // send response
    res.status(200).json({ success: true, student: { _id: student._id, name: student.userId.name,}, data: grades  })
}
//------------------9-get-student-subjectes--------------
export const getStudentSubjects = async (req, res, next) => {
    
    const studentId = req.authUser._id
    // check student existance
    const student = await Student.findOne({ userId: studentId }).populate("subjectes");
    if (!student) {
        return next(new AppErorr(message.student.notFound, 404))
    }
    // send response
    return res.status(200).json({
        success: true,
        student: {
            _id: studentId,
            name: student.userId.name,
        },
        subjects: student.subjectes.map(subject => ({
            _id: subject._id,
            name: subject.name,  
        })),
    })
}
//------------10-get-notification-for-student-----------
export const getStudentNotifications = async (req, res, next) => {
    const studentId = req.authUser._id
    // check student existance
  const student = await Student.findOne({ userId: studentId })
  if (!student) {
    return next(new AppErorr(message.student.notFound, 404))
  }

  // get data
  const notifications = await Notification.find({
    $or: [
      { receiverStudent: student._id },
      { receiverParent: student._id },  
    ]
  }).sort({ createdAt: -1 })

  if (notifications.length === 0) {
    return next(new AppErorr(message.notification.notFound, 404))
  }

  // send response
  res.status(200).json({
    success: true,
    notifications: notifications.map(notification => ({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
    })),
  })
}
//-------------------------11-getStudentSubjectsWithTasks----
export const getStudentSubjectsWithTasks = async (req, res, next) => {
    const student = await Student.findOne({ userId: req.authUser._id }).populate("subjectes");
     // check student existance
  if (!student) {
    return next(new AppErorr(message.student.notFound, 404))
  }
  
    const response = [];
  
    for (const subject of student.subjectes) {
      const [quizzes, links, materials, assigments, grades] = await Promise.all([
        Quiz.find({ subjectId: subject._id, classId: student.classId }),
        Link.find({ subjectId: subject._id }),
        Material.find({ subjectId: subject._id, classId: student.classId }),
        Assigment.find({ subjectId: subject._id, classId: student.classId }),
        Grade.find({ studentId: student._id, subjectId: subject._id }),
      ])
      response.push({
        subjectId: subject._id,
        subjectName: subject.name,
        quizzes,
        links,
        materials,
        assigments,
        grades,
      })
    }
    return res.status(200).json({success: true, data: response })
}
//--------------------------12-getStudentGradesInSubject------------
export const getStudentGradesInSubject = async (req, res, next) => {
  const { subjectId } = req.params

  // هات الطالب من الـ authUser
  const student = await Student.findOne({ userId: req.authUser._id });
    // check student existance
    if (!student) {
      return next(new AppErorr(message.student.notFound, 404))
    }

  //get grade
  const grades = await Grade.find({ studentId: student._id, subjectId })
    .populate("quizId", "title")
    .populate("assigmentId", "name")

  if (!grades.length) {
    return next(new AppErorr(message.grade.notFound, 404))
  }
  return res.status(200).json({
    success: true,
    data: grades,
  });
}
  