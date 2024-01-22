import { onBeforeUnmount, onMounted, toValue, type MaybeRefOrGetter } from "vue";
import type { Rectangle } from "..";
import { getPointInElement } from "../utils/getPointInElement";

export interface UseControlOptions {
  el: MaybeRefOrGetter<HTMLElement>;
  onStart: (point: Rectangle) => boolean;
  onMove: (point: Rectangle) => void;
  onEnd: (point: Rectangle) => void;
  onCancel: () => void;
}

export function useControl({ el, onStart, onMove, onEnd, onCancel }: UseControlOptions) {
  const onPointerDown = (ev: PointerEvent) => {
    ev.preventDefault();
    if (!ev.isPrimary) return;

    const point = getPointInElement(toValue(el), ev);
    if (!onStart(point)) return;

    // const pointerId = ev.pointerId;
    //    ( ev.target as HTMLElement)?.setPointerCapture(pointerId);

    document.addEventListener("pointermove", onPointerMove, { capture: true });
    document.addEventListener("pointerup", onPointerUp, { capture: true });
    document.addEventListener("pointercancel", onPointerCancel, { capture: true });
  };

  const onPointerMove = (ev: PointerEvent) => {
    const point = getPointInElement(toValue(el), ev);
    onMove(point);
  };

  const onPointerUp = (ev: PointerEvent) => {
    document.removeEventListener("pointermove", onPointerMove, { capture: true });
    document.removeEventListener("pointerup", onPointerUp, { capture: true });
    document.removeEventListener("pointercancel", onPointerCancel, { capture: true });

    const point = getPointInElement(toValue(el), ev);
    onEnd(point);
  };

  const onPointerCancel = (ev: PointerEvent) => {
    document.removeEventListener("pointermove", onPointerMove, { capture: true });
    document.removeEventListener("pointerup", onPointerUp, { capture: true });
    document.removeEventListener("pointercancel", onPointerCancel, { capture: true });
    onCancel();
  };

  onMounted(() => {
    const element = toValue(el);
    if (!element) return console.warn("Element not found");
    element.style.touchAction = "none";
    element.addEventListener("pointerdown", onPointerDown);
  });
  onBeforeUnmount(() => {
    const element = toValue(el);
    if (!element) return console.warn("Element not found");

    element.style.touchAction = "auto";
    element.removeEventListener("pointerdown", onPointerDown);
  });
  return {};
}
