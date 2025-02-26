import "./style/main.css";

export type * from "./types";
import type { UseChessboardPieces } from "./hooks/pieces";
import { useContext, type ChessboardContext } from "./hooks/context";

import Chessboard from "./components/Chessboard.vue";
import ChessboardSurface from "./components/ChessboardSurface.vue";
import PromotionDialog from "./components/PromotionDialog.vue";
import ChessboardControl from "./components/ChessboardControl.vue";

import ChessboardPieces from "./components/ChessboardPieces.vue";
import ChessboardPiece from "./components/ChessboardPiece.vue";

import ChessboardSquare from "./components/ChessboardSquare.vue";
import ChessboardArrow from "./components/ChessboardArrow.vue";
import ChessboardFrame from "./components/ChessboardFrame.vue";
import ChessboardDot from "./components/ChessboardDot.vue";
import ChessboardCircle from "./components/ChessboardCircle.vue";

export {
  type UseChessboardPieces,
  useContext,
  type ChessboardContext,
  Chessboard,
  ChessboardSurface,
  PromotionDialog,
  ChessboardControl,
  ChessboardSquare,
  ChessboardPieces,
  ChessboardPiece,
  ChessboardArrow,
  ChessboardDot,
  ChessboardCircle,
  ChessboardFrame,
};
