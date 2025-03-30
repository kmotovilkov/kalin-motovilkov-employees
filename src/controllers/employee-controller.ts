import { JsonController, Get, Post, Put, Delete, Param, Body, UseBefore, Res } from 'routing-controllers';
import { Response } from 'express';
import { body } from 'express-validator';
import { Container, Service } from 'typedi';
import EmployeeService from '../services/employee-service';
import { validateRequest } from '../middlewares/validate-request';

@Service()
@JsonController('/employees')
export default class EmployeeController {
  private employeeService = Container.get(EmployeeService);

  @Get()
  async getAllEmployees() {
    return await this.employeeService.getAllEmployees();
  };

  @Get('/:id')
  async getEmployeeById(@Param('id') id: string) {
    return await this.employeeService.getEmployeeById(id);
  };

  @Post()
  @UseBefore(
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Employee name is required!'),
    validateRequest)
  async createEmployee(@Body() employeeData: { name: string }, @Res() res: Response) {
    const employee = await this.employeeService.createEmployee(employeeData);
    return res.status(201).json(employee);
  };

  @Put('/:id')
  @UseBefore(
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Employee name is required!'),
    validateRequest)
  async updateEmployee(@Param('id') id: string, @Body() employeeData: { name: string }, @Res() res: Response) {
    const employee = await this.employeeService.updateEmployee(id, employeeData);
    return res.status(201).json(employee);
  };

  @Delete('/:id')
  async deleteEmployee(@Param('id') id: string, @Res() res: Response) {
    const deletedEmployee = await this.employeeService.deleteEmployee(id);
    return res.status(204).json(deletedEmployee);
  };
};