/**
 * Terminal boot sequence. Plays once per browser session on the home page,
 * skippable with any input, skipped entirely under prefers-reduced-motion.
 * Always announces completion (window.__fgdevBooted + 'fgdev:booted' event)
 * so reveal.ts can hold the hero entrance until the overlay lifts.
 */

const KEY = 'fgdev-booted';

const LINES = [
  '> FGDEV.SYS v2.6 — cold boot',
  '> mounting /dev/portfolio .......... OK',
  '> loading identity: FIGO_PERDANA ... OK',
  '> linking modules: 5 roles found ... OK',
  '> decrypting interface ............. OK',
];

const BAR_SLOTS = 24;
const CHAR_MS = 9;
const LINE_PAUSE_MS = 60;

declare global {
  interface Window {
    __fgdevBooted?: boolean;
  }
}

function announce(): void {
  window.__fgdevBooted = true;
  window.dispatchEvent(new CustomEvent('fgdev:booted'));
}

function initBoot(): void {
  const el = document.querySelector<HTMLElement>('[data-boot]');
  if (!el) {
    announce();
    return;
  }

  let seen = false;
  try {
    seen = sessionStorage.getItem(KEY) !== null;
    sessionStorage.setItem(KEY, '1');
  } catch {
    // Private-mode storage failures → just play once.
  }

  if (seen || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.remove();
    announce();
    return;
  }

  const linesEl = el.querySelector<HTMLElement>('[data-boot-lines]');
  const barEl = el.querySelector<HTMLElement>('[data-boot-bar]');
  const pctEl = el.querySelector<HTMLElement>('[data-boot-pct]');
  if (!linesEl || !barEl || !pctEl) {
    el.remove();
    announce();
    return;
  }

  el.hidden = false;
  document.documentElement.style.overflow = 'hidden';

  const totalChars = LINES.reduce((n, l) => n + l.length, 0);
  let typed = 0;
  let done = false;
  const timers: number[] = [];

  const setProgress = (): void => {
    const p = Math.min(1, typed / totalChars);
    const filled = Math.round(p * BAR_SLOTS);
    barEl.textContent = `[${'|'.repeat(filled)}${'-'.repeat(BAR_SLOTS - filled)}]`;
    pctEl.textContent = `${Math.round(p * 100)}%`;
  };

  const finish = (): void => {
    if (done) return;
    done = true;
    for (const t of timers) clearTimeout(t);
    barEl.textContent = `[${'|'.repeat(BAR_SLOTS)}]`;
    pctEl.textContent = '100%';
    el.style.transition = 'opacity 250ms ease-out';
    el.style.opacity = '0';
    window.setTimeout(() => {
      el.remove();
      document.documentElement.style.overflow = '';
      announce();
    }, 260);
  };

  window.addEventListener('keydown', finish, { once: true });
  el.addEventListener('pointerdown', finish, { once: true });

  // Type the lines out
  let lineIdx = 0;
  let charIdx = 0;
  const typeNext = (): void => {
    if (done) return;
    const line = LINES[lineIdx];
    if (line === undefined) {
      timers.push(window.setTimeout(finish, 220));
      return;
    }
    if (charIdx < line.length) {
      const prev = LINES.slice(0, lineIdx).join('\n');
      linesEl.textContent = `${prev}${lineIdx ? '\n' : ''}${line.slice(0, charIdx + 1)}`;
      charIdx++;
      typed++;
      setProgress();
      timers.push(window.setTimeout(typeNext, CHAR_MS));
    } else {
      lineIdx++;
      charIdx = 0;
      timers.push(window.setTimeout(typeNext, LINE_PAUSE_MS));
    }
  };
  typeNext();
}

initBoot();
