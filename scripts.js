const options = document.querySelector(".options");
const computerBtn = document.querySelector(".computer");
const gameOverElement = document.querySelector(".gameover");
const friendBtn = document.querySelector(".friend");
const xBtn = document.querySelector(".x");
const oBtn = document.querySelector(".o");
const playBtn = document.querySelector(".play");
const player = new Object();
let OPPONENT;
const xImage = new Image();
xImage.src = "x.png";
const oImage = new Image();
oImage.src = "o.png";

computerBtn.addEventListener("click", function () {
  OPPONENT = "computer";
  switchActive(friendBtn, computerBtn);
});

friendBtn.addEventListener("click", function () {
  OPPONENT = "friend";
  switchActive(computerBtn, friendBtn);
});

oBtn.addEventListener("click", function () {
  player.man = "O";
  player.computer = "X";
  player.friend = "X";
  switchActive(xBtn, oBtn);
});

xBtn.addEventListener("click", function () {
  player.man = "X";
  player.computer = "O";
  player.friend = "O";
  switchActive(oBtn, xBtn);
});

playBtn.addEventListener("click", function () {
  if (!OPPONENT) {
    computerBtn.style.backgroundColor = "#7700ff ";
    friendBtn.style.backgroundColor = "#7700ff ";
    return;
  }
  if (!player.man) {
    oBtn.style.backgroundColor = "#7700ff ";
    xBtn.style.backgroundColor = "#7700ff";
    return;
  }
  //   init(player, OPPONENT);
  options.classList.add("hide");
});

function switchActive(off, on) {
  off.classList.remove("active");
  on.classList.add("active");
}

function init(player, OPPONENT) {
  const canvas = document.getElementById("cvs");
  const ctx = canvas.getContext("2d");
  const COLUMN = 3;
  const ROW = 3;
  let board = [];
  const SPACE_SIZE = 150;
  let gameData = new Array(9);
  let currentPlayer = player.man;
  const COMBOS = [
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let GAME_OVER = false;

  function drawBoard() {
    let id = 0;
    for (let i = 0; i < ROW; i++) {
      board[i] = [];
      for (let j = 0; i < COLUMN; j++) {
        board[i][j] = id;
        id++;
        ctx.strokeStyle = "#000";
        ctx.strokeRect(j * SPACE_SIZE, i * SPACE_SIZE, SPACE_SIZE, SPACE_SIZE);
      }
    }
  }
  drawBoard();

  canvas.addEventListener("click", function (event) {
    if (GAME_OVER) return;
    let X = event.clientX - canvas.getBoundingClientRect().x;
    let Y = event.clientY - canvas.getBoundingClientRect().y;
    let i = Math.floor(Y / SPACE_SIZE);
    let j = Math.floor(X / SPACE_SIZE);
    let id = board[i][j];
    if (gameData[id]) return;
    gameData[id] = currentPlayer;
    drawOnBoard(currentPlayer, i, j);

    if (isWinner(gameData, currentPlayer)) {
      showGameOver(currentPlayer);
      GAME_OVER = true;
      return;
    }
    if (isTie(gameData)) {
      showGameOver("tie");
      GAME_OVER = true;
      return;
    }

    if (currentPlayer == player.man) {
      currentPlayer = player.friend;
    } else {
      currentPlayer = player.man;
    }
  });

  function isWinner(gameData, player) {
    for (let i = 0; i < COMBOS.length; i++) {
      let won = true;
      for (let j = 0; j < COMBOS[i].length; j++) {
        let id = COMBOS[i][j];
        won = gameData[id] == player && won;
      }
      if (won) {
        return true;
      }
    }
    return false;
  }

  function isTie(gameData) {
    let isBoardFill = true;
    for (let i = 0; i < gameData.length; i++) {
      isBoardFill = gameData[i] && isBoardFill;
    }
    if (isBoardFill) {
      return true;
    }
    return false;
  }

  function showGameOver(player) {
    let imgSrc = `${player}.png`;
    let message = player == "tie" ? "Oops No Winner" : "The Winner is";
    gameOverElement.innerHTML = `<h1>${message}</h1>
  <img class="winner-img" src=${imgSrc}>
  <div class="play" onclick="location.reload();">PLAY AGAIN</div>`;
    gameOverElement.classList.remove("hide");
  }
  function drawOnBoard(player, i, j) {
    const img = player == "X" ? xImage : oImage;
    ctx.drawImage(img, j * SPACE_SIZE, i * SPACE_SIZE);
  }
}
