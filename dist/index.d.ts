import { ComponentOptionsMixin } from 'vue';
import { ComponentProvideOptions } from 'vue';
import { DefineComponent } from 'vue';
import { PublicProps } from 'vue';
import { ShallowRef } from 'vue';

declare const __VLS_component: DefineComponent<ChessboardSquareProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<ChessboardSquareProps> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLDivElement>;

declare type __VLS_Props = {
    color?: Color;
};

declare type __VLS_Props_2 = {
    square: string;
    toSquare: string;
    size?: number;
    offset?: number;
};

declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        default?(_: {}): any;
    };
    refs: {};
    rootEl: HTMLDivElement;
};

declare type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;

declare type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare type __VLS_WithTemplateSlots_2<T, S> = T & {
    new (): {
        $slots: S;
    };
};

export declare type AbsolutePoint = {
    x: number;
    y: number;
};

export declare interface ChangeEvent {
    from: string;
    to?: string;
    piece: string;
}

export declare interface ChangeEvent {
    from: string;
    to?: string;
    piece: string;
}

export declare const Chessboard: __VLS_WithTemplateSlots<DefineComponent<ChessboardProps, {
pieces: {
getPieceByIndex: (idx: number) => Pick<Piece, "color" | "name"> | null;
getPieceByPoint: (p: Point) => Pick<Piece, "color" | "name"> | null;
setFen: (newFen: string, animate?: boolean) => Promise<unknown>;
setDuration: (newDuration: number) => void;
setOrientation: (newOrientation: Color, animate?: boolean) => Promise<[void | undefined, unknown] | undefined>;
setContainer: (newContainer: HTMLElement) => void;
setVisibility: (newVisibility: InputColor, animate?: boolean) => Promise<unknown>;
terminate: () => void;
};
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
ready: (args_0: {
getPieceByIndex: (idx: number) => Pick<Piece, "color" | "name"> | null;
getPieceByPoint: (p: Point) => Pick<Piece, "color" | "name"> | null;
setFen: (newFen: string, animate?: boolean) => Promise<unknown>;
setDuration: (newDuration: number) => void;
setOrientation: (newOrientation: Color, animate?: boolean) => Promise<[void | undefined, unknown] | undefined>;
setContainer: (newContainer: HTMLElement) => void;
setVisibility: (newVisibility: InputColor, animate?: boolean) => Promise<unknown>;
terminate: () => void;
}) => any;
moves: (moves: ChangeEvent[]) => any;
beforemove: (square: string, piece: PieceSymbol, done: DoneFn) => any;
aftermove: (fromSquare: string, toSquare: string, type: InputType, done: DoneFn) => any;
cancelmove: (square: string) => any;
entersquare: (square: string) => any;
leavesquare: (square: string) => any;
oversquare: (square: string) => any;
outsquare: (square: string) => any;
}, string, PublicProps, Readonly<ChessboardProps> & Readonly<{
onReady?: ((args_0: {
getPieceByIndex: (idx: number) => Pick<Piece, "color" | "name"> | null;
getPieceByPoint: (p: Point) => Pick<Piece, "color" | "name"> | null;
setFen: (newFen: string, animate?: boolean) => Promise<unknown>;
setDuration: (newDuration: number) => void;
setOrientation: (newOrientation: Color, animate?: boolean) => Promise<[void | undefined, unknown] | undefined>;
setContainer: (newContainer: HTMLElement) => void;
setVisibility: (newVisibility: InputColor, animate?: boolean) => Promise<unknown>;
terminate: () => void;
}) => any) | undefined;
onMoves?: ((moves: ChangeEvent[]) => any) | undefined;
onBeforemove?: ((square: string, piece: PieceSymbol, done: DoneFn) => any) | undefined;
onAftermove?: ((fromSquare: string, toSquare: string, type: InputType, done: DoneFn) => any) | undefined;
onCancelmove?: ((square: string) => any) | undefined;
onEntersquare?: ((square: string) => any) | undefined;
onLeavesquare?: ((square: string) => any) | undefined;
onOversquare?: ((square: string) => any) | undefined;
onOutsquare?: ((square: string) => any) | undefined;
}>, {
orientation: Color;
duration: number;
coordinates: CoordinatesPlacement;
visibility: InputColor;
mode: "auto" | "move" | "press";
turn: InputColor;
}, {}, {}, {}, string, ComponentProvideOptions, false, {
piecesContainer: HTMLDivElement;
}, HTMLDivElement>, {
    before?(_: {}): any;
    default?(_: {}): any;
    after?(_: {}): any;
}>;

