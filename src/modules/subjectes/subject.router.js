import { Router } from "express";
import { asyncHandler } from "../../utils/AppError.js";
import { isValid } from "../../midderware/validation.js";
 import { isAuthorized } from "../../midderware/authorization.js";
 import { roles } from "../../utils/constant/enum.js";
import { isAuthenticated } from "../../midderware/authentication.js";
import { addsubjectVal, Deletesubjectval, updatesubjectVal } from "./subject.validation.js";
import { Createsubject, Deletesubject, getallsubjectes, getspecificsubject, updatesubject } from "./subject.controller.js";



const subjectrouter=Router()

//----------------1-subject-----------------
//1- add subject
subjectrouter.post('/addsubject',isAuthenticated(),isAuthorized([roles.MANAGMENT]),isValid(addsubjectVal),asyncHandler(Createsubject))
//2-update subject
subjectrouter.put('/:subjectId',isAuthenticated(),isAuthorized([roles.MANAGMENT]),isValid(updatesubjectVal),asyncHandler(updatesubject))
//get all subject
subjectrouter.get('/',isAuthenticated(),isAuthorized([roles.MANAGMENT]), asyncHandler(getallsubjectes))
//4-get specific subject
subjectrouter.get('/:subjectId',isAuthenticated(),isAuthorized([roles.MANAGMENT,roles.STUDENT]), asyncHandler(getspecificsubject))
//4-delete specific subject
subjectrouter.delete('/:subjectId',isAuthenticated(),isAuthorized([roles.MANAGMENT]),isValid(Deletesubjectval), asyncHandler(Deletesubject))



export default subjectrouter