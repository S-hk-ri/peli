import { formatTime } from './utils.js';

const scoreEl = document.getElementById('scoreDisplay');
const timeEl = document.getElementById('timeDisplay');
const startOverlay = document.getElementById('startOverlay');
const shockOverlay = document.getElementById('shockOverlay');
const notificationOverlay = document.getElementById('notificationOverlay');
const notifyText = document.getElementById('notifyText');
const restartBtn = document.getElementById('restartButton');

export function updateScoreDisplay(score) {
  scoreEl.textContent = `🪙 ${score}`;
}

export function updateTimeDisplay(elapsedSeconds) {
  timeEl.textContent = `⏱️ ${formatTime(elapsedSeconds)}`;
}

export function showStartOverlay() {
  startOverlay.style.display = 'flex';
}

export function hideStartOverlay() {
  startOverlay.style.display = 'none';
}

export function showShockOverlay(duration = 300) {
  shockOverlay.style.display = 'flex';
  setTimeout(() => {
    shockOverlay.style.display = 'none';
  }, duration);
}

export function showNotificationOverlay(score, elapsedTime) {
  notifyText.textContent = `Hupsista! Ota huikka! Sait ${score} pistettä ajassa ${formatTime(elapsedTime)}`;
  notificationOverlay.style.display = 'flex';
}

export function hideNotificationOverlay() {
  notificationOverlay.style.display = 'none';
}

export function bindStartButton(callback) {
  document.getElementById('startButton').addEventListener('click', callback);
}

export function bindRestartButton(callback) {
  restartBtn.addEventListener('click', callback);
}
