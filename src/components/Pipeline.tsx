import { useTranslations } from "next-intl";
import { Eyebrow } from "./ui";

/* The insertion-point diagram: real text in real DOM, so it reflows, themes
   and reads aloud. No SVG, no second mobile copy. */
export default function Pipeline() {
  const t = useTranslations("home.pipeline");
  const th = useTranslations("home");

  const stages = [
    { key: "cache", accent: false },
    { key: "model", accent: true },
    { key: "eval", accent: false },
  ] as const;

  return (
    <figure className="mt-8">
      <figcaption className="mb-12 max-w-2xl text-lg leading-relaxed text-graphite">
        {th("pipelineLead")}
      </figcaption>
      <Lane title={t("app")} note={t("appNote")} />
      <Connector caption={t("hook")} />

      <div className="rounded-[3px] border border-signal-edge bg-signal-wash p-4 sm:p-6">
        <Eyebrow>{t("layer")}</Eyebrow>
        <div className="mt-5 grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:gap-4">
          {stages.map(({ key, accent }, index) => (
            <Stage
              key={key}
              title={t(key)}
              note={t(`${key}Note`)}
              accent={accent}
              last={index === stages.length - 1}
            />
          ))}
        </div>
      </div>

      <Connector caption={t("result")} />
      <Lane title={t("back")} note={t("backNote")} />
    </figure>
  );
}

function Lane({ title, note }: { title: string; note: string }) {
  return (
    <div className="rounded-[3px] border border-rule bg-raised px-4 py-4 sm:px-6">
      <p className="font-mono text-eyebrow font-medium uppercase text-ink">{title}</p>
      <p className="mt-1.5 font-mono text-[0.8125rem] leading-relaxed text-graphite">
        {note}
      </p>
    </div>
  );
}

function Connector({ caption }: { caption: string }) {
  return (
    <div aria-hidden className="grid grid-cols-3 items-center">
      <span />
      <span className="relative mx-auto block h-12 w-px overflow-hidden bg-rule">
        <span className="animate-flow absolute inset-x-0 top-0 block h-5 bg-signal" />
      </span>
      <Eyebrow className="justify-self-start pl-3">{caption}</Eyebrow>
    </div>
  );
}

function Stage({
  title,
  note,
  accent,
  last,
}: {
  title: string;
  note: string;
  accent: boolean;
  last: boolean;
}) {
  return (
    <>
      <div
        className={`rounded-[3px] border bg-paper p-4 ${
          accent ? "border-signal-edge" : "border-rule"
        }`}
      >
        <p
          className={`font-mono text-eyebrow font-medium uppercase ${
            accent ? "text-signal" : "text-ink"
          }`}
        >
          {title}
        </p>
        <p className="mt-2 font-mono text-[0.75rem] leading-relaxed text-faint">{note}</p>
      </div>
      {!last && (
        <span
          aria-hidden
          className="mx-auto my-1 block h-4 w-px bg-rule-strong md:my-0 md:h-px md:w-4 md:self-center"
        />
      )}
    </>
  );
}
