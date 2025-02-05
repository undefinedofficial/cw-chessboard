import type { Ref } from "vue";
import type { ChessboardPieces } from "./pieces";
import { useProvider } from "./provider";
import type { Color } from "../types";

export interface ChessboardContext {
  container: Ref<HTMLElement | undefined>;
  chessboard: Ref<HTMLElement | undefined>;
  orientation: Ref<Color>;
  pieces: ChessboardPieces;
  boardSet: Ref<string>;
  pieceSet: Ref<string>;
}

export const [provideContext, useContext] = useProvider<ChessboardContext>("chessboard-context");
