import { Router } from "express";
import { asyncHandler } from "../../utils/AppErrorr.js";
import { isValid } from "../../midderware/validation.js";
import { cloudUploadd } from "../../utils/multer-cloud .js";
 import { isAuthorized } from "../../midderware/authorization.js";
 import { isAuthenticated } from "../../midderware/authentication.js";
 import { roles } from "../../utils/constant/enum.js";
import { addScheduleVal, DeleteScheduleval, updateScheduleVal } from "./Schedule.validation.js";
import { addSchedule, DeleteSchedule, getallSchedules, getspecificSchedule, updateSchedule } from "./Schedule.controller.js";


const schedulerouter=Router()

//----------------1-Schedule-----------------
//1- addSchedule
schedulerouter.post('/addschedule',isAuthenticated(),isAuthorized([roles.MANAGMENT]),cloudUploadd({}).single('image'),isValid(addScheduleVal),asyncHandler(addSchedule))
//2-updateSchedule
schedulerouter.put('/:scheduleId',isAuthenticated(),isAuthorized([roles.MANAGMENT]),cloudUploadd({}).single('image'),isValid(updateScheduleVal),asyncHandler(updateSchedule))
//3-get allSchedules 
schedulerouter.get('/',isAuthenticated(),isAuthorized([roles.MANAGMENT]), asyncHandler(getallSchedules))
//4-get specific Schedule
schedulerouter.get('/:scheduleId',isAuthenticated(),isAuthorized([roles.MANAGMENT]), asyncHandler(getspecificSchedule))
//5-delete specific Schedule
schedulerouter.delete('/:scheduleId',isAuthenticated(),isAuthorized([roles.MANAGMENT]),isValid(DeleteScheduleval), asyncHandler(DeleteSchedule))


export default schedulerouter