import mongoose, { Schema, Document } from "mongoose";

export interface IWorkspace extends Document {
  name: string;
  users: string[];
}

const WorkspaceSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Please enter workspace name'],
    lowercase: true
  },
  users: {
    type: [Schema.Types.ObjectId],
    default: null
  },
});

// Export the model and return your IUser interface
export default mongoose.model<IWorkspace>("Workspace", WorkspaceSchema);
