/**
 * Hanging ID-card physics.
 *
 * Two coupled behaviors:
 * 1. Pendulum swing (rotateZ around the strap anchor) — drag the card and
 *    throw it; damping settles it back to rest. Drag direction matches the
 *    pointer: CSS rotateZ(+) moves the hanging card LEFT, so the rendered
 *    angle is the negated physics angle (this was the inverted-drag bug).
 * 2. Idle spin (rotateY on the two-faced card) — the card slowly turns 360°
 *    like a badge twisting on its lanyard, showing the back face. Grabbing
 *    eases it to face front; it resumes spinning after the swing settles.
 *
 * Compositor-only (CSS variable writes), loop gated by an
 * IntersectionObserver so nothing runs while the hero is off-screen.
 * Disabled under prefers-reduced-motion. MPA: no teardown needed.
 */

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)');

const K = 6.5; // gravity/length (s^-2) — swing period ≈ 2.5s
const DAMP = 0.7; // angular damping
const MAX_ANGLE = 1.05; // ±60° clamp (rad)
const FOLLOW = 14; // drag follow response (s^-1)
const SPIN_RATE = 26; // idle spin speed (deg/s) — ~14s per revolution
const FACE_EASE = 10; // ease-to-front response when grabbed (s^-1)

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
  let mode: 'spin' | 'front' = 'spin';
  let visible = false;
  let raf = 0;
  let last = 0;

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
    if (mode === 'front') {
      const front = Math.round(psi / 360) * 360;
      psi += (front - psi) * (1 - Math.exp(-dt * FACE_EASE));
      if (Math.abs(front - psi) < 0.4) psi = front;
    } else {
      psi += SPIN_RATE * dt;
    }

    render();

    // Swing settled after a release → resume the idle spin.
    if (
      dragTarget === null &&
      Math.abs(theta) < 0.0025 &&
      Math.abs(omega) < 0.0025
    ) {
      theta = 0;
      omega = 0;
      if (mode === 'front') mode = 'spin';
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
    mode = 'front'; // grabbed card turns to face the viewer
    dragTarget = angleToPointer(e);
    start();
  });
  card.addEventListener('pointermove', (e) => {
    if (dragTarget !== null) dragTarget = angleToPointer(e);
  });
  const release = (): void => {
    dragTarget = null;
    start();
  };
  card.addEventListener('pointerup', release);
  card.addEventListener('pointercancel', release);

  // Entrance: a small initial swing that settles into the idle spin.
  theta = 0.14;
  start();
}

initLanyard();
