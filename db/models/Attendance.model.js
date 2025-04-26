import { model, Schema } from "mongoose";
import { attendancestatus } from "../../src/utils/constant/enum.js";

//schema
const attendanceSchema= new Schema(
    {
        studentId: { type:Schema.Types.ObjectId, ref: 'User', required: true }, 
        date: { type:Date,default:Date.now() }, 
        status: { 
            type: String, 
            enum:Object.values(attendancestatus),
             default:attendancestatus.PRESENT 
        }, 
            
},{timestamps:false})
//model
export const Attendance= model('Attendance',attendanceSchema)