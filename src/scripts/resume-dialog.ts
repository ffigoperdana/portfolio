/**
 * Resume preview dialog. Upgrades every a[data-resume-trigger] (plain PDF
 * links — the no-JS fallback) into a native <dialog>.
 *
 * The preview is chosen DETERMINISTICALLY, not via <object>'s flaky auto-
 * fallback (which showed the image on desktop unpredictably):
 *   - navigator.pdfViewerEnabled === false (Android Chrome) → page-1 image
 *   - otherwise (desktop, Firefox, Safari) → <iframe> inline PDF
 * <iframe>.src reloads reliably, so switching CVs never goes stale.
 */
function initResumeDialog(): void {
  const dialog = document.querySelector<HTMLDialogElement>(
    'dialog[data-resume-dialog]',
  );
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const frame = dialog.querySelector<HTMLIFrameElement>('[data-resume-frame]');
  const fallback = dialog.querySelector<HTMLElement>('[data-resume-fallback]');
  const preview = dialog.querySelector<HTMLImageElement>(
    '[data-resume-preview]',
  );
  const fallbackDownload = dialog.querySelector<HTMLAnchorElement>(
    '[data-resume-download-fallback]',
  );
  const title = dialog.querySelector<HTMLElement>('[data-resume-title]');
  const download = dialog.querySelector<HTMLAnchorElement>(
    '[data-resume-download]',
  );
  const permalink = dialog.querySelector<HTMLAnchorElement>(
    '[data-resume-permalink]',
  );
  if (!frame || !fallback || !title || !download) return;

  // Only Android Chrome reports this as false; treat unknown as "can inline".
  const canInline = navigator.pdfViewerEnabled !== false;

  const close = (): void => dialog.close();
  dialog.querySelector('[data-resume-close]')?.addEventListener('click', close);
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close();
  });
  // Unload the PDF when closed so it never lingers or bleeds audio/CPU.
  dialog.addEventListener('close', () => {
    frame.src = 'about:blank';
  });

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

      if (canInline) {
        fallback.hidden = true;
        frame.hidden = false;
        frame.src = `${href}#toolbar=0&navpanes=0`;
      } else {
        frame.hidden = true;
        frame.removeAttribute('src');
        fallback.hidden = false;
        if (preview && slug) preview.src = `/resume/${slug}-preview.webp`;
        if (fallbackDownload) fallbackDownload.href = href;
      }

      dialog.showModal();
    });
  }
}

initResumeDialog();

// Module marker: keeps this file in module scope (own const scope,
// enables global augmentation elsewhere).
export {};
