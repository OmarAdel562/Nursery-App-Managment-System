import { Router } from "express";
import { asyncHandler } from "../../utils/AppErrorr.js";
import { isValid } from "../../midderware/validation.js";
import { cloudUpload } from "../../utils/multer-cloud .js";
 import { isAuthorized } from "../../midderware/authorization.js";
 import { isAuthenticated } from "../../midderware/authentication.js";
 import { roles } from "../../utils/constant/enum.js";
import { addMaterialVal, DeleteMaterialval, updateMaterialVal } from "./material.validation.js";
import { addMaterial, DeleteMaterial, getallMaterial, getMatriaalBySubject, getspecificMaterial, updateMaterial } from "./material.controller.js";


const materialrouter=Router()

//----------------1-material-----------------
//1- addmaterial
materialrouter.post('/addmaterial',isAuthenticated(),isAuthorized([roles.TEACHER]),cloudUpload({}).single('file'),isValid(addMaterialVal),asyncHandler(addMaterial))
//2-update material
materialrouter.put('/:materialId',isAuthenticated(),isAuthorized([roles.TEACHER]),cloudUpload({}).single('file'),isValid(updateMaterialVal),asyncHandler(updateMaterial))
//3-get all material 
materialrouter.get('/',isAuthenticated(),isAuthorized([roles.TEACHER,roles.STUDENT]), asyncHandler(getallMaterial))
//4-get specific material
materialrouter.get('/:materialId',isAuthenticated(),isAuthorized([roles.TEACHER,roles.STUDENT]), asyncHandler(getspecificMaterial))
//5-delete specific material
materialrouter.delete('/:materialId',isAuthenticated(),isAuthorized([roles.TEACHER]),isValid(DeleteMaterialval), asyncHandler(DeleteMaterial))
//6- getmaterialBySubject
materialrouter.get('/subject/:subjectId',asyncHandler(getMatriaalBySubject))

export default materialrouter