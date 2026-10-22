import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
} from "react";
import { cx } from "./actions";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Calls back once when the element first scrolls into view. */
function useInView<T extends Element>(enabled = true) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(!enabled);
  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);
  return [ref, inView] as const;
}

export interface GradientTextProps extends HTMLAttributes<HTMLSpanElement> {
  /** Slowly pans the gradient across the text. */
  animate?: boolean;
}
export function GradientText({
  animate = true,
  className,
  ...props
}: GradientTextProps) {
  return (
    <span
      className={cx("ui-gradient-text", className)}
      data-animate={animate || undefined}
      {...props}
    />
  );
}

export interface ShinyTextProps extends HTMLAttributes<HTMLSpanElement> {
  /** Seconds per sweep. */
  speed?: number;
}
export function ShinyText({
  speed = 3,
  className,
  style,
  ...props
}: ShinyTextProps) {
  return (
    <span
      className={cx("ui-shiny-text", className)}
      style={{ "--ui-shine-speed": `${speed}s`, ...style } as CSSProperties}
      {...props}
    />
  );
}

export interface SplitTextProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> {
  text: string;
  by?: "char" | "word";
  /** Milliseconds between each piece. */
  stagger?: number;
  /** Milliseconds before the first piece. */
  delay?: number;
  /** Wait until the text scrolls into view. */
  whenVisible?: boolean;
}
export function SplitText({
  text,
  by = "char",
  stagger = 28,
  delay = 0,
  whenVisible = true,
  className,
  ...props
}: SplitTextProps) {
  const [ref, inView] = useInView<HTMLSpanElement>(whenVisible);
  const words = text.split(" ");
  let index = 0;
  return (
    <span
      ref={ref}
      className={cx("ui-split-text", className)}
      data-visible={inView || undefined}
      {...props}
    >
      <span className="ui-sr-only">{text}</span>
      {words.map((word, w) => (
        <span key={w} className="ui-split-word" aria-hidden="true">
          {(by === "word" ? [word] : Array.from(word)).map((piece, p) => (
            <span
              key={p}
              className="ui-split-piece"
              style={
                {
                  "--ui-delay": `${delay + index++ * stagger}ms`,
                } as CSSProperties
              }
            >
              {piece}
            </span>
          ))}
          {w < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

export interface ScrambleTextProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> {
  text: string;
  /** Milliseconds for the whole decode. */
  duration?: number;
  /** Scramble again whenever the pointer enters. */
  replayOnHover?: boolean;
}
export function ScrambleText({
  text,
  duration = 700,
  replayOnHover = true,
  className,
  onMouseEnter,
  ...props
}: ScrambleTextProps) {
  const [ref, inView] = useInView<HTMLSpanElement>();
  const [shown, setShown] = useState(text);
  const frame = useRef(0);
  function run() {
    cancelAnimationFrame(frame.current);
    if (
      prefersReducedMotion() ||
      typeof requestAnimationFrame === "undefined"
    ) {
      setShown(text);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const settled = Math.floor(progress * text.length);
      setShown(
        Array.from(text, (ch, i) =>
          i < settled || ch === " "
            ? ch
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        ).join(""),
      );
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }
  useEffect(() => {
    if (inView) run();
    return () => cancelAnimationFrame(frame.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, text]);
  return (
    <span
      ref={ref}
      className={cx("ui-scramble-text", className)}
      onMouseEnter={(e) => {
        onMouseEnter?.(e);
        if (replayOnHover) run();
      }}
      {...props}
    >
      <span className="ui-sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}

export interface TypewriterProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> {
  words: string[];
  /** Milliseconds per typed character. */
  speed?: number;
  /** Milliseconds a finished word stays before deleting. */
  pause?: number;
}
export function Typewriter({
  words,
  speed = 70,
  pause = 1600,
  className,
  ...props
}: TypewriterProps) {
  const list = words.length ? words : [""];
  const [word, setWord] = useState(0);
  const [length, setLength] = useState(() =>
    prefersReducedMotion() ? list[0].length : 0,
  );
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const current = list[word % list.length];
    let wait = deleting ? speed / 2 : speed;
    if (!deleting && length === current.length) wait = pause;
    const timer = setTimeout(() => {
      if (!deleting && length === current.length) setDeleting(list.length > 1);
      else if (deleting && length === 0) {
        setDeleting(false);
        setWord((w) => (w + 1) % list.length);
      } else setLength((l) => l + (deleting ? -1 : 1));
    }, wait);
    return () => clearTimeout(timer);
  }, [length, deleting, word, list, speed, pause]);
  return (
    <span className={cx("ui-typewriter", className)} {...props}>
      <span className="ui-sr-only">{list.join(", ")}</span>
      <span aria-hidden="true">
        {list[word % list.length].slice(0, length)}
      </span>
      <span className="ui-typewriter-caret" aria-hidden="true" />
    </span>
  );
}

export interface CountUpProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> {
  value: number;
  /** Milliseconds to reach the value. */
  duration?: number;
  /** Decimal places to show. */
  decimals?: number;
  prefix?: string;
  suffix?: string;
}
export function CountUp({
  value,
  duration = 1200,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
  ...props
}: CountUpProps) {
  const [ref, inView] = useInView<HTMLSpanElement>();
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (
      prefersReducedMotion() ||
      typeof requestAnimationFrame === "undefined"
    ) {
      setCurrent(value);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setCurrent(value * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration]);
  const format = (n: number) =>
    `${prefix}${n.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;
  return (
    <span ref={ref} className={cx("ui-count-up", className)} {...props}>
      <span className="ui-sr-only">{format(value)}</span>
      <span aria-hidden="true">{format(current)}</span>
    </span>
  );
}
