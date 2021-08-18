const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');
// const animals = require('../data/animals.js');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route.
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with '/api' below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this protected route, we get the user's id like so: ${req.animalsId}`,
  });
});

app.get('/animals', async (req, res) => {
  try {
    const data = await client.query(`SELECT animals.id,
    animals.name,
    animals.type_id,
    animals.snuggly,
    types.type as type_name
    FROM animals INNER JOIN types
    ON animals.type_id = types.id
    ORDER BY animals.id;`);
   

    res.json(data.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/animals/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const data = await client.query(`SELECT animals.id,
    animals.name,
    animals.type_id,
    animals.snuggly,
    types.type as type_name
    FROM animals INNER JOIN types
    ON animals.type_id = types.id
    WHERE animals.id = $1
    ORDER BY animals.id;`, [id]);

    res.json(data.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/types', async (req, res) => {
  try {
    const data = await client.query('SELECT * from types;');

    res.json(data.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


app.post('/animals', async (req, res) => {
  try {
    const data = await client.query(`
    INSERT into animals (name, type_id, snuggly)
    VALUES ($1, $2, $3)
    RETURNING *`
    , [req.body.name, req.body.type_id, req.body.snuggly]);
    res.json(data.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/animals/:id', async (req, res) => {
  try {
    const data = await client.query(`
    UPDATE animals
    SET 
    name=$2,
    type_id=$3,
    snuggly=$4
    WHERE id = $1
    RETURNING *
`
    , [req.params.id, req.body.name, req.body.type_id, req.body.snuggly]);
    res.json(data.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/animals/:id', async (req, res) => {
  try {
    const data = await client.query(`
    INSERT into animals (name, type_id, snuggly)
    VALUES ($1, $2, $3)
    RETURNING *`
    , [req.body.name, req.body.type_id, req.body.snuggly]);
    res.json(data.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});    

app.delete('/animals/:id', async (req, res) => {
  try {
    const data = await client.query(`
    DELETE FROM animals WHERE id=$1
    RETURNING *`, [
      req.params.id
    ]
    );
    res.json(data.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.use(require('./middleware/error'));

module.exports = app;
