import { Subject } from "../../../db/models/Subject.model.js"
import { AppErorr } from "../../utils/apperror.js"
import { message } from "../../utils/constant/messages.js"


//------------------------------------------classes----------------------------------------------------
//------------1-create subject-------
export const Createsubject=async(req,res,next) =>{
    //get data from req
     let {name,description }=req.body
     //check existance
     const subjectExist=await Subject.findOne({name})
     if(subjectExist){
        return next( new AppErorr(message.subject.alreadyExist,409))
     }
    //prepare data
     const subject= new Subject({
        name,
        description,
        createdBy:req.authUser._id
     })
     //add to db
     const createdsubject=await subject.save()
     if(!createdsubject){
        return next(new AppErorr(message.subject.fileToCreate,500))
     }
     return res.status(201).json({message:message.subject.createsuccessfully,
        success:true,
        data:createdsubject})

}
 //---------------2-update subject---------------
export const updatesubject= async (req,res,next) => {
        //get data from req
        let {name, description}=req.body
        const { subjectId } =req.params
        
    
        //check existance
        const subjectExist= await Subject.findById(subjectId)
        if(!subjectExist){
            return next( new AppErorr(message.subject.notFound,404))
        }
        //check name existance
        const nameExist= await Subject.findOne({name})
        if(nameExist){
            return next( new AppErorr(message.subject.alreadyExist,409))
        }
        // prepare data
        if(name){ [
            subjectExist.name=name,
            subjectExist.description=description
        ]}
            
        //update  to db
        const updatesubject= await subjectExist.save()
        if(!updatesubject){
            return next( new AppErorr(message.subject.fileToUpdate,500))
        }
        //send response
        return res.status(200).json({
            message:message.subject.updatesuccessfully,
            success:true,
            data:updatesubject
        })
}    
//---------------------3-getallsubject----------------------------     
export const getallsubjectes= async (req,res,next) => {
    //get data from req
    const subject=await Subject.find()
    res.status(200).json({success:true,data:subject})      
}
//---------------4-get specific subject-------------------------
export const getspecificsubject= async (req,res,next) => {
    //get data from req
    const { subjectId } =req.params
    const subject=await Subject.findById(subjectId).populate([
        {path:"materials"},
        {path:"assigments"},
        {path:"links"},
        {path:"quiz"},
        {path:"grade"},
    ]);
    subject?
    res.status(200).json({ success:true,data:subject})
    : next (new AppErorr(message.subject.notFound,404))
}
//-------------5-deletesubject-------------------------------------
export const Deletesubject= async (req,res,next) => {
    //get data from req
    const { subjectId } =req.params
        const subject = await Subject.findByIdAndDelete(subjectId);
        if (!subject) {
          return next(new AppErorr(message.subject.notFound, 404));
        }
       //send response
       return res.status(200).json({
        message:message.subject.deletesuccessfully,
        success:true
    })
}