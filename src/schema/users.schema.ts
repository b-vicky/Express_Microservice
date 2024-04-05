import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const UserSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    lowercase: true
  },
  lastName: {
    type: String,
    required: [true, 'Please enter last name'],
    lowercase: true
  },
  email: {
    type: String,
    required: [true, 'Please enter the email'],
    unique: true,
    lowercase: true
  },
  org: {
    type: String,
    required: [true, 'Please enter the org name'],
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
});

//MONGOOSE HOOKS BEFORE THE DOC IS UPLOADED TO THE DB 
UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt)
})

// Export the model and return your IUser interface
export default mongoose.model<IUser>("User", UserSchema);
