import bcrypt from 'bcrypt'
import { User } from "../../../db/models/User.model.js"
import { AppError } from '../../utils/AppError.js';
import { message } from "../../utils/constant/messages.js"
import cloudinary from '../../utils/cloud.js'
import { generateToken } from '../../utils/token.js'

//-------------------------- users----------------------
//--------------------------1-add user------------------------
export const adduser=async(req,res,next) =>{
    //get data from req
     let {name , email, phone, password,DOB,gander,age,role}=req.body
     //check existance
     const userExist=await User.findOne({$or:[{email},{phone}]})
     if(userExist){
        return res.status(409).json({ message:message.user.alreadyExist, success: false, data: {}})
     }
    //prepare data
    //upload image
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
        folder:'ursery-app/managment'
    })
    //hash password
    const hashpassword = bcrypt.hashSync(password,8)
     const user= new User({
        name,
        email,
        phone,
        password:hashpassword,
        DOB,
        gander,
        age,
        role,
        profilePic:{secure_url,public_id},
     })
     //add to db
     const createdUser=await user.save()
     if(!createdUser){
        // rollback 
        req.fileImage = {secure_url,public_id}
        return next( new AppError (message.user.fileToCreate,500))
     }
    //  //generate token
     const token= generateToken({payload:{email,_id:createdUser._id}})
     //send response
     return res.status(201).json({message:message.user.createsuccessfully,
        success:true,
        data:createdUser})
}
//---------------2-update user---------------
export const updateuser= async (req,res,next) => {
        //get data from req
        let {name , email, phone, password,DOB,gander,age,role}=req.body
        const { userId } =req.params
        //check existance
        const userExist= await User.findById(userId)
        if(!userExist){
            return res.status(404).json({ message:message.user.notFound, success: false, data: {}})
        }
        //check email existance
        const emailExist= await User.findOne({email,_id:{$ne:userId }})
        if(emailExist){
            return res.status(409).json({ message:message.user.alreadyExist, success: false, data: {}})
        }
        // prepare data
        userExist.name = name || userExist.name;
        userExist.email = email || userExist.email;
        userExist.phone = phone || userExist.phone;
        userExist.DOB = DOB || userExist.DOB;
        userExist.gander = gander || userExist.gander;
        userExist.role = role || userExist.role;

        //upload file
        if(req.file){
        //upload new image
           const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{
                public_id:userExist.profilePic.public_id
            })
            userExist.profilePic={secure_url,public_id}
            req.fileImage={secure_url,public_id}
        }
        //update  to db
        const updateuser= await userExist.save()
        if(!updateuser){
            return next( new AppError (message.user.fileToUpdate,500))
        }
        //send response
        return res.status(200).json({
            message:message.user.updatesuccessfully,
            success:true,
            data:updateuser
        })
}
//---------------------3-getallusers----------------------------        
export const getallusers= async (req,res,next) => {
    //get data from req
    const users=await User.find().select('-createdAt -updatedAt -__v');
    res.status(200).json({message:"get successfully",success:true,data:users})      
}
//---------------4-get specificuser-------------------------
export const getspecificuser= async (req,res,next) => {
    //get data from req
    const { userId } =req.params
    const user=await User.findById(userId).select('-createdAt -updatedAt -__v');
    user?
    res.status(200).json({ message:"get successfully",success:true,data:user})
        : next (new AppError (message.user.notFound,404))
}
//-------------5-deleteuser-------------------------------------
export const Deleteuser= async (req,res,next) => {
    //get data from req
    const { userId } =req.params
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
          return next(new AppError (message.user.notFound, 404));
        }
       //send response
       return res.status(200).json({
        message:message.user.deletesuccessfully,
        success:true,
        data:{}
    })
}
//-----------6-get managment data-----------------------------
export const getUserprofile = async (req, res, next) => {
    const userId = req.authUser._id
  
    const user = await User.findById(userId).select(" profilePic name role");
    if (!user) {
      return next(new AppError ("User not found", 404))
    }
    return res.status(200).json({
      success: true,
      data: {
        profilePic: user.profilePic?.secure_url || null,
        name: user.name,
        role: user.role
      }
    })
  }
  
//------------------------------------------------------------------------------------------
//------------------------------------------signin and logout------------------------------------------
//------------1-signin---
export const signin=async(req, res,next) =>{
    //get data from req
    const {email,password}=req.body
    //check existance
    const userExist=await User.findOne({email})
    if(!userExist){
        return res.status(400).json({ message: "Invalid username", success: false, data: {}})
    }
    //check password
    const match= bcrypt.compareSync(password, userExist.password)
    if(!match){
        return res.status(400).json({ message: "Invalid password", success: false, data: {}})
    }
    //generate token
    const token =generateToken({payload:{_id:userExist._id ,email}})
 
    //send response
    return res.status(200).json({
       message:"login successfully",
       success:true,
       data:{token,role:userExist.role},
     })
}
//--------------2-logout------
export const logout = async (req, res, next) => {
    res.clearCookie("token")
    res.status(200).json({
        message: "user logout successfully" ,
        success: true,
        data: {}
    })
}



