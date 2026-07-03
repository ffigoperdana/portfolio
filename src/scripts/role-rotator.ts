/**
 * Hero role rotator: cycles through the roles in site.ts with a short
 * terminal-glitch scramble (~400ms), then holds. The rotating span is
 * aria-hidden; a sibling sr-only span lists every role statically, and the
 * server-rendered first role is the no-JS / reduced-motion fallback.
 */

const CHARS = '!<>-_\\/[]{}=+*^?#_______';
const HOLD_MS = 4000;
const FRAMES = 22;

function initRoleRotator(): void {
  const el = document.querySelector<HTMLElement>('[data-role-rotator]');
  if (!el) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let roles: string[] = [];
  try {
    roles = JSON.parse(el.dataset.roles ?? '[]');
  } catch {
    return;
  }
  if (roles.length < 2) return;

  let index = 0;
  let scrambling = false;

  const scrambleTo = (to: string): void => {
    scrambling = true;
    const from = el.textContent ?? '';
    const len = Math.max(from.length, to.length);
    let frame = 0;

    const step = (): void => {
      frame++;
      const progress = frame / FRAMES;
      let out = '';
      for (let i = 0; i < len; i++) {
        if (progress > i / len + 0.2) {
          out += to[i] ?? '';
        } else if (Math.random() < 0.55) {
          out += CHARS[(Math.random() * CHARS.length) | 0];
        } else {
          out += from[i] ?? ' ';
        }
      }
      el.textContent = out;
      if (frame < FRAMES) {
        requestAnimationFrame(step);
      } else {
        el.textContent = to;
        scrambling = false;
      }
    };
    requestAnimationFrame(step);
  };

  setInterval(() => {
    // Skip cycles in background tabs (rAF is paused there) and mid-scramble.
    if (document.hidden || scrambling) return;
    index = (index + 1) % roles.length;
    scrambleTo(`[${roles[index]}]`);
  }, HOLD_MS);
}

initRoleRotator();
