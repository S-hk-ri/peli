import { hypot } from './utils.js';

let canvas, ctx;
export let wireRadius = 30; // Johtopisteen säde (esim. 30 px)

export function initCanvas() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
  // Skaalaa canvas pitämään 414x896-aspektisuhde
  const frame = document.getElementById('gameFrame');
  const rect = frame.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}

export function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Piirtää yksittäisen johdon (valkoinen kuori + diagonaaliraita + sisempi väripallo + kupariydin)
export function drawWire(wire) {
  const { x, y, color } = wire;

  // Ulkokuori (valkoinen ympyrä)
  ctx.beginPath();
  ctx.arc(x, y, wireRadius, 0, 2 * Math.PI);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.closePath();

  // Diagonaaliraita: piirreään maskina käyttäen clipping-path-tekniikkaa
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, wireRadius, 0, 2 * Math.PI);
  ctx.clip();
  ctx.translate(x - wireRadius, y - wireRadius);
  ctx.fillStyle = color === 'maa' ? '#888' : color; // maa-johto harmahtavana
  ctx.fillRect(0, 0, wireRadius * 2, wireRadius * 2);
  ctx.globalCompositeOperation = 'xor';
  ctx.lineWidth = 6;
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.moveTo(0, 0);
  ctx.lineTo(wireRadius * 2, wireRadius * 2);
  ctx.moveTo(wireRadius * 2, 0);
  ctx.lineTo(0, wireRadius * 2);
  ctx.stroke();
  ctx.restore();

  // Sisempi väripallo (jos ei maa)
  if (color !== 'maa') {
    ctx.beginPath();
    ctx.arc(x, y, wireRadius * 0.7, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }

  // Kupariydin (pieni oranssinkultainen ympyrä keskellä)
  ctx.beginPath();
  ctx.arc(x, y, wireRadius * 0.3, 0, 2 * Math.PI);
  ctx.fillStyle = '#d2691e';
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 3;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.closePath();
}

// Piirtää kaikki jäljellä olevat johdot ja mahdollisen väliviivan
export function drawAll(wires, startWire, currPos) {
  clearCanvas();
  // Piirrä kukin jäljellä oleva johto
  wires.forEach(w => drawWire(w));

  // Jos vetämistilassa, piirrä väliviiva
  if (startWire && currPos) {
    ctx.beginPath();
    ctx.moveTo(startWire.x, startWire.y);
    ctx.lineTo(currPos.x, currPos.y);
    ctx.lineWidth = 6;
    ctx.strokeStyle = startWire.color === 'maa' ? '#888' : startWire.color;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.closePath();
  }
}
