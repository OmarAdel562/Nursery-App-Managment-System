import { Router } from "express";
import { asyncHandler } from "../../utils/apperror.js";
 import { isAuthorized } from "../../midderware/authorization.js";
 import { isAuthenticated } from "../../midderware/authentication.js";
 import { roles } from "../../utils/constant/enum.js";
import { analyzePronunciation } from "./pronunciation.controller.js";


const pronunciationrouter=Router()

//----------------1-AnalyzePronunciation-----------------
//1- create message
pronunciationrouter.post('/analyze',isAuthenticated,isAuthorized([roles.STUDENT]),asyncHandler(analyzePronunciation))

export default pronunciationrouter