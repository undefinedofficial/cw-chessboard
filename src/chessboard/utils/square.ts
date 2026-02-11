import type {
  Rect,
  AbsolutePoint,
  Point,
  SquarePoint,
  PieceSymbol,
  PieceCode,
  Color,
  Square,
} from "../types";

export const invertPoint = (
  { x, y }: SquarePoint,
  orientation: Color
): SquarePoint => (orientation === "b" ? { x: 7 - x, y: 7 - y } : { x, y });

export const normalizePoint = ({
  x,
  y,
  height,
  width,
}: Rect): AbsolutePoint => ({
  x: Math.floor(x / (width / 8)),
  y: Math.floor(y / (height / 8)),
});

export const pointToSquare = (rect: Rect, orientation: Color): SquarePoint =>
  invertPoint(normalizePoint(rect), orientation);

export const squareToPoint = ({
  x,
  y,
  height,
  width,
}: Rect): AbsolutePoint => ({
  x: x * (width / 8),
  y: y * (height / 8),
});

export const squareToString = ({ x, y }: SquarePoint): Square =>
  (String.fromCharCode(x + 97) + (8 - y)) as Square;

export const stringToSquare = (square: string): SquarePoint => ({
  x: square.charCodeAt(0) - 97,
  y: 8 - parseInt(square[1]!),
});

export const pointEqual = ({ x, y }: Point, point: Point): boolean =>
  x === point.x && y === point.y;

export const squareValid = ({ x, y }: SquarePoint): boolean =>
  x > -1 && x < 8 && y > -1 && y < 8;

export const isWhiteSquare = (x: number, y: number) =>
  (x % 2 === 0 && y % 2 === 0) || (x % 2 !== 0 && y % 2 !== 0);

export function pieceToSymbol(piece: PieceSymbol): PieceCode {
  const type = piece.toLowerCase();
  const color = type === piece ? "b" : "w";
  return (color + type) as PieceCode;
}

export function symbolToPiece(piece: PieceCode): PieceSymbol {
  const color = piece[0];
  const type = piece[1];
  return (color === "w" ? type!.toUpperCase() : type) as PieceSymbol;
}

export const isPromise = <T>(
  value: PromiseLike<T> | T
): value is PromiseLike<T> =>
  value && typeof (value as any).then === "function";
