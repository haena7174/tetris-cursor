// 테트리스 보드 설정 (가로 10칸, 세로 20칸)
const COLS = 10;
const ROWS = 20;
const DROP_INTERVAL = 800;

const LINE_SCORES = {
  1: 100,
  2: 300,
  3: 500,
  4: 800,
};

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
const gameOverElement = document.getElementById("game-over");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

let score = 0;
let board = [];
let currentPiece = null;
let boardCells = [];
let dropIntervalId = null;
let isGameOver = false;

// --- 보드 유틸 ---

function createEmptyRow() {
  return Array(COLS).fill(null);
}

function createEmptyBoard() {
  return Array.from({ length: ROWS }, () => createEmptyRow());
}

function cloneBoard(boardMatrix) {
  return boardMatrix.map((row) => row.slice());
}

function isRowFull(row) {
  return row.every((cell) => cell !== null);
}

function isValidPieceCell(x, y, boardMatrix) {
  if (x < 0 || x >= COLS || y >= ROWS) {
    return false;
  }

  if (y >= 0 && boardMatrix[y][x]) {
    return false;
  }

  return true;
}

function isVisibleCell(x, y) {
  return x >= 0 && x < COLS && y >= 0 && y < ROWS;
}

// --- DOM 초기화 ---

function initBoard() {
  boardElement.innerHTML = "";
  boardCells = [];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      boardElement.appendChild(cell);
      boardCells.push(cell);
    }
  }
}

// --- 블록(piece) 유틸 ---

function createPiece(type) {
  const pieceType = type || PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
  const shape = PIECES[pieceType].shape.map((row) => row.slice());

  return {
    type: pieceType,
    shape,
    x: Math.floor((COLS - shape[0].length) / 2),
    y: 0,
  };
}

function getPieceCells(piece, offsetX = 0, offsetY = 0) {
  const occupiedCells = [];

  piece.shape.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (!cell) return;

      occupiedCells.push({
        x: piece.x + colIndex + offsetX,
        y: piece.y + rowIndex + offsetY,
      });
    });
  });

  return occupiedCells;
}

function rotateShape(shape) {
  const rowCount = shape.length;
  const colCount = shape[0].length;
  const rotated = Array.from({ length: colCount }, () => Array(rowCount).fill(0));

  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < colCount; col++) {
      rotated[col][rowCount - 1 - row] = shape[row][col];
    }
  }

  return rotated;
}

function canMove(piece, offsetX, offsetY, boardMatrix) {
  return getPieceCells(piece, offsetX, offsetY).every(({ x, y }) =>
    isValidPieceCell(x, y, boardMatrix)
  );
}

// --- 렌더링 ---

function mergePieceIntoBoard(boardMatrix, piece) {
  const displayBoard = cloneBoard(boardMatrix);

  if (!piece) return displayBoard;

  getPieceCells(piece).forEach(({ x, y }) => {
    if (!isVisibleCell(x, y)) return;
    displayBoard[y][x] = piece.type;
  });

  return displayBoard;
}

function renderBoard() {
  const displayBoard = mergePieceIntoBoard(board, currentPiece);

  displayBoard.forEach((row, rowIndex) => {
    row.forEach((cellValue, colIndex) => {
      const cell = boardCells[rowIndex * COLS + colIndex];
      cell.className = "cell";

      if (cellValue) {
        cell.classList.add(`piece-${cellValue}`);
      }
    });
  });
}

function updateScoreDisplay() {
  scoreElement.textContent = score;
}

function showGameOverMessage() {
  gameOverElement.hidden = false;
}

function hideGameOverMessage() {
  gameOverElement.hidden = true;
}

// --- 게임 상태 변경 ---

function isPlaying() {
  return !isGameOver && currentPiece !== null;
}

function lockPiece() {
  if (!currentPiece) return;

  getPieceCells(currentPiece).forEach(({ x, y }) => {
    if (!isVisibleCell(x, y)) return;
    board[y][x] = currentPiece.type;
  });
}

function clearLines() {
  const keptRows = [];
  let linesCleared = 0;

  for (let row = 0; row < ROWS; row++) {
    if (isRowFull(board[row])) {
      linesCleared++;
    } else {
      keptRows.push(board[row]);
    }
  }

  while (keptRows.length < ROWS) {
    keptRows.unshift(createEmptyRow());
  }

  board = keptRows;
  return linesCleared;
}

function addScore(linesCleared) {
  if (linesCleared <= 0) return;

  score += LINE_SCORES[linesCleared] || linesCleared * 100;
  updateScoreDisplay();
}

function spawnPiece() {
  currentPiece = createPiece();

  if (!canMove(currentPiece, 0, 0, board)) {
    currentPiece = null;
    renderBoard();
    return false;
  }

  renderBoard();
  return true;
}

function triggerGameOver() {
  isGameOver = true;
  stopDropLoop();
  showGameOverMessage();
  renderBoard();
}

function settlePiece() {
  lockPiece();

  const linesCleared = clearLines();
  addScore(linesCleared);

  if (!spawnPiece()) {
    triggerGameOver();
  }
}

// --- 블록 이동 ---

function moveDown() {
  if (!isPlaying()) return;

  if (canMove(currentPiece, 0, 1, board)) {
    currentPiece.y++;
    renderBoard();
    return;
  }

  settlePiece();
}

function tryMove(offsetX, offsetY) {
  if (!isPlaying()) return false;

  if (!canMove(currentPiece, offsetX, offsetY, board)) {
    return false;
  }

  currentPiece.x += offsetX;
  currentPiece.y += offsetY;
  renderBoard();
  return true;
}

function tryRotate() {
  if (!isPlaying()) return false;

  const previousShape = currentPiece.shape;
  currentPiece.shape = rotateShape(previousShape);

  if (!canMove(currentPiece, 0, 0, board)) {
    currentPiece.shape = previousShape;
    return false;
  }

  renderBoard();
  return true;
}

function hardDrop() {
  if (!isPlaying()) return;

  while (canMove(currentPiece, 0, 1, board)) {
    currentPiece.y++;
  }

  settlePiece();
}

// --- 입력 ---

function handleKeyDown(event) {
  if (!isPlaying()) return;

  switch (event.code) {
    case "ArrowLeft":
      event.preventDefault();
      tryMove(-1, 0);
      break;
    case "ArrowRight":
      event.preventDefault();
      tryMove(1, 0);
      break;
    case "ArrowDown":
      event.preventDefault();
      moveDown();
      break;
    case "ArrowUp":
      event.preventDefault();
      tryRotate();
      break;
    case "Space":
      event.preventDefault();
      hardDrop();
      break;
    default:
      break;
  }
}

// --- 타이머 ---

function startDropLoop() {
  stopDropLoop();
  dropIntervalId = setInterval(moveDown, DROP_INTERVAL);
}

function stopDropLoop() {
  if (dropIntervalId !== null) {
    clearInterval(dropIntervalId);
    dropIntervalId = null;
  }
}

// --- 게임 시작/재시작 ---

function startGame() {
  stopDropLoop();
  isGameOver = false;
  hideGameOverMessage();
  score = 0;
  updateScoreDisplay();
  board = createEmptyBoard();
  currentPiece = createPiece();
  renderBoard();
  startDropLoop();
}

function restartGame() {
  startGame();
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);
document.addEventListener("keydown", handleKeyDown);

initBoard();
startGame();
