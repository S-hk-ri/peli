import { getPt, hypot } from './utils.js';
import { drawAll, wireRadius } from './draw.js';
import { handleEndSelection, handleStartSelection } from './game.js';

let dragging = false;
let startWire = null;
let currPos = null;

export function initInput(wiresRef) {
  const canvas = document.getElementById('gameCanvas');

  canvas.addEventListener('mousedown', onDown);
  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('mouseup', onUp);
  canvas.addEventListener('touchstart', onTouchStart, { passive: false });
  canvas.addEventListener('touchmove', onTouchMove, { passive: false });
  canvas.addEventListener('touchend', onTouchEnd, { passive: false });

  // Tarvittaessa returnataan tilaviite pelitilaan (wires-listaan)
  return { getWires: () => wiresRef.wires };
}

function onDown(e) {
  e.preventDefault();
  const { x, y } = getPt(e, document.getElementById('gameCanvas'));
  const wires = window.gameState.wires; // oletetaan globaali ref peliobjektiin
  for (let w of wires) {
    if (hypot(w.x - x, w.y - y) < wireRadius) {
      startWire = w;
      dragging = true;
      currPos = { x, y };
      drawAll(wires, startWire, currPos);
      return;
    }
  }
}

function onMove(e) {
  if (!dragging) return;
  e.preventDefault();
  const { x, y } = getPt(e, document.getElementById('gameCanvas'));
  currPos = { x, y };
  drawAll(window.gameState.wires, startWire, currPos);
}

function onUp(e) {
  if (!dragging) return;
  e.preventDefault();
  const { x, y } = getPt(e, document.getElementById('gameCanvas'));
  dragging = false;
  drawAll(window.gameState.wires, startWire, null);
  handleEndSelection(startWire, { x, y });
  startWire = null;
  currPos = null;
}

function onTouchStart(e) {
  e.preventDefault();
  onDown(e);
}

function onTouchMove(e) {
  e.preventDefault();
  onMove(e);
}

function onTouchEnd(e) {
  e.preventDefault();
  onUp(e);
}
