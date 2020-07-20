//width and height of the board i.e 10 X 10 = 100 box board
let width = 10;
let height = 10;
//if the player has won or not
let hasWon = false;

//two players
let players = [
  { name: "P1", position: 0, color: "#2d03fc" },
  { name: "P2", position: 0, color: "#fc03df" },
];

let currentPlayerTurn = 0;

let board = [];
// board box size
let boardSize = 50;
let position = 0;
let darkBox = false;
const dice = [
  'url("./assets/one.png")',
  'url("./assets/two.png")',
  'url("./assets/three.png")',
  'url("./assets/four.png")',
  'url("./assets/five.png")',
  'url("./assets/six.png")',
];
const ladders = [
  { start: 2, end: 23 },
  { start: 50, end: 34 },
  { start: 10, end: 44 },
  { start: 52, end: 74 },
  { start: 53, end: 19 },
  { start: 72, end: 91 },
  { start: 78, end: 4 },
  { start: 98, end: 65 },
];
const rollDice = () => {
  if (hasWon) {
    return;
  }
  document.getElementById("message").innerHTML = "";
  let currentPlayer = players[currentPlayerTurn];
  roll = Math.floor(Math.random() * 6 + 1);
  document.getElementById(
    "message"
  ).innerHTML += `<h4>${currentPlayer.name}, You rolled ${roll}</h4>`;
  console.log(currentPlayer.name + ", You rolled", roll); //keeping track of rolls
  document.getElementById("dice").style.backgroundImage = dice[roll - 1];
  //incrementing the position after the roll using the dice value
  if (currentPlayer.position === 0 && roll != 1) {
    //the first turn has to have 1
    currentPlayer.position = 0; //otherwise the position stays as it is
    console.log("Bad luck, you need to roll a 1!"); //logs it that I need a one
    document.getElementById(
      "message"
    ).innerHTML += `<h4 style="color:red">Bad luck, you need to roll a 1!</h4>`;
  } else {
    //else the # of roll is added to the position of the player
    currentPlayer.position += roll;
    ladders.forEach((ladder) => {
      //looping through each ladder
      //if the starting of the ladder is equal to player's position
      if (ladder.start === currentPlayer.position) {
        if (currentPlayer.position > ladder.end) {
          console.log("snake");
          document.getElementById(
            "message"
          ).innerHTML += `<h2 style="color:red">Sorry, You met with snake</h2>`;
        } else {
          console.log("ladder");
          document.getElementById(
            "message"
          ).innerHTML += `<h2 style="color:green">Congratulations, You took a ladder</h2>`;
        }

        currentPlayer.position = ladder.end; //step to the end of the ladder
      }
    });

    //if the curretPlayer has the last position
    if (currentPlayer.position > 99) {
      //game is over
      console.log(currentPlayer.name + " has won!");
      hasWon = true; //hasWon is true = player wins
      alert(`Congratulations ${currentPlayer.name}, you have won !`);
      document.getElementById(
        "message"
      ).innerHTML = `<h2 style="color:red">Game Over !!</h2>`;
      //reset everything
      setTimeout(() => {
        reset();
      }, 3000);
    }

    //if it is any other position
    if (currentPlayer.position === position) {
      diff = currentPlayer.position - position;
      currentPlayerPosition = position - diff;
    }
  }
  currentPlayerTurn++;
  if (currentPlayerTurn >= players.length) {
    currentPlayerTurn = 0;
  }
  drawBoard();
};
const constructBox = () => {
  for (let y = height; y > 0; y--) {
    let row = [];
    board.push(row);
    for (let x = 0; x < width; x++) {
      row.push({
        x,
        y,
        occupied: null,
        position,
        color: darkBox ? "silver" : "gray",
      });
      darkBox = !darkBox; //next one is not dark box
      position++;
    }
  }
};
//make box board
constructBox();
const drawBoard = () => {
  let boardOnScreen = ``;
  board.forEach((row) => {
    row.forEach((square) => {
      boardOnScreen += `<div class=square style="top:${
        square.y * boardSize
      }px; left:${square.x * boardSize}px; background-color:${square.color};">${
        square.position + 1
      }</div>`;
    });
  });

  players.forEach((player) => {
    // let square = null;
    // console.log(player);
    board.forEach((row) => {
      row.forEach((square) => {
        if (square.position === player.position) {
          boardOnScreen += `<div class=player style="top:${
            square.y * boardSize + 5
          }px; left:${square.x * boardSize + 5}px;background-color:${
            player.color
          };">${player.name}</div>`;
        }
      });
    });
  });

  ladders.forEach((ladder) => {
    //let start = 0;
    let startPos = { x: 0, y: 0 };
    let endPos = { x: 0, y: 0 };

    board.forEach((row) => {
      row.forEach((square) => {
        if (square.position === ladder.start) {
          startPos.x = square.x * boardSize;
          startPos.y = square.y * boardSize;
        }

        if (square.position === ladder.end) {
          endPos.x = square.x * boardSize;
          endPos.y = square.y * boardSize;
        }
      });
    });
    // if end is greater than start that means it is a ladder or it is a snake
    isLadder = ladder.end > ladder.start;

    //if it is a ladder then it is green, otherwise snake is red
    drawLine({ color: isLadder ? "green" : "red", startPos, endPos });
  });
  //get everything on the page
  document.getElementById("board").innerHTML = boardOnScreen;
};

const drawLine = ({ color, startPos, endPos }) => {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.moveTo(startPos.x + 35, startPos.y + 20);
  ctx.lineTo(endPos.x + 25, endPos.y + 25);
  ctx.lineWidth = 10;
  ctx.strokeStyle = color;
  ctx.stroke();

  //
  // var snakeImage = new Image();
  // var ladderImage = new Image();

  // snakeImage.onload = function(){
  //   ctx.save();
  //   ctx.globalCompositeOperation = `source-atop`;
  //   ctx.drawImage(snakeImage,0,0);
  //   ctx.restore()
  // };
  // snakeImage.src = 'snake.png';
};
const reset = () => {
  board = [];
  players = [
    { name: "P1", position: 0, color: "#2d03fc" },
    { name: "P2", position: 0, color: "#fc03df" },
  ];
  position = 0;
  currentPlayerTurn = 0;
  currentPlayer = players[currentPlayerTurn];
  document.getElementById("dice").style.display = "none";
  document.getElementById("message").innerHTML = "";
  constructBox();
  drawBoard();
};

// draw on page load
drawBoard();
