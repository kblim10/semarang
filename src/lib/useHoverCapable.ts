"use client";

import { useEffect, useState } from "react";

/**
 * True only on devices that have a real pointer (mouse/trackpad).
 * Used to gate cursor-driven effects like the 3D tilt on gallery cards so
 * touch devices fall back to a lighter, swipe-friendly presentation.
 */
export function useHoverCapable() {
  const [hoverCapable, setHoverCapable] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setHoverCapable(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return hoverCapable;
}
