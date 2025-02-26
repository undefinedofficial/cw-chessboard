import type { Color } from "../types";

export function createSvgPieceElement(piecePack: string, figure: string) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", "0 0 40 40");
  svg.setAttribute("version", "1.1");

  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", `#${piecePack}-${figure}`);
  use.setAttribute("xlink:href", `#${piecePack}-${figure}`);

  svg.appendChild(use);

  return svg;
}
