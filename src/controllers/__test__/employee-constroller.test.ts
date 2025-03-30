import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Employee } from "../../models/employee";

describe('Get All Employees', () => {
  it('can fetch a list of employees', async () => {
    await request(app)
      .get('/employees')
      .set('Cookie', global.login())
      .expect(200);
  });

  it('returns a 401 if the user is not authenticated', async () => {
    await request(app)
      .get('/employees')
      .expect(401);
  });
});

describe('Create Employee', () => {
  it('has a router handler listening to /employees for post request', async () => {
    const response = await request(app)
      .post('/employees')
      .send({});

    expect(response.status).not.toEqual(404);
  });

  it('returns an error if an invalid name is provided', async () => {
    await request(app)
      .post('/employees')
      .send({
        name: ''
      })
      .expect(400);

    await request(app)
      .post('/employees')
      .send({})
      .expect(400);
  });

  it('create a employee with valid input', async () => {
    let employee = await Employee.find({});
    expect(employee.length).toEqual(0);

    await request(app)
      .post('/employees')
      .send({
        name: 'Name Test',
      })
      .expect(201);

    employee = await Employee.find({});
    expect(employee.length).toEqual(1);
    expect(employee[0].name).toEqual('Name Test');
  });

});

describe('Update Employee', () => {
  it('has a router handler listening to /employees/:id for put request', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
      .put(`/employees/${id}`)
      .send({});

    expect(response.status).not.toEqual(404);
  });

  it('return a 404 if provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .put(`/employees/${id}`)
      .send({
        name: 'Name Test',
      })
      .expect(404);
  });

  it('return a 400 if the user provide an invalid name', async () => {
    const response = await request(app)
      .post(`/employees`)
      .send({
        name: 'Name Test',
      });

    await request(app)
      .put(`/employees/${response.body.id}`)
      .send({
        name: ''
      })
      .expect(400);
  });

  it('update employee provided valid input', async () => {
    const response = await request(app)
      .post(`/employees`)
      .send({
        name: 'Name Test',
      });

    await request(app)
      .put(`/employees/${response.body.id}`)
      .send({
        name: 'Name Test New'
      })
      .expect(201);

    const employee = await Employee.findById(response.body.id);
    expect(employee?.name).toEqual('Name Test New');
  });
});

describe('Delete Employee', () => {
  it('delete an employee with valid id', async () => {
    const response = await request(app)
      .post(`/employees`)
      .send({
        name: 'Name Test',
      });

    await request(app)
      .delete(`/employees/${response.body.id}`)
      .expect(204);

    const employee = await Employee.findById(response.body.id);
    expect(employee).toBeNull();
  });

  it('return a 404 if provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .delete(`/employees/${id}`)
      .expect(404);
  });
});