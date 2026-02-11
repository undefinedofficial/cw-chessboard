export type Color = "w" | "b";

export type InputColor = "all" | "none" | Color;
export type InputMode = "auto" | "move" | "press";
export type InputType = "drag" | "click";

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

export type Rect = Point & {
  width: number;
  height: number;
};

export type PieceSymbol =
  | "k"
  | "q"
  | "r"
  | "n"
  | "b"
  | "p"
  | "K"
  | "Q"
  | "R"
  | "N"
  | "B"
  | "P";

export type PieceCode = `${Color}${Lowercase<PieceSymbol>}`;

export interface Piece extends Point {
  name: PieceSymbol;
  color: Color;
}

export interface PieceMove {
  square: string;
  color: Color;
  name: PieceSymbol;
}

export interface ChangeEvent {
  from: string;
  to?: string;
  piece: string;
}

export type Square = `${"a" | "b" | "c" | "d" | "e" | "f" | "g" | "h"}${
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"}`;

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

export type RenderPieceCallback = (
  square: string,
  piece: PieceSymbol,
  color: Color
) => string;

export type CoordinatesPlacement = "inside" | "outside" | "hidden";
export type CoordinatesDirection = "left" | "right"; // | "double";

export interface ChessboardProps {
  fen?: string;
  orientation?: Color;
  duration?: number;
  coordinatesDir?: CoordinatesDirection;
  coordinates?: CoordinatesPlacement;
  interactive?: boolean;
  visibility?: InputColor;
  mode?: "auto" | "move" | "press";
  turn?: InputColor;
  alignPiece?: boolean;
}

export type DoneFn = (is: boolean) => any;

export interface PieceMove {
  square: string;
  color: Color;
  name: PieceSymbol;
}

export interface ChangeEvent {
  from: string;
  to?: string;
  piece: string;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}
