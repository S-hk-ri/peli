import { bindStartButton, bindRestartButton, showStartOverlay } from './ui.js';
import { initInput } from './input.js';
import { startGame, gameState } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
  // Näytetään start-overlay heti
  showStartOverlay();

  // Liitetään nappien callbackit
  bindStartButton(() => {
    startGame();
    // Alusta input-käsittelijä vasta vuoden gameState mukaan
    initInput({ wires: gameState.wires });
  });
  bindRestartButton(() => {
    startGame();
  });
});
