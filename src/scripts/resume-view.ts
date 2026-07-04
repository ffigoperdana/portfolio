/**
 * Resume page (/resume/<variant>/) preview switch. The iframe PDF is server-
 * rendered so desktop works even without JS. Only when the browser can't
 * render PDFs inline (Android Chrome → navigator.pdfViewerEnabled === false)
 * do we hide the iframe and reveal the page-1 image fallback instead.
 */
function initResumeView(): void {
  if (navigator.pdfViewerEnabled !== false) return; // desktop keeps the iframe

  const frame = document.querySelector<HTMLIFrameElement>(
    '[data-resume-frame]',
  );
  const fallback = document.querySelector<HTMLElement>(
    '[data-resume-fallback]',
  );
  if (!frame || !fallback) return;

  frame.removeAttribute('src'); // stop the PDF fetch it can't display
  frame.hidden = true;
  fallback.hidden = false;
}

initResumeView();

// Module marker: keeps this file in module scope.
export {};
