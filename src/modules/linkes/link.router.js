import { Router } from "express";
import { asyncHandler } from "../../utils/appError.js";
import { isValid } from "../../midderware/validation.js";
 import { isAuthorized } from "../../midderware/authorization.js";
 import { isAuthenticated } from "../../midderware/authentication.js";
 import { roles } from "../../utils/constant/enum.js";
import { addLinkVal, DeleteLinkval, updateLinklVal } from "./link.validation.js";
import { addLink, DeleteLink, getallLink, getlinkBySubject, getspecificLink, updateLink } from "./link.controller.js";




const linkrouter=Router()

//----------------1-Link-----------------
//1- add Link
linkrouter.post('/addlink',isAuthenticated(),isAuthorized([roles.TEACHER]),isValid(addLinkVal),asyncHandler(addLink))
//2-update Link
linkrouter.put('/:linkId',isAuthenticated(),isAuthorized([roles.TEACHER]),isValid(updateLinklVal),asyncHandler(updateLink))
//3-get all Link 
linkrouter.get('/',isAuthenticated(),isAuthorized([roles.TEACHER,roles.STUDENT]), asyncHandler(getallLink))
//4-get specific Link
linkrouter.get('/:linkId',isAuthenticated(),isAuthorized([roles.TEACHER,roles.STUDENT]), asyncHandler(getspecificLink))
//5-delete specific Link
linkrouter.delete('/:linkId',isAuthenticated(),isAuthorized([roles.TEACHER]),isValid(DeleteLinkval), asyncHandler(DeleteLink))
//6- getlinkBySubject
linkrouter.get('/subject/:subjectId',asyncHandler(getlinkBySubject))

export default linkrouter