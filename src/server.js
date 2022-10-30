const express = require('express');
const cors = require('cors');
const colors = require('colors');
const dotenv = require('dotenv');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const userRoutes = require('./routes/userRoutes');
const connectDB = require('./config/db');

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
    cluster.on('online', function (worker) {
      console.log('Worker ' + worker.process.pid + ' is online');
    });
    cluster.on('exit', function (worker, code, signal) {
      console.log(
        'Worker ' +
          worker.process.pid +
          ' died with code: ' +
          code +
          ', and signal: ' +
          signal
      );
      console.log('Starting a new worker');
      cluster.fork();
    });
  }
} else {
  const app = express();
  dotenv.config();
  connectDB();

  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('I am running');
  });

  app.use('/api/users', userRoutes);

  const PORT = process.env.PORT || 5000;

  app.listen(
    PORT,
    console.log(
      `Server Running in ${process.env.NODE_ENV} mode on PORT: ${PORT}`.yellow
        .bold
    )
  );
}
