// 테트리스 보드 설정 (가로 10칸, 세로 20칸)
const COLS = 10;
const ROWS = 20;

const PIECES = {
  I: { shape: [[1, 1, 1, 1]] },
  O: { shape: [[1, 1], [1, 1]] },
  T: { shape: [[0, 1, 0], [1, 1, 1]] },
  S: { shape: [[0, 1, 1], [1, 1, 0]] },
  Z: { shape: [[1, 1, 0], [0, 1, 1]] },
  J: { shape: [[1, 0, 0], [1, 1, 1]] },
  L: { shape: [[0, 0, 1], [1, 1, 1]] },
};

const PIECE_TYPES = Object.keys(PIECES);

const boardElement = document.getElementById("game-board");
const scoreElement = document.getElementById("score");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

let score = 0;
let board = [];
let currentPiece = null;
let cells = [];

function createEmptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function initBoard() {
  boardElement.innerHTML = "";
  cells = [];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      boardElement.appendChild(cell);
      cells.push(cell);
    }
  }
}

function createPiece(type) {
  const pieceType = type || PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
  const shape = PIECES[pieceType].shape;

  return {
    type: pieceType,
    shape,
    x: Math.floor((COLS - shape[0].length) / 2),
    y: 0,
  };
}

function drawPiece(targetBoard, piece) {
  const displayBoard = targetBoard.map((row) => row.slice());

  piece.shape.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (!cell) return;

      const y = piece.y + rowIndex;
      const x = piece.x + colIndex;

      if (y < 0 || y >= ROWS || x < 0 || x >= COLS) return;

      displayBoard[y][x] = piece.type;
    });
  });

  return displayBoard;
}

function renderBoard() {
  const displayBoard = drawPiece(board, currentPiece);

  displayBoard.forEach((row, rowIndex) => {
    row.forEach((cellValue, colIndex) => {
      const cell = cells[rowIndex * COLS + colIndex];
      cell.className = "cell";

      if (cellValue) {
        cell.classList.add(`piece-${cellValue}`);
      }
    });
  });
}

function updateScore() {
  scoreElement.textContent = score;
}

function startGame() {
  score = 0;
  updateScore();
  board = createEmptyBoard();
  currentPiece = createPiece();
  renderBoard();
}

function restartGame() {
  startGame();
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);

initBoard();
startGame();
