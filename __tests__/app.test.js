require('dotenv').config();

const { execSync } = require('child_process');
const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');
// const animalData = require('../data/animals.js');

describe('app routes', () => {
  describe('routes', () => {
    // let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      // const signInData = await fakeRequest(app)
      //   .post('/auth/signup')
      //   .send({
      //     email: 'jon@user.com',
      //     password: '1234'
      //   });
      
      // token = signInData.body.token; // eslint-disable-line
    }, 100000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('POST /create a new animal in animal data', async ()=>{
      const newAnimal = {
        id:5,
        name: 'Leroy',
        type: 'dog',
        snuggly: true, 
      };
  
      const data = await fakeRequest(app)
        .post('/animals')
        .send(newAnimal)
        .expect(200)
        .expect('Content-Type', /json/);
  
      expect(data.body.name).toEqual(newAnimal.name);
      //check the data.body.id HERE
      expect(data.body.id).toBeGreaterThan(0);
  
    });

    test('PUT /animals/:id --will update the animal selected', async ()=>{
      const updatedAnimal = {
        id:5,
        name: 'Leroy-Boy',
        type: 'dog',
        snuggly: true, 
      };
  
      const data = await fakeRequest(app)
        .put('/animals/5')
        .send(updatedAnimal)
        .expect(200)
        .expect('Content-Type', /json/);
      // console.log(data.body);
      expect(data.body.name).toEqual(updatedAnimal.name);
      // //check the data.body.id HERE
      // expect(data.body.id).toBeGreaterThan(0);
  
    });

    test('POST /animals/:id --will create new animal into array', async ()=>{
      const newAnimalInArray = {
        id:5,
        name: 'Leroy',
        type: 'dog',
        snuggly: true, 
      };
  
      const data = await fakeRequest(app)
        .put('/animals/5')
        .send(newAnimalInArray)
        .expect(200)
        .expect('Content-Type', /json/);
      // console.log(data.body);
      expect(data.body.name).toEqual(newAnimalInArray.name);
      expect(data.body.id).toBeGreaterThan(0);

      // //check the data.body.id HERE
  
    });

    test('DELETE /deletes one object in the array by query id', async () => {
      const deletedObject = {

        name: 'Leroy',
        type: 'dog',
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
      console.log(data.body);
      expect(data.body).toEqual({ ...deletedObject, id:5 });
      // expect(data.body.id).toBeGreaterThan(0);
    });
  });
});