var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

/**
 * Global variables down here
 */

var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;

// Ball properties
var ballRadius = 10;

// Sausage properties
var image = new Image();
image.src = 'http://files.softicons.com/download/food-drinks-icons/free-food-icons-by-daily-overview/png/64x64/sausage.png';
image.width = 64;
image.height = 64;

/**
 * Methods down here
 */

function draw(){
  // clear the whole canvas at each iteration
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // drawing the ball at position x,y
  // drawBlueBall();
  drawSausage();

  // check for collision
  // ballCollisionCheck();
  sausageCollisionCheck();

  // change position
  x += dx;
  y += dy;
}

function ballCollisionCheck(){
  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {
    dy = -dy;
  }
}

function sausageCollisionCheck(){
  if(x + dx > canvas.width-image.width || x + dx < 0) {
    dx = -dx;
  }
  if(y + dy > canvas.height || y + dy < 0 + image.height) {
    dy = -dy;
  }
}

function drawBlueBall(){
  ctx.beginPath();
  ctx.arc(x,y,ballRadius,0,Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawSausage(){
  ctx.drawImage(image,x,y-70);
}

/**
 * Main down here
 */

// Note "draw" and not "draw()"
setInterval(draw, 10);
