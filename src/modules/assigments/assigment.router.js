import { Router } from "express";
import { asyncHandler } from "../../utils/AppError.js";
import { isValid } from "../../midderware/validation.js";
import { cloudUpload } from "../../utils/multer-cloud .js";
 import { isAuthorized } from "../../midderware/authorization.js";
 import { isAuthenticated } from "../../midderware/authentication.js";
 import { roles } from "../../utils/constant/enum.js";
import { addAssigmentlVal, DeleteAssigmentval, updateAssigmentlVal } from "./assigment.validation.js";
import { addAssigment, DeleteAssigment, getallAssigment, getAssigmentBySubject, getspecificAssigment, updateAssigment } from "./assigment.controller.js";




const assigmentrouter=Router()

//----------------1-Assigment-----------------
//1- addassigment
assigmentrouter.post('/addassigment',isAuthenticated(),isAuthorized([roles.TEACHER]),cloudUpload({}).single('file'),isValid(addAssigmentlVal),asyncHandler(addAssigment))
//2-update assigment
assigmentrouter.put('/:assigmentId',isAuthenticated(),isAuthorized([roles.TEACHER]),cloudUpload({}).single('file'),isValid(updateAssigmentlVal),asyncHandler(updateAssigment))
//3-get all assigment 
assigmentrouter.get('/',isAuthenticated(),isAuthorized([roles.TEACHER,roles.STUDENT]), asyncHandler(getallAssigment))
//4-get specific assigment
assigmentrouter.get('/:assigmentId',isAuthenticated(),isAuthorized([roles.TEACHER,roles.STUDENT]), asyncHandler(getspecificAssigment))
//5-delete specific assigment
assigmentrouter.delete('/:assigmentId',isAuthenticated(),isAuthorized([roles.TEACHER]),isValid(DeleteAssigmentval), asyncHandler(DeleteAssigment))
//6- getassigmentBySubject
assigmentrouter.get('/subject/:subjectId',asyncHandler(getAssigmentBySubject))

export default assigmentrouter