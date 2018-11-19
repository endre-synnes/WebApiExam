# Web and API exam 2018

<br/>

## How to start/access the application

First of all, make sure you have internet connectivity.

#### Docker / local

1. Open Docker on your machine.

2. In a terminal, navigate to the root directory of this project.

3. run the following command: `docker-compose up -d`
    Now docker will run the setup of this project and install dependencies,
    as well as create the necessary docker images and start docker containers serving this application. 
    Note: If are running windows you may have to restart Docker and run `docker-compose up -d` [again](https://github.com/docker/for-win/issues/573#issuecomment-301513210) 
    due to a [bug](https://github.com/docker/for-win/issues/573) in the monggoDB container image.

4. After docker is finished with the setup, the application will be accessible at: `localhost:8080`. 
    There is no default users so you need to sign up before you can start a game. 
    And sign up with a player two on a second web browser to be able to start a game. 
    There are three default users created that you can use if you want, or create your own by clikking `sign up`:
    
    | Username      | Password      |
    |:-------------:|:-------------:|
    | mee           | mee           |
    | you           | you           |
    | wee           | wee           |

5. To stop the application, you can run the following command: `docker-compose down`, or to also clean all docker containers and images: 
    `docker-compose -f docker-compose.yml down --rmi all`.

#### Heroku 
The application is already running on [Heroku](https://afternoon-everglades-27665.herokuapp.com).

Keep in mind that Heroku servers tend to go in a hibernate state after 30 minutes of inactivity.
So be patient the first time you load this page.

<br/>

## Overview
This is an online quiz game. Each player plays against each other.
The first player to join a queue becomes the organizer for that game.
When there are more than 2 players in the queue (including the organizer),
the game can start by the organizer hitting "start Game".

Web sockets are used to transmit questions and other events where websockets
can be useful. Like when there are enough players to start the game.

In the case of that the organizer should leave the queue, everyone in that queue get notified
and can choose to start a new game (queue to a new game) or exit to the main page.

Also, if some users leave the queue and there are too fev players left to start a game,
the organizer gets notified.

The score is based on player response time. Meaning the faster you are to answer a question,
the more points you get. You have 10 seconds to answer each question and a theoretical max score
of 1000 points per question. After  a player has made a guess, the times goes away until the next 
question is available.

I have also implemented a leader board where all players are listed with username and total number of wins.
This is sorted descending, with the player with the moat wins on top.

As a security feature I have also encrypted all the users passwords using the bcryp library

As a bonus I have also used a middleware on all components that should require authentication.
The file is called [requireAuth.js](./src/client/components/requireAuth.js). 
This file helps ensure that an user is in fact authentication, by calling the API on `componentDidMount`. 
If the response is 401 you will not be able to view the component on this route and get redirected to the home page.

#### Achieved bonus implementations

- [x] Docker 
- [x] Deployment (Heroku) 
- [x] Database (MongoDB using Docker) 
- [x] Redux 
- [x] Websockets 
- [x] Authentication (Session based Cookie)
- [x] RESTful API
- [x] React state handling

<br/>

## Endpoints (RESTful API)

#### Authentication
- [POST] /api/signup
    - Takes as parameter a username and password, then creates a user and logs the user in.
- [POST] /api/login
    - Takes as parameter a username and password, authenticating a user.
- [POST] /api/wstoken
    - Creating a ws token to help connect to web socket.
- [POST] /api/logout
    - Destroying session and deletes cookie.  
- [GET] /api/user
    - Making sure that the user still is authenticated by validating cookie.
- [GET] /api/leaderboard
    - Getting the leaderboard.

<br/>

#### Game
- [POST] /api/game
    - Setting up a new game using the ws token and open a web socket. And adding the user/player to the game queue.
- [POST] /api/start
    - If the user is the organizer of a game, he/she will be able to call this endpoint successfully to start a new game.
- [DELETE] /api/leaveGame
    - Made to handle the event of a user leaving 
    but not being used due to same functionality in an disconnected websocket.



<br/>

## Code 
The front end and backend is in the same root directory, which make it possible to start the
application as a single instance, as described above. Inside the root folder there is a source folder
with sub folders for client (frontend) and server (backend).

When you build this project the `bundle.js` file will be generated into the [public](./public) folder. The files here will
then be served to the web browser.

#### File Structure
- client
    - actions
        - In this folder there is a file called [index.js](./src/client/actions/index.js). This file is an action-file that
        does HTTP requests to the server and handle the response. This i a part of the redux implementation.
    - components
        - Here you can find all my React components. The middleware for authentication checks ([requireAuth.js](./src/client/components/requireAuth.js)) is also here. The most important here is the [Lobby.js](./src/client/components/game/Lobby.js) file.
        This file handles the game itself on the client side.
    - reducers
        - The reduces is also a part om my redux implementation, he files here handle states of the application that is useful for many of mine
        react components
    - index.html
        - This file handle things such as react routes etc.
- server 
    - config
        - This folder contains configuration files for the server, such as mongodb url´s depending on the environment and passport logic for authentication of users.
    - db
        - This folder contains a file for database population. The [QuizSetup.js](./src/server/db/QuizSetup.js) reads quizzes from my [DefaultData.json](./src/server/DefaultData.json) file
        and populate the database with dose quizzes. I have also implemented a check so there will not be duplicates with the same question.
    - model
        - For the database I make use of the mongoose library to make it easier for database communication.
        I have two files in this folder one for the [quizzes](./src/server/model/Quiz.js) and one for the [users](./src/server/model/User.js). The files function as database schemas and contains functions for CRUD operations.
    - routes
        - The files here contain all the server endpoints where the client can communicate with the server. Such as authentication and routes for the game itself etc.
    - ws
        - This folder has two files that makes it possible to use WS tokens and handle the WebSocket connections.
    - app.js
        - This file is for server setup. This file does things such as connecting to the database, making use of the routes and defining other settings as what file types to support for communication (json) and passport.
    - defaultData.json
        - Containing default quizzes.
    - server.js
        - Responsible for starting the server, deciding what port to use etc.

<br/>

## Evaluation
In this project I do fulfill all of the requirements given to us in the exam, as well as almost all
of the potential extras except for tests.

I Have made use of Docker, Deployed on Heroku, 
implemented Redux where that make sense to use, 
as well as a real MongoDB database using docker.

All in all, I am satisfied with the result, but of course if I had time, I would
try to use more redux and in a better way (I realize that I am not yet an expert on redux),
and created tests.

#### Further development
For further development I would have created some tests, but due to the difficulty of creating good
tests with web sockets I have prioritized to implement other things as mentioned above. 
I would also have made better use of redux and with more knowledge written some better state handling in react.

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