const Quiz = require("../model/Quiz");


module.exports.createQuizzesFromDefaultData = () => {
  let quizData = require("../DefaultData.json");

  let quizObjects = quizData.quizzes.map(q => new Quiz({
    question : q.question,
    alternatives: q.alternatives,
    correctIndex: q.correctIndex,
    category: q.category}));

  Quiz.getAllQuizzes(function (err, quizzes) {
    if (err) {
      console.log(err);
      return
    }
    if (quizzes.length === 0) {
      console.log("Database was empty, saving all quizzes to database...");
      quizObjects.forEach(quiz => Quiz.createQuiz(quiz));

    } else {
      console.log("Adding new quizzes to database...");

      let difference = quizObjects.filter(o1 => !quizzes.some(o2 => o1.question === o2.question));
      console.log(`Number of new quizzes: ${difference.length}`);

      difference.forEach(quiz => Quiz.createQuiz(quiz))
    }
    console.log("quizzes saved to database");
  })
};