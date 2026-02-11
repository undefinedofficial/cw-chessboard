import { computed, toValue, type MaybeRefOrGetter } from "vue";

export function useCssVars(vars: MaybeRefOrGetter<Record<string, string>>) {
  const styleString = computed(() => {
    const _vars = toValue(vars);
    return Object.entries(_vars)
      .map(([key, value]) => `--${key}: ${value};`)
      .join("\n");
  });
  return styleString;
}
