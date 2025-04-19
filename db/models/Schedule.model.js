import { model, Schema } from "mongoose";

//schema
const scheduleSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        image: {
            secure_url:{type:String,required:false},
           public_id:{type:String,required:false}
       },
       createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    } 
       
},{timestamps:true})
//model
export const Schedule= model('Schedule',scheduleSchema )