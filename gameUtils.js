export function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export function generateWires(width, height, colors) {
  const wires = [];
  const wireRadius = 20;
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const sp = height / 4;
  let yPositions = [sp, sp * 2, sp * 3];
  yPositions = shuffle(yPositions);
  const includeMaa = Math.random() < 0.05;
  const p = Math.random();
  if (p < 0.75) {
    const cols = shuffle(colors).filter(c => c !== 'maa').slice(0, 3);
    for (let i = 0; i < 3; i++) {
      const y = yPositions[i];
      wires.push({ x: 50, y, color: cols[i] });
      wires.push({ x: width - 50, y, color: cols[i] });
    }
  } else {
    const cols = shuffle(colors).filter(c => c !== 'maa').slice(0, 2);
    for (let i = 0; i < 2; i++) {
      const y = yPositions[i];
      wires.push({ x: 50, y, color: cols[i] });
      wires.push({ x: width - 50, y, color: cols[i] });
    }
    const odd = shuffle(colors.filter(c => !cols.includes(c) && c !== 'maa'))[0];
    const y = yPositions[2];
    const side = Math.random() < 0.5 ? 'left' : 'right';
    wires.push({ x: side === 'left' ? 50 : width - 50, y, color: odd });
  }
  if (includeMaa) {
    const y = yPositions[Math.floor(Math.random() * 3)];
    const side = Math.random() < 0.5 ? 'left' : 'right';
    wires.push({ x: side === 'left' ? 50 : width - 50, y, color: 'maa' });
  }
  return wires;
}
