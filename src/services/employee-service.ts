import { Service } from "typedi";
import { Employee } from "../models/employee";
import { HttpError } from "routing-controllers";
import mongoose from "mongoose";

@Service()
export default class EmployeeService {
  async getAllEmployees() {
    return await Employee.find({});
  };

  async getEmployeeById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpError(404, 'Employee not found.');
    };

    const employee = await Employee.findById(id);

    if (!employee) {
      throw new HttpError(404, 'Employee not found.');
    };

    return employee;
  };

  async createEmployee(employeeData: { name: string }) {
    const employee = Employee.build(employeeData);
    try {
      await employee.save();
      return employee;
    }
    catch (err) {
      throw new HttpError(500, 'Error connecting to database.');
    };
  };

  async updateEmployee(id: string, employeeData: { name: string }) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpError(404, 'Employee not found.');
    };

    const updatedEmployee = await Employee.findById(id);

    if (!updatedEmployee) {
      throw new HttpError(404, 'Employee not found.');
    };

    updatedEmployee.set(employeeData);

    try {
      await updatedEmployee.save();
      return updatedEmployee;

    } catch (err) {
      throw new HttpError(500, 'Error connecting to database.');
    }
  };

  async deleteEmployee(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpError(404, 'Employee not found.');
    };

    const deletedEmployee = await Employee.findById(id);

    if (!deletedEmployee) {
      throw new HttpError(404, 'Employee not found.');
    };
    await deletedEmployee.deleteOne();

    return deletedEmployee;
  };
};