import { type Ref, onMounted, onUnmounted, ref, type MaybeRefOrGetter, toValue } from "vue";

export function useRescale(element: MaybeRefOrGetter<HTMLElement | null>) {
  const brdSize = ref<number>(1024);
  const ratioSize = ref<number>(1);
  function getClientSize(element: HTMLElement) {
    return {
      width: element.clientWidth,
      height: element.clientHeight,
    };
  }

  let hScale: any;
  function Rescale() {
    if (hScale) clearTimeout(hScale);
    hScale = setTimeout(() => {
      const el = toValue(element);
      if (!el) return;

      let size;
      let field = el;
      while (!size) {
        if (field) {
          size = getClientSize(field);
        } else {
          size = { width: 128, height: 128 };
          break;
        }
        field = field.parentElement!;
      }
      const { height, width } = size;
      if (width < height) {
        brdSize.value = width;
        ratioSize.value = width / 900;
        // ratioFontSize.value = height / width
      } else {
        brdSize.value = height;
        ratioSize.value = height / 900;
        // ratioFontSize.value = width / height;
      }
      if (width === 0) brdSize.value = height;
      else if (height === 0) brdSize.value = width;
    }, 10);
  }

  let offRescale: Function;
  onMounted(() => {
    if (window.ResizeObserver) {
      const observer = new ResizeObserver(Rescale);
      observer.observe(toValue(element));
      offRescale = () => observer.disconnect();
    } else {
      window.addEventListener("resize", Rescale);
      offRescale = () => window.removeEventListener("resize", Rescale);
    }
    Rescale();
  });
  onUnmounted(() => offRescale?.());
  return {
    brdSize,
    ratioSize,
    Rescale,
  };
}
