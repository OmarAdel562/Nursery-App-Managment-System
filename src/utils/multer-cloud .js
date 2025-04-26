//import modules
import multer,{ diskStorage } from "multer";
import { AppErorr } from "./AppError.js";




export const fileValidation ={
    image:['image/jpeg','image/png'],
    file:['application/pdf','application/msword'],
    video:['video/mp4']
}

export const cloudUpload = ({ allowTyp = fileValidation.file, maxSize = 20 * 1024 * 1024 }={}) =>{
    const storage = diskStorage({});
    const fileFilter = (req, file, cb)=>{
        if(!allowTyp.includes(file.mimetype)) {
            
            return cb(new AppErorr('invalid file format',400),false)
        }
        return cb(null, true)
    }
    return multer({storage,fileFilter, limits: {fileSize: maxSize }});
}

export const cloudUploadd = ({ allowTyp = fileValidation.image, maxSize = 5 * 1024 * 1024 }={}) =>{
    const storage = diskStorage({});
    const fileFilter = (req, file, cb)=>{
        if(!allowTyp.includes(file.mimetype)) {
            
            return cb(new AppErorr('invalid file format',400),false)
        }
        return cb(null, true)
    }
    return multer({storage,fileFilter,
        limits: {fileSize: maxSize }})
}