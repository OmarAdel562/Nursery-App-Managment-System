import { Router } from "express";
import { asyncHandler } from "../../utils/AppError.js";
import { isValid } from "../../midderware/validation.js";
import { adduser, Deleteuser, getallusers, getspecificuser, getUserProfiledata, logout, signin, updateuser } from "./managment.controller.js";
import { adduserVal, Deleteuserval, signinval, updateuserVal } from "./managment.validation.js";
import { cloudUploadd } from "../../utils/multer-cloud .js";
import { isAuthenticated } from "../../midderware/authentication.js";


const userrouter=Router()

//----------------1-user-----------------
//1- adduser
userrouter.post('/adduser',cloudUploadd({}).single('profilePic'),isValid(adduserVal),asyncHandler(adduser))
//2-updateuser
userrouter.put('/:userId',cloudUploadd({}).single('profilePic'),isValid(updateuserVal),asyncHandler(updateuser))
//3-get allusers 
userrouter.get('/', asyncHandler(getallusers))
//4-get specific user
userrouter.get('/:userId', asyncHandler(getspecificuser))
//5-delete specific user
userrouter.delete('/:userId',isValid(Deleteuserval), asyncHandler(Deleteuser))

//---------------2-signin and logout---------------------
//1- signin
userrouter.post('/signin',isValid(signinval),asyncHandler(signin))
//1- signin
userrouter.post('/logout',isAuthenticated(), asyncHandler(logout))

export default userrouter