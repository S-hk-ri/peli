const KEY_MAX_SCORE = 'maxScore';

export function getMaxScore() {
  const stored = localStorage.getItem(KEY_MAX_SCORE);
  return stored ? Number(stored) : 0;
}

export function setMaxScore(score) {
  const current = getMaxScore();
  if (score > current) {
    localStorage.setItem(KEY_MAX_SCORE, String(score));
  }
}
