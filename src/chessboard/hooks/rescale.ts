import { type Ref, onMounted, onUnmounted, ref, type MaybeRefOrGetter, toValue } from "vue";
import type { ChessboardResize } from "../types";

export function useRescale(
  element: MaybeRefOrGetter<HTMLElement | null>,
  mode: MaybeRefOrGetter<ChessboardResize>
) {
  const size = ref<number>(0);

  let hScale: any;
  function Rescale() {
    const modeValue = toValue(mode);
    if (!modeValue) return;

    if (hScale) clearTimeout(hScale);
    hScale = setTimeout(() => {
      const el = toValue(element);
      if (!el) return console.warn("cw-chessboard: no element provided for rescale");

      const { height, width } = el.getBoundingClientRect();
      if (modeValue === "width") {
        size.value = width;
        return;
      } else if (modeValue === "height") {
        size.value = height;
        return;
      }

      size.value = width < height ? width : height;

      if (width === 0) size.value = height;
      else if (height === 0) size.value = width;
    }, 10);
  }

  let offRescale: Function;
  onMounted(() => {
    if (window.ResizeObserver) {
      const observer = new ResizeObserver(Rescale);
      observer.observe(toValue(element)!);
      offRescale = () => observer.disconnect();
    } else {
      window.addEventListener("resize", Rescale);
      offRescale = () => window.removeEventListener("resize", Rescale);
    }
    Rescale();
  });
  onUnmounted(() => offRescale?.());
  return {
    size,
    Rescale,
  };
}
