import { AppError  } from "../../utils/AppError.js"
import { message } from "../../utils/constant/messages.js"
import cloudinary from '../../utils/cloud.js'
import { Material } from '../../../db/models/Material.models.js'
import { Subject } from "../../../db/models/Subject.model.js"
import { Class } from "../../../db/models/Class.model.js"
import { Student } from "../../../db/models/Student.model.js"


//-------------------------- Materials----------------------
//--------------------------1-add Material------------------------
export const addMaterial=async(req,res,next) =>{
    //get data from req
     let {name , file,subjectId,classId}=req.body
     console.log("Received data:", { name, subjectId, classId });
     //check existance
     const subjectExist=await Subject.findById(subjectId)
     if(!subjectExist){
        console.log("Subject not found");
        return next( new AppError (message.subject.notFound,404))
     }
     //   ckeck classexistance
         const classExist = await Class.findById(classId);
         if (!classExist) {
            console.log("Class not found");
             return next(new AppError (message.class.notFound, 404));
         }
     //check nameexistance
     const nameExist=await Material.findOne({name})
     if(nameExist){
        console.log("Material name already exists");
        return next( new AppError (message.material.alreadyExist,409))
     }
     console.log("Material name is unique");
    //prepare data
    //upload file
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
        folder:'ursery-app/material'
    })
    console.log("File uploaded:", { secure_url, public_id });
    
     const materialer= new Material({
        name,
        subjectId,
        classId,
        file:{secure_url,public_id},
        createdBy:req.authUser._id
     })
     //add to db
     const createdmaterial=await materialer.save()
     if(!createdmaterial){
        console.log("Failed to create material, rolling back file upload");
        // rollback 
        req.fileImage = {secure_url,public_id}
        return next( new AppError (message.material.fileToCreate,500))
     }
     console.log("Material created successfully");
    //    
    const students = await Student.find({ classId }).select("userId");
    const studentIds = students.map(student => student.userId);
    //    
    await Student.updateMany({ _id: { $in: studentIds } }, { $push: { materials: materialer._id } });


     return res.status(201).json({message:message.material.createsuccessfully,
        success:true,
        data:createdmaterial})

}
//---------------2-update Material---------------
 export const updateMaterial= async (req,res,next) => {
        //get data from req
        let {name,subjectId,classId }=req.body
        const { materialId } =req.params
        
    
        //check existance
        const materialExist= await Material.findById(materialId)
        if(!materialExist){
            return next( new AppError (message.material.notFound,404))
        }
        //   ckeck classexistance
        const classExist = await Class.findById(classId);
        if (!classExist) {
            return next(new AppError (message.class.notFound, 404));
        }
        //check nameexistance
        const nameExist= await Material.findOne({name,_id:{$ne:materialId }})
        if(nameExist){
            return next( new AppError (message.material.alreadyExist,404))
        }
        //check existance
     const subjectExist=await Subject.findById(subjectId)
     if(!subjectExist){
        return next( new AppError (message.subject.notFound,404))
     }
        // prepare data
        materialExist.name = name || materialExist.name;
        materialExist.subjectId = subjectId || materialExist.subjectId;
        materialExist.classId = classId || materialExist.classId;

        //upload file
        if(req.file){
    
        //upload new image
           const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{
                public_id:materialExist.file.public_id
            })
            materialExist.file={secure_url,public_id}
            req.fileImage={secure_url,public_id}
        }
        //update  to db
        const updatematerial= await materialExist.save()
        if(!updatematerial){
            return next( new AppError (message.material.fileToUpdate,500))
        }
        //send response
        return res.status(200).json({
            message:message.material.updatesuccessfully,
            success:true,
            data:updatematerial
        })
}
//---------------------3-getallMaterial----------------------------  
export const getallMaterial= async (req,res,next) => {
    //get data from req
    const materials=await Material.find().select('-createdBy -createdAt -updatedAt -__v')
    res.status(200).json({message:"get successfully",success:true,data:materials})      
}
//---------------4-get specificMaterial-------------------------
export const getspecificMaterial= async (req,res,next) => {
    //get data from req
    const { materialId } =req.params
    const material=await Material.findById(materialId).select('-createdBy -createdAt -updatedAt -__v')
    material?
    res.status(200).json({message:"get successfully", success:true,data:material})
        : next (new AppError (message.material.notFound,404))
}
//-------------5-deleteMaterial-------------------------------------
export const DeleteMaterial= async (req,res,next) => {
    //get data from req
    const { materialId } =req.params
        const material = await Material.findByIdAndDelete(materialId);
        if (!material) {
          return next(new AppError (message.material.notFound, 404));
        }
       //send response
       return res.status(200).json({
        message:message.material.deletesuccessfully,
        success:true,
        data:{}
    })
    }
//-----------------------6-get subject material -------------
export const getMatriaalBySubject = async (req, res) => {
    const { subjectId } = req.params; 
    const subjectExist=await Subject.findById(subjectId)
 if(!subjectExist){
    return res.status(404).json({  message:message.subject.notFound,success: false,data:{} })
 }
    const material = await Material.find({ subjectId }).lean().select(' -subjectId -classId -createdBy -createdAt -updatedAt -__v')
    if (material.length === 0) {
        return res.status(404).json({  message:message.material.notFound, success:false,data:{}});
    }
    res.status(200).json({message:"get successfully",success:true,data:material})
}


