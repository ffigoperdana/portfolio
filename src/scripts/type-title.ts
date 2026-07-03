/**
 * Terminal-typed section titles. Each [data-type-target] span is emptied at
 * init (JS-only — no-JS users keep the static text; the h2 aria-label keeps
 * the accessible name stable) and typed back fast when it scrolls into view.
 * A temporary block cursor blinks during typing unless the heading already
 * owns a persistent one (EXP_LOG).
 */

const CHAR_MS = 24;

function initTypeTitles(): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = document.querySelectorAll<HTMLElement>('[data-type-target]');
  if (targets.length === 0) return;

  for (const el of targets) {
    const full = el.textContent ?? '';
    if (!full) continue;

    // Reserve the final width so the heading row never shifts mid-type.
    el.style.minWidth = `${el.offsetWidth}px`;
    el.textContent = '';

    const heading = el.closest('h2');
    const hasOwnCursor = heading?.querySelector('.terminal-cursor') !== null;
    let tempCursor: HTMLElement | null = null;
    if (!hasOwnCursor) {
      tempCursor = document.createElement('span');
      tempCursor.className = 'terminal-cursor';
      tempCursor.setAttribute('aria-hidden', 'true');
      el.after(tempCursor);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        let i = 0;
        const tick = (): void => {
          i++;
          el.textContent = full.slice(0, i);
          if (i < full.length) {
            window.setTimeout(tick, CHAR_MS);
          } else {
            window.setTimeout(() => tempCursor?.remove(), 700);
          }
        };
        tick();
      },
      { threshold: 0.1 },
    );
    observer.observe(el.parentElement ?? el);
  }
}

initTypeTitles();
