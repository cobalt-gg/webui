import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
} from "react";
import { cx } from "./actions";

/*
 * Text effects are still until someone clicks them, then play once. The text
 * itself is always readable and selectable, and assistive technology reads the
 * final string exactly once.
 */

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Restarts the element's CSS animation by toggling data-playing. */
function replay(el: HTMLElement) {
  el.removeAttribute("data-playing");
  void el.offsetWidth;
  el.setAttribute("data-playing", "");
}

type ClickHandler = (event: MouseEvent<HTMLSpanElement>) => void;
function withReplay(onClick?: ClickHandler): ClickHandler {
  return (event) => {
    replay(event.currentTarget);
    onClick?.(event);
  };
}
const stop = (event: { currentTarget: HTMLElement; target: EventTarget }) => {
  if (event.target === event.currentTarget)
    event.currentTarget.removeAttribute("data-playing");
};

export type GradientTextProps = HTMLAttributes<HTMLSpanElement>;
/** Cobalt gradient text. Click to sweep the gradient across it. */
export function GradientText({
  className,
  onClick,
  ...props
}: GradientTextProps) {
  return (
    <span
      className={cx("ui-gradient-text", className)}
      onClick={withReplay(onClick)}
      onAnimationEnd={stop}
      {...props}
    />
  );
}

export type ShinyTextProps = HTMLAttributes<HTMLSpanElement>;
/** Muted text. Click to run a soft highlight across it. */
export function ShinyText({ className, onClick, ...props }: ShinyTextProps) {
  return (
    <span
      className={cx("ui-shiny-text", className)}
      onClick={withReplay(onClick)}
      onAnimationEnd={stop}
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
}
/** Text split into pieces. Click to send a wave through them. */
export function SplitText({
  text,
  by = "char",
  stagger = 24,
  className,
  onClick,
  ...props
}: SplitTextProps) {
  const words = text.split(" ");
  let index = 0;
  return (
    <span
      className={cx("ui-split-text", className)}
      onClick={(event) => {
        // Only the last piece's animation clears the flag.
        replay(event.currentTarget);
        onClick?.(event);
      }}
      onAnimationEnd={(event) => {
        if ((event.target as HTMLElement).dataset.last !== undefined)
          event.currentTarget.removeAttribute("data-playing");
      }}
      {...props}
    >
      <span className="ui-sr-only">{text}</span>
      {words.map((word, w) => (
        <span key={w} className="ui-split-word" aria-hidden="true">
          {(by === "word" ? [word] : Array.from(word)).map((piece, p, all) => {
            const last = w === words.length - 1 && p === all.length - 1;
            return (
              <span
                key={p}
                className="ui-split-piece"
                data-last={last || undefined}
                style={
                  { "--ui-delay": `${index++ * stagger}ms` } as CSSProperties
                }
              >
                {piece}
              </span>
            );
          })}
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
}
/** Click to scramble the text and let it decode back into place. */
export function ScrambleText({
  text,
  duration = 600,
  className,
  onClick,
  ...props
}: ScrambleTextProps) {
  const [shown, setShown] = useState(text);
  const frame = useRef(0);
  useEffect(() => {
    setShown(text);
    return () => cancelAnimationFrame(frame.current);
  }, [text]);
  function run() {
    cancelAnimationFrame(frame.current);
    if (prefersReducedMotion() || typeof requestAnimationFrame === "undefined")
      return;
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
  return (
    <span
      className={cx("ui-scramble-text", className)}
      onClick={(event) => {
        run();
        onClick?.(event);
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
}
/** Shows one word. Click to delete it and type the next. */
export function Typewriter({
  words,
  speed = 55,
  className,
  onClick,
  ...props
}: TypewriterProps) {
  const list = words.length ? words : [""];
  const [word, setWord] = useState(0);
  const [length, setLength] = useState(list[0].length);
  const [phase, setPhase] = useState<"idle" | "deleting" | "typing">("idle");
  const current = list[word % list.length];
  useEffect(() => {
    if (phase === "idle") return;
    const timer = setTimeout(
      () => {
        if (phase === "deleting") {
          if (length > 0) setLength(length - 1);
          else {
            setWord((w) => (w + 1) % list.length);
            setPhase("typing");
          }
        } else if (length < current.length) setLength(length + 1);
        else setPhase("idle");
      },
      phase === "deleting" ? speed / 2 : speed,
    );
    return () => clearTimeout(timer);
  }, [phase, length, current, list.length, speed]);
  return (
    <span
      className={cx("ui-typewriter", className)}
      data-typing={phase !== "idle" || undefined}
      onClick={(event) => {
        if (list.length > 1 && phase === "idle") {
          if (prefersReducedMotion()) {
            const next = (word + 1) % list.length;
            setWord(next);
            setLength(list[next].length);
          } else setPhase("deleting");
        }
        onClick?.(event);
      }}
      {...props}
    >
      <span className="ui-sr-only" aria-live="polite">
        {phase === "idle" ? current : ""}
      </span>
      <span aria-hidden="true">{current.slice(0, length)}</span>
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
/** Shows a number. Click to count it up from zero again. */
export function CountUp({
  value,
  duration = 900,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
  onClick,
  ...props
}: CountUpProps) {
  const [current, setCurrent] = useState(value);
  const frame = useRef(0);
  useEffect(() => {
    setCurrent(value);
    return () => cancelAnimationFrame(frame.current);
  }, [value]);
  function run() {
    cancelAnimationFrame(frame.current);
    if (prefersReducedMotion() || typeof requestAnimationFrame === "undefined")
      return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setCurrent(value * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }
  const format = (n: number) =>
    `${prefix}${n.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;
  return (
    <span
      className={cx("ui-count-up", className)}
      onClick={(event) => {
        run();
        onClick?.(event);
      }}
      {...props}
    >
      <span className="ui-sr-only">{format(value)}</span>
      <span aria-hidden="true">{format(current)}</span>
    </span>
  );
}
