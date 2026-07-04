/**
 * Hanging ID-card physics.
 *
 * Axes:
 * 1. Pendulum swing (rotateZ around the strap anchor) — drag past a small
 *    threshold and throw; damping settles it. CSS rotateZ(+) moves the
 *    hanging card LEFT, so the rendered angle is the negated physics angle.
 * 2. Spin (rotateY on the two-faced card):
 *    - idle: slow continuous 360° (back face visible every revolution)
 *    - while dragging: eases to face the viewer
 *    - after a throw: resumes spinning immediately, so the free swing also
 *      shows the back
 *    - SINGLE CLICK: eases to the FRONT face and holds
 *    - DOUBLE CLICK: eases to the BACK face and holds
 *    - holds auto-resume the idle spin after 8s
 *
 * Compositor-only (CSS variable writes), loop gated by an
 * IntersectionObserver. Disabled under prefers-reduced-motion. MPA: no
 * teardown needed.
 */

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)');

const K = 6.5; // gravity/length (s^-2) — swing period ≈ 2.5s
const DAMP = 0.7; // angular damping
const MAX_ANGLE = 1.05; // ±60° clamp (rad)
const FOLLOW = 14; // drag follow response (s^-1)
const SPIN_RATE = 26; // idle spin speed (deg/s) — ~14s per revolution
const FACE_EASE = 10; // ease-to-face response (s^-1)
const DRAG_THRESHOLD = 6; // px of movement before a press becomes a drag
const CLICK_DELAY = 260; // ms to wait for a possible double click
const HOLD_MS = 8000; // how long a clicked face holds before spin resumes

type Mode = 'spin' | 'front' | 'back';

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

function initLanyard(): void {
  const rig = document.querySelector<HTMLElement>('[data-lanyard]');
  const swing = document.querySelector<HTMLElement>('[data-lanyard-card]');
  const card = document.querySelector<HTMLElement>('[data-lanyard-grab]');
  const scene = rig?.parentElement;
  if (!rig || !swing || !card || !scene) return;
  if (REDUCED.matches) return; // card hangs straight and static

  let theta = 0; // swing angle (rad); positive = card displaced RIGHT
  let omega = 0; // rad/s
  let psi = 0; // spin angle (deg), grows continuously
  let dragTarget: number | null = null;
  let mode: Mode = 'spin';
  let visible = false;
  let raf = 0;
  let last = 0;

  // Pointer-gesture state
  let pressing = false;
  let dragged = false;
  let pressX = 0;
  let pressY = 0;
  let grabOffset = 0; // pointer-angle minus card-angle at drag start
  let clickTimer = 0;
  let holdTimer = 0;

  const render = (): void => {
    const deg = theta * 57.2958;
    rig.style.setProperty('--swing', `${(-deg).toFixed(2)}deg`);
    swing.style.setProperty(
      '--wobx',
      `${clamp(-omega * 7, -14, 14).toFixed(2)}deg`,
    );
    swing.style.setProperty(
      '--lag',
      `${clamp(omega * 2.4, -8, 8).toFixed(2)}deg`,
    );
    card.style.setProperty('--spin', `${(psi % 360).toFixed(2)}deg`);
  };

  /** Nearest angle showing the requested face (front = 0°, back = 180°). */
  const faceTarget = (m: Mode): number =>
    m === 'back'
      ? Math.round((psi - 180) / 360) * 360 + 180
      : Math.round(psi / 360) * 360;

  const tick = (now: number): void => {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;

    // Pendulum axis
    if (dragTarget !== null) {
      const k = 1 - Math.exp(-dt * FOLLOW);
      const prev = theta;
      theta += (dragTarget - theta) * k;
      omega = dt > 0 ? (theta - prev) / dt : 0;
    } else {
      omega += (-K * Math.sin(theta) - DAMP * omega) * dt;
      theta += omega * dt;
    }
    theta = clamp(theta, -MAX_ANGLE, MAX_ANGLE);

    // Spin axis
    if (mode === 'spin') {
      psi += SPIN_RATE * dt;
    } else {
      const target = faceTarget(mode);
      psi += (target - psi) * (1 - Math.exp(-dt * FACE_EASE));
      if (Math.abs(target - psi) < 0.4) psi = target;
    }

    render();

    // Swing settled → rest exactly at zero.
    if (
      dragTarget === null &&
      Math.abs(theta) < 0.0025 &&
      Math.abs(omega) < 0.0025
    ) {
      theta = 0;
      omega = 0;
    }

    if (visible || dragTarget !== null) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = 0;
    }
  };

  const start = (): void => {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };

  /** Enter a clicked face-hold; idle spin resumes after HOLD_MS. */
  const hold = (m: Mode): void => {
    mode = m;
    window.clearTimeout(holdTimer);
    holdTimer = window.setTimeout(() => {
      mode = 'spin';
      start();
    }, HOLD_MS);
    start();
  };

  new IntersectionObserver((entries) => {
    visible = entries[0]?.isIntersecting ?? false;
    if (visible) start();
  }).observe(scene);

  const angleToPointer = (e: PointerEvent): number => {
    // Anchor = top-center of the (untransformed) scene container.
    const r = scene.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - r.top;
    return clamp(Math.atan2(dx, dy), -MAX_ANGLE, MAX_ANGLE);
  };

  card.addEventListener('pointerdown', (e) => {
    try {
      card.setPointerCapture(e.pointerId);
    } catch {
      // Capture is an enhancement; drag still works while the pointer
      // stays over the card.
    }
    pressing = true;
    dragged = false;
    pressX = e.clientX;
    pressY = e.clientY;
    start();
  });

  card.addEventListener('pointermove', (e) => {
    if (!pressing) return;
    if (!dragged) {
      if (Math.hypot(e.clientX - pressX, e.clientY - pressY) < DRAG_THRESHOLD)
        return;
      dragged = true; // press became a drag
      window.clearTimeout(clickTimer);
      window.clearTimeout(holdTimer);
      mode = 'front'; // grabbed card turns to face the viewer
      // Grab-offset: you grabbed the card wherever your pointer is — the
      // card must move RELATIVE to that grip, not snap its hang-angle to
      // the cursor (the old snap was a visible twitch on every drag start).
      grabOffset = angleToPointer(e) - theta;
    }
    dragTarget = clamp(angleToPointer(e) - grabOffset, -MAX_ANGLE, MAX_ANGLE);
  });

  const release = (): void => {
    if (!pressing) return;
    pressing = false;
    if (dragged) {
      dragTarget = null;
      mode = 'spin'; // thrown card spins freely — back face shows mid-swing
    }
    start();
  };
  card.addEventListener('pointerup', release);
  card.addEventListener('pointercancel', release);

  // Click = face front; double click = show the back. The delay lets a
  // second click cancel the single-click action.
  card.addEventListener('click', () => {
    if (dragged) return; // synthetic click right after a drag
    window.clearTimeout(clickTimer);
    clickTimer = window.setTimeout(() => hold('front'), CLICK_DELAY);
  });
  card.addEventListener('dblclick', () => {
    if (dragged) return;
    window.clearTimeout(clickTimer);
    hold('back');
  });

  // Entrance: a small initial swing that settles into the idle spin.
  theta = 0.14;
  start();
}

initLanyard();

// Module marker: keeps this file in module scope (own const scope,
// enables global augmentation elsewhere).
export {};
