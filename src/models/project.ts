import mongoose from 'mongoose';

export enum ProjectStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
};

interface ProjectAttrs {
  name: string;
  status: ProjectStatus;
  startDate: Date;
  endDate: Date | undefined;
  employees: string[];
};

interface ProjectDoc extends mongoose.Document {
  name: string;
  status: ProjectStatus;
  startDate: Date;
  endDate: Date | undefined;
  employees: string[];
};

interface ProjectModel extends mongoose.Model<ProjectDoc> {
  build(attrs: ProjectAttrs): ProjectDoc;
};

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ProjectStatus,
    default: ProjectStatus.ACTIVE
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
  },
  employees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    }
  ]
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

projectSchema.statics.build = (attrs: ProjectAttrs) => {
  return new Project(attrs);
};

const Project = mongoose.model<ProjectDoc, ProjectModel>('Project', projectSchema);

export { Project };