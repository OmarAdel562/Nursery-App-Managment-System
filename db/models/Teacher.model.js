import { model, Schema } from "mongoose";

//schema
const teaherSchema= new Schema(
    {
        
        userId: { type:Schema.Types.ObjectId, ref: 'User', required: true }, 
        classId: {type:Schema.Types.ObjectId, ref: 'Class', required: true},
        subjectes:[{type:Schema.Types.ObjectId, ref: 'Subject', required: true}],
        createdBy:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
       
},{timestamps:true})
//model
export const Teacher= model('Teacher',teaherSchema)