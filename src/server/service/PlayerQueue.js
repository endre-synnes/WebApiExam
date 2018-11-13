/*
    INFO:
    This file is inspired by The Web And API design lecture 11.
 */

/*
    When a user wants to play, it needs an opponent.
    So, we need at least 2 players.
    A user has to wait until an opponent is available.

    If we always match a user against the first available opponent, then
    we would not need a queue, as such queue will at most contain a single user
    at any point in time.

    We could be more sophisticated. For example, we could try to match players
    with same skills (computed based on number of past victories).
    And, so, let some users wait on the queue for some seconds until a better opponent appears,
    even if the queue is not empty.
    However, to keep it simple, here we match against the first available opponent.
 */

const queue = [];


function addUser(id){

  if(queue.includes(id)){
    return false;
  }

  queue.push(id);
  return true;
}


function size(){
  return queue.length;
}

function hasUser(id){
  return queue.includes(id);
}

function takeUser(){

  if(queue.length === 0){
    return null;
  }

  return queue.shift();
}

function getQueue() {
  if(queue.length === 0){
    return null;
  }

  return queue;
}

function emptyQueue() {
  while (this.size() > 0) {
    this.takeUser()
  }

  return queue.length;
}

function removeUser(value) {
  const index = queue.indexOf(value);
  if (index > -1) {
    queue.splice(index, 1);
  }
}

function getOrganizer(){
  if (queue.length > 0) {
    return queue[0];
  }
  return null;
}


module.exports = {addUser, size, takeUser, hasUser, getOrganizer, getQueue, removeUser, emptyQueue};

