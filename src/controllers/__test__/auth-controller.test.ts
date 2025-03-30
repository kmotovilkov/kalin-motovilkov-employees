import request from "supertest";
import { app } from "../../app";

describe('User Registation', () => {
  it('returns a 201 on successful registration', async () => {
    return request(app)
      .post('/register')
      .send({
        email: 'test@test.test',
        password: 'password'
      })
      .expect(201);
  });

  it('return a 400 with invalid email', async () => {
    return request(app)
      .post('/register')
      .send({
        email: 'testtast.test',
        password: 'password'
      })
      .expect(400);
  });

  it('return a 400 with invalid password', async () => {
    return request(app)
      .post('/register')
      .send({
        email: 'testtast@test.test',
        password: ''
      })
      .expect(400);
  });

  it('return a 400 with invalid email and password', async () => {
    await request(app)
      .post('/register')
      .send({
        password: 'password'
      })
      .expect(400);

    await request(app)
      .post('/register')
      .send({
        email: 'test@test.test',
      })
      .expect(400);
  });

  it('disallows duplicates emails', async () => {
    await request(app)
      .post('/register')
      .send({
        email: 'test@test.test',
        password: 'password'
      })
      .expect(201);

    await request(app)
      .post('/register')
      .send({
        email: 'test@test.test',
        password: 'password'
      })
      .expect(400);
  });
});

describe('User Login', () => {
  it('response with cookie with valid credentials', async () => {
    await request(app)
      .post('/register')
      .send({
        email: 'test@test.test',
        password: 'password'
      })
      .expect(201);

    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@test.test',
        password: 'password'
      })
      .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
  });

  it("fails when an email that doesn't exits is supplied", async () => {
    return request(app)
      .post('/login')
      .send({
        email: 'test@test.test',
        password: 'password'
      })
      .expect(400);
  });

  it('login with existing account, but with incorrect password or incorrect email', async () => {
    await request(app)
      .post('/register')
      .send({
        email: 'test@test.test',
        password: 'password'
      })
      .expect(201);

    await request(app)
      .post('/login')
      .send({
        email: 'test@test.test',
      })
      .expect(400);

    await request(app)
      .post('/login')
      .send({
        password: 'password'
      })
      .expect(400);
  });
});

describe('User Logout', () => {
  it('clears the cookie after signing out', async () => {
    await request(app)
      .post('/register')
      .send({
        email: 'test@test.test',
        password: 'password'
      })
      .expect(201);

      await request(app)
      .post('/login')
      .send({
        email: 'test@test.test',
        password: 'password'
      })
      .expect(200);

    const response = await request(app)
      .post('/logout')
      .expect(200);

    const cookie = response.get("Set-Cookie");
    if (!cookie) {
      throw new Error("Expected cookie but got undefined.");
    }

    expect(cookie[0]).toEqual(
      "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
    );
  });
});