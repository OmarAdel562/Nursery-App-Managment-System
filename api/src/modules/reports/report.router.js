import { Router } from "express";
import { asyncHandler } from "../../utils/apperror.js";
import { isValid } from "../../midderware/validation.js";
 import { isAuthorized } from "../../midderware/authorization.js";
 import { isAuthenticated } from "../../midderware/authentication.js";
 import { roles } from "../../utils/constant/enum.js";
import { addReportVal, DeleteReportVal, updateReportVal } from "./report.validation.js";
import { addReport, DeleteReport, getallReport, getspecificReport, getspecificstudentreport, updateReport } from "./report.controller.js";





const reportrouter=Router()

//----------------1-Report-----------------
//1- add Report
reportrouter.post('/addreport',isAuthenticated(),isAuthorized([roles.MANAGMENT]),isValid(addReportVal),asyncHandler(addReport))
//2-update Report
reportrouter.put('/:reportId',isAuthenticated(),isAuthorized([roles.MANAGMENT]),isValid(updateReportVal),asyncHandler(updateReport))
//3-get all Report 
reportrouter.get('/',isAuthenticated(),isAuthorized([roles.MANAGMENT]), asyncHandler(getallReport))
//4-get specific Report
reportrouter.get('/:reportId',isAuthenticated(),isAuthorized([roles.MANAGMENT]), asyncHandler(getspecificReport))
//5-delete specific Report
reportrouter.delete('/:reportId',isAuthenticated(),isAuthorized([roles.MANAGMENT]),isValid(DeleteReportVal), asyncHandler(DeleteReport))
//6- getspecificestudentreport
reportrouter.get('/student/:studentId',asyncHandler(getspecificstudentreport))

export default reportrouter