// Sekoittaa taulukon elementit satunnaisesti (Fisher–Yates)
export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Palauttaa hiiren/kosketuksen koordinaatit canvasin koordinaatistossa
export function getPt(event, canvas) {
  let rect = canvas.getBoundingClientRect();
  let x, y;
  if (event.touches) {
    x = event.touches[0].clientX - rect.left;
    y = event.touches[0].clientY - rect.top;
  } else {
    x = event.clientX - rect.left;
    y = event.clientY - rect.top;
  }
  return { x, y };
}

// Laskee euclidisen etäisyyden
export function hypot(dx, dy) {
  return Math.sqrt(dx * dx + dy * dy);
}

// Muotoilee ajan (sekunnit) MM:SS-muotoon
export function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return `${mm}:${ss}`;
}
