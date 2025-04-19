import { Router } from "express";
import { asyncHandler } from "../../utils/AppError.js";
import { isValid } from "../../midderware/validation.js";
 import { isAuthorized } from "../../midderware/authorization.js";
 import { isAuthenticated } from "../../midderware/authentication.js";
 import { roles } from "../../utils/constant/enum.js";
import { addParentVal, DeleteParentval, updateParentlVal } from "./parent.validation.js";
import { addParent, DeleteParent, getallParent, getParentData, getParentNotifications, getspecificParent, getStudentGradesForParent, getStudentReportForParent, getStudentScheduleForParent, updateParent } from "./parent.controller.js";



const  parentrouter=Router()

//----------------1-Parent-----------------
//1- add Parent
parentrouter.post('/addparent',isAuthenticated(),isAuthorized([roles.MANAGMENT]),isValid(addParentVal),asyncHandler(addParent))
//2-update Parent
parentrouter.put('/:parentId',isAuthenticated(),isAuthorized([roles.MANAGMENT]),isValid(updateParentlVal),asyncHandler(updateParent))
//3-get all Parent 
parentrouter.get('/',isAuthenticated(),isAuthorized([roles.MANAGMENT]), asyncHandler(getallParent))
//4-get specific Parent
parentrouter.get('/:parentId',isAuthenticated(),isAuthorized([roles.MANAGMENT]), asyncHandler(getspecificParent))
//5-delete specific Parent
parentrouter.delete('/:parentId',isAuthenticated(),isAuthorized([roles.MANAGMENT]),isValid(DeleteParentval), asyncHandler(DeleteParent))
//6-get-Student-Grades-for-parent
parentrouter.get('/student/grades',isAuthenticated(),isAuthorized([roles.PARENT]) ,asyncHandler(getStudentGradesForParent))
//7-get-Student-report-for-parent
parentrouter.get('/student/report',isAuthenticated(),isAuthorized([roles.PARENT]) ,asyncHandler(getStudentReportForParent))
//8-get-Student-Schedule-for-parent
parentrouter.get('/student/schedule',isAuthenticated(),isAuthorized([roles.PARENT]) ,asyncHandler(getStudentScheduleForParent))
//9-get-Parent-profiledata
parentrouter.get('/parent/data',isAuthenticated(),isAuthorized([roles.PARENT]),asyncHandler(getParentData))
//9-get-Parent-notification
parentrouter.get('/parent/notification',isAuthenticated(),isAuthorized([roles.PARENT]),asyncHandler(getParentNotifications))

export default parentrouter