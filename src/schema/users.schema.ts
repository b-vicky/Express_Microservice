import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  org: string;
  workspace: string[];
  projects: string[];
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
    required: [true, 'Please enter your password'],
    minlength: [8, 'Password must be atleast 8 character long']
  },
  workspace: {
    type: [Schema.Types.ObjectId],
    required: [true, 'User must be assigned to atlease one workspace']
  },
  projects: {
    type: [Schema.Types.ObjectId],
    default: null
  },
});

//MONGOOSE HOOKS BEFORE THE DOC IS UPLOADED TO THE DB 
UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt)
})

// Export the model and return your IUser interface
export default mongoose.model<IUser>("User", UserSchema);
