import { inject, provide } from "vue";

export function useProvider<T>(key: string): [(value: T) => void, () => T] {
  const transmitter = (value: T) => provide<T, string>(key, value);

  const receiver = (): T => {
    const value = inject<Readonly<T>>(key);
    if (value === undefined) throw new Error(`Provider "${key}" not found.`);
    return value;
  };

  return [transmitter, receiver] as const;
}
