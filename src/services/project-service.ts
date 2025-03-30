import { Service } from "typedi";
import { Project, ProjectStatus } from "../models/project";
import { Employee } from "../models/employee";
import mongoose from "mongoose";
import { HttpError } from "routing-controllers";

export interface IUpdateProjectData {
  name?: string;
  status?: ProjectStatus;
  endDate?: Date;
  employees: string[];
};

@Service()
export default class ProjectService {
  async getAllProjects() {
    return await Project.find({});
  };

  async getProjectById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpError(404, 'Employee not found');
    };

    const project = await Project.findById(id);

    if (!project) {
      throw new HttpError(404, 'Project not found');
    };

    return project;
  };

  async createProject(projectData: { name: string; employees?: string[] }) {
    const { name, employees } = projectData;

    if (employees && employees.length > 0) {
      const existingEmployees = await Employee.find({});
      const existingEmployeeIds = existingEmployees.map(emp => emp.id!.toString());
      const invalidEmployeeIds = employees.filter(empId => !existingEmployeeIds.includes(empId));

      if (invalidEmployeeIds.length > 0) {
        throw new HttpError(404, `Missing employee IDs: ${invalidEmployeeIds.join(', ')}`);
      };
    };

    const project = Project.build({
      name,
      status: ProjectStatus.ACTIVE,
      startDate: new Date(),
      endDate: undefined,
      employees: employees || []
    });

    try {
      await project.save();
      return project;

    } catch (err) {
      throw new HttpError(500, 'Error connecting to database');
    };
  };

  async updateProject(id: string, updateData: IUpdateProjectData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpError(404, 'Project not found');
    };

    const updatedProject = await Project.findById(id);

    if (!updatedProject) {
      throw new HttpError(404, 'Project not found');
    };

    if (updateData.name) {
      updatedProject.name = updateData.name;
    };

    if (updateData.employees && updateData.employees.length > 0) {
      const existingEmployees = await Employee.find({});
      const existingEmployeeIds = existingEmployees.map(emp => emp.id!.toString());
      const invalidEmployeeIds = updateData.employees.filter(empId => !existingEmployeeIds.includes(empId));

      if (invalidEmployeeIds.length > 0) {
        throw new HttpError(404, `Missing employee IDs: ${invalidEmployeeIds.join(", ")}`);
      };

      updatedProject.employees = [...updatedProject.employees, ...updateData.employees];
    };

    if (updateData.status) {
      if (updateData.status === ProjectStatus.COMPLETED) {
        updatedProject.status = ProjectStatus.COMPLETED;
        updatedProject.endDate = new Date();
      } else {
        updatedProject.endDate = undefined;
        updatedProject.status = ProjectStatus.ACTIVE;
      };
    };

    try {
      await updatedProject.save();
      return updatedProject;
    } catch (err) {
      throw new HttpError(500, 'Error connecting to database');
    }
  };

  async deleteProject(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpError(404, 'Project not found');
    };

    const deletedProject = await Project.findById(id);

    if (!deletedProject) {
      throw new HttpError(404, 'Project not found');
    };

    await deletedProject.deleteOne();

    return deletedProject;
  };
};
