import { Router } from "express";
import { asyncHandler } from "../../utils/AppError.js";
 import { isAuthorized } from "../../midderware/authorization.js";
 import { isAuthenticated } from "../../midderware/authentication.js";
 import { roles } from "../../utils/constant/enum.js";
import { sendToAIChatbot } from "./chat.controller.js";


const chatrouter=Router()

//----------------1-ChatBot-----------------
//1- create message
chatrouter.post('/ask',isAuthenticated,isAuthorized([roles.PARENT]),asyncHandler(sendToAIChatbot))

export default chatrouter