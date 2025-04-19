import { Router } from "express";
import { CreateNotification } from "./notification.controller.js";
import { asyncHandler } from "../../utils/appError.js";
import { isAuthenticated } from "../../midderware/authentication.js";
import { isAuthorized } from "../../midderware/authorization.js";
import { roles } from "../../utils/constant/enum.js";


const notificationrouter=Router()

//----------------1-Notification-----------------
//1- add Notification
notificationrouter.post('/addnotification',isAuthenticated(),isAuthorized([roles.TEACHER]), asyncHandler(CreateNotification))

export default notificationrouter