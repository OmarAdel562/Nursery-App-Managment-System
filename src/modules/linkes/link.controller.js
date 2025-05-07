import { AppError  } from "../../utils/AppError.js"
import { message } from "../../utils/constant/messages.js"
import { Subject } from "../../../db/models/Subject.model.js"
import { Link } from "../../../db/models/Link.model.js"


//-------------------------- Link----------------------
//--------------------------1-add Link------------------------
export const addLink=async(req,res,next) =>{
    //get data from req
     let {name , subjectId,link}=req.body
     //check existance
     const subjectExist=await Subject.findById(subjectId)
     if(!subjectExist){
        return next( new AppError (message.subject.notFound,404))
     }
     //check nameexistance
     const nameExist=await Link.findOne({name})
     if(nameExist){
        return next( new AppError (message.link.alreadyExist,409))
     }
    //prepare data
    
     const linkk= new Link({
        name,
        subjectId,
        link,
        createdBy:req.authUser._id
     })
     //add to db
     const createdlink=await linkk.save()
     if(!createdlink){
        return next( new AppError (message.link.fileToCreate,500))
     }
     return res.status(201).json({message:message.link.createsuccessfully,
        success:true,
        data:createdlink})

}
//---------------2-update Link---------------
export const updateLink= async (req,res,next) => {
        //get data from req
        let {name,subjectId,link }=req.body
        const { linkId } =req.params
        
    
        //check existance
        const linkExist= await Link.findById(linkId)
        if(!linkExist){
            return next( new AppError (message.link.notFound,404))
        }
        //check nameexistance
        const nameExist= await Link.findOne({name,_id:{$ne:linkId }})
        if(nameExist){
            return next( new AppError (message.link.alreadyExist,404))
        }
        //check existance
     const subjectExist=await Subject.findById(subjectId)
     if(!subjectExist){
        return next( new AppError (message.subject.notFound,404))
     }
        // prepare data
        linkExist.name = name || linkExist.name;
        linkExist.link = link || linkExist.link;
        linkExist.subjectId = subjectId || linkExist.subjectId;
   

    
        //update  to db
        const updatelink= await linkExist.save()
        if(!updatelink){
            return next( new AppError (message.link.fileToUpdate,500))
        }
        //send response
        return res.status(200).json({
            message:message.link.updatesuccessfully,
            success:true,
            data:updatelink
        })
}
//---------------------3-getall Link----------------------------     
export const getallLink= async (req,res,next) => {
    //get data from req
    const link=await Link.find().select('-createdBy -createdAt -updatedAt -__v')   
    res.status(200).json({message:"get successfully",success:true,data:link})      
}
//---------------4-get specific Link-------------------------
export const getspecificLink= async (req,res,next) => {
    //get data from req
    const { linkId } =req.params
    const link=await Link.findById(linkId).select('-createdBy -createdAt -updatedAt -__v')   
    link?
    res.status(200).json({message:"get successfully", success:true,data:link})
        : next (new AppError (message.link.notFound,404))
}
//-------------5-delete Link-------------------------------------
export const DeleteLink= async (req,res,next) => {
    //get data from req
    const { linkId } =req.params
        const link = await Link.findByIdAndDelete(linkId);
        if (!link) {
          return next(new AppError (message.link.notFound, 404));
        }
       //send response
       return res.status(200).json({
        message:message.link.deletesuccessfully,
        success:true,
        data:{}
    })
}
//-----------------------6-get subject link-------------
export const getlinkBySubject = async (req, res) => {
          const { subjectId } = req.params
          const subjectExist=await Subject.findById(subjectId)
       if(!subjectExist){
          return res.status(404).json({  message:message.subject.notFound,success: false,data:{} })
       }
          const linkes = await Link.find({ subjectId }).lean().select(' -subjectId  -createdBy -createdAt -updatedAt -__v')  
          if (linkes.length === 0) {
              return res.status(404).json({ message:message.link.notFound ,success:false, data:{} })
          }
          res.status(200).json({message:"get successfully",success:true,data:linkes})
}   