let ballX = 75;
let ballY = 75;
let ballSpeedX = 5;
let ballSpeedY = 7; 
const BRICK_W = 80;
const BRICK_H = 40;
const BRICK_GAP = 2;
const BRICK_COLS = 10;
const BRICK_ROWS = 7;
let brickGrid = new Array(BRICK_COLS * BRICK_ROWS);
const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_FROM_EDGE = 60;
let paddleX = 400;
let canvas, canvasContext;
let mouseX;
let mouseY;

function updateMousePos(e) {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    mouseX = e.clientX - rect.left - root.scrollLeft;
    mouseY = e.clientY - rect.top - root.scrollTop;
    paddleX = mouseX - PADDLE_WIDTH / 2;
    
    /* // Debugger for brick / ball collision 
    ballX = mouseX;
    ballY = mouseY;
    ballSpeedX = 4;
    ballSpeedY = -4;
    */
    /* // Debugger for brick co-ordinates and number of brick
    colorText("COLUMN = " + mouseBrickCol + ", ROW = " + mouseBrickRow + ", BRICK = " + brickIndexUnderMouse, mouseX, mouseY, 'darkblue');
    */     
}

function brickReset() {
    for (let i = 0; i < BRICK_COLS * BRICK_ROWS; i++) {
            brickGrid[i] = true;
        }
}

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    let framesPerSecond = 30;
    setInterval(updateAll, 1000 / framesPerSecond);
    canvas.addEventListener('mousemove', updateMousePos);
    brickReset();
    //ballReset();
}

function updateAll () {
    moveAll();
    drawAll();
}

function ballReset() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function ballMove() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
               
    if(ballX < 0) {                 
        ballSpeedX *= -1;
    }
    if(ballX > canvas.width) {      
        ballSpeedX *= -1;
    }
    if(ballY < 0) {                 
        ballSpeedY *= -1;
    }
    if(ballY > canvas.height) {     
        ballReset();
    }
}

function ballBrickHandling() {
    let ballBrickCol = Math.floor(ballX / BRICK_W);
    let ballBrickRow = Math.floor(ballY / BRICK_H);
    let brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);
    if (ballBrickCol >= 0 && ballBrickCol < BRICK_COLS &&
        ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS) {
        if (brickGrid[brickIndexUnderBall]) {
            brickGrid[brickIndexUnderBall] = false;
            let prevBallX = ballX - ballSpeedX;
            let prevBallY = ballY - ballSpeedY;
            let prevBrickCol = Math.floor(prevBallX / BRICK_W);
            let prevBrickRow = Math.floor(prevBallY / BRICK_H);
            let bothTestsFailed = true;
            if (prevBrickCol != ballBrickCol) {
                let adjBrickSide = rowColToArrayIndex(prevBrickCol, ballBrickRow);
                if (brickGrid[adjBrickSide] == false) {
                    ballSpeedX *= -1;
                    bothTestsFailed = false;
                }
            }
            if (prevBrickRow != ballBrickRow) {
                let adjBrickTopBot = rowColToArrayIndex(ballBrickCol,prevBrickRow);
                if(brickGrid[adjBrickTopBot] == false) {
                    ballSpeedY *= -1;
                    bothTestsFailed = false;
                }
            }
            if (bothTestsFailed) {
                ballSpeedX *= -1;
                ballSpeedY *= -1;
            }
        }
    }
}

function ballPaddleHandling() {
    let paddleTopEdgeY = canvas.height-PADDLE_DIST_FROM_EDGE;
    let paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
    let paddleLeftEdgeX = paddleX;
    let paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH;
    if (ballY > paddleTopEdgeY &&
        ballY < paddleBottomEdgeY &&
        ballX > paddleLeftEdgeX &&
        ballX < paddleRightEdgeX) {
            ballSpeedY *= -1;
            let centerOfPaddleX = paddleX + PADDLE_WIDTH / 2;
            let ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
            ballSpeedX = ballDistFromPaddleCenterX * 0.35;
    } 
}

function moveAll() {
    ballMove();
    ballBrickHandling();
    ballPaddleHandling();
}

function rowColToArrayIndex(col, row) {
    return col + BRICK_COLS * row;
}

function drawBricks() {
    for (let eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
        for (let eachCol = 0; eachCol < BRICK_COLS; eachCol++) {
            let arrayIndex = rowColToArrayIndex(eachCol, eachRow);
            if (brickGrid[arrayIndex]) {
                colorRect(BRICK_W * eachCol, BRICK_H * eachRow, BRICK_W - BRICK_GAP, BRICK_H - BRICK_GAP, 'orange');
            }
        }
    }
}

function drawAll() {
    colorRect(0, 0, canvas.width, canvas.height, 'darkred');
    colorCircle(ballX, ballY, 10, 'yellow');
    colorRect(paddleX, canvas.height-PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, 'black');
    drawBricks();
}
 
function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}

function colorText(showWords, textX, textY, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillText(showWords, textX, textY);
}