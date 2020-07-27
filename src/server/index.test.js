const app = require('./index');
const supertest = require('supertest');
const request = supertest(app);

it('gets the home page', async done => {
  const response = await request.get('/')
  expect(response.status).toBe(200)
  done();
})