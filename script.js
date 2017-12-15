var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

/**
 * Global variables down here
 */

var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;

var image = new Image();
// image.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';
image.src = 'http://files.softicons.com/download/food-drinks-icons/free-food-icons-by-daily-overview/png/64x64/sausage.png';

/**
 * Methods down here
 */

function draw(){
  // clear the whole canvas at each iteration
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // drawing the ball at position x,y
  drawBlueBall();
  // drawSausage();

  // change position
  x += dx;
  y += dy;
}

function drawBlueBall(){
  ctx.beginPath();
  ctx.arc(x,y,10,0,Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawSausage(){
  ctx.drawImage(image,x,y);
}

/**
 * Main down here
 */

// Note "draw" and not "draw()"
setInterval(draw, 10);
