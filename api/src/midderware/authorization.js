import { AppErorr } from "../utils/apperror.js"
import { message } from "../utils/constant/messages.js"


export const isAuthorized= (roles)=>{
    return async(req,res,next) =>{
        // if (!req.authUser || !req.authUser.role) {
        //     return next(new AppErorr(message.user.notauthorized, 401));}
       if (!roles.includes(req.authUser.role)) {
            return next (new AppErorr(message.user.notauthorized,403))
        }
        next()

    }
}