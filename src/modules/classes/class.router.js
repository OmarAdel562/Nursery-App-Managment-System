import { Router } from "express";
import { asyncHandler } from "../../utils/apperror.js";
import { isValid } from "../../midderware/validation.js";
 import { isAuthorized } from "../../midderware/authorization.js";
 import { roles } from "../../utils/constant/enum.js";
import { isAuthenticated } from "../../midderware/authentication.js";
import { CreateClass, Deleteclass, getallclasses,  getspecificclass, updateclass } from "./class.controller.js";
import { addclassVal, Deleteclassval, updateclassVal } from "./class.validation.js";


const classrouter=Router()

//----------------1-user-----------------
//1- addclass
classrouter.post('/addclass',isAuthenticated(),isAuthorized([roles.MANAGMENT]),isValid(addclassVal),asyncHandler(CreateClass))
//2-updateclass
classrouter.put('/:classId',isAuthenticated(),isAuthorized([roles.MANAGMENT]),isValid(updateclassVal),asyncHandler(updateclass))
//3-get allclass
classrouter.get('/',isAuthenticated(),isAuthorized([roles.MANAGMENT]), asyncHandler(getallclasses))
//4-get specific class
classrouter.get('/:classId',isAuthenticated(),isAuthorized([roles.MANAGMENT]), asyncHandler(getspecificclass))
//5-delete specific class
classrouter.delete('/:classId',isAuthenticated(),isAuthorized([roles.MANAGMENT]),isValid(Deleteclassval), asyncHandler(Deleteclass))





export default classrouter