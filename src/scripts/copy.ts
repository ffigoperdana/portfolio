/**
 * Copy-to-clipboard for [data-copy] buttons (CopyButton.astro).
 * Buttons ship hidden and are revealed here — without JS the value is
 * always visible, selectable text, so nothing is lost. Feedback is both
 * visible (COPY → COPIED) and announced via a sibling role="status".
 */
function initCopyButtons(): void {
  const buttons =
    document.querySelectorAll<HTMLButtonElement>('button[data-copy]');

  for (const btn of buttons) {
    btn.hidden = false;
    const label = btn.querySelector<HTMLElement>('[data-copy-label]');
    const status =
      btn.parentElement?.querySelector<HTMLElement>('[role="status"]') ?? null;
    let timer = 0;

    btn.addEventListener('click', async () => {
      const value = btn.dataset.copy ?? '';
      let ok = false;
      try {
        await navigator.clipboard.writeText(value);
        ok = true;
      } catch {
        // Clipboard API can reject (unfocused document, older engines) —
        // fall back to a transient selection + execCommand.
        const ta = document.createElement('textarea');
        ta.value = value;
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.append(ta);
        ta.select();
        try {
          ok = document.execCommand('copy');
        } catch {
          ok = false;
        }
        ta.remove();
      }
      if (ok) {
        btn.classList.add('copied');
        if (label) label.textContent = 'COPIED';
        if (status)
          status.textContent = `${btn.getAttribute('aria-label') ?? 'Value'}: copied`;
      } else if (status) {
        status.textContent = 'Copy failed — select the text manually';
      }
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        btn.classList.remove('copied');
        if (label) label.textContent = 'COPY';
        if (status) status.textContent = '';
      }, 1800);
    });
  }
}

initCopyButtons();
