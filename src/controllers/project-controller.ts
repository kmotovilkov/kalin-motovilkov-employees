import { JsonController, Get, Post, Put, Delete, Param, Body, UseBefore, Res, HttpError } from 'routing-controllers';
import { Response } from 'express';
import mongoose from 'mongoose';
import { Container, Service } from 'typedi';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';
import ProjectService, { IUpdateProjectData } from '../services/project-service';
import { ProjectStatus } from '../models/project';

@Service()
@JsonController('/projects')
export default class ProjectController {
  private projectService = Container.get(ProjectService);

  @Get()
  async getAllProjects() {
    return await this.projectService.getAllProjects();
  };

  @Get('/:id')
  async getProjectById(@Param('id') id: string) {
    return await this.projectService.getProjectById(id);
  };

  @Post()
  @UseBefore(
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Project name is required!'),
    body('employees')
      .optional()
      .isArray()
      .withMessage('Employees must be an array!')
      .custom((employees) => {
        const invalidIds = employees.filter((id: string) => {
          return !mongoose.Types.ObjectId.isValid(id)
        });

        if (invalidIds.length > 0) {
          throw new HttpError(400, `Invalid employee IDs: ${invalidIds.join(', ')}`);
        };

        return true;
      }),
    validateRequest)
  async createProject(@Body() projectData: { name: string; employees?: string[] }, @Res() res: Response) {
    const project = await this.projectService.createProject(projectData);
    return res.status(201).json(project);
  };

  @Put('/:id')
  @UseBefore(
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Project name is required!'),
    body('status')
      .optional()
      .isIn(Object.values(ProjectStatus))
      .withMessage('Project status must be valid!'),
    body('employees')
      .optional()
      .isArray()
      .withMessage('Employees must be an array!')
      .custom((employees) => {
        const invalidIds = employees.filter((id: string) => {
          return !mongoose.Types.ObjectId.isValid(id)
        });
        if (invalidIds.length > 0) {
          throw new HttpError(400, `Invalid employee IDs: ${invalidIds.join(', ')}`);
        };
        return true;
      }),
    validateRequest)
  async updateProject(@Param('id') id: string, @Body() projectData: IUpdateProjectData, @Res() res: Response) {
    const project = await this.projectService.updateProject(id, projectData);
    return res.status(201).send(project);
  };

  @Delete('/:id')
  async deleteProject(@Param('id') id: string, @Res() res: Response) {
    const deletedProject = await this.projectService.deleteProject(id);
    return res.status(204).json(deletedProject);
  };
};