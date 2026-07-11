/**
 * Entrance + scroll reveals (Motion mini `animate` + `inView`).
 *
 * Hooks:
 *   [data-reveal-load]          — load-time stagger over direct children (hero text)
 *   [data-reveal-fade]          — load-time opacity-only fade (lanyard scene:
 *                                 transform stays owned by the physics)
 *   [data-reveal-group="x|y"]   — children stagger when the group scrolls into
 *                                 view; optional [data-reveal-stagger="0.07"]
 *   [data-reveal-each="x|y"]    — each direct child reveals on its own entry
 *                                 (experience timeline)
 *
 * Hidden states are applied HERE, not in CSS — users without JS (and
 * reduced-motion users) always see the full content. One-shot: observers
 * stop after firing. MPA: no teardown needed.
 */
import { animate } from 'motion/mini';
import { inView } from 'motion';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const FROM = { x: 'translateX(-8px)', y: 'translateY(12px)' } as const;
const TO = { x: 'translateX(0px)', y: 'translateY(0px)' } as const;

type Axis = keyof typeof FROM;

function axisOf(value: string | undefined): Axis {
  return value === 'x' ? 'x' : 'y';
}

// Safari on iOS can keep elements hidden after an IntersectionObserver-based
// Motion reveal until the user causes a repaint (for example by tapping a
// filter). Keep scroll-reveal content visible there; it is a progressive
// enhancement, never a prerequisite for seeing the page.
const isIOSSafari = (() => {
  const ua = navigator.userAgent;
  const isIOS =
    /iP(?:hone|ad|od)/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  return isIOS && /WebKit/.test(ua) && !/(CriOS|FxiOS|EdgiOS|OPiOS)/.test(ua);
})();

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Load-time reveals wait for the boot overlay (if present on this page)
  // so the hero entrance isn't wasted behind it. boot.ts always announces,
  // even when it skips; the timeout is a safety net against ordering races.
  const runLoadReveals = (): void => {
    for (const group of document.querySelectorAll<HTMLElement>(
      '[data-reveal-load]',
    )) {
      [...group.children].forEach((child, i) => {
        const el = child as HTMLElement;
        animate(
          el,
          { opacity: 1, transform: TO.y },
          { duration: 0.4, delay: i * 0.06, ease: EASE },
        );
      });
    }
    for (const el of document.querySelectorAll<HTMLElement>(
      '[data-reveal-fade]',
    )) {
      animate(
        el,
        { opacity: 1 },
        { duration: 0.5, delay: 0.12, ease: 'easeOut' },
      );
    }
  };

  // Hide load-reveal targets up front (no-JS users never reach this branch).
  for (const group of document.querySelectorAll<HTMLElement>(
    '[data-reveal-load]',
  )) {
    for (const child of group.children) {
      (child as HTMLElement).style.opacity = '0';
      (child as HTMLElement).style.transform = FROM.y;
    }
  }
  for (const el of document.querySelectorAll<HTMLElement>(
    '[data-reveal-fade]',
  )) {
    el.style.opacity = '0';
  }

  if (document.querySelector('[data-boot]') && !window.__fgdevBooted) {
    let started = false;
    const go = (): void => {
      if (started) return;
      started = true;
      runLoadReveals();
    };
    window.addEventListener('fgdev:booted', go, { once: true });
    window.setTimeout(go, 2600);
  } else {
    runLoadReveals();
  }

  if (!isIOSSafari) {
    // Scroll-triggered group staggers
    for (const group of document.querySelectorAll<HTMLElement>(
      '[data-reveal-group]',
    )) {
      const axis = axisOf(group.dataset.revealGroup);
      const step = Number(group.dataset.revealStagger ?? '0.08');
      const items = [...group.children] as HTMLElement[];
      for (const el of items) {
        el.style.opacity = '0';
        el.style.transform = FROM[axis];
      }
      const stop = inView(
        group,
        () => {
          items.forEach((el, i) =>
            animate(
              el,
              { opacity: 1, transform: TO[axis] },
              { duration: 0.35, delay: i * step, ease: EASE },
            ),
          );
          stop();
        },
        { amount: 0.15 },
      );
    }

    // Per-item scroll reveals
    for (const parent of document.querySelectorAll<HTMLElement>(
      '[data-reveal-each]',
    )) {
      const axis = axisOf(parent.dataset.revealEach);
      for (const child of parent.children) {
        const el = child as HTMLElement;
        el.style.opacity = '0';
        el.style.transform = FROM[axis];
        const stop = inView(
          el,
          () => {
            animate(
              el,
              { opacity: 1, transform: TO[axis] },
              { duration: 0.35, ease: EASE },
            );
            stop();
          },
          { amount: 0.35 },
        );
      }
    }
  }
}
