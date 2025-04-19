import { Router } from "express";
import { asyncHandler } from "../../utils/appError.js";
import { isValid } from "../../midderware/validation.js";
 import { isAuthorized } from "../../midderware/authorization.js";
 import { roles } from "../../utils/constant/enum.js";
import { isAuthenticated } from "../../midderware/authentication.js";
import { addsubjectVal, Deletesubjectval, updatesubjectVal } from "./subject.validation.js";
import { Createsubject, Deletesubject, getallsubjectes, getspecificsubject, updatesubject } from "./subject.controller.js";



const subjectrouter=Router()

//----------------1-user-----------------
//1- addclass
subjectrouter.post('/addsubject',isAuthenticated(),isAuthorized([roles.MANAGMENT]),isValid(addsubjectVal),asyncHandler(Createsubject))
//2-updateclass
subjectrouter.put('/:subjectId',isAuthenticated(),isAuthorized([roles.MANAGMENT]),isValid(updatesubjectVal),asyncHandler(updatesubject))
//get allclass
subjectrouter.get('/',isAuthenticated(),isAuthorized([roles.MANAGMENT]), asyncHandler(getallsubjectes))
//4-get specific class
subjectrouter.get('/:subjectId',isAuthenticated(),isAuthorized([roles.MANAGMENT]), asyncHandler(getspecificsubject))
//4-delete specific class
subjectrouter.delete('/:subjectId',isAuthenticated(),isAuthorized([roles.MANAGMENT]),isValid(Deletesubjectval), asyncHandler(Deletesubject))



export default subjectrouter