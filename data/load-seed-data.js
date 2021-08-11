const client = require('../lib/client');
// import our seed data:
const animals = require('./animals.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );

    // id: 4,
    // name: 'Luna',
    // type: 'dog',
    // snuggly: true,


    await Promise.all(
      animals.map(animal => {
        return client.query(`
                    INSERT INTO animals (id, name, type, snuggly)
                    VALUES ($1, $2, $3, $4);
                `,
        [animal.id, animal.name, animal.type, animal.snuggly]);
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
