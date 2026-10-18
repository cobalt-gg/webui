import { createContext, useContext } from "react";
/** Optional portal target for locally themed regions and embedded applications. */
const PortalContainerContext = createContext<HTMLElement | null>(null);
export const PortalContainerProvider = PortalContainerContext.Provider;
export const usePortalContainer = () => useContext(PortalContainerContext);
