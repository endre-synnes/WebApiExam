# Web and API exam 2018

<br/>

## How to start/access the application

#### Docker / local

1. Open Docker on your machine.
2. In a terminal, navigate to the root directory of this project.
3. run the following command: `docker-compose up`

Now docker will run the setup of this project and install dependencies,
as well as create the necessary docker images and start docker containers serving this application.

After docker is finished with the setup, the application will be accessible at: `localhost:8080`

#### Herpoku 
The application is already running on [Heroku](https://afternoon-everglades-27665.herokuapp.com).

Keep in mind that Heroku servers tend to go in a hibernate state after 30 minutes of inactivity.
So be patient the first time you load this page.

<br/>

## Overview
This ia a online quiz game. Each player play against each other.
The first player to join a queue becomes the organizer for that game.
When there are more than 2 players in the queue (including the organizer),
the game can start by the organizer hitting "start Game".

Web sockets are used to transmit questions and other events where websockets
can be useful. Like when there are enough players to start the game.

In the case of that the organizer should leave the queue, everyone in that queue get notified
and can choose to start a new game (queue to a new game) or exit to the main page.

Also if some users leave the queue and there are too fev players left to start a game,
the organizer gets notified.

The score is based on player response time. Meaning the faster you are to answer a question,
the more points you get. You have 10 seconds to answer each question and a theoretical max score
of 1000 points per question. After  a player has made a guess, the times goes away until the next 
question is available.

I have also implemented a leader board where all players are listed with username and total number of wins.
This is sorted descending, with the player with the moat wins on top.

As a bonus I have also used a middleware on all components that should require authentication.
The file is called [requireAuth.js](./src/client/components/requireAuth.js). 
This files helps ensure that an user is in fact authentication, by calling the API on `componentDidMount`. 
If the response is 401 you will not be able to view the component on this route and get redirected to the home page.


<br/>

## Evaluation
In this project I do fulfill all of the requirements given to us in the exam, as well as almost all
of the potential extras except for tests.

I Have made use of Docker, Deployed on Heroku, 
implemented Redux where that make sense to use, 
as well as a real MongoDB database using docker.

All in all I am satisfied with the result, but of course if I had time I would
trie to use more redux and in a better way (I realise that I am not yet an expert on redux),
and created tests.

<br/>

## Resources
- Lecture repository
    - [Lecture repository](https://github.com/arcuri82/pg6300)

- Udemy course: Advanced React and Redux: 2018 Edition (Made by Stephen Grider)
    - [Advanced React Stephen Grider](https://www.udemy.com/react-redux-tutorial/learn/v4/overview)
    
- code snippets
    -  [Boostrap Table](http://allenfang.github.io/react-bootstrap-table/start.html)
    -  [Bootstrap CSS](https://getbootstrap.com/docs/4.0/examples/cover/#)
    -  [React Footer](http://tszekely.github.io/react-learning-module/step-02?fbclid=IwAR3k3UXUjB0wA-IieWG32sh8z4pf9WhPvabZpd3wKpg1-RXrDt5NqLxz3P4)
    -  [Bootsrap buttons](https://getbootstrap.com/docs/4.0/components/buttons/)
    
- Quiz questions
    - [General questions](https://www.quiz-questions.net)
    - [Game of Thrones questions](https://www.theguardian.com/tv-and-radio/quiz/2015/apr/11/game-of-thrones-quiz)