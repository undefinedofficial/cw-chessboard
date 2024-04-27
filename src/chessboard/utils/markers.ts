export const enum MARKER {
  NONE = "none",
  FRAME = "marker-frame",
  CIRCLE = "marker-circle",
  DOT = "marker-dot",
  SQUARE = "marker-square",
  ARROW = "arrow",
  TEXT = "marker-text",
}

interface IMarker {
  id?: string;
  square: string;
  color?: "red" | "green" | "blue";
}

export interface MarkerPoint extends IMarker {
  type: MARKER.FRAME | MARKER.CIRCLE | MARKER.DOT | MARKER.SQUARE | MARKER.NONE;
}
export interface MarkerArrow extends IMarker {
  type: MARKER.ARROW;
  toSquare: string;
  size?: number;
}

export type Marker = MarkerPoint | MarkerArrow;
