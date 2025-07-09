const board = document.getElementById("board");
const status = document.getElementById("status");
const overlay = document.getElementById("overlay");
const container = document.querySelector(".container");

let cells = [];
let currentPlayer;
let userSymbol;
let aiSymbol;
let gameOver = false;

function selectSymbol(symbol) {
  userSymbol = symbol;
  aiSymbol = symbol === "X" ? "O" : "X";
  currentPlayer = "X";
  overlay.style.display = "none";
  container.style.display = "block";
  createBoard();
  if (userSymbol !== currentPlayer) aiMove(); // AI starts if user chose O
}

function createBoard() {
  board.innerHTML = "";
  cells = [];
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", () => handleClick(i));
    board.appendChild(cell);
    cells.push(cell);
  }
  status.textContent = `Player ${userSymbol}'s Turn`;
}

function handleClick(index) {
  if (gameOver || cells[index].textContent !== "" || currentPlayer !== userSymbol) return;

  cells[index].textContent = userSymbol;
  if (checkWin(userSymbol)) {
    status.textContent = `You Win! 🎉`;
    gameOver = true;
    return;
  }

  if (isBoardFull()) {
    status.textContent = "It's a Draw!";
    gameOver = true;
    return;
  }

  currentPlayer = aiSymbol;
  status.textContent = "AI's Turn...";
  setTimeout(aiMove, 500); // Give time delay for realism
}

function aiMove() {
  if (gameOver) return;
  let emptyIndices = cells.map((cell, i) => cell.textContent === "" ? i : null).filter(i => i !== null);
  let randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  if (randomIndex !== undefined) {
    cells[randomIndex].textContent = aiSymbol;
    if (checkWin(aiSymbol)) {
      status.textContent = "AI Wins!";
      gameOver = true;
      return;
    }

    if (isBoardFull()) {
      status.textContent = "It's a Draw!";
      gameOver = true;
      return;
    }

    currentPlayer = userSymbol;
    status.textContent = `Your Turn (${userSymbol})`;
  }
}

function checkWin(player) {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      cells[a].textContent === player &&
      cells[b].textContent === player &&
      cells[c].textContent === player
    ) {
      cells[a].classList.add("winner");
      cells[b].classList.add("winner");
      cells[c].classList.add("winner");
      return true;
    }
  }
  return false;
}

function isBoardFull() {
  return cells.every(cell => cell.textContent !== "");
}

function resetGame() {
  gameOver = false;
  currentPlayer = "X";
  overlay.style.display = "flex";
  container.style.display = "none";
}
