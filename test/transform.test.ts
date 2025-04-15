import { it, expect, describe } from 'vitest';
import { transformTailwindcssClassOrder } from '../src/transform';

describe('Tailwind className sorted', () => {
  it('should sort class names', () => {
    const input = `<div className="m-2 flex text-red-500"></div>`;
    const output = transformTailwindcssClassOrder(input);
    expect(output).toContain('className="flex m-2 text-red-500');
  });
});
