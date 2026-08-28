/** Traducción editorial del texto visible que aún no tiene un atributo data-i18n. */
export function translateDom(
  root: Document,
  translate: (key: string, options?: { defaultValue?: string }) => string,
  dictionary: Record<string, string>
) {
  const entries = Object.entries(dictionary).sort(([a], [b]) => b.length - a.length);
  const walker = root.createTreeWalker(root.body, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);

  for (const node of nodes) {
    const parent = node.parentElement;
    if (!parent || ["SCRIPT", "STYLE", "CODE", "PRE"].includes(parent.tagName)) continue;
    const source = node.textContent ?? "";
    const trimmed = source.trim();
    if (!trimmed) continue;

    const exact = translate(trimmed, { defaultValue: "" });
    if (exact) {
      node.textContent = source.replace(trimmed, exact);
      continue;
    }

    let translated = source;
    for (const [from, to] of entries) translated = translated.split(from).join(to);
    if (translated !== source) node.textContent = translated;
  }
}
