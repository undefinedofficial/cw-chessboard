import type { Meta, StoryObj } from "@storybook/vue3";
import { fn } from "@storybook/test";

import Chessboard from "../chessboard/Chessboard.vue";

const meta = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Chessboard",
  component: Chessboard,
  argTypes: {
    fen: {
      control: "text",
      defaultValue: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    },
    orientation: {
      control: "select",
      options: ["w", "b"],
    },
    coordMode: {
      control: "select",
      options: ["none", "left", "right"],
    },
    duration: {
      control: "number",
      defaultValue: 150,
    },
    borderSize: {
      control: "number",
      defaultValue: 12,
    },
    roundSize: {
      control: "number",
      defaultValue: 12,
    },
    fontSize: {
      control: "number",
      defaultValue: 32,
    },
    coordOutside: {
      control: "boolean",
      defaultValue: false,
    },
    alphaPiece: {
      control: "boolean",
      defaultValue: false,
    },
    boardSet: {
      control: "select",
      options: ["default", "blue", "green", "sport"],
    },
    pieceSet: {
      control: "select",
      options: ["default", "grady", "staunty", "stock"],
    },
    resize: {
      control: "select",
      options: [false, true, "width", "height"],
    },
    onMoves: fn,
    onReady: fn,
  },
  args: {
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    orientation: "w",
    coordMode: "left",
    duration: 250,
    borderSize: 1,
    roundSize: 12,
    fontSize: 32,
    boardSet: "default",
    pieceSet: "default",
  },
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  render: (args: any) => ({
    components: { Chessboard },
    setup() {
      return { args };
    },
    template: '<div style="width: 90vw; height: 90vh"><chessboard v-bind="args"/></div>',
  }),
} satisfies Meta<typeof Chessboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const View: Story = {
  args: {},
};
