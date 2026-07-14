/**
 * Gem Vault — Memory Card Game
 * Fixed bugs:
 *   1. Removed duplicate addEventListener (was added twice on init)
 *   2. Match comparison uses data-img attribute, not fragile .src URL
 *   3. HTML card markup was broken (hardcoded img-4 × 6); JS owns all state
 *   4. shuffleCard now uses Fisher-Yates for true randomness (original used
 *      Math.random() > 0.5 bias sort which is not a proper shuffle)
 *   5. Matched cards have their listeners cleanly removed
 *   6. All 8 gem images (including unused img-7, img-8) are now in rotation
 */

"use strict";

// ── Config ────────────────────────────────────────────────
const TOTAL_PAIRS  = 8;
const TOTAL_CARDS  = TOTAL_PAIRS * 2;
const SHAKE_DELAY  = 400;    // ms before shake starts
const FLIP_BACK_MS = 1200;   // ms before unmatched cards flip back

// ── DOM refs ──────────────────────────────────────────────
const cardsUL     = document.getElementById("cards");
const btnShuffle  = document.getElementById("btn-shuffle");
const btnPlayAgain= document.getElementById("btn-play-again");
const winOverlay  = document.getElementById("win-overlay");
const statMoves   = document.getElementById("stat-moves");
const statPairs   = document.getElementById("stat-pairs");
const statTime    = document.getElementById("stat-time");
const winMoves    = document.getElementById("win-moves");
const winTime     = document.getElementById("win-time");
const winRating   = document.getElementById("win-rating");

// ── Game State ────────────────────────────────────────────
let firstCard    = null;
let secondCard   = null;
let disableDeck  = false;
let matchedCount = 0;
let moveCount    = 0;
let timerInterval= null;
let elapsedSecs  = 0;
let gameStarted  = false;

// ── Fisher-Yates shuffle (proper, unbiased) ───────────────
function fisherYates(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Build card DOM ────────────────────────────────────────
function buildCard(imgIndex) {
  const li = document.createElement("li");
  li.className = "card";
  li.setAttribute("tabindex", "0");
  li.setAttribute("role", "button");
  li.setAttribute("aria-label", "Hidden gem card");
  li.dataset.img = `img-${imgIndex}`;

  li.innerHTML = `
    <div class="view front-view">
      <img src="images/que_icon.svg" alt="hidden" />
    </div>
    <div class="view back-view">
      <img src="images/img-${imgIndex}.png" alt="gem ${imgIndex}" />
    </div>`;

  li.addEventListener("click", onCardClick);
  li.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onCardClick.call(li);
    }
  });

  return li;
}

// ── Init / Shuffle ────────────────────────────────────────
function initGame() {
  // Stop timer
  stopTimer();
  elapsedSecs = 0;
  gameStarted = false;

  // Reset state
  firstCard    = null;
  secondCard   = null;
  disableDeck  = false;
  matchedCount = 0;
  moveCount    = 0;

  // Update UI
  updateStats();
  hideWinOverlay();

  // Build deck: pairs [1..8, 1..8] shuffled with Fisher-Yates
  const indices = fisherYates([1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8]);

  // Rebuild card list
  cardsUL.innerHTML = "";
  indices.forEach(n => {
    cardsUL.appendChild(buildCard(n));
  });
}

// ── Timer ─────────────────────────────────────────────────
function startTimer() {
  timerInterval = setInterval(() => {
    elapsedSecs++;
    statTime.textContent = formatTime(elapsedSecs);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// ── Stats ─────────────────────────────────────────────────
function updateStats() {
  statMoves.textContent = moveCount;
  statPairs.innerHTML   = `${matchedCount}<span class="stat-denom">/${TOTAL_PAIRS}</span>`;
  statTime.textContent  = formatTime(elapsedSecs);
}

// ── Card Click ────────────────────────────────────────────
function onCardClick() {
  const clickedCard = this;

  // Guards
  if (disableDeck) return;
  if (clickedCard === firstCard) return;
  if (clickedCard.classList.contains("matched")) return;
  if (clickedCard.classList.contains("flip")) return;

  // Start timer on first interaction
  if (!gameStarted) {
    gameStarted = true;
    startTimer();
  }

  clickedCard.classList.add("flip");
  clickedCard.setAttribute("aria-label", "Revealed gem card");

  if (!firstCard) {
    firstCard = clickedCard;
    return;
  }

  // Second card picked
  secondCard = clickedCard;
  disableDeck = true;
  moveCount++;
  updateStats();

  checkMatch();
}

// ── Match Logic ───────────────────────────────────────────
function checkMatch() {
  // Compare data-img attribute — never .src (avoids URL path fragility)
  const isMatch = firstCard.dataset.img === secondCard.dataset.img;

  if (isMatch) {
    handleMatch();
  } else {
    handleMismatch();
  }
}

function handleMatch() {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");

  // Remove click listeners — no more interaction with matched cards
  firstCard.removeEventListener("click", onCardClick);
  secondCard.removeEventListener("click", onCardClick);
  firstCard.setAttribute("aria-label", "Matched gem — locked");
  secondCard.setAttribute("aria-label", "Matched gem — locked");

  matchedCount++;
  updateStats();

  resetPick();
  disableDeck = false;

  if (matchedCount === TOTAL_PAIRS) {
    stopTimer();
    setTimeout(showWin, 650);
  }
}

function handleMismatch() {
  // Shake after brief pause so player can see the card
  setTimeout(() => {
    firstCard.classList.add("shake");
    secondCard.classList.add("shake");
  }, SHAKE_DELAY);

  setTimeout(() => {
    firstCard.classList.remove("shake", "flip");
    secondCard.classList.remove("shake", "flip");
    firstCard.setAttribute("aria-label", "Hidden gem card");
    secondCard.setAttribute("aria-label", "Hidden gem card");
    resetPick();
    disableDeck = false;
  }, FLIP_BACK_MS);
}

function resetPick() {
  firstCard  = null;
  secondCard = null;
}

// ── Win Screen ────────────────────────────────────────────
function showWin() {
  winMoves.textContent  = moveCount;
  winTime.textContent   = formatTime(elapsedSecs);
  winRating.textContent = getRating(moveCount, elapsedSecs);
  winOverlay.classList.add("visible");
  winOverlay.setAttribute("aria-hidden", "false");
  document.getElementById("btn-play-again").focus();
}

function hideWinOverlay() {
  winOverlay.classList.remove("visible");
  winOverlay.setAttribute("aria-hidden", "true");
}

function getRating(moves, secs) {
  // Rating based on moves (fewer = better)
  if (moves <= 14)       return "★★★★★";
  if (moves <= 18)       return "★★★★☆";
  if (moves <= 24)       return "★★★☆☆";
  if (moves <= 32)       return "★★☆☆☆";
  return "★☆☆☆☆";
}

// ── Event listeners ───────────────────────────────────────
btnShuffle.addEventListener("click", initGame);
btnPlayAgain.addEventListener("click", initGame);

// Keyboard shortcut: press R to restart
document.addEventListener("keydown", (e) => {
  if (e.key === "r" || e.key === "R") initGame();
});

// ── Boot ──────────────────────────────────────────────────
initGame();
