import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cx, useReducedMotion } from "../lib/utils";

type SpanProps = Omit<HTMLAttributes<HTMLSpanElement>, "children">;

/** Replays an animation each time the element is clicked or activated by key. */
function usePlay(onPlay?: () => void) {
  const [run, setRun] = useState(0);
  const play = () => {
    setRun((n) => n + 1);
    onPlay?.();
  };
  return {
    run,
    play,
    triggerProps: {
      role: "button" as const,
      tabIndex: 0,
      onClick: play,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          play();
        }
      },
    },
  };
}

export interface SplitTextProps extends SpanProps {
  text: string;
  by?: "char" | "word";
  /** ms between pieces */
  stagger?: number;
}

/** Letters or words that rise in sequence when clicked. */
export function SplitText({
  text,
  by = "char",
  stagger = 24,
  className,
  ...props
}: SplitTextProps) {
  const reduced = useReducedMotion();
  const { run, triggerProps } = usePlay();
  const pieces = by === "word" ? text.split(/(\s+)/) : Array.from(text);
  return (
    <span
      className={cx("ui-split", className)}
      aria-label={text}
      {...triggerProps}
      {...props}
    >
      {pieces.map((piece, i) => (
        <span
          key={`${run}-${i}`}
          aria-hidden="true"
          className={cx("ui-split-piece", run > 0 && !reduced && "is-playing")}
          style={{ animationDelay: `${i * stagger}ms` } as CSSProperties}
        >
          {piece === " " ? " " : piece}
        </span>
      ))}
    </span>
  );
}

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*+=<>/";

export interface ScrambleTextProps extends SpanProps {
  text: string;
  /** ms for the decode */
  duration?: number;
}

/** Scrambles into glyphs and decodes back, left to right, on click. */
export function ScrambleText({
  text,
  duration = 700,
  className,
  ...props
}: ScrambleTextProps) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(text);
  const frame = useRef(0);
  useEffect(() => setShown(text), [text]);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const { triggerProps } = usePlay(() => {
    if (reduced) return;
    cancelAnimationFrame(frame.current);
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const settled = Math.floor(t * text.length);
      setShown(
        Array.from(text)
          .map((ch, i) =>
            i < settled || ch === " "
              ? ch
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          )
          .join(""),
      );
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  });
  return (
    <span
      className={cx("ui-scramble", className)}
      aria-label={text}
      {...triggerProps}
      {...props}
    >
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}

export interface TypewriterProps extends SpanProps {
  text: string;
  /** ms per character */
  speed?: number;
  cursor?: boolean;
}

/** Retypes its text with a caret when clicked. */
export function Typewriter({
  text,
  speed = 38,
  cursor = true,
  className,
  ...props
}: TypewriterProps) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(text.length);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => setCount(text.length), [text]);
  useEffect(() => () => window.clearInterval(timer.current), []);
  const { triggerProps } = usePlay(() => {
    if (reduced) return;
    window.clearInterval(timer.current);
    setCount(0);
    timer.current = window.setInterval(() => {
      setCount((n) => {
        if (n >= text.length) {
          window.clearInterval(timer.current);
          return n;
        }
        return n + 1;
      });
    }, speed);
  });
  return (
    <span
      className={cx("ui-typewriter", className)}
      aria-label={text}
      {...triggerProps}
      {...props}
    >
      <span aria-hidden="true">{text.slice(0, count)}</span>
      {cursor && <span className="ui-typewriter-caret" aria-hidden="true" />}
    </span>
  );
}

export interface GradientTextProps extends HTMLAttributes<HTMLSpanElement> {
  /** CSS colours; defaults to the cobalt ramp */
  colors?: string[];
}

/** Cobalt gradient fill. Click to sweep the gradient across. */
export function GradientText({
  colors,
  className,
  style,
  children,
  ...props
}: GradientTextProps) {
  const { run, triggerProps } = usePlay();
  const stops = colors?.join(", ");
  return (
    <span
      className={cx("ui-gradient-text", run > 0 && "is-playing", className)}
      style={
        {
          ...(stops ? { "--ui-gradient": stops } : {}),
          ...style,
        } as CSSProperties
      }
      key={run}
      {...triggerProps}
      {...props}
    >
      {children}
    </span>
  );
}

