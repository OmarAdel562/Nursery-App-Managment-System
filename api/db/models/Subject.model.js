import { model, Schema } from "mongoose";

//schema
const subjectSchema= new Schema(
    {
        
        name: {
             type: String, 
             required: true
             },
         description: {
                type: String, 
                required: true },     
        createdBy:{
                type:Schema.Types.ObjectId,
                ref:"User",
                required:true
            }
       
},{timestamps:true,toJSON: { virtuals: true }, toObject: { virtuals: true }});
//virtual
subjectSchema.virtual("materials",{
    ref:"Material",
    foreignField:"subjectId",
    localField:"_id"
});
subjectSchema.virtual("assigments",{
    ref:"Assigment",
    foreignField:"subjectId",
    localField:"_id"
});subjectSchema.virtual("links",{
    ref:"Link",
    foreignField:"subjectId",
    localField:"_id"
});
subjectSchema.virtual("quiz",{
    ref:"Quiz",
    foreignField:"subjectId",
    localField:"_id"
});
subjectSchema.virtual("grade",{
    ref:"Grade",
    foreignField:"subjectId",
    localField:"_id"
});
//model
export const Subject= model('Subject',subjectSchema)