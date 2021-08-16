require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');
const animalData = require('../data/animals-types');

describe('network routes', () => {
  
  beforeAll(async () => {
    execSync('npm run setup-db');
  
    await client.connect();
 
  }, 10000);
  
  afterAll(done => {
    return client.end(done);
  });

  test('(types) GET /animals returns list of animals', async() => {
    const expected = animalData.map(typeOF => typeOF.type);
    const data = await fakeRequest(app)
      .get('/types')
      .expect('Content-Type', /json/)
      .expect(200);
    // console.log(data.body)
    const animalTypes = data.body.map(typeOF => typeOF.type);
    
    expect(animalTypes).toEqual(expected);
    expect(animalTypes.length).toBe(animalTypes.length);
    expect(data.body[0].id).toBeGreaterThan(0);
      

  });
});