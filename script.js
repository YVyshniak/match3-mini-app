
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
let replaced = null;

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
  replaced = this;

  const fromId = parseInt(dragged.getAttribute("data-id"));
  const toId = parseInt(replaced.getAttribute("data-id"));

  const validMoves = [fromId - 1, fromId + 1, fromId - width, fromId + width];
  if (!validMoves.includes(toId)) return;

  const fromIcon = dragged.textContent;
  const toIcon = replaced.textContent;

  dragged.textContent = toIcon;
  replaced.textContent = fromIcon;

  setTimeout(() => {
    if (checkMatches(true)) {
      checkMatches();
    } else {
      dragged.textContent = fromIcon;
      replaced.textContent = toIcon;
    }
  }, 100);
}

function checkMatches(simulateOnly = false) {
  let matched = false;

  for (let i = 0; i < width * width; i++) {
    let row = Math.floor(i / width);
    if (i % width < width - 2) {
      let icon = grid[i].textContent;
      if (
        icon &&
        grid[i + 1].textContent === icon &&
        grid[i + 2].textContent === icon
      ) {
        if (simulateOnly) return true;
        grid[i].classList.add("fade");
        grid[i + 1].classList.add("fade");
        grid[i + 2].classList.add("fade");
        matched = true;
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
        if (simulateOnly) return true;
        grid[i].classList.add("fade");
        grid[i + width].classList.add("fade");
        grid[i + 2 * width].classList.add("fade");
        matched = true;
        score += 3;
      }
    }
  }

  if (!simulateOnly && matched) {
    scoreDisplay.textContent = "Очки: " + score;
    setTimeout(removeMatches, 300);
  }

  return matched;
}

function removeMatches() {
  for (let i = 0; i < width * width; i++) {
    if (grid[i].classList.contains("fade")) {
      grid[i].classList.remove("fade");
      grid[i].textContent = "";
    }
  }
  setTimeout(dropCells, 200);
}

function dropCells() {
  for (let i = width * width - 1; i >= 0; i--) {
    if (grid[i].textContent === "") {
      if (i - width >= 0 && grid[i - width].textContent !== "") {
        grid[i].textContent = grid[i - width].textContent;
        grid[i - width].textContent = "";
      } else {
        grid[i].textContent = icons[Math.floor(Math.random() * icons.length)];
      }
    }
  }
  setTimeout(() => {
    if (!checkMatches(true)) {
      updateLeaderboard();
    } else {
      checkMatches();
    }
  }, 200);
}

// Leaderboard
function updateLeaderboard() {
  const leaderboardEl = document.getElementById("leaderboard");
  const scores = JSON.parse(localStorage.getItem("topScores") || "[]");

  scores.push(score);
  scores.sort((a, b) => b - a);
  const top = scores.slice(0, 5);
  localStorage.setItem("topScores", JSON.stringify(top));

  leaderboardEl.innerHTML = "<b>🏆 Рейтинг (топ-5):</b><br>" + top.map((s, i) => `${i + 1}. ${s} очок`).join("<br>");
}

createBoard();
