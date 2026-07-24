import { useState } from "react";
import { ModalMode } from "./types";

export const useAssetModal = () => {
  const [mode, setMode] = useState<ModalMode>(null);

  return {
    mode,
    isOpen: mode !== null,
    openAdd: () => setMode({ type: "add" }),
    openEdit: (symbol: string) => setMode({ type: "edit", symbol }),
    close: () => setMode(null),
  };
};
