import { User } from "../../../db/models/User.model.js"
import { AppError  } from "../../utils/AppError.js"
import { message } from "../../utils/constant/messages.js"
import { Parent } from "../../../db/models/Parent.model.js"
import { Student } from "../../../db/models/Student.model.js"
import { Grade } from "../../../db/models/Grade.model.js"
import { Report } from "../../../db/models/Report.model.js"
import { Schedule } from "../../../db/models/Schedule.model.js"
import { Notification } from "../../../db/models/Notification.model.js"
import { Attendance } from "../../../db/models/Attendance.model.js"

//-------------------------- Parent----------------------
//--------------------------1-add Parent------------------------
export const addParent=async(req,res,next) =>{A
    //get data from req
    const {userId , studentId}=req.body
    //check existance
    const parentExist=await Parent.findOne({userId})
    if(parentExist){
       return next( new AppError (message.parent.alreadyExist,409))
    }
     //check userexistance
     const userExist=await User.findById(userId)
     if(!userExist){
        return next( new AppError (message.user.notFound,404))
     }
     //check studentexistance
     const studentExist=await Student.findById(studentId)
     if(!studentExist){
        return next( new AppError (message.student.notFound,404))
     }
    //prepare data
     const parent= new Parent({
        userId,
        studentId,
        createdBy:req.authUser._id
     })
     //add to db
     const createdparent=await parent.save()
     if(!createdparent){
        return next( new AppError (message.parent.fileToCreate,500))
     }
     return res.status(201).json({message:message.parent.createsuccessfully,
        success:true,
        data:createdparent})
}
//---------------2-update Parent---------------
export const updateParent= async (req,res,next) => {
        //get data from req
        let {userId , studentId }=req.body
        const { parentId } =req.params
        //check existance
        const parentExist= await Parent.findById(parentId)
        if(!parentExist){
            return next( new AppError (message.parent.notFound,404))
        }
        //check userexistance
          const userExist=await User.findById(userId)
           if(!userExist){
            return next( new AppError (message.user.notFound,404))
          }
        // prepare data
        parentExist.userId = userId || parentExist.userId;
        parentExist.studentId = studentId || parentExist.studentId;

    
        //update  to db
        const updateparent= await parentExist.save()
        if(!updateparent){
            return next( new AppError (message.parent.fileToUpdate,500))
        }
        //send response
        return res.status(200).json({
            message:message.parent.updatesuccessfully,
            success:true,
            data:updateparent
        }) 
}
//---------------------3-getall Parent----------------------------    
export const getallParent= async (req,res,next) => {
    //get data from req
    const parentes=await Parent.find().populate("userId", "name").populate("studentId", "name").select("userId name studentId name")
    res.status(200).json({message:"get successfully", success:true,data:parentes})      
}
//---------------4-get specific Parent-------------------------
export const getspecificParent= async (req,res,next) => {
    //get data from req
    const { parentId } =req.params
    const parent=await Parent.findById(parentId).populate("userId", "name").select(" userId name")
    parent?
    res.status(200).json({message:"get successfully", success:true,data:parent})
        : next (new AppError (message.parent.notFound,404))
}
//-------------5-delete Parent-------------------------------------
export const DeleteParent= async (req,res,next) => {
    //get data from req
    const { parentId } =req.params
        const parent = await Parent.findByIdAndDelete(parentId);
        if (!parent) {
          return next(new AppError (message.parent.notFound, 404));
        }
       //send response
       return res.status(200).json({
        message:message.parent.deletesuccessfully,
        success:true,
        data:{}
    })
}
//-----------------6-get-Student-Grades-for-parent----------------
export const getStudentGradesForParent = async (req, res, next) => {
    const parentId = req.authUser._id
    // check parent existance
    const parent = await Parent.findOne({ userId: parentId }).populate({
        path: "studentId",
        populate: { path: "userId", select: "name" }
    })
    if (!parent) {
        return next(new AppError (message.parent.notFound, 404));
    }
    const studentId = parent.studentId._id;
    // get grades
    const grade = await Grade.find({ studentId })
        .populate("subjectId", "name") 
        .populate("quizId", "title") 
        .populate("assigmentId", "name") 
        .select("score max_score subjectId quizId assigmentId "); 

    const grades = grade.map(g => ({
            subject: g.subjectId?.name || null,
            quiz: g.quizId?.title || null,
            assignment: g.assigmentId?.name || null,
            score: g.score,
            maxScore: g.max_score
        }));   

    return res.status(200).json({
        message:"get successfully",
        success: true,
        data:{  
        studentname: parent.studentId.userId.name,
        grades}
    })
}
//-----------------7-get-Student-report-for-parent----------------
export const getStudentReportForParent = async (req, res, next) => {
    const parentId = req.authUser._id
    // check parent existance
    const parent = await Parent.findOne({ userId: parentId }).populate({
        path: "studentId",
        populate: { path: "userId", select: "name" } 
    })
    if (!parent) {
        return next(new AppError (message.parent.notFound, 404));
    }

    const studentId = parent.studentId._id;

    // get report
    const reports = await Report.find({ studentId })
    .select("report ")

    return res.status(200).json({
        message:"get successfully",
        success: true,
        data:{
        studentname: parent.studentId.userId.name
        ,reports}
    })
}
//-----------------8-get-Student-Schedule-for-parent----------------
export const getStudentScheduleForParent = async (req, res, next) => {
    const parentId = req.authUser._id

    // check parent exist
    const parent = await Parent.findOne({ userId: parentId }).populate({
        path: "studentId",
        populate: { path: "userId", select: "name" } 
    });

    if (!parent) {
        return next(new AppError (message.parent.notFound, 404));
    }

    const studentId = parent.studentId.userId._id;

    // جلب جدول الطالب
    const schedule = await Schedule.findOne({ userId: studentId }).select("image ");

    if (!schedule) {
        return next(new AppError (message.schedule.notFound, 404));
    }

    return res.status(200).json({
        message:"get successfully",
        success: true,
        data:{
        student: {name: parent.studentId.userId.name},
        schedule: {image: schedule.image }}
    })
}
//----------------9-get-Parent-Data------------------
export const getParentData = async (req, res, next) => {
    const parentId = req.authUser._id;
    // check parent existance
    const parent = await Parent.findOne({ userId: parentId })
    .populate({path: 'userId',  select: 'profilePic name email gander phone'})
    .populate({ path: 'studentId', populate: {path: 'userId',select: 'name' } })
    if (!parent) {
        return next(new AppError (message.parent.notFound, 404));
    }
     //send response
    return res.status(200).json({
        message:"get successfully",
        success: true,
        data: {
            profilePic: parent.userId.profilePic?.secure_url || null,
            Name: parent.userId.name,
            gender: parent.userId.gander,
            email: parent.userId.email,
            phone: parent.userId.phone,
            SonsName: parent.studentId?.userId?.name || "N/A"
          }
    })
}
//----------10-get-parent-notification-------------------
export const getParentNotifications = async (req, res, next) => {
    
    const parentId = req.authUser._id
    // check parent existanse
    const parent = await Parent.findOne({ userId: parentId })
    if (!parent) {
      return next(new AppError (message.parent.notFound, 404))
    }
  
    // get response
    const notifications = await Notification.find({
      receiverParent: parent._id, 
    }).sort({ createdAt: -1 })
  
    if (notifications.length === 0) {
      return next(new AppError (message.notification.notFound, 404))
    }
  
    // send response
  res.status(200).json({
    message:"get successfully",
    success: true,
    data: notifications.map(notification => ({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
    })),
  })
}
//-----------------10-get-Student-attendance-for-parent----------------
export const getStudentAttendanceForParent = async (req, res, next) => {
    const parentId = req.authUser._id;

    // Get parent and populate student's user name
    const parent = await Parent.findOne({ userId: parentId }).populate({
        path: "studentId",
        populate: {
            path: "userId",
            model: "User",
            select: "name"
        }
    });

    if (!parent || !parent.studentId || !parent.studentId.userId) {
        return next(new AppError (message.parent.notFound, 404));
    }

    const studentUserId = parent.studentId.userId._id;

const attendanceRecords = await Attendance.find({ studentId: studentUserId })
    .select("date status")
    .sort({ date: -1 });

    return res.status(200).json({
        message: "get successfully",
        success: true,
        data: {
            studentname: parent.studentId.userId.name,
            attendanceRecords
        }
    });
}



