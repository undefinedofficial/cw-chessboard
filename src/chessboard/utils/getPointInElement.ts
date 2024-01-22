import type { Point, Rectangle } from "../types";

export function getPointInElement(el: HTMLElement, { x, y }: Point): Rectangle {
  const rect = el.getBoundingClientRect();
  return {
    x: x - rect.left,
    y: y - rect.top,
    width: rect.width,
    height: rect.height,
  };
}
