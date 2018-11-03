const Quiz = require("../model/Quiz");


module.exports.createQuizzesFromDefaultData = () => {

  Quiz.getAllQuizzes(function(err, quizzes){
    if (err) {
      console.log(err);
      return
    }
    if (quizzes.length === 0) {
      console.log("No quizzes in database");
      createData();
    }else {
      console.log("Quizzes already in Database");
    }
  });


};

function createData() {
  console.log("Creating Quizzes...");

  let quizData = require("../DefaultData.json");

  let quizObjects = quizData.quizzes.map(q => new Quiz({
    question : q.question,
    answerOne: q.answerOne,
    answerTwo: q.answerTwo,
    answerThree: q.answerThree,
    answerFour: q.answerFour,
    correctIndex: q.correctIndex,
    category: q.category}));

  quizObjects.forEach(quiz => Quiz.createQuiz(quiz))
}