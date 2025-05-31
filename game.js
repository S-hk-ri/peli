import { shuffle, hypot } from './utils.js';
import { drawAll, initCanvas, wireRadius } from './draw.js';
import {
  updateScoreDisplay,
  updateTimeDisplay,
  showNotificationOverlay,
  showShockOverlay,
  hideStartOverlay,
  hideNotificationOverlay,
} from './ui.js';
import { getMaxScore, setMaxScore } from './storage.js';

export let gameState = {
  wires: [],
  score: 0,
  elapsedTime: 0,
  timerInterval: null,
};

const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange']; // voimme muokata listaa tarvittaessa
const MAX_PAIRS = 3; // maks 3 paria per generointi
const GROUND_RADIUS = 30; // MAA-alueen puoli

export function startGame() {
  // 1. Nollaa pisteet ja aika
  gameState.score = 0;
  gameState.elapsedTime = 0;
  updateScoreDisplay(0);
  updateTimeDisplay(0);
  // 2. Piilota overlayt
  hideStartOverlay();
  hideNotificationOverlay();
  // 3. Init canvas
  initCanvas();
  // 4. Generoi johdot ja piirrä ne
  generateWires();
  drawAll(gameState.wires, null, null);
  // 5. Aloita ajastin
  startTimer();
}

function startTimer() {
  if (gameState.timerInterval) clearInterval(gameState.timerInterval);
  gameState.timerInterval = setInterval(() => {
    gameState.elapsedTime += 1;
    updateTimeDisplay(gameState.elapsedTime);
  }, 1000);
}

function stopTimer() {
  clearInterval(gameState.timerInterval);
  gameState.timerInterval = null;
}

// Päivittää pistemäärän ja lokalStorage-ennätyksen
function updateScore(points) {
  gameState.score += points;
  updateScoreDisplay(gameState.score);
  if (gameState.score > getMaxScore()) {
    setMaxScore(gameState.score);
  }
}

// Johdoen generointi
export function generateWires() {
  const canvas = document.getElementById('gameCanvas');
  const width = canvas.width;
  const height = canvas.height;
  const sp = height / 4;

  let yPositions = [sp, sp * 2, sp * 3];
  yPositions = shuffle(yPositions);

  const wires = [];

  // 1. Päätetään, tuleeko maa-johto (5 % todennäköisyys)
  if (Math.random() < 0.05) {
    const side = Math.random() < 0.5 ? 'left' : 'right';
    const idx = Math.floor(Math.random() * 3);
    const xPos = side === 'left' ? 50 : width - 50;
    wires.push({ x: xPos, y: yPositions[idx], color: 'maa' });
  }

  // 2. Päätetään, 75 % todennäköisyydellä 3 paria vai 2 paria + yksittäinen
  const isTwoPairsOneSingle = Math.random() >= 0.75;

  if (!isTwoPairsOneSingle) {
    // 3 paria
    const selected = shuffle(COLORS).slice(0, MAX_PAIRS);
    for (let i = 0; i < MAX_PAIRS; i++) {
      const color = selected[i];
      // vasen ja oikea piste
      wires.push({ x: 50, y: yPositions[i], color });
      wires.push({ x: width - 50, y: yPositions[i], color });
    }
  } else {
    // 2 paria + 1 yksittäinen
    const selected = shuffle(COLORS).slice(0, 2); // 2 väriä
    for (let i = 0; i < 2; i++) {
      const color = selected[i];
      wires.push({ x: 50, y: yPositions[i], color });
      wires.push({ x: width - 50, y: yPositions[i], color });
    }
    // Yksittäinen satunnaisväri (ei 'maa') jommallekin puolelle
    const singleColor = shuffle(COLORS.filter(c => !selected.includes(c)))[0];
    const side = Math.random() < 0.5 ? 'left' : 'right';
    const idx = 2; // jäljellä yksi korkeus
    const xPos = side === 'left' ? 50 : width - 50;
    wires.push({ x: xPos, y: yPositions[idx], color: singleColor });
  }

  // Sekoita lopullinen järjestys (jos halutaan erilainen järjestys piirtämiselle)
  gameState.wires = shuffle(wires);
}

// Käsittelee, kun käyttäjä vapauttaa vedon (pt = {x, y})
export function handleEndSelection(startWire, pt) {
  const wires = gameState.wires;
  if (!startWire) return;

  // 1. Etsi kohteena oleva toinen johto (samat koordinaatit)
  const target = wires.find(
    w => w !== startWire && hypot(w.x - pt.x, w.y - pt.y) < wireRadius
  );

  // 2. Oikea paritus (samanvärisiä)
  if (target && target.color === startWire.color && startWire.color !== 'maa') {
    gameState.wires = wires.filter(w => w !== startWire && w !== target);
    updateScore(10);
    checkRoundCompletion();
    return;
  }

  // 3. Mahdollinen maa-yhdistys
  const canvas = document.getElementById('gameCanvas');
  const centerX = canvas.width / 2;
  const centerY = canvas.height - 60;
  const distanceToGround = hypot(pt.x - centerX, pt.y - centerY);

  // Ehto: jos startWire on 'maa' tai värille ei enää ole paria
  const remainingSameColor = wires.filter(
    w => w.color === startWire.color && w !== startWire
  ).length;

  if (
    distanceToGround < GROUND_RADIUS &&
    (startWire.color === 'maa' || remainingSameColor === 0)
  ) {
    gameState.wires = wires.filter(w => w !== startWire);
    updateScore(10);
    checkRoundCompletion();
    return;
  }

  // 4. Virhetilanne: väärä kytkentä
  // Näytä sähköisku ja keskeytä peli hetkiseksi
  stopTimer();
  showShockOverlay(300);
  setTimeout(() => {
    showNotificationOverlay(gameState.score, gameState.elapsedTime);
  }, 300);
}

// Kun kaikki johdot on yhdistetty oikein, generoidaan uudet
function checkRoundCompletion() {
  if (gameState.wires.length === 0) {
    // Pieni viive ennen seuraavaa kierrosta
    setTimeout(() => {
      generateWires();
      drawAll(gameState.wires, null, null);
    }, 500);
  } else {
    // Piirretään puuttuvat johdot heti
    drawAll(gameState.wires, null, null);
  }
}