export declare const ChessboardArrow: DefineComponent<__VLS_Props_2, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<__VLS_Props_2> & Readonly<{}>, {
size: number;
offset: number;
}, {}, {}, {}, string, ComponentProvideOptions, false, {}, SVGSVGElement>;

export declare const ChessboardCircle: DefineComponent<ChessboardSquareProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<ChessboardSquareProps> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLDivElement>;

export declare interface ChessboardContext {
    orientation: ShallowRef<Color>;
    pieces: UseChessboardPieces;
}

export declare const ChessboardDot: DefineComponent<ChessboardSquareProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<ChessboardSquareProps> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLDivElement>;

export declare const ChessboardFrame: DefineComponent<ChessboardSquareProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<ChessboardSquareProps> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLDivElement>;

export declare interface ChessboardProps {
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

export declare const ChessboardSquare: __VLS_WithTemplateSlots_2<typeof __VLS_component, __VLS_TemplateResult["slots"]>;

declare interface ChessboardSquareProps {
    square: string;
    above?: boolean;
}

export declare type Color = "w" | "b";

export declare type CoordinatesDirection = "left" | "right";

export declare type CoordinatesPlacement = "inside" | "outside" | "hidden";

export declare type DoneFn = (is: boolean) => any;

export declare type InputColor = "all" | "none" | Color;

export declare type InputMode = "auto" | "move" | "press";

export declare type InputType = "drag" | "click";

export declare type MovePieceFunction = (from: Point, to: Point, animated?: boolean, type?: string) => Promise<void>;

export declare interface Piece extends Point {
    name: PieceSymbol;
    color: Color;
}

export declare interface Piece extends Point {
    name: PieceSymbol;
    color: Color;
}

export declare type PieceCode = `${Color}${Lowercase<PieceSymbol>}`;

export declare interface PieceMove {
    square: string;
    color: Color;
    name: PieceSymbol;
}

export declare interface PieceMove {
    square: string;
    color: Color;
    name: PieceSymbol;
}

export declare type PieceSymbol = "k" | "q" | "r" | "n" | "b" | "p" | "K" | "Q" | "R" | "N" | "B" | "P";

export declare interface Point {
    x: number;
    y: number;
}

export declare const PromotionDialog: DefineComponent<__VLS_Props, {
require: (square: string) => Promise<"b" | "q" | "r" | "n">;
abort: () => void;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, false, {}, any>;

export declare type Rect = Point & {
    width: number;
    height: number;
};

export declare interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

export declare type Square = `${"a" | "b" | "c" | "d" | "e" | "f" | "g" | "h"}${"1" | "2" | "3" | "4" | "5" | "6" | "7" | "8"}`;

export declare type SquarePoint = {
    x: number;
    y: number;
};

export declare type UseChessboardPieces = ReturnType<typeof usePieces>;

export declare const useContext: () => ChessboardContext;

declare function usePieces({ onOrientationChange, onChange, }: UsePiecesOptions): {
    getPieceByIndex: (idx: number) => Pick<Piece, "color" | "name"> | null;
    getPieceByPoint: (p: Point) => Pick<Piece, "color" | "name"> | null;
    setFen: (newFen: string, animate?: boolean) => Promise<unknown>;
    setDuration: (newDuration: number) => void;
    setOrientation: (newOrientation: Color, animate?: boolean) => Promise<[void | undefined, unknown] | undefined>;
    setContainer: (newContainer: HTMLElement) => void;
    setVisibility: (newVisibility: InputColor, animate?: boolean) => Promise<unknown>;
    terminate: () => void;
};

declare interface UsePiecesOptions {
    /**
     * onOrientationChange
     * @description orientation switch callback.
     * @param orientation Color "w" | "b"
     */
    onOrientationChange?: (orientation: Color) => void;
    /**
     * onChange
     * @description callback before when piece move
     * @param moves Array<ChangeEvent> changes pieces for the actual position.
     */
    onChange?: (moves: ChangeEvent[]) => void;
}

export { }
