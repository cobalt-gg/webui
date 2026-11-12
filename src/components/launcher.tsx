import { type HTMLAttributes, type ReactNode } from "react";
import { Download, Lock, Minus, Pause, Play, Square, Trophy, X, Copy as Restore, Loader2, RefreshCw } from "lucide-react";
import { cx, formatBytes, ripple } from "../lib/utils";
import { Avatar } from "./data";
import { ProgressBar, type Status } from "./feedback";

/* ---------- PlayButton ---------- */

export type GameState = "ready" | "install" | "update" | "downloading" | "running" | "queued";

export interface PlayButtonProps extends Omit<HTMLAttributes<HTMLButtonElement>, "onClick"> {
  state: GameState;
  /** 0–100 while downloading */
  progress?: number;
  onAction?: (state: GameState) => void;
  size?: "md" | "lg";
  disabled?: boolean;
}

const playLabels: Record<GameState, string> = { ready: "Play", install: "Install", update: "Update", downloading: "Pause", running: "Stop", queued: "Queued" };

/** The launcher's primary action. Label and icon follow the game's state. */
export function PlayButton({ state, progress = 0, onAction, size = "lg", disabled, className, ...props }: PlayButtonProps) {
  const icon = {
    ready: <Play size={16} fill="currentColor" />,
    install: <Download size={16} />,
    update: <RefreshCw size={16} />,
    downloading: <Pause size={16} fill="currentColor" />,
    running: <Square size={14} fill="currentColor" />,
    queued: <Loader2 size={16} />,
  }[state];
  return (
    <button
      type="button"
      className={cx("ui-play ui-rippled", `is-${state}`, `is-${size}`, className)}
      disabled={disabled || state === "queued"}
      onClick={(e) => (ripple(e), onAction?.(state))}
      style={state === "downloading" ? ({ "--ui-play-progress": `${progress}%` } as React.CSSProperties) : undefined}
      {...props}
    >
      {icon}
      <span>{playLabels[state]}</span>
      {state === "downloading" && <span className="ui-play-pct">{Math.round(progress)}%</span>}
    </button>
  );
}

/* ---------- GameCard ---------- */

export interface GameCardProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: string;
  /** Portrait (3:4) or landscape cover */
  cover: string;
  subtitle?: ReactNode;
  badge?: ReactNode;
  /** 0–100 when installing */
  progress?: number;
  orientation?: "portrait" | "landscape";
  installed?: boolean;
  href?: string;
  onSelect?: () => void;
}

/** Cover tile for library and store grids. */
export function GameCard({ title, cover, subtitle, badge, progress, orientation = "portrait", installed = true, href, onSelect, className, ...props }: GameCardProps) {
  const inner = (
    <>
      <span className="ui-game-cover">
        <img src={cover} alt="" loading="lazy" />
        {badge && <span className="ui-game-badge">{badge}</span>}
        {progress !== undefined && <ProgressBar className="ui-game-progress" value={progress} size="sm" aria-label={`${title} download progress`} />}
      </span>
      <span className="ui-game-meta">
        <span className="ui-game-title">{title}</span>
        {subtitle && <span className="ui-hint">{subtitle}</span>}
      </span>
    </>
  );
  const classes = cx("ui-game-card", `is-${orientation}`, !installed && "is-uninstalled", className);
  if (href) return <a href={href} className={classes} {...(props as HTMLAttributes<HTMLAnchorElement>)}>{inner}</a>;
  return (
    <button type="button" className={classes} onClick={onSelect} {...(props as HTMLAttributes<HTMLButtonElement>)}>
      {inner}
    </button>
  );
}

/* ---------- GameHero ---------- */

export interface GameHeroProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: ReactNode;
  art: string;
  logo?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  stats?: { label: string; value: ReactNode }[];
  /** Heading level for the title (default 1) */
  headingLevel?: 1 | 2 | 3 | 4;
}

