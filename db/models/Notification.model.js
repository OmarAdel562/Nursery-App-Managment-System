import { model, Schema } from "mongoose";

const notificationSchema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  receiverStudent: { type: Schema.Types.ObjectId, ref: 'Student' },
  receiverParent: { type: Schema.Types.ObjectId, ref: 'Parent' },
  type: { type: String, enum: ["quiz", "assignment", "material", "link", "grade", "attendance"], required: true },
  //isRead: { type: Boolean, default: false }
}, { timestamps: true })

export const Notification = model("Notification", notificationSchema)