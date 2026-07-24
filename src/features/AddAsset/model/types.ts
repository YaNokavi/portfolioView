type Action<Type extends string, Payload = unknown> = { type: Type } & Payload;

export type ModalMode =
  | Action<"add">
  | Action<"edit", { symbol: string }>
  | null;
