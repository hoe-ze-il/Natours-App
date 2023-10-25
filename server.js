const mongoose = require('mongoose');
const dotenv = require('dotenv');
// This is how we handle bugs or error in synchronous code (uncaugth exception)
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message, err.stack);
  server.close(() => {
    process.exit(1);
  });
});
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful!');
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// This is how we handle error asynchronouse code (unhande rejection)
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLER REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
