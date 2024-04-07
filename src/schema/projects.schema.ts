import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  parentProjectName: string;
  parentProjectID: string;
  assignee: string;
  priority: string;
  status: string;
  milestones: string[];
  workspace: string[];
}

const ProjectSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Project title is invalid'],
  },
  description: {
    type: String
  },
  parentProjectName: {
    type: String,
    required: [true, 'Parent project name must be provided'],
  },
  parentProjectID: {
    type: Number,
    required: [true, 'Parent project id must be provided']
  },
  assignee: {
    type: String,
    required: [true, 'Project must have an assignee'],
  },
  priority: {
    type: String,
    default: null
  },
  status: {
    type: String,
    default: null
  },
  milestones: {
    type: [Schema.Types.ObjectId],
    default: null
  },
  workspace: {
    type: [Schema.Types.ObjectId],
    default: null
  },
});

// Export the model and return your IUser interface
export default mongoose.model<IProject>("Projects", ProjectSchema);