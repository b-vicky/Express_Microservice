import mongoose, { Schema, Document } from "mongoose";

export interface IMilestone extends Document {
  name: string;
  description: string[];
  projectId: string[];
}

const MilestoneSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Please enter workspace name'],
    lowercase: true
  },
  description: {
    type: String,
    lowercase: true,
    default: null
  },
  projectId: {
    type: [Schema.Types.ObjectId],
    required: [true, 'Atlease one project must be tagged to a milestone']
  },
});

// Export the model and return your IUser interface
export default mongoose.model<IMilestone>("Milestones", MilestoneSchema);
