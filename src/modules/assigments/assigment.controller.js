import { AppErorr } from "../../utils/appError.js"
import { message } from "../../utils/constant/messages.js"
import cloudinary from '../../utils/cloud.js'
import { Subject } from "../../../db/models/Subject.model.js"
import { Assigment } from "../../../db/models/Assignment.model.js"
import { Class } from "../../../db/models/Class.model.js"
import { Student } from "../../../db/models/Student.model.js"


//-------------------------- Assigment----------------------
//--------------------------1-add Assigment------------------------
export const addAssigment=async(req,res,next) =>{
    //get data from req
     let {name , subjectId,dueDate,classId}=req.body
     //check existance
     const subjectExist=await Subject.findById(subjectId)
     if(!subjectExist){
        return next( new AppErorr(message.subject.notFound,404))
     }
     //   ckeck classexistance
     const classExist = await Class.findById(classId);
     if (!classExist) {
         return next(new AppErorr(message.class.notFound, 404));
     }
     //check nameexistance
     const nameExist=await Assigment.findOne({name})
     if(nameExist){
        return next( new AppErorr(message.assigment.alreadyExist,409))
     }
    //prepare data
    //upload file
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
        folder:'ursery-app/assigment'
    })
    
     const assigment= new Assigment({
        name,
        subjectId,
        classId,
        dueDate,
        file:{secure_url,public_id},
        createdBy:req.authUser._id
     })
     //add to db
     const createdassigment=await assigment.save()
     if(!createdassigment){
        // rollback 
        req.fileImage = {secure_url,public_id}
        return next( new AppErorr(message.assigment.fileToCreate,500))
     }
     //    
         const students = await Student.find({ classId }).select("userId");
         const studentIds = students.map(student => student.userId);
         //    
         await Student.updateMany({ _id: { $in: studentIds } }, { $push: { assigments: assigment._id } });
    
   //send response
     return res.status(201).json({message:message.assigment.createsuccessfully,
        success:true,
        data:createdassigment})

}
//---------------2-update Assigment---------------
export const updateAssigment= async (req,res,next) => {
        //get data from req
        let {name,subjectId,dueDate,classId }=req.body
        const { assigmentId } =req.params
        
    
        //check existance
        const assigmentExist= await Assigment.findById(assigmentId)
        if(!assigmentExist){
            return next( new AppErorr(message.assigment.notFound,404))
        }
        //   ckeck classexistance
        const classExist = await Class.findById(classId);
        if (!classExist) {
            return next(new AppErorr(message.class.notFound, 404));
        }
        //check nameexistance
        const nameExist= await Assigment.findOne({name,_id:{$ne:assigmentId }})
        if(nameExist){
            return next( new AppErorr(message.assigment.alreadyExist,404))
        }
        //check existance
     const subjectExist=await Subject.findById(subjectId)
     if(!subjectExist){
        return next( new AppErorr(message.subject.notFound,404))
     }
        // prepare data
        if(name){[
            
            assigmentExist.name=name,
            assigmentExist.dueDate=dueDate,
            assigmentExist.subjectId=subjectId, 
            assigmentExist.classId=classId, 
        ]}
        //upload file
        if(req.file){
    
        //upload new image
           const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{
                public_id:assigmentExist.file.public_id
            })
            assigmentExist.file={secure_url,public_id}
            req.fileImage={secure_url,public_id}
        }
        //update  to db
        const updateassigment= await assigmentExist.save()
        if(!updateassigment){
            return next( new AppErorr(message.assigment.fileToUpdate,500))
        }
        //send response
        return res.status(200).json({
            message:message.assigment.updatesuccessfully,
            success:true,
            data:updateassigment
        })
}
//---------------------3-getall Assigment----------------------------        
export const getallAssigment= async (req,res,next) => {
    //get data from req
    const assigment=await Assigment.find()
    res.status(200).json({success:true,data:assigment})      
}
//---------------4-get specificAssigment-------------------------
export const getspecificAssigment= async (req,res,next) => {
    //get data from req
    const { assigmentId } =req.params
    const assigment=await Assigment.findById(assigmentId)
    assigment?
    res.status(200).json({ success:true,data:assigment})
        : next (new AppErorr(message.assigment.notFound,404))
}
//-------------5-deleteAssigment-------------------------------------
export const DeleteAssigment= async (req,res,next) => {
    //get data from req
    const { assigmentId } =req.params
        const assigment = await Assigment.findByIdAndDelete(assigmentId);
        if (!assigment) {
          return next(new AppErorr(message.assigment.notFound, 404));
        }
       //send response
       return res.status(200).json({
        message:message.assigment.deletesuccessfully,
        success:true
    })
}
//-----------------------6-get assigment questiones-------------
export const getAssigmentBySubject = async (req, res) => {
    const { subjectId } = req.params; 
    const subjectExist=await Subject.findById(subjectId)
 if(!subjectExist){
    return res.status(404).json({ success: false, message:message.subject.notFound });
 }
    const assigment = await Assigment.find({ subjectId }).lean();
    if (assigment.length === 0) {
        return res.status(404).json({ success: false, message:message.assigment.notFound });
    }
    res.status(200).json({success:true,data:assigment})
}