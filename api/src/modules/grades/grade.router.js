import { Router } from "express";
import { asyncHandler } from "../../utils/apperror.js";
import { isValid } from "../../midderware/validation.js";
 import { isAuthorized } from "../../midderware/authorization.js";
 import { isAuthenticated } from "../../midderware/authentication.js";
 import { roles } from "../../utils/constant/enum.js";
import { addGradeVal, DeleteGradeval, updateGradelVal } from "./grade.validation.js";
import { addGrade, DeleteGrade, getallGrade, getspecificGrade, updateGrade } from "./grade.controller.js";




const graderouter=Router()

//----------------1-grade-----------------
//1- add grade
graderouter.post('/addgrade',isAuthenticated(),isAuthorized([roles.TEACHER]),isValid(addGradeVal),asyncHandler(addGrade))
//2-update grade
graderouter.put('/:gradeId',isAuthenticated(),isAuthorized([roles.TEACHER]),isValid(updateGradelVal),asyncHandler(updateGrade))
//3-get all grade 
graderouter.get('/',isAuthenticated(),isAuthorized([roles.TEACHER,roles.STUDENT,roles.PARENT]), asyncHandler(getallGrade))
//4-get specific grade
graderouter.get('/:gradeId',isAuthenticated(),isAuthorized([roles.TEACHER,roles.STUDENT,roles.PARENT]), asyncHandler(getspecificGrade))
//5-delete specific grade
graderouter.delete('/:gradeId',isAuthenticated(),isAuthorized([roles.TEACHER]),isValid(DeleteGradeval), asyncHandler(DeleteGrade))


export default graderouter