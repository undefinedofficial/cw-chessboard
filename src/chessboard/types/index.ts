export type Color = "w" | "b";
export type InputColor = "all" | "none" | Color;

export interface Point {
  x: number;
  y: number;
}

export type SquarePoint = {
  x: number;
  y: number;
};
export type AbsolutePoint = {
  x: number;
  y: number;
};

export type Size2D = {
  width: number;
  height: number;
};

export type PieceSymbol = "k" | "q" | "r" | "n" | "b" | "p" | "K" | "Q" | "R" | "N" | "B" | "P";

export interface Piece extends Point {
  name: PieceSymbol;
  color: Color;
}

export type MovePieceFunction = (
  from: Point,
  to: Point,
  animated?: boolean,
  type?: string
) => Promise<void>;

export type CoordMode = "none" | "left" | "right";
