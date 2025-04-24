import { model, Schema } from "mongoose";

//schema
const assigmentSchema= new Schema(
    {
        name: { type: String, required: true },
        subjectId: { type:Schema.Types.ObjectId, ref: 'Subject', required: true }, 
        classId: { type: Schema.Types.ObjectId, ref: 'Class' }, 
        dueDate: { type: Date, required: true }, 
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
export const Assigment= model('Assigment',assigmentSchema)