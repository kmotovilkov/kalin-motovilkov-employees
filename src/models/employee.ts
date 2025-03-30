import mongoose from 'mongoose';

interface EmployeeAttrs {
  name: string;
};

interface EmployeeDoc extends mongoose.Document {
  name: string;
};

interface EmployeeModel extends mongoose.Model<EmployeeDoc> {
  build(attrs: EmployeeAttrs): EmployeeDoc;
};

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

employeeSchema.statics.build = (attrs: EmployeeAttrs) => {
  return new Employee(attrs);
};



const Employee = mongoose.model<EmployeeDoc, EmployeeModel>('Employee', employeeSchema);

export { Employee };