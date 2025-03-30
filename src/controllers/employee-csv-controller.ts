import { JsonController, Get, QueryParam, HttpError, UseBefore } from "routing-controllers";
import Container, { Service } from "typedi";
import path from "path";
import { query } from "express-validator";
import { existsSync, accessSync, constants } from "fs";
import EmployeePairService from "../services/employee-pair-service";
import { validateRequest } from "../middlewares/validate-request";

@Service()
@JsonController('/employees-pair')
export default class EmployeePairController {
  private employeePairService = Container.get(EmployeePairService);

  @Get()
  @UseBefore(
    query('filePath')
      .notEmpty()
      .withMessage('File path is required.')
      .bail()
      .custom((filePath) => {
        if (!filePath.endsWith('.csv')) {
          throw new HttpError(400, 'File must be in CSV format.');
        };

        if (!existsSync(path.join(__dirname, '../../data', filePath))) {
          console.log("existsSync: File does not exist");
          throw new HttpError(400, 'File does not exist at the specified path.');
        };

        try {
          console.log("accessSync: Checking file readability");
          accessSync(path.join(__dirname, '../../data', filePath), constants.R_OK);
        } catch (err) {
          console.log("accessSync: File is not readable");
          throw new HttpError(400, 'File is not readeble.');
        };
        return true;
      }),
    validateRequest)
  async findLongestWorkingPair(@QueryParam('filePath') filePath: string) {
    const results = this.employeePairService.calculateLongestWorkingPair(filePath);

    if (results?.length === 0 || !results) {
      throw new HttpError(404, 'No overlapping work periods found.');
    };

    return results.map((result) => `${result.firstEmplID}, ${result.secondEmplID}, ${result.daysOverlap}`)
      .join('\n');
  };
};