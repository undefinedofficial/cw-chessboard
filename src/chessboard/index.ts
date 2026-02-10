// import "./style/main.css";

export type * from "./types";
import type { UseChessboardPieces } from "./hooks/pieces";
import { useContext, type ChessboardContext } from "./hooks/context";

import Chessboard from "./components/Chessboard.vue";
import PromotionDialog from "./components/PromotionDialog.vue";

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
  PromotionDialog,
  ChessboardSquare,
  ChessboardArrow,
  ChessboardDot,
  ChessboardCircle,
  ChessboardFrame,
};
