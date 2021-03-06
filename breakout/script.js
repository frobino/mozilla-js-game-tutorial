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
image.src = './img/sausage.png';
image.width = 64;
image.height = 64;

// Bread properties
var breadImage = new Image();
breadImage.src = './img/bread.png';
breadImage.width = 64;
breadImage.height = 20;

// Paddle properties
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

// Paddle movement
var rightPressed = false;
var leftPressed = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Score
var score = 0;

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

  drawPaddle();
  movePaddle();

  drawBread();

  // change ball/sausage position
  x += dx;
  y += dy;
}

function movePaddle(){
  if(rightPressed && paddleX < canvas.width-paddleWidth) {
      paddleX += 7;
  }
  else if(leftPressed && paddleX > 0) {
      paddleX -= 7;
  }
}

function ballCollisionCheck(){
  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if(y + dy < ballRadius) {
    dy = -dy;
  } else if(y + dy > canvas.height-ballRadius) {
    if(x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
    }
    else {
        alert("GAME OVER");
        document.location.reload();
    }
  }
}

function sausageCollisionCheck(){
  if(x + dx > canvas.width-image.width || x + dx < 0) {
    dx = -dx;
  }
  if(y + dy < 0 + image.height) {
    dy = -dy;
  } else if(y + dy > canvas.height) {
    if(x > paddleX - 5 && x < paddleX + paddleWidth + 5) {
        dy = -dy;
        score++;
    }
    else {
        alert("KORV OVER\nYour score is: " + score.toString());
        document.location.reload();
    }
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

function drawPaddle(){
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBread(){
  ctx.drawImage(breadImage,paddleX,canvas.height-breadImage.height);
}

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

/**
 * Main down here
 */

// Note "draw" and not "draw()"
setInterval(draw, 10);
