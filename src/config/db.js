const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });

    console.log(`MongoDB Connected: ${connect.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.underline.red.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
