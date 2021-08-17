require('dotenv').config();

const { execSync } = require('child_process');
const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');
const animalData = require('../data/animals.js');

describe('app routes', () => {
  describe('routes', () => {
    // let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
    }, 100000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('GET /animals returns list of animals', async() => {

      const expectation = animalData.map(animals => animals.name);
      const expectedShape = {
        id: 1,
        name: 'Tala',
        type_id: 1,
        snuggly: true,
      };

      const data = await fakeRequest(app)
        .get('/animals')
        .expect('Content-Type', /json/)
        .expect(200);
      // console.log(data.body)
      const names = data.body.map(animals => animals.name);

      expect(names).toEqual(expectation);
      expect(names.length).toBe(animalData.length);
      expect(data.body[0]).toEqual(expectedShape);
    }, 10000);
    
    test('GET /animals/:id returns the individual animals', async ()=>{
      const expectation = {
        id: 1,
        name: 'Tala',
        type_id: 1,
        snuggly: true,
      };
      
      const data = await fakeRequest(app)
        .get('/animals/1')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(data.body).toEqual(expectation);
    });

    test('POST /create a new animal in animal data', async ()=>{
      const newAnimal = {
        name: 'Leroy',
        type_id: 1,
        snuggly: true, 
      };
  
      const data = await fakeRequest(app)
        .post('/animals')
        .send(newAnimal)
        .expect(200)
        // console.log(data.body);
        .expect('Content-Type', /json/);
  
      expect(data.body.name).toEqual(newAnimal.name);
      expect(data.body.id).toBeGreaterThan(0);
  
    });

    test('PUT /animals/:id --will update the animal selected', async ()=>{
      const updatedAnimal = {
        id:5,
        name: 'Leroy-Boy',
        type_id: 1,
        snuggly: true, 
      };
  
      const data = await fakeRequest(app)
        .put('/animals/5')
        .send(updatedAnimal)
        .expect(200)
        // console.log(data.body)
        .expect('Content-Type', /json/);
      expect(data.body.name).toEqual(updatedAnimal.name);
  
    });

    test('POST /animals/:id --will create new animal into array', async ()=>{
      const newAnimalInArray = {
        name: 'Leroy',
        type_id: 1,
        snuggly: true, 
      };
  
      const data = await fakeRequest(app)
        .put('/animals/5')
        .send(newAnimalInArray)
        .expect(200)
        .expect('Content-Type', /json/);
      expect(data.body.name).toEqual(newAnimalInArray.name);
      expect(data.body.id).toBeGreaterThan(0);
  
    });

    test('DELETE /deletes one object in the array by query id', async () => {
      const deletedObject = {
        name: 'Leroy',
        type_id: 1,
        snuggly: true,
      };
      await fakeRequest(app)
        .post('/animals')
        .send(deletedObject)
        .expect('Content-Type', /json/);
      const data = await fakeRequest(app)
        .delete('/animals/5')
        .expect(200) 
        .expect('Content-Type', /json/);
      expect(data.body).toEqual({ ...deletedObject, id:5 });
   
    });
  });
});