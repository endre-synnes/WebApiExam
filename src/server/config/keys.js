/*
    INFO:
    This file is inspired by The Udemy course: Advanced React and Redux: 2018 Edition (Made by Stephen Grider)
 */

switch(process.env.NODE_ENV) {
  case 'prod': {
    module.exports = {mongoURI: process.env.MONGO_URI};
    break
  }
  case 'dev': {
    module.exports = {mongoURI: "mongodb://localhost:27017/exam"};
    break
  }
  case 'docker': {
    module.exports = {mongoURI: 'mongodb://mongodb:27017/exam',};
    break
  }
  case 'local': {
    module.exports = {mongoURI: 'mongodb://localhost:27017/exam'};
    break
  }
}