/** A single highlight passes over the text on click. */
export function ShinyText({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  const { run, triggerProps } = usePlay();
  return (
    <span
      key={run}
      className={cx("ui-shiny", run > 0 && "is-playing", className)}
      {...triggerProps}
      {...props}
    >
      {children}
    </span>
  );
}

export interface CountUpProps extends SpanProps {
  to: number;
  from?: number;
  /** ms */
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Count on mount as well as on click */
  autoStart?: boolean;
}

/** Counts to a number with an ease-out curve. Click to recount. */
export function CountUp({
  to,
  from = 0,
  duration = 1200,
  decimals = 0,
  prefix = "",
  suffix = "",
  autoStart = false,
  className,
  ...props
}: CountUpProps) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(autoStart ? from : to);
  const frame = useRef(0);
  const start = () => {
    if (reduced) return setValue(to);
    cancelAnimationFrame(frame.current);
    const begin = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - begin) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from + (to - from) * eased);
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  };
  useEffect(() => {
    if (autoStart) start();
    else setValue(to);
    return () => cancelAnimationFrame(frame.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to]);
  const { triggerProps } = usePlay(start);
  const format = (n: number) =>
    `${prefix}${n.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;
  return (
    <span
      className={cx("ui-countup", className)}
      aria-label={format(to)}
      {...triggerProps}
      {...props}
    >
      <span aria-hidden="true">{format(value)}</span>
    </span>
  );
}

export interface BlurRevealProps extends SpanProps {
  text: string;
  stagger?: number;
}

/** Words sharpen out of a blur, one after another. Click to replay. */
export function BlurReveal({
  text,
  stagger = 60,
  className,
  ...props
}: BlurRevealProps) {
  const reduced = useReducedMotion();
  const { run, triggerProps } = usePlay();
  return (
    <span
      className={cx("ui-blur-reveal", className)}
      aria-label={text}
      {...triggerProps}
      {...props}
    >
      {text.split(" ").map((word, i) => (
        <span
          key={`${run}-${i}`}
          aria-hidden="true"
          className={cx("ui-blur-word", run > 0 && !reduced && "is-playing")}
          style={{ animationDelay: `${i * stagger}ms` }}
        >
          {word}{" "}
        </span>
      ))}
    </span>
  );
}

export interface MarqueeProps extends HTMLAttributes<HTMLDivElement> {
  /** seconds per loop */
  speed?: number;
  reverse?: boolean;
  /** Pause while hovered */
  pauseOnHover?: boolean;
}

/** Endless horizontal scroll of its children (logos, tags). Stops for reduced motion. */
export function Marquee({
  speed = 30,
  reverse,
  pauseOnHover = true,
  className,
  style,
  children,
  ...props
}: MarqueeProps) {
  return (
    <div
      className={cx(
        "ui-marquee",
        reverse && "is-reverse",
        pauseOnHover && "is-hover-pause",
        className,
      )}
      style={{ "--ui-marquee-speed": `${speed}s`, ...style } as CSSProperties}
      {...props}
    >
      <div className="ui-marquee-track">{children}</div>
      <div className="ui-marquee-track" aria-hidden="true">
        {children}
      </div>
    </div>
  );
}

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Keys rendered as separate caps, e.g. ["⌘", "K"] */
  keys?: string[];
}

/** Keyboard key caps. */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { keys, className, children, ...props },
  ref,
) {
  if (keys)
    return (
      <span className={cx("ui-kbd-group", className)} ref={ref} {...props}>
        {keys.map((k) => (
          <kbd key={k} className="ui-kbd">
            {k}
          </kbd>
        ))}
      </span>
    );
  return (
    <kbd className={cx("ui-kbd", className)} ref={ref} {...props}>
      {children}
    </kbd>
  );
});

export interface HighlightProps extends HTMLAttributes<HTMLElement> {
  tone?: "accent" | "success" | "warning" | "danger";
}

/** Marker-style highlight for a phrase in running text. */
export function Highlight({
  tone = "accent",
  className,
  ...props
}: HighlightProps) {
  return <mark className={cx("ui-highlight", `is-${tone}`, className)} {...props} />;
}

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4;
  /** Visual size, independent of level */
  size?: "sm" | "md" | "lg" | "xl" | "display";
  eyebrow?: ReactNode;
}

/** Heading with an optional eyebrow line; level and visual size are separate. */
export function Heading({
  level = 2,
  size,
  eyebrow,
  className,
  children,
  ...props
}: HeadingProps) {
  const Tag = `h${level}` as "h2";
  const resolved = size ?? (["display", "xl", "lg", "md"] as const)[level - 1];
  return (
    <div className={cx("ui-heading-wrap", className)}>
      {eyebrow && <p className="ui-eyebrow">{eyebrow}</p>}
      <Tag className={cx("ui-heading", `is-${resolved}`)} {...props}>
        {children}
      </Tag>
    </div>
  );
}
