// board
let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

//Player
let playerWidth = 500; //500 for testing and 80 is normal
let playerHeight = 10;
let playerVelocityX = 10;

let player = {
    x : boardWidth/2 - playerWidth/2,
    y : boardHeight - playerHeight - 5,
    width : playerWidth,
    height : playerHeight,
    velocityX : playerVelocityX
}

//Ball
let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 15;  // 15 for testing, 3 is normal 
let ballVelocityY = 10;  //10 for testing , 2 is normal

let ball = {
    x : boardWidth/2,
    y : boardHeight/2,
    width : ballWidth,
    height : ballWidth,
    velocityX : ballVelocityX,
    velocityY : ballVelocityY
}

//Blocks
let blockArray = [];
let blockWidth = 50;
let blockHeight = 10;
let blockColumns = 8;
let blockRows = 3; //add more as game gose on
let blockMaxRows = 10; //limit how many rows
let blockCount = 0;

//starting block corner top left
let blockX = 15;
let blockY = 45;

let score = 0;
let gameOver = false;



window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); // Use for drawing on the board

    //Draw initial player
    context.fillStyle = "Green";
    context.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer);

    //creat blocks
    creatBlocks();
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);


    //Player
    context.fillStyle = "skyblue";
    context.fillRect(player.x, player.y, player.width, player.height);
    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    //Bounce ball off all walls
    if (ball.y <= 0) {
        //if ball touch top of canvas
        ball.velocityY *= -1; //reverse direction
    }
    else if (ball.x <= 0 || (ball.x + ball.width) >= boardWidth) {
        //if ball touches left or right of canvas
        ball.velocityX *= -1; //reverse direction
    }
    else if (ball.y + ball.height >= boardHeight) {
        //if ball touches bottom of canvas
        //Game Over
        context.font = "20px sans-serif";
        context.fillStyle = "white"
        context.fillText("Game Over: Press Space to Restart", 80, 400);
        gameOver = true;
    }
  //bounce the ball off player paddle
  if (topCollision(ball, player) || bottomCollision(ball, player)) {
     ball.velocityY *= -1; //flip y direction up or down
  }
  else if (leftCollision(ball, player) || rightCollision(ball, player)) {
     ball.velocityX *= -1; //flip x direction up to down
  }

  //blocks
  context.fillStyle = "yellow";
  for (let i = 0; i <blockArray.length; i++) {
    let block = blockArray[i];
    if (!block.break) {
        if (topCollision(ball, block) || bottomCollision(ball, block)) {
            block.break = true;
            ball.velocityY *= -1;  //flip direction up or down
            blockCount -= 1;
            score += 100;
        }
        else if (leftCollision(ball, block) || rightCollision(ball, block)) {
            block.break = true;
            ball.velocityX *=- 1;  //flip x direction left to right
            blockCount -= 1;
            score += 100;
        }
        context.fillRect(block.x, block.y, block.width, block.height);
    }

  }
  //next level

  if (blockCount == 0) {
    score += 100*blockRows*blockColumns;  //bonuse points :)
    blockRows = Math.min(blockRows + 1, blockMaxRows);
    creatBlocks();
  }
  //score
  context.font = "20px sans-serif";
  context.fillStyle = "white";
  context.fillText('Score: '+score, 10, 25);
 
 
}

function outOfBounds(xPosition) {
    return (xPosition < 0 || xPosition + playerWidth > boardWidth);

}

function movePlayer(e) {
    if (gameOver) {
      if  (e.code == "Space") {
            resetGame();
        }
    }
    if (e.code == "ArrowLeft") {
        // player.x -= player.velocityX;
        let nextPlayerX = player.x - player.velocityX;
        if (!outOfBounds(nextPlayerX)) {
            player.x = nextPlayerX;
        }
    }
    else if (e.code == "ArrowRight") {
        // player.x += player.velocityX;
        let nextPlayerX = player.x + player.velocityX;
        if (!outOfBounds(nextPlayerX)) {
            player.x = nextPlayerX;
        }
    }
}

function detectCollision (a, b) {
    return a.x < b.x + b.width && 
           a.x + a.width > b.x &&
           a.y <b.y + b.height &&
           a.y + a.height > b.y;

}


function topCollision(ball, block) {
    return detectCollision(ball, block) && (ball.y + ball.height) >= block.y;
}

function bottomCollision(ball, block) {
    return detectCollision(ball, block) && (block.y + block.height) >= ball.y;
}

function leftCollision(ball, block) {
    return detectCollision(ball, block) && (ball.x + ball.width) >= block.x;
}

function rightCollision(ball, block) {
    return detectCollision(ball, block) && (block.x + block.width) >= ball.x;
}

function creatBlocks() {
    blockArray = [];  //creat block array
    for (let c = 0; c <blockColumns; c++) {
        for (let r = 0; r <blockRows; r++) {
            let block = {
                x : blockX + c*blockWidth + c*10, //c*10 space 10 pixels apart columns
                y : blockY + r*blockHeight + r*10, //r*10 space 10 pixels apart rows
                width : blockWidth,
                height : blockHeight,
                break : false
            }
            blockArray.push(block);
        }
    }
    blockCount = blockArray.length;
}

function resetGame() {
    gameOver = false;
     player = {
        x : boardWidth/2 - playerWidth/2,
        y : boardHeight - playerHeight - 5,
        width : playerWidth,
        height : playerHeight,
        velocityX : playerVelocityX
    }
    ball = {
        x : boardWidth/2,
        y : boardHeight/2,
        width : ballWidth,
        height : ballWidth,
        velocityX : ballVelocityX,
        velocityY : ballVelocityY
    }
    blockArray = [];
    blockRows = 3;
    score = 0;
    creatBlocks();

}