/**
 * Generic disclosure controller for [data-disclosure] buttons paired with
 * their aria-controls panel (mobile menu, resume dropdown).
 *
 * MPA site (no ClientRouter): module runs once per page load, no teardown
 * needed. Panels start [hidden]; no-JS users navigate via the footer links.
 */
function initDisclosures(): void {
  const buttons =
    document.querySelectorAll<HTMLButtonElement>('[data-disclosure]');

  for (const btn of buttons) {
    const panelId = btn.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) continue;

    const isOpen = () => btn.getAttribute('aria-expanded') === 'true';
    const close = () => {
      btn.setAttribute('aria-expanded', 'false');
      panel.hidden = true;
    };
    const open = () => {
      // Only one disclosure open at a time.
      for (const other of buttons) {
        if (other !== btn && other.getAttribute('aria-expanded') === 'true') {
          other.click();
        }
      }
      btn.setAttribute('aria-expanded', 'true');
      panel.hidden = false;
    };

    btn.addEventListener('click', () => (isOpen() ? close() : open()));

    // Following a link inside the panel closes it.
    panel.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('a')) close();
    });

    // Escape closes and returns focus to the trigger.
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) {
        close();
        btn.focus();
      }
    });

    // Click outside closes.
    document.addEventListener('click', (e) => {
      const t = e.target as Node;
      if (isOpen() && !panel.contains(t) && !btn.contains(t)) close();
    });
  }
}

initDisclosures();

// Module marker: keeps this file in module scope (own const scope,
// enables global augmentation elsewhere).
export {};
