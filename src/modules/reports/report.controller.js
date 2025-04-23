import { Report } from "../../../db/models/Report.model.js"
import { Student } from "../../../db/models/Student.model.js"
import { User } from "../../../db/models/User.model.js"
import { AppErorr } from "../../utils/AppError.js"
import { message } from "../../utils/constant/messages.js"



//-------------------------- Report----------------------
//--------------------------1-add Report------------------------
export const addReport=async(req,res,next) =>{
    //get data from req
     let {report , studentId}=req.body
     //check existance
     const studentExist=await Student.findById(studentId)
     if(!studentExist){
        return next( new AppErorr(message.student.notFound,404))
     }
    //prepare data
    
     const reportt= new Report({
        report,
        studentId,
        createdBy:req.authUser._id
     })
     //add to db
     const createdreport=await reportt.save()
     if(!createdreport){
        return next( new AppErorr(message.report.fileToCreate,500))
     }
     return res.status(201).json({message:message.report.createsuccessfully,
        success:true,
        data:createdreport})

}
//---------------2-update Report---------------
export const updateReport= async (req,res,next) => {
        //get data from req
        let {report , studentId }=req.body
        const { reportId } =req.params
        //check existance
        const reportExist= await Report.findById(reportId)
        if(!reportExist){
            return next( new AppErorr(message.report.notFound,404))
        }
        //check existance
     const studentExist=await Student.findById(studentId)
     if(!studentExist){
        return next( new AppErorr(message.student.notFound,404))
     }
        // prepare data
        if(report){[
            
            reportExist.report=report,
            reportExist.studentId=studentId, 
        ]}
    
        //update  to db
        const updatereport= await reportExist.save()
        if(!updatereport){
            return next( new AppErorr(message.report.fileToUpdate,500))
        }
        //send response
        return res.status(200).json({
            message:message.report.updatesuccessfully,
            success:true,
            data:updatereport
        })
}
//---------------------3-getall Report----------------------------     
export const getallReport= async (req,res,next) => {
    //get data from req
    const report=await Report.find().select("studentId report")
    res.status(200).json({message:"get successfully",success:true,data:report})      
}
//---------------4-get specific Report-------------------------
export const getspecificReport= async (req,res,next) => {
    //get data from req
    const { reportId } =req.params
    const report=await Report.findById(reportId).select("studentId report")
    report?
    res.status(200).json({message:"get successfully", success:true,data:report})
        : next (new AppErorr(message.report.notFound,404))
}
//-------------5-delete Report-------------------------------------
export const DeleteReport= async (req,res,next) => {
    //get data from req
    const { reportId } =req.params
        const report = await Report.findByIdAndDelete(reportId);
        if (!report) {
          return next(new AppErorr(message.report.notFound, 404));
        }
       //send response
       return res.status(200).json({
        message:message.report.deletesuccessfully,
        success:true
    })
}
