import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Project } from "../../models/project";
import { ProjectStatus } from "../../models/project";

describe('Get All Projects', () => {
  it('can fetch a list of projects', async () => {
    await request(app)
      .get('/projects')
      .set('Cookie', global.login())
      .expect(200);
  });

  it('returns a 401 if the user is not authenticated', async () => {
    await request(app)
      .get('/projects')
      .expect(401);
  });
});

describe('Get Project By ID', () => {
  it('has a router handler listening to /projects/:id for get request', async () => {
    const response = await request(app)
      .get('/projects/id')
      .send({});

    expect(response.status).not.toEqual(404);
  });

  it('returns a 401 if the user is not authenticated', async () => {
    await request(app)
      .get('/projects/id')
      .expect(401);
  });

  it('returns an error if a not existing project id is provided', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .get(`/projects/${id}`)
      .set('Cookie', global.login())
      .expect(404);
  });


  it('returns status 200 and project if valid id is provided', async () => {
    let projects = await Project.find({});
    expect(projects.length).toEqual(0);

    const project = await request(app)
      .post('/projects')
      .send({
        name: 'Name Test',
      })
      .expect(201);

    await request(app)
      .get(`/projects/${project.body.id}`)
      .set('Cookie', global.login())
      .expect(200);

    projects = await Project.find({});
    expect(projects.length).toEqual(1);
    expect(projects[0].name).toEqual('Name Test');
  });
});

describe('Create Project', () => {
  it('has a router handler listening to /projects for post request', async () => {
    const response = await request(app)
      .post('/projects')
      .send({});

    expect(response.status).not.toEqual(404);
  });

  it('returns an error if an invalid name is provided', async () => {
    await request(app)
      .post('/projects')
      .send({
        name: ''
      })
      .expect(400);

    await request(app)
      .post('/projects')
      .send({})
      .expect(400);
  });

  it('returns an error if an invalid employees is provided', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .post('/projects')
      .send({
        name: 'Test Name',
        employees: ['invalid-id']
      })
      .expect(400);

    await request(app)
      .post('/projects')
      .send({
        name: 'Test Name',
        employees: 'invalid-employees'
      })
      .expect(400);

    await request(app)
      .post('/projects')
      .send({
        name: 'Test Name',
        employees: 123
      })
      .expect(400);

    await request(app)
      .post('/projects')
      .send({
        name: 'Test Name',
        employees: [id, 'invalid-id']
      })
      .expect(400);
  });

  it('create a project with valid input name', async () => {
    let projects = await Project.find({});
    expect(projects.length).toEqual(0);

    await request(app)
      .post('/projects')
      .send({
        name: 'Name Test',
      })
      .expect(201);

    projects = await Project.find({});
    expect(projects.length).toEqual(1);
    expect(projects[0].name).toEqual('Name Test');
  });

  it('create a project with valid input name and not found employee id', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    let projects = await Project.find({});
    expect(projects.length).toEqual(0);

    await request(app)
      .post('/projects')
      .send({
        name: 'Name Test',
        employees: [id]
      })
      .expect(404);
  });

  it('create a project with valid inputs name and employees', async () => {
    const employee = await request(app)
      .post('/employees')
      .send({
        name: 'Name Test1',
      })
      .expect(201);

    let projects = await Project.find({});
    expect(projects.length).toEqual(0);

    await request(app)
      .post('/projects')
      .send({
        name: 'Name Test',
        employees: [employee.body.id]
      })
      .expect(201);

    projects = await Project.find({});
    expect(projects.length).toEqual(1);
    expect(projects[0].name).toEqual('Name Test');
    expect(projects[0].employees.length).toEqual(1);
    expect(projects[0].employees[0].toString()).toEqual(employee.body.id);
  });
});

describe('Update Project', () => {
  it('return a 404 if provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .put(`/projects/${id}`)
      .send({
        name: 'Name Test',
      })
      .expect(404);
  });

  it('return a 400 if the user provide an invalid name', async () => {
    const response = await request(app)
      .post(`/projects`)
      .send({
        name: 'Name Test',
      });

    await request(app)
      .put(`/projects/${response.body.id}`)
      .send({
        name: ''
      })
      .expect(400);
  });

  it('return a 400 if the user provide an invalid status and no end date is set', async () => {
    const response = await request(app)
      .post(`/projects`)
      .send({
        name: 'Name Test',
      });

    await request(app)
      .put(`/projects/${response.body.id}`)
      .send({
        status: 'invalid-status'
      })
      .expect(400);

    const projects = await Project.findById(response.body.id);
    expect(projects?.endDate).toEqual(undefined);
  });

  it('update project with provided valid input name', async () => {
    const response = await request(app)
      .post(`/projects`)
      .send({
        name: 'Name Test',
      });

    await request(app)
      .put(`/projects/${response.body.id}`)
      .send({
        name: 'Name Test New'
      })
      .expect(201);

    const projects = await Project.findById(response.body.id);
    expect(projects?.name).toEqual('Name Test New');
  });


  it('update project with provided valid status', async () => {
    const response = await request(app)
      .post(`/projects`)
      .send({
        name: 'Name Test',
      });

    await request(app)
      .put(`/projects/${response.body.id}`)
      .send({
        status: ProjectStatus.COMPLETED
      })
      .expect(201);

    const projects = await Project.findById(response.body.id);
    expect(projects?.status).toEqual(ProjectStatus.COMPLETED);
  });

  it('update project with provided valid status and auto set end date', async () => {
    const response = await request(app)
      .post(`/projects`)
      .send({
        name: 'Name Test',
      });

    await request(app)
      .put(`/projects/${response.body.id}`)
      .send({
        status: ProjectStatus.COMPLETED
      })
      .expect(201);

    const projects = await Project.findById(response.body.id);
    expect(projects?.status).toEqual(ProjectStatus.COMPLETED);
    expect(projects?.endDate).toBeDefined();
    expect(projects?.endDate).toBeInstanceOf(Date);
  });

  it('update project with provided active staus and auto unset end date', async () => {
    const response = await request(app)
      .post(`/projects`)
      .send({
        name: 'Name Test',
      });

    await request(app)
      .put(`/projects/${response.body.id}`)
      .send({
        status: ProjectStatus.COMPLETED
      })
      .expect(201);

    const projects = await Project.findById(response.body.id);
    expect(projects?.status).toEqual(ProjectStatus.COMPLETED);
    expect(projects?.endDate).toBeDefined();
    expect(projects?.endDate).toBeInstanceOf(Date);


    await request(app)
      .put(`/projects/${response.body.id}`)
      .send({
        status: ProjectStatus.ACTIVE
      })
      .expect(201);

    const projects2 = await Project.findById(response.body.id);
    expect(projects2?.status).toEqual(ProjectStatus.ACTIVE);
    expect(projects2?.endDate).toEqual(undefined);
  });
});

describe('Delete Project', () => {
  it('delete a project with valid id', async () => {
    const response = await request(app)
      .post(`/projects`)
      .send({
        name: 'Name Test',
      });

    await request(app)
      .delete(`/projects/${response.body.id}`)
      .expect(204);

    const project = await Project.findById(response.body.id);
    expect(project).toBeNull();
  });

  it('return a 404 if provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .delete(`/projects/${id}`)
      .expect(404);
  });
});