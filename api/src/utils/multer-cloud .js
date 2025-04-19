//import modules
import multer,{ diskStorage } from "multer";
import { AppErorr } from "./appError.js";




export const fileValidation ={
    image:['image/jpeg','image/png'],
    file:['application/pdf','application/msword'],
    video:['video/mp4']
}

export const cloudUpload = ({ allowTyp = fileValidation.file }={}) =>{
    const storage = diskStorage({});
    const fileFilter = (req, file, cb)=>{
        if(!allowTyp.includes(file.mimetype)) {
            
            return cb(new AppErorr('invalid file format',400),false)
        }
        return cb(null, true)
    }
    return multer({storage,fileFilter});
}

export const cloudUploadd = ({ allowTyp = fileValidation.image }={}) =>{
    const storage = diskStorage({});
    const fileFilter = (req, file, cb)=>{
        if(!allowTyp.includes(file.mimetype)) {
            
            return cb(new AppErorr('invalid file format',400),false)
        }
        return cb(null, true)
    }
    return multer({storage,fileFilter});
}