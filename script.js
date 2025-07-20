
Telegram.WebApp.ready();

const game = document.getElementById("game");
const scoreDisplay = document.getElementById("score");
const width = 6;
const icons = ["🍓", "🍋", "🍇", "🍊", "🍏", "🥝"];
let grid = [];
let score = 0;

function createBoard() {
  grid = [];
  game.innerHTML = "";
  for (let i = 0; i < width * width; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    const icon = icons[Math.floor(Math.random() * icons.length)];
    cell.textContent = icon;
    cell.setAttribute("draggable", true);
    cell.setAttribute("data-id", i);
    game.appendChild(cell);
    grid.push(cell);
  }
  enableDrag();
}

let dragged = null;

function enableDrag() {
  grid.forEach(cell => {
    cell.addEventListener("dragstart", dragStart);
    cell.addEventListener("dragover", e => e.preventDefault());
    cell.addEventListener("drop", dragDrop);
  });
}

function dragStart(e) {
  dragged = this;
}

function dragDrop(e) {
  const fromId = parseInt(dragged.getAttribute("data-id"));
  const toId = parseInt(this.getAttribute("data-id"));

  const validMoves = [fromId - 1, fromId + 1, fromId - width, fromId + width];
  if (!validMoves.includes(toId)) return;

  const fromIcon = dragged.textContent;
  const toIcon = this.textContent;

  // Swap
  dragged.textContent = toIcon;
  this.textContent = fromIcon;

  checkMatches();
}

function checkMatches() {
  for (let i = 0; i < width * width; i++) {
    let row = Math.floor(i / width);
    if (i % width < width - 2) {
      let icon = grid[i].textContent;
      if (
        icon &&
        grid[i + 1].textContent === icon &&
        grid[i + 2].textContent === icon
      ) {
        grid[i].textContent = "";
        grid[i + 1].textContent = "";
        grid[i + 2].textContent = "";
        score += 3;
      }
    }
    if (row < width - 2) {
      let icon = grid[i].textContent;
      if (
        icon &&
        grid[i + width].textContent === icon &&
        grid[i + 2 * width].textContent === icon
      ) {
        grid[i].textContent = "";
        grid[i + width].textContent = "";
        grid[i + 2 * width].textContent = "";
        score += 3;
      }
    }
  }
  scoreDisplay.textContent = "Очки: " + score;
  setTimeout(dropCells, 200);
}

function dropCells() {
  for (let i = width * width - 1; i >= 0; i--) {
    if (grid[i].textContent === "") {
      if (i - width >= 0) {
        grid[i].textContent = grid[i - width].textContent;
        grid[i - width].textContent = "";
      } else {
        grid[i].textContent = icons[Math.floor(Math.random() * icons.length)];
      }
    }
  }
}

createBoard();
