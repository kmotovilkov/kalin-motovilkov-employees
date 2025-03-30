import { HttpError } from "routing-controllers";
import { IEmployeeOverlap, IEmployeePair } from "../services/employee-pair-service";

export default class EmployeesPairCalculate {
  static calculateDays(from1: Date, to1: Date, from2: Date, to2: Date): number {
    if (!(from1 instanceof Date) || !(to1 instanceof Date) || !(from2 instanceof Date) || !(to2 instanceof Date)) {
      throw new HttpError(400, 'Invalid date inputs. All inputs must be valid Date objects.');
    };

    const start = new Date(Math.max(from1.getTime(), from2.getTime()));
    const end = new Date(Math.min(to1.getTime(), to2.getTime()));

    const overlap = Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.round(overlap);
  };

  static calculatePair(data: IEmployeePair[]): IEmployeeOverlap[] | null {
    const overlaps: IEmployeeOverlap[] = [];

    for (let i = 0; i < data.length; i++) {
      for (let j = i + 1; j < data.length; j++) {
        const emp1 = data[i];
        const emp2 = data[j];

        if (emp1.ProjectID === emp2.ProjectID) {
          const overlapDays = this.calculateDays(emp1.DateFrom, emp1.DateTo, emp2.DateFrom, emp2.DateTo);

          if (overlapDays > 0) {
            const [firstEmplID, secondEmplID] = [emp1.EmpID, emp2.EmpID].sort((a, b) => a > b ? 1 : -1);
            overlaps.push({
              firstEmplID,
              secondEmplID,
              daysOverlap: overlapDays,
            });
          };
        };
      };
    };

    if (overlaps.length === 0) {
      return null;
    };

    const longestOverlaps = Math.max(...overlaps.map((overlap) => overlap.daysOverlap));

    return overlaps.filter((overlap) => overlap.daysOverlap === longestOverlaps);
  }
};