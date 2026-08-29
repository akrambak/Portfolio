type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const SunIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

export const MoonIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </svg>
);

export const MenuIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

export const CloseIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const ArrowIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const MailIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 6.5 8.5 6 8.5-6" />
  </svg>
);

export const CalendarIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

export const LinkedInIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95C20.7 8.75 22 11 22 14.4V21h-4v-5.9c0-1.4-.03-3.2-2-3.2-2 0-2.3 1.5-2.3 3.1V21H9V9Z" />
  </svg>
);

export const GitHubIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49l-.01-1.9c-2.78.62-3.37-1.22-3.37-1.22-.46-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.35 4.8-4.58 5.05.36.32.68.94.68 1.9l-.01 2.82c0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
  </svg>
);

export const XIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M18.24 2.25h3.31l-7.23 8.26L22.75 21.75h-6.6l-5.18-6.77-5.92 6.77H1.74l7.73-8.84L1.25 2.25h6.77l4.68 6.19 5.54-6.19Zm-1.16 17.52h1.83L7.02 4.13H5.06l12.02 15.64Z" />
  </svg>
);

/* Capability marks: each one draws the thing it names, not a generic symbol. */
export const InsertionIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <rect x="2" y="5.5" width="11.5" height="13" rx="1.5" />
    <path d="M13.5 12h3.5" />
    <circle cx="19.5" cy="12" r="2.5" />
    <path d="M5 9.5h5.5M5 12.5h3.5" />
  </svg>
);

export const StorefrontIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M3.5 8.5 5 4h14l1.5 4.5z" />
    <path d="M5 8.5V20h14V8.5" />
    <path d="M10 20v-5.5h4V20" />
  </svg>
);

export const DevicesIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <rect x="2" y="4.5" width="13" height="11" rx="1.5" />
    <path d="M2 8h13" />
    <path d="M6.5 19h4" />
    <path d="M8.5 15.5V19" />
    <rect x="17" y="8" width="5" height="11.5" rx="1.5" />
  </svg>
);
