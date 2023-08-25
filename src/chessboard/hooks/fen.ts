import type { PieceSymbol, SquarePoint } from "../types";
export type SquareType = PieceSymbol | null;

export const stringToFen = (fen: string) => {
  const squares: SquareType[] = [];

  const fenParts = fen.split(" ")[0].split("/");
  if (fenParts.length !== 8) throw new Error("Invalid fen string");

  for (let y = 0; y < 8; y++) {
    let offset = 0;
    for (let x = 0; x < fenParts[y].length; x++) {
      const piece = fenParts[y][x];
      offset = parseInt(piece);

      if (Number.isNaN(offset)) squares.push(piece as PieceSymbol); // push symbol piece
      else squares.push(...Array(offset).fill(null)); // or empty squares
    }
  }
  return squares;
};
export const fenToString = (squares: SquareType[]): string => {
  const parts = new Array<string>();

  let spaceCounter = 0;
  for (let i = 0; i < 64; i += 8) {
    const row = squares.slice(i, i + 8);

    let line = "";
    for (const square of row) {
      if (square) {
        if (spaceCounter > 0) {
          line += spaceCounter;
          spaceCounter = 0;
        }
        line += square;
      } else spaceCounter++;
    }
    if (spaceCounter > 0) {
      line += spaceCounter;
      spaceCounter = 0;
    }
    parts.push(line);
  }
  return parts.join("/");
};

export const indexToPoint = (index: number): SquarePoint => ({
  x: index % 8,
  y: Math.floor(index / 8),
});
export const pointToIndex = ({ x, y }: SquarePoint): number => 8 * y + x;
