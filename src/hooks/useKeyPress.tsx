import React from "react";

interface useKeyPressArgs {
  key: string;
  onKeyPressed: () => void;
}

export function useKeyPress({ key, onKeyPressed }: useKeyPressArgs) {
  React.useEffect(() => {
    const keyDownHandler = (e: globalThis.KeyboardEvent) => {
      if (e.key === key) {
        e.preventDefault();
        onKeyPressed();
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [key, onKeyPressed]);
}
