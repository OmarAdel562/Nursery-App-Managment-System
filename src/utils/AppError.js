import { deleteCloudFile } from "./cloud.js"
import { deleteCloud } from "./file-function.js"


export default class AppErorr extends Error {
    constructor(message , statusCode) {
        super (message)
        this.statusCode=statusCode
    }
}
//asyncHandler
export const asyncHandler=(fn) =>{
    return(req,res,next) =>{
        fn(req,res,next).catch((err) =>{
            return next(new AppErorr(err.message,err.statusCode))
        })
     }
}
//globalErrorHandling
export const globalErrorHandling=async (err,req,res,next) =>{
    //rollback file system
    if(req.file){   
        deleteCloud(req.file.path)
    }
   // rollback cloud
    if(req.failFile){
       await deleteCloudFile(req.failFile.public_id)
    }
    if(req.failFile?.length>0){
        for (const public_id of req.failFile) {
            await deleteCloudFile(public_id)  
        }
    }
    return res.status(err.statusCode || 500).json({
        message:err.message ,
        success:false
    })
}