import { AppErorr } from "../../utils/AppErrorr.js"
import { message } from "../../utils/constant/messages.js"
import { Subject } from "../../../db/models/Subject.model.js"
import { Grade } from "../../../db/models/Grade.model.js"
import { Student } from "../../../db/models/Student.model.js"


//-------------------------- grade----------------------
//--------------------------1-add grade------------------------
export const addGrade=async(req,res,next) =>{
    //get data from req
     let { studentId,subjectId,quizId,assigmentId,score,max_score}=req.body
     //check existance
     const subjectExist=await Subject.findById(subjectId)
     if(!subjectExist){
        return next( new AppErorr(message.subject.notFound,404))
     }
     //check userexistance
     const studentExist=await Student.findById(studentId)
     if(!studentExist){
        return next( new AppErorr(message.student.notFound,404))
     }
    //prepare data
    
     const grade= new Grade({
        studentId,
        subjectId,
        quizId,
        assigmentId,
        score,
        max_score,
        createdBy:req.authUser._id
     })
     //add to db
     const createdgrade=await grade.save()
     if(!createdgrade){
        return next( new AppErorr(message.grade.fileToCreate,500))
     }
     return res.status(201).json({message:message.grade.createsuccessfully,
        success:true,
        data:createdgrade})

}
//---------------2-update grade---------------
export const updateGrade= async (req,res,next) => {
        //get data from req
        let {studentId,subjectId,quizId,assigmentId,score,max_score }=req.body
        const { gradeId } =req.params
        
    
        //check existance
        const gradeExist= await Grade.findById(gradeId)
        if(!gradeExist){
            return next( new AppErorr(message.grade.notFound,404))
        }
        //check existance
        const subjectExist=await Subject.findById(subjectId)
        if(!subjectExist){
        return next( new AppErorr(message.subject.notFound,404))
     }
        // prepare data
        gradeExist.studentId = studentId || gradeExist.studentId;
        gradeExist.subjectId = subjectId || gradeExist.subjectId;
        gradeExist.quizId = quizId || gradeExist.quizId;
        gradeExist.assigmentId = assigmentId || gradeExist.assigmentId;
        gradeExist.score = score || gradeExist.score;
        gradeExist.max_score = max_score || gradeExist.max_score;
        
    
        //update  to db
        const updategrade= await gradeExist.save()
        if(!updategrade){
            return next( new AppErorr(message.grade.fileToUpdate,500))
        }
        //send response
        return res.status(200).json({
            message:message.grade.updatesuccessfully,
            success:true,
            data:updategrade
        })
}
//---------------------3-getall grade----------------------------      
export const getallGrade= async (req,res,next) => {
    //get data from req
    const grade=await Grade.find().select('-createdBy -createdAt -updatedAt -__v')   
    res.status(200).json({message:"get successfully",success:true,data:grade})      
}
//---------------4-get specific grade-------------------------
  export const getspecificGrade= async (req,res,next) => {
    //get data from req
    const { gradeId } =req.params
    const grade=await Grade.findById(gradeId).select('-createdBy -createdAt -updatedAt -__v')   
    grade?
    res.status(200).json({message:"get successfully", success:true,data:grade})
        : next (new AppErorr(message.grade.notFound,404))
}
//-------------5-delete grade-------------------------------------
export const DeleteGrade= async (req,res,next) => {
    //get data from req
    const { gradeId } =req.params
        const grade = await Grade.findByIdAndDelete(gradeId);
        if (!grade) {
          return next(new AppErorr(message.grade.notFound, 404));
        }
       //send response
       return res.status(200).json({
        message:message.grade.deletesuccessfully,
        success:true,
        data:{}
    })
}
