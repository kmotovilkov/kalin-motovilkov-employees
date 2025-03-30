import { HttpError } from "routing-controllers";

const mockExistsSync = jest.fn((filePath: string) => {
  console.log("Mock existsSync called with:", filePath);
  return filePath.endsWith('valid.csv');
});

const mockAccessSync = jest.fn((filePath: string) => {
  if (!filePath.endsWith('valid.csv')) {
    throw new HttpError(400, 'File not readable');
  }
});

const mockReadFileSync = jest.fn(() => `
  EmpID,ProjectID,DateFrom,DateTo
  143,12,2013-11-01,2014-01-05
  218,10,2011-04-16,INVALID_DATE
`);

jest.mock("fs", () => ({
  existsSync: mockExistsSync,
  accessSync: mockAccessSync,
  readFileSync: mockReadFileSync,
  constants: {
    R_OK: 4,
  },
}));

export const fsMock = {
  existsSync: mockExistsSync,
  accessSync: mockAccessSync,
  readFileSync: mockReadFileSync,
};
