import type { ShallowRef } from "vue";
import type { UseChessboardPieces } from "./pieces";
import { useProvider } from "./provider";
import type { Color } from "../types";

export interface ChessboardContext {
  orientation: ShallowRef<Color>;
  pieces: UseChessboardPieces;
}

export const [provideContext, useContext] =
  useProvider<ChessboardContext>("chessboard-context");
