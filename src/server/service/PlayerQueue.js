/*
    INFO:
    This file is inspired by The Web And API design lecture 11, but extended for more functionality
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

