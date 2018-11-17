
class GameState {

  constructor(players, questionDto){
    this.players = players;
    this.questionDto = questionDto;
  }

  nextQuestion(questionDto){
    this.questionDto = questionDto
  }

  returnDto(){
    return this.questionDto
  }
}

module.exports = GameState;