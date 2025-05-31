import { formatTime, generateWires } from '../gameUtils.js';

describe('formatTime', () => {
  test('formats 75 seconds as 01:15', () => {
    expect(formatTime(75)).toBe('01:15');
  });
});

describe('generateWires', () => {
  test('generates between 1 and 7 wires', () => {
    const colors = ['red','blue','green','yellow','orange','purple','cyan','lime','maa'];
    const wires = generateWires(400, 800, colors);
    expect(wires.length).toBeGreaterThanOrEqual(1);
    expect(wires.length).toBeLessThanOrEqual(7);
  });
});
