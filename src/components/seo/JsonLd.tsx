/**
 * Structured data for search engines and answer engines.
 *
 * `<` is escaped so a string that happens to contain `</script>` — a blog title,
 * an FAQ answer — cannot close the tag early and turn the rest into markup.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
