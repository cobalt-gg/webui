import { createContext, useContext } from "react";

const PortalContext = createContext<HTMLElement | null>(null);

/** Render overlays into `value` instead of document.body (for themed regions). */
export const PortalContainerProvider = PortalContext.Provider;

export function usePortalContainer() {
  return useContext(PortalContext) ?? undefined;
}
