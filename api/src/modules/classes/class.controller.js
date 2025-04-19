import { Class } from "../../../db/models/Class.model.js"
import { Student } from "../../../db/models/Student.model.js"
import { Teacher } from "../../../db/models/Teacher.model.js"
import { AppErorr } from "../../utils/apperror.js"
import { message } from "../../utils/constant/messages.js"


//------------------------------------------classes----------------------------------------------------
//------------1-create class-------
export const CreateClass=async(req,res,next) =>{
    //get data from req
     let {name }=req.body
     //check existance
     const ClassExist=await Class.findOne({name})
     if(ClassExist){
        return next( new AppErorr(message.class.alreadyExist,409))
     }
    //prepare data
     const clas= new Class({
        name,
        createdBy:req.authUser._id
     })
     //add to db
     const createdClass=await clas.save()
     if(!createdClass){
        return next(new AppErorr(message.class.fileToCreate,500))
     }
     return res.status(201).json({message:message.class.createsuccessfully,
        success:true,
        data:createdClass})

}
//---------------2-update class---------------
export const updateclass= async (req,res,next) => {
        //get data from req
        let {name }=req.body
        const { classId } =req.params
        
    
        //check existance
        const classExist= await Class.findById(classId)
        if(!classExist){
            return next( new AppErorr(message.class.notFound,404))
        }
        //check name existance
        const nameExist= await Class.findOne({name})
        if(nameExist){
            return next( new AppErorr(message.class.alreadyExist,409))
        }
        // prepare data
        if(name){ [classExist.name=name]}
            
        //update  to db
        const updateclass= await classExist.save()
        if(!updateclass){
            return next( new AppErorr(message.class.fileToUpdate,500))
        }
        //send response
        return res.status(200).json({
            message:message.class.updatesuccessfully,
            success:true,
            data:updateclass
        })
}    
//---------------------3-getallclasses----------------------------  
export const getallclasses= async (req,res,next) => {
    //get data from req
    const classes=await Class.find()
    res.status(200).json({success:true,data:classes})      
}
//---------------4-get specificclass-------------------------
export const getspecificclass= async (req,res,next) => {
    //get data from req
    const { classId } =req.params
    const classs=await Class.findById(classId)
    classs?
    res.status(200).json({ success:true,data:classs})
        : next (new AppErorr(message.class.notFound,404))
}
//-------------5-deleteclass-------------------------------------
export const Deleteclass= async (req,res,next) => {
    //get data from req
    const { classId } =req.params
        const clas = await Class.findByIdAndDelete(classId);
        if (!clas) {
          return next(new AppErorr(message.class.notFound, 404));
        }
       //send response
       return res.status(200).json({
        message:message.class.deletesuccessfully,
        success:true
    })
}

