import { model, Schema } from "mongoose";

//schema
const materialSchema= new Schema(
    {
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' }, 
    classId: { type: Schema.Types.ObjectId, ref: 'Class' }, 
    name: { type: String }, 
    file: {
         secure_url:{type:String,required:false},
        public_id:{type:String,required:false}
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
    
},{timestamps:false})
//model
export const Material= model('Material',materialSchema)