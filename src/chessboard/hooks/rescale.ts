import { type Ref, onMounted, onUnmounted, ref, type MaybeRefOrGetter, toValue } from "vue";

export function useRescale(element: MaybeRefOrGetter<HTMLElement | null>) {
  const size = ref<number>(1024);

  let hScale: any;
  function Rescale() {
    if (hScale) clearTimeout(hScale);
    hScale = setTimeout(() => {
      const el = toValue(element);
      if (!el) return console.warn("cw-chessboard: no element provided for rescale");

      const { height, width } = el.getBoundingClientRect();
      if (width < height) {
        size.value = width;
      } else {
        size.value = height;
      }
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
