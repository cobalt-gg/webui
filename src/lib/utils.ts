import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type Ref,
  type RefCallback,
} from "react";

/** Join class names, skipping falsy values. */
export function cx(...parts: unknown[]) {
  return parts.filter((p): p is string => typeof p === "string" && p.length > 0).join(" ");
}

/** Controlled/uncontrolled state in one hook. */
export function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
) {
  const [inner, setInner] = useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;
  const latest = useRef(current);
  latest.current = current;
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === "function"
          ? (next as (prev: T) => T)(latest.current)
          : next;
      if (Object.is(resolved, latest.current)) return;
      if (!controlled) setInner(resolved);
      latest.current = resolved;
      onChange?.(resolved);
    },
    [controlled, onChange],
  );
  return [current, set] as const;
}

/** True when the user asked the OS for less motion. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const listen = () => setReduced(query.matches);
    query.addEventListener?.("change", listen);
    return () => query.removeEventListener?.("change", listen);
  }, []);
  return reduced;
}

export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as { current: T | null }).current = node;
    }
  };
}

/** Stable id, preferring one passed by the consumer. */
export function useFieldId(id?: string) {
  const generated = useId();
  return id ?? `ui-${generated.replace(/:/g, "")}`;
}

/**
 * Click ripple. Spawns a short-lived span at the pointer inside the target.
 * The target needs `position: relative; overflow: hidden` (class `ui-rippled`).
 */
export function ripple(event: ReactMouseEvent<HTMLElement>) {
  const target = event.currentTarget;
  if (
    typeof window === "undefined" ||
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  )
    return;
  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const dot = document.createElement("span");
  dot.className = "ui-ripple";
  dot.setAttribute("aria-hidden", "true");
  const x = event.clientX ? event.clientX - rect.left : rect.width / 2;
  const y = event.clientY ? event.clientY - rect.top : rect.height / 2;
  dot.style.cssText = `width:${size}px;height:${size}px;left:${x - size / 2}px;top:${y - size / 2}px`;
  target.appendChild(dot);
  window.setTimeout(() => dot.remove(), 600);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${value.toFixed(value >= 100 ? 0 : 1)} ${units[unit]}`;
}
