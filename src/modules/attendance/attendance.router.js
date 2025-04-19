import { Router } from "express";
import { asyncHandler } from "../../utils/AppError.js";
import { isValid } from "../../midderware/validation.js";
 import { isAuthorized } from "../../midderware/authorization.js";
 import { isAuthenticated } from "../../midderware/authentication.js";
 import { roles } from "../../utils/constant/enum.js";
import { leaveAttendance, markAttendance } from "./attendance.controller.js";




const attendancerouter=Router()

//----------------1-Attendance-----------------
//1- create attendance
attendancerouter.post('/createattendance',asyncHandler(markAttendance))
//2-leave attendance
attendancerouter.post('/leaveattendance',asyncHandler(leaveAttendance))


export default attendancerouter