const client = require('../lib/client');
// import our seed data:
const animals = require('./animals.js');
// const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');
const animalTypes = require('./animals-types.js');

run();

async function run() {

  try {
    await client.connect();


    await Promise.all(
      animalTypes.map(types => {
        return client.query(`
                    INSERT INTO types (type)
                    VALUES ($1)
                    RETURNING *;
                `,
        [types.type]);
      })
    );
    
    await Promise.all(
      animals.map(animal => {
        return client.query(`
                    INSERT INTO animals (name, type_id, snuggly)
                    VALUES ($1, $2, $3)
                    RETURNING *;
                `,
        [animal.name, animal.type_id, animal.snuggly]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
