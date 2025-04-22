import bcrypt from 'bcrypt'
import { User } from "../../../db/models/User.model.js"
import { AppErorr } from "../../utils/AppError.js"
import { message } from "../../utils/constant/messages.js"
import cloudinary from '../../utils/cloud.js'
import { generateToken } from '../../utils/token.js'
//import { sendEmail } from '../../utils/email.js'
//import { userstatus } from '../../utils/constant/enum.js'

//-------------------------- users----------------------
//--------------------------1-add user------------------------
export const adduser=async(req,res,next) =>{
    //get data from req
     let {name , email, phone, password,DOB,gander,age,role}=req.body
     //check existance
     const userExist=await User.findOne({$or:[{email},{phone}]})
     if(userExist){
        return next( new AppErorr(message.user.alreadyExist,409))
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
        return next( new AppErorr(message.user.fileToCreate,500))
     }
    //  //generate token
     const token= generateToken({payload:{email,_id:createdUser._id}})
     //send Email
     //await sendEmail({to:email,subject:"verify your account",html:`<p> Click on link to verify account<a href="${req.protocol}://${req.headers.host}/managment/verify/${token}"> link</a> </p>`})
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
            return next( new AppErorr(message.user.notFound,404))
        }
        //check email existance
        const emailExist= await User.findOne({email,_id:{$ne:userId }})
        if(emailExist){
            return next( new AppErorr(message.user.alreadyExist,409))
        }
        // prepare data
        if(name){
            
            userExist.name=name,
            userExist.email=email,
            userExist.password=password,
            userExist.phone=phone,
            userExist.DOB=DOB,
            userExist.gander=gander,
            userExist.age=age,
            userExist.role=role

            
        }
        //upload file
        if(req.file){
    
        //delete old image
          //  await cloudinary.uploader.destroy(brandExist.logo.public_id)
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
            return next( new AppErorr(message.user.fileToUpdate,500))
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
    const users=await User.find()
    res.status(200).json({success:true,data:users})      
}
//---------------4-get specificuser-------------------------
export const getspecificuser= async (req,res,next) => {
    //get data from req
    const { userId } =req.params
    const user=await User.findById(userId)
    user?
    res.status(200).json({ success:true,data:user})
        : next (new AppErorr(message.user.notFound,404))
}
//-------------5-deleteuser-------------------------------------
export const Deleteuser= async (req,res,next) => {
    //get data from req
    const { userId } =req.params
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
          return next(new AppErorr(message.user.notFound, 404));
        }
       //send response
       return res.status(200).json({
        message:message.user.deletesuccessfully,
        success:true
    })
    }
//-----------6-get profile data for user
export const getUserProfiledata = async (req, res, next) => {
        const { userId } = req.params;
    
        // check userexist
        const user = await User.findById(userId).select("name gander email phone profilePic")
        if (!user) {
            return next(new AppErorr(message.user.notFound, 404));
        }
        //   send response 
        res.status(200).json({success: true, data: user})
    }
//-----------------------------------------------------------------------------------------------------
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
       data:{token},
     })
}
//--------------2-logout------
export const logout = async (req, res, next) => {
    res.clearCookie("token")
    res.status(200).json({
        success: true,
        message: "user logout successfully" })
}



