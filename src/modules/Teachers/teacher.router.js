import { Router } from "express";
import { asyncHandler } from "../../utils/apperror.js";
import { isValid } from "../../midderware/validation.js";
 import { isAuthorized } from "../../midderware/authorization.js";
 import { isAuthenticated } from "../../midderware/authentication.js";
 import { roles } from "../../utils/constant/enum.js";
import { addTeacherVal, DeleteTeacherval, updateTeacherlVal } from "./teacher.validation.js";
import { addTeacher, DeleteTeacher, getallTeacher, getClassForTeacher, getQuizGradesForClass, getspecificTeacher, getTeacherData, getTeacherSchedule, getTeacherSubjects, updateTeacher } from "./teacher.controller.js";



const teacherrouter=Router()

//----------------1-Teacher-----------------
//1- add Teacher
teacherrouter.post('/addteacher',isAuthenticated(),isAuthorized([roles.MANAGMENT]),isValid(addTeacherVal),asyncHandler(addTeacher))
//2-update Teacher
teacherrouter.put('/:teacherId',isAuthenticated(),isAuthorized([roles.MANAGMENT]),isValid(updateTeacherlVal),asyncHandler(updateTeacher))
//3-get all Teacher 
teacherrouter.get('/',isAuthenticated(),isAuthorized([roles.MANAGMENT]), asyncHandler(getallTeacher))
//4-get specific Teacher
teacherrouter.get('/:teacherId',isAuthenticated(),isAuthorized([roles.MANAGMENT]), asyncHandler(getspecificTeacher))
//5-delete specific Teacher
teacherrouter.delete('/:teacherId',isAuthenticated(),isAuthorized([roles.MANAGMENT]),isValid(DeleteTeacherval), asyncHandler(DeleteTeacher))
//6- get-teacher-profiledata
teacherrouter.get('/teacher/data',isAuthenticated(),isAuthorized([roles.TEACHER]),asyncHandler(getTeacherData))
//7- get-teacher-schedule
teacherrouter.get('/teacher/schedule',isAuthenticated(),isAuthorized([roles.TEACHER]),asyncHandler(getTeacherSchedule))
//8- get-teacher-classdata
teacherrouter.get('/teacher/classdata',isAuthenticated(),isAuthorized([roles.TEACHER]),asyncHandler(getClassForTeacher))
//9- get-teacher-subjectes
teacherrouter.get('/teacher/subject',isAuthenticated(),isAuthorized([roles.TEACHER]),asyncHandler(getTeacherSubjects))
//10- getQuizGradesForClass
teacherrouter.get('/teacher/quizscore/:classId/:quizId',isAuthenticated(),isAuthorized([roles.TEACHER]),asyncHandler(getQuizGradesForClass))
export default teacherrouter