/** Full-bleed key art with title, primary action and quick stats. */
export function GameHero({ title, art, logo, meta, actions, stats, headingLevel = 1, className, ...props }: GameHeroProps) {
  const H = `h${headingLevel}` as "h1";
  return (
    <section className={cx("ui-game-hero", className)} {...props}>
      <img className="ui-game-hero-art" src={art} alt="" />
      <div className="ui-game-hero-body">
        {logo ?? <H className="ui-game-hero-title">{title}</H>}
        {meta && <div className="ui-game-hero-meta">{meta}</div>}
        <div className="ui-game-hero-row">
          {actions}
          {stats && (
            <dl className="ui-game-hero-stats">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- DownloadItem ---------- */

export interface DownloadItemProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  cover?: string;
  /** bytes */
  downloaded: number;
  total: number;
  /** bytes per second */
  speed?: number;
  status: "downloading" | "paused" | "queued" | "complete" | "error";
  onPause?: () => void;
  onResume?: () => void;
  onCancel?: () => void;
}

/** One row in the download queue. */
export function DownloadItem({ title, cover, downloaded, total, speed, status, onPause, onResume, onCancel, className, ...props }: DownloadItemProps) {
  const pct = total ? (downloaded / total) * 100 : 0;
  const eta = speed && status === "downloading" ? Math.ceil((total - downloaded) / speed) : undefined;
  const etaText = eta === undefined ? undefined : eta > 3600 ? `${Math.floor(eta / 3600)}h ${Math.ceil((eta % 3600) / 60)}m left` : eta > 60 ? `${Math.ceil(eta / 60)} min left` : `${eta}s left`;
  const statusText = { downloading: [speed && `${formatBytes(speed)}/s`, etaText].filter(Boolean).join(" · "), paused: "Paused", queued: "Queued", complete: "Ready to play", error: "Download failed" }[status];
  return (
    <div className={cx("ui-download", `is-${status}`, className)} {...props}>
      {cover && <img className="ui-download-cover" src={cover} alt="" />}
      <div className="ui-download-body">
        <div className="ui-download-head">
          <span className="ui-list-title">{title}</span>
          <span className="ui-hint ui-mono">{formatBytes(downloaded)} / {formatBytes(total)}</span>
        </div>
        <ProgressBar value={pct} size="sm" tone={status === "error" ? "danger" : status === "complete" ? "success" : "accent"} aria-label={`${title} progress`} />
        <span className={cx("ui-hint", status === "error" && "ui-danger-text")}>{statusText}</span>
      </div>
      <div className="ui-download-actions">
        {status === "downloading" && onPause && <button type="button" className="ui-close" aria-label={`Pause ${title}`} onClick={onPause}><Pause size={15} /></button>}
        {(status === "paused" || status === "error") && onResume && <button type="button" className="ui-close" aria-label={`Resume ${title}`} onClick={onResume}><Play size={15} /></button>}
        {status !== "complete" && onCancel && <button type="button" className="ui-close" aria-label={`Cancel ${title}`} onClick={onCancel}><X size={15} /></button>}
      </div>
    </div>
  );
}

/* ---------- FriendRow ---------- */

export interface FriendRowProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  avatar?: string;
  status: Status;
  /** e.g. game title when playing */
  activity?: ReactNode;
  actions?: ReactNode;
}

/** Friend list entry with presence and current activity. */
export function FriendRow({ name, avatar, status, activity, actions, className, ...props }: FriendRowProps) {
  const statusText = status === "playing" ? activity ?? "In game" : status === "online" ? "Online" : status === "away" ? "Away" : status === "busy" ? "Do not disturb" : "Offline";
  return (
    <div className={cx("ui-friend", `is-${status}`, className)} {...props}>
      <Avatar alt={name} src={avatar} size="sm" status={status} />
      <span className="ui-list-text">
        <span className="ui-list-title">{name}</span>
        <span className={cx("ui-hint", status === "playing" && "ui-accent-text")}>{statusText}</span>
      </span>
      {actions && <span className="ui-friend-actions">{actions}</span>}
    </div>
  );
}

/* ---------- AchievementCard ---------- */

export interface AchievementCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  unlocked?: boolean;
  unlockedAt?: string;
  /** For progress achievements */
  progress?: { value: number; max: number };
  /** Share of players who have it, 0–100 */
  rarity?: number;
}

export function AchievementCard({ title, description, icon, unlocked, unlockedAt, progress, rarity, className, ...props }: AchievementCardProps) {
  return (
    <div className={cx("ui-achievement", unlocked ? "is-unlocked" : "is-locked", rarity !== undefined && rarity < 10 && "is-rare", className)} {...props}>
      <span className="ui-achievement-icon" aria-hidden="true">{unlocked ? icon ?? <Trophy size={20} /> : <Lock size={18} />}</span>
      <div className="ui-achievement-body">
        <span className="ui-list-title">{title}<span className="ui-sr-only">{unlocked ? " (unlocked)" : " (locked)"}</span></span>
        {description && <span className="ui-hint">{description}</span>}
        {progress && !unlocked && <ProgressBar value={progress.value} max={progress.max} size="sm" aria-label="Achievement progress" />}
      </div>
      <div className="ui-achievement-meta">
        {unlocked && unlockedAt && <span className="ui-hint">{unlockedAt}</span>}
        {progress && !unlocked && <span className="ui-hint ui-mono">{progress.value}/{progress.max}</span>}
        {rarity !== undefined && <span className="ui-hint">{rarity}% of players</span>}
      </div>
    </div>
  );
}

/* ---------- TitleBar ---------- */

export interface TitleBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  /** Centre content, e.g. a search trigger */
  center?: ReactNode;
  maximized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  /** macOS-style traffic lights instead of Windows-style buttons */
  platform?: "windows" | "mac";
}

/** Frameless desktop window chrome. The bar is a drag region; buttons aren't. */
export function TitleBar({ title, center, maximized, onMinimize, onMaximize, onClose, platform = "windows", className, children, ...props }: TitleBarProps) {
  const controls =
    platform === "mac" ? (
      <div className="ui-titlebar-lights">
        <button type="button" aria-label="Close window" className="is-close" onClick={onClose} />
        <button type="button" aria-label="Minimize window" className="is-min" onClick={onMinimize} />
        <button type="button" aria-label={maximized ? "Restore window" : "Maximize window"} className="is-max" onClick={onMaximize} />
      </div>
    ) : (
      <div className="ui-titlebar-controls">
        <button type="button" aria-label="Minimize window" onClick={onMinimize}><Minus size={14} /></button>
        <button type="button" aria-label={maximized ? "Restore window" : "Maximize window"} onClick={onMaximize}>{maximized ? <Restore size={12} /> : <Square size={12} />}</button>
        <button type="button" aria-label="Close window" className="is-close" onClick={onClose}><X size={15} /></button>
      </div>
    );
  return (
    <div className={cx("ui-titlebar", `is-${platform}`, className)} {...props}>
      {platform === "mac" && controls}
      <div className="ui-titlebar-title">{title}</div>
      <div className="ui-titlebar-center">{center}</div>
      <div className="ui-titlebar-extra">{children}</div>
      {platform === "windows" && controls}
    </div>
  );
}
