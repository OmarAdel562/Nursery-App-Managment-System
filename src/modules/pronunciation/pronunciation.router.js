import { Router } from "express";
import { asyncHandler } from "../../utils/AppError.js";
 import { isAuthorized } from "../../midderware/authorization.js";
 import { isAuthenticated } from "../../midderware/authentication.js";
 import { roles } from "../../utils/constant/enum.js";
import { analyzePronunciation } from "./pronunciation.controller.js";
import multer from 'multer';  // استيراد multer


const storage = multer.memoryStorage();
const upload = multer({ storage });


const pronunciationrouter=Router()

//----------------1-AnalyzePronunciation-----------------
//1- create message
pronunciationrouter.post('/analyze',isAuthenticated(),upload.single('audio'),isAuthorized([roles.STUDENT]),asyncHandler(analyzePronunciation))

export default pronunciationrouter