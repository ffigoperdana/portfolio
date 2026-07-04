/**
 * Resume preview dialog. Upgrades every a[data-resume-trigger] (plain PDF
 * links — the no-JS fallback) into a native <dialog> with an embedded PDF
 * preview and a real download button.
 *
 * The preview is an <object type="application/pdf"> whose fallback children
 * (a page-1 image + download button) render on browsers with no inline PDF
 * viewer (Android Chrome). IMPORTANT: mutating an <object>'s `data` does NOT
 * reliably reload the embedded PDF plugin — switching resumes left the first
 * PDF stuck. So each open recreates the object from a template; a fresh node
 * always loads the correct file.
 */
function initResumeDialog(): void {
  const dialog = document.querySelector<HTMLDialogElement>(
    'dialog[data-resume-dialog]',
  );
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const original = dialog.querySelector<HTMLObjectElement>(
    '[data-resume-frame]',
  );
  const title = dialog.querySelector<HTMLElement>('[data-resume-title]');
  const download = dialog.querySelector<HTMLAnchorElement>(
    '[data-resume-download]',
  );
  const permalink = dialog.querySelector<HTMLAnchorElement>(
    '[data-resume-permalink]',
  );
  if (!original || !title || !download) return;

  // Template captured before any mutation; each open/close swaps in a clone.
  const template = original.cloneNode(true) as HTMLObjectElement;
  let current = original;

  const swap = (build: (obj: HTMLObjectElement) => void): void => {
    const fresh = template.cloneNode(true) as HTMLObjectElement;
    build(fresh);
    current.replaceWith(fresh);
    current = fresh;
  };

  const close = (): void => dialog.close();
  dialog.querySelector('[data-resume-close]')?.addEventListener('click', close);
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close();
  });
  // On close, swap in a blank (dataless) object so the PDF plugin unloads.
  dialog.addEventListener('close', () => swap(() => {}));

  for (const link of document.querySelectorAll<HTMLAnchorElement>(
    'a[data-resume-trigger]',
  )) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href') ?? '';
      const slug = link.dataset.resumeSlug;

      title.textContent = link.dataset.resumeLabel ?? 'RESUME';
      download.href = href;
      if (permalink && slug) permalink.href = `/resume/${slug}/`;

      // Fresh <object> → the correct PDF always loads (fixes the stale bug).
      swap((obj) => {
        obj.data = `${href}#toolbar=0&navpanes=0`;
        const img = obj.querySelector<HTMLImageElement>(
          '[data-resume-preview]',
        );
        // Preview src set here (not in markup) + loading=lazy → only fetched
        // when the fallback actually shows (browsers without a PDF viewer).
        if (img && slug) img.src = `/resume/${slug}-preview.webp`;
        const fdl = obj.querySelector<HTMLAnchorElement>(
          '[data-resume-download-fallback]',
        );
        if (fdl) fdl.href = href;
      });

      dialog.showModal();
    });
  }
}

initResumeDialog();

// Module marker: keeps this file in module scope (own const scope,
// enables global augmentation elsewhere).
export {};
