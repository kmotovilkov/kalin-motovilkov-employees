import { Service } from "typedi";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import EmployeesPairCalculate from "../utils/employees-pair-calculate";
import { HttpError } from "routing-controllers";

export interface IEmployeePair {
  EmpID: string;
  ProjectID: string;
  DateFrom: Date;
  DateTo: Date;
};

export interface IEmployeeOverlap {
  firstEmplID: string;
  secondEmplID: string;
  daysOverlap: number;
};

@Service()
export default class EmployeePairService {
  private readonly dataDirectory = path.join(__dirname, '../../data');

  private parseCSV(filePath: string) {
    const absolutePath = path.resolve(this.dataDirectory, filePath);
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });
     
    if (records.length === 0) {
      throw new HttpError(404, 'No records found in the CSV file.');
    };

    const recordsData = records.map((record: IEmployeePair) => {
      const dateFrom = new Date(record.DateFrom);
      const dateTo = String(record.DateTo) === 'undefined' ? new Date() : new Date(record.DateTo);

      
      if (isNaN(dateFrom.getTime())) {
        throw new HttpError(400, `Invalid DateFrom value: ${record.DateFrom} for id: ${record.EmpID}`);
      };

      if (isNaN(dateTo.getTime())) {
        throw new HttpError(400, `Invalid DateTo value: ${record.DateTo} for id: ${record.EmpID}`);
      };

      return {
        EmpID: parseInt(record.EmpID),
        ProjectID: parseInt(record.ProjectID),
        DateFrom: dateFrom,
        DateTo: dateTo
      };
    });

    return recordsData;
  };

  calculateLongestWorkingPair(filePath: string): IEmployeeOverlap[] | null {
    const data = this.parseCSV(filePath);
    return EmployeesPairCalculate.calculatePair(data);
  };
};