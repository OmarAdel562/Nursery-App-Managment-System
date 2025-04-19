import { Router } from "express";
import { asyncHandler } from "../../utils/appError.js";
import { isValid } from "../../midderware/validation.js";
 import { isAuthorized } from "../../midderware/authorization.js";
 import { isAuthenticated } from "../../midderware/authentication.js";
 import { roles } from "../../utils/constant/enum.js";
import { addStudent, DeleteStudent, getallStudent, getspecificStudent, getStudentData, getStudentGrades, getStudentGradesInSubject, getStudentNotifications, getStudentSchedule, getStudentSubjects, getStudentSubjectsWithTasks, updateStudent } from "./student.controller.js";
import { addStudentVal, Deletestudentval, updateStudentlVal } from "./student.validation.js";



const studentrouter=Router()

//----------------1-Student-----------------
//1- add Student
studentrouter.post('/addstudent',isAuthenticated(),isAuthorized([roles.MANAGMENT]),isValid(addStudentVal),asyncHandler(addStudent))
//2-update Student
studentrouter.put('/:studentId',isAuthenticated(),isAuthorized([roles.MANAGMENT]),isValid(updateStudentlVal),asyncHandler(updateStudent))
//3-get all Student 
studentrouter.get('/',isAuthenticated(),isAuthorized([roles.MANAGMENT]), asyncHandler(getallStudent))
//4-get specific Student
studentrouter.get('/:studentId',isAuthenticated(),isAuthorized([roles.MANAGMENT]), asyncHandler(getspecificStudent))
//5-delete specific Student
studentrouter.delete('/:studentId',isAuthenticated(),isAuthorized([roles.MANAGMENT]),isValid(Deletestudentval), asyncHandler(DeleteStudent))
//6- get-Student-profiledata
studentrouter.get('/student/data',isAuthenticated(),isAuthorized([roles.STUDENT]),asyncHandler(getStudentData))
//7- get-Student-schedule
studentrouter.get('/student/schedule',isAuthenticated(),isAuthorized([roles.STUDENT]),asyncHandler(getStudentSchedule))
//8- get-Student-grade
studentrouter.get('/student/grade',isAuthenticated(),isAuthorized([roles.STUDENT]),asyncHandler(getStudentGrades))
//9- get-Student-subject
studentrouter.get('/student/subject',isAuthenticated(),isAuthorized([roles.STUDENT]),asyncHandler(getStudentSubjects))
//10- get-Student-notification
studentrouter.get('/student/notification',isAuthenticated(),isAuthorized([roles.STUDENT]),asyncHandler(getStudentNotifications))
//11-getStudentSubjectsWithTasks
studentrouter.get('/student/subjectdata',isAuthenticated(),isAuthorized([roles.STUDENT]),asyncHandler(getStudentSubjectsWithTasks))
//12-getStudentGradesInSubject
studentrouter.get('/student/gradesinsubject/:subjectId',isAuthenticated(),isAuthorized([roles.STUDENT]),asyncHandler(getStudentGradesInSubject))
export default studentrouter