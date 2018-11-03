const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create schema
const QuizSchema = new Schema({
  question: {
    type: String,
    required: true
  },
  answerOne: {
    type: String,
    required: true
  },
  answerTwo: {
    type: String,
    required: true
  },
  answerThree: {
    type: String,
    required: true
  },
  answerFour: {
    type: String,
    required: true
  },
  correctIndex: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

module.exports = Quiz = mongoose.model("quizes", QuizSchema);

module.exports.createQuiz = (newQuiz, callback) => {
  newQuiz.save(callback);
};

module.exports.getQuizByCategory = (category, callback) => {
  const query = {category: category};
  Quiz.findOne(query, callback);
};

module.exports.getQuizById = (id, callback) => {
  Quiz.findById(id, callback);
};

module.exports.getAllQuizzes = (callback) => {
  Quiz.find(callback);
};