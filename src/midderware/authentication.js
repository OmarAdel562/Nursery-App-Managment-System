import { AppError  } from "../utils/AppError.js"
import { verifyToken } from "../utils/token.js"
import { message } from "../utils/constant/messages.js"
import { User } from "../../db/models/User.model.js"


export const isAuthenticated = () =>{
    return async(req,res,next) =>{

        //token
        const {token}= req.headers

        //decoded token
        const payload= verifyToken({token})
        if( payload.message){
            return next (new AppError (payload.message,401))
        }
        
        //check user exist
        const authUser= await User.findOne({_id:payload._id })
        if(!authUser){
            return next(new AppError (message.user.notFound,404))
        }
        req.authUser=authUser
        next()
    }

    }
    
