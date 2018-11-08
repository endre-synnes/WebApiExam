const Quiz = require("../model/Quiz");


module.exports.createQuizzesFromDefaultData = () => {

  // Sjekk for ny data i default quiz dokumentet

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
    alternatives: q.alternatives,
    correctIndex: q.correctIndex,
    category: q.category}));

  quizObjects.forEach(quiz => Quiz.createQuiz(quiz))
}