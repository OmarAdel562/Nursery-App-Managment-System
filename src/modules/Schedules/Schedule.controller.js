import { AppErorr } from "../../utils/AppErrorr.js"
import { message } from "../../utils/constant/messages.js"
import cloudinary from '../../utils/cloud.js'
import { Schedule } from "../../../db/models/Schedule.model.js"
import { User } from "../../../db/models/User.model.js"
// import { Parent } from "../../../db/models/Parent.model.js"
// import { Student } from "../../../db/models/Student.model.js"


//-------------------------- Schedules----------------------
//--------------------------1-add Schedule------------------------
export const addSchedule=async(req,res,next) =>{
    //get data from req
     const {userId}=req.body
     //check existance
     const userExist=await User.findById(userId)
     if(!userExist){
        return next( new AppErorr(message.user.notFound,404))
     }
    //prepare data
    //upload image
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
        folder:'ursery-app/Schedule'
    })

    
     const schedule= new Schedule({
        userId,
        image:{secure_url,public_id},
        createdBy:req.authUser._id

     })
     //add to db
     const createdschedule=await schedule.save()
     if(!createdschedule){
        // rollback 
        req.fileImage = {secure_url,public_id}
        return next( new AppErorr(message.user.fileToCreate,500))
     }
    

     return res.status(201).json({message:message.schedule.createsuccessfully,
        success:true,
        data:createdschedule})

}
//---------------2-update Schedule---------------
export const updateSchedule= async (req,res,next) => {
        //get data from req
        const { scheduleId } =req.params
        
        //check existance
        const scheduleExist= await Schedule.findById(scheduleId)
        if(!scheduleExist){
            return next( new AppErorr(message.schedule.notFound,404))
        }
        
        // prepare data
        //upload file
        if(req.file){
        //upload new image
           const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{
                public_id:scheduleExist.image.public_id
            })
            scheduleExist.image={secure_url,public_id}
            req.fileImage={secure_url,public_id}
        }
        //update  to db
        const updateschedule= await scheduleExist.save()
        if(!updateschedule){
            return next( new AppErorr(message.schedule.fileToUpdate,500))
        }
        //send response
        return res.status(200).json({
            message:message.schedule.updatesuccessfully,
            success:true,
            data:updateschedule
        })
}
//---------------------3-getall Schedule----------------------------     
export const getallSchedules= async (req,res,next) => {
    //get data from req
    const schedules=await Schedule.find().select("userId image")
    res.status(200).json({message:"get successfully",success:true,data:schedules})      
}
//---------------4-get specific Schedule---------------------------
export const getspecificSchedule= async (req,res,next) => {
    //get data from req
    const { scheduleId } =req.params
    const schedule=await Schedule.findById(scheduleId).select("userId image")
    schedule?
    res.status(200).json({message:"get successfully", success:true,data:schedule})
        : next (new AppErorr(message.schedule.notFound,404))
}
//-------------5-delete Schedule-------------------------------------
export const DeleteSchedule= async (req,res,next) => {
    //get data from req
    const { scheduleId } =req.params
        const schedule = await Schedule.findByIdAndDelete(scheduleId)
        if (!schedule) {
          return next(new AppErorr(message.schedule.notFound, 404))
        }
       //send response
       return res.status(200).json({
        message:message.schedule.deletesuccessfully,
        success:true
    })
}


