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

export type RenderPieceCallback = (square: string, piece: PieceSymbol, color: Color) => string;

export type CoordMode = "none" | "left" | "right"; // | "double";

export type ChessboardResize = true | false | "width" | "height";

export interface ChessboardProps {
  fen?: string;
  orientation?: Color;
  duration?: number;
  borderSize?: number;
  roundSize?: number;
  fontSize?: number;
  coordOutside?: boolean;
  coordMode?: CoordMode;
  alphaPiece?: boolean;
  boardSet?: string;
  pieceSet?: string;
  pieceWhiteSet?: string;
  pieceBlackSet?: string;
  resize?: ChessboardResize;
  visibility?: InputColor;
  onRenderPiece?: RenderPieceCallback;
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

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}
