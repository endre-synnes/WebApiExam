
//TODO make use of constructor and implement it to hold state
class GameState {

  constructor(numberOfQuestions, currentQuestion, alternatives){
    this.numberOfQuestions = numberOfQuestions;
    this.currentQuestion = currentQuestion;
    this.alternatives = alternatives;
  }
}

module.exports = GameState;