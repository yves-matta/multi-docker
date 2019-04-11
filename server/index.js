const keys = require('./keys');

// Express App Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
// Make request from one domain to different domain/port
app.use(cors());
// parse incoming request from react and turn body into json value for our express applicaiton can work with
app.use(bodyParser.json());

// Postgres Client Setup
const { Pool } = require('pg');
const pgClient = new Pool({
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
  host: keys.pgHost,
  user: keys.pgUser
});
pgClient.on('error', () => console.log('Lost PG connection'));

pgClient
  .query('CREATE TABLE IF NOT EXISTS values(number INT)')
  .catch(err => console.log('err:', err));

// Redis Client Setup
const redis = require('redis');
const redisClient = redis.createClient({
  port: keys.redisPort,
  host: keys.redisHost,
  retry_strategy: () => 1000
});
// according to docs, if ever have client, we need to make duplicat
// when turn into sub/pub, we need to make duplicate for only that
const redisPublisher = redisClient.duplicate();

// Express route handlers
app.get('/', (req, res) => {
  res.send('Hi');
});

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * FROM values');
  res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

app.post('/values', async (req, res) => {
  const { index } = req.body || {};

  // cap index for worker process not to hang for so long
  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high');
  }

  redisClient.hset('values', index, 'Nothing yet!');
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

  res.send({ working: true });
});

app.listen(5000, err => {
  console.log('Listening');
});
