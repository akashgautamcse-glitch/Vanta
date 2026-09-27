const mongoose = require('mongoose');

const dbURI = process.env.MONGO_URI;

const connect_db = async() => {
  await mongoose.connect(dbURI);
};

module.exports = {
  connect_db
}