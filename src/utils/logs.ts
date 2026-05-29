const isDev = import.meta.env.VITE_NODE_ENV === "development";
const noop = () => {};
// console.log(import.meta.env.VITE_NODE_ENV );

const styles = {
  info:    "color: #06b6d4; font-weight: normal",
  success: "color: #22c55e; font-weight: normal",
  warn:    "color: #eab308; font-weight: normal",
  error:   "color: #ef4444; font-weight: bold",
  debug:   "color: #6b7280; font-weight: normal",
  title:   "color: #d946ef; font-weight: bold; font-size: 1.1em",
  line:    "color: #374151; font-weight: normal",
} as const;

const make =
  (label: string, style: string, method: "log" | "warn" | "error" = "log") =>
  (msg: unknown) =>
    console[method](`%c[${label}]`, style, msg);

export const logger = isDev
  ? {
      info:    make("INFO",    styles.info),
      success: make("SUCCESS", styles.success),
      warn:    make("WARN",    styles.warn,  "warn"),
      error:   make("ERROR",   styles.error, "error"),
      debug:   make("DEBUG",   styles.debug),
      raw:     (msg: unknown) => console.log(msg),
      title:   (msg: unknown) => console.log(`%c\n=== ${String(msg)} ===\n`, styles.title),
      line:    () => console.log("%c----------------------------------", styles.line),
    }
  : {
      info:    noop,
      success: noop,
      warn:    noop,
      error:   noop,
      debug:   noop,
      raw:     noop,
      title:   noop,
      line:    noop,
    };