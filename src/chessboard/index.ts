export type * from "./types";
export * from "./utils/markers";

import Chessboard from "./Chessboard.vue";
import PromotionDialog from "./PromotionDialog.vue";
import ChessboardControl from "./ChessboardControl.vue";
import ChessboardMarkers from "./ChessboardMarkers.vue";
import ChessboardSquare from "./ChessboardSquare.vue";
import type { ChessboardPieces } from "./hooks/pieces";

export {
  Chessboard,
  PromotionDialog,
  ChessboardControl,
  ChessboardMarkers,
  ChessboardSquare,
  type ChessboardPieces,
};
