/**
 * Resume preview dialog. Upgrades every a[data-resume-trigger] (plain PDF
 * links — the no-JS fallback) to open a native <dialog> with an embedded,
 * scrollable PDF preview and a real download button.
 */
function initResumeDialog(): void {
  const dialog = document.querySelector<HTMLDialogElement>(
    'dialog[data-resume-dialog]',
  );
  if (!dialog || typeof dialog.showModal !== 'function') return;

  // <object> instead of <iframe>: its children render as an automatic
  // fallback on browsers without inline PDF support (Android Chrome).
  const frame = dialog.querySelector<HTMLObjectElement>('[data-resume-frame]');
  const title = dialog.querySelector<HTMLElement>('[data-resume-title]');
  const download = dialog.querySelector<HTMLAnchorElement>(
    '[data-resume-download]',
  );
  const fallbackDownload = dialog.querySelector<HTMLAnchorElement>(
    '[data-resume-download-fallback]',
  );
  const permalink = dialog.querySelector<HTMLAnchorElement>(
    '[data-resume-permalink]',
  );
  if (!frame || !title || !download) return;

  const close = (): void => dialog.close();
  dialog.querySelector('[data-resume-close]')?.addEventListener('click', close);
  // Click on the backdrop (the dialog element itself) closes.
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close();
  });
  // Free the PDF renderer when closed (also stops mobile viewers).
  dialog.addEventListener('close', () => {
    frame.data = '';
  });

  for (const link of document.querySelectorAll<HTMLAnchorElement>(
    'a[data-resume-trigger]',
  )) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href') ?? '';
      title.textContent = link.dataset.resumeLabel ?? 'RESUME';
      frame.data = `${href}#toolbar=0&navpanes=0`;
      download.href = href;
      if (fallbackDownload) fallbackDownload.href = href;
      if (permalink && link.dataset.resumeSlug) {
        permalink.href = `/resume/${link.dataset.resumeSlug}/`;
      }
      dialog.showModal();
    });
  }
}

initResumeDialog();

// Module marker: keeps this file in module scope (own const scope,
// enables global augmentation elsewhere).
export {};
