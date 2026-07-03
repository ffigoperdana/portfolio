/**
 * INIT_PROJECT wizard. Progressive enhancement over one long form:
 * - No JS  → all steps visible, noscript block offers the direct email.
 * - With JS → stepped flow with validation, progress dots, a compiled
 *   summary and a mailto SEND (+ clipboard fallback).
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function initWizard(): void {
  const form = document.querySelector<HTMLFormElement>('form[data-wizard]');
  if (!form) return;

  const steps = [...form.querySelectorAll<HTMLElement>('[data-step]')];
  const nav = form.querySelector<HTMLElement>('[data-wizard-nav]');
  const backBtn = form.querySelector<HTMLButtonElement>('[data-back]');
  const nextBtn = form.querySelector<HTMLButtonElement>('[data-proceed]');
  const errorEl = form.querySelector<HTMLElement>('[data-wizard-error]');
  const dots = [
    ...document.querySelectorAll<HTMLElement>('[data-step-dots] > span'),
  ];
  const stepLabel = document.querySelector<HTMLElement>('[data-step-label]');
  const stepName = document.querySelector<HTMLElement>('[data-step-name]');
  const briefArea = form.querySelector<HTMLTextAreaElement>(
    'textarea[name="brief"]',
  );
  const briefCount = form.querySelector<HTMLElement>('[data-brief-count]');
  if (!nav || !backBtn || !nextBtn || !errorEl) return;

  const NAMES = ['IDENTITY', 'DOMAIN', 'PARAMETERS', 'PAYLOAD', 'SUMMARY'];
  const DATA_STEPS = 4;
  let current = 0; // 0-based index into `steps`

  nav.hidden = false;

  briefArea?.addEventListener('input', () => {
    if (briefCount) briefCount.textContent = String(briefArea.value.length);
  });

  const setError = (msg: string | null): void => {
    errorEl.hidden = msg === null;
    errorEl.textContent = msg ?? '';
  };

  const value = (name: string): string =>
    form.querySelector<HTMLInputElement>(`[name="${name}"]`)?.value.trim() ??
    '';
  const checked = (name: string): string[] =>
    [
      ...form.querySelectorAll<HTMLInputElement>(
        `input[name="${name}"]:checked`,
      ),
    ].map((i) => i.value);

  const validate = (idx: number): string | null => {
    switch (idx) {
      case 0:
        if (!value('name')) return 'ERR: NAME is required.';
        if (!EMAIL_RE.test(value('email')))
          return 'ERR: a valid EMAIL is required.';
        return null;
      case 1:
        if (checked('domain').length === 0)
          return 'ERR: select at least one target system.';
        return null;
      case 2:
        if (checked('scope').length === 0) return 'ERR: pick a BUDGET_BRACKET.';
        if (checked('timeline').length === 0)
          return 'ERR: pick a TIMELINE_PROJECTION.';
        return null;
      case 3:
        if ((briefArea?.value.trim().length ?? 0) < 10)
          return 'ERR: VISION_DESCRIPTION needs at least 10 characters.';
        return null;
      default:
        return null;
    }
  };

  const buildMessage = (): { subject: string; body: string } => {
    const domains = checked('domain');
    const name = value('name');
    return {
      subject: `[INIT_PROJECT] ${name} — ${domains[0] ?? 'General inquiry'}`,
      body: [
        'INIT_PROJECT REQUEST — fgdev.tech',
        '',
        `FROM: ${name} <${value('email')}>`,
        `ORG: ${value('org') || '-'}`,
        `DOMAINS: ${domains.join(', ')}`,
        `SCOPE: ${checked('scope')[0] ?? '-'}`,
        `TIMELINE: ${checked('timeline')[0] ?? '-'}`,
        '',
        'MISSION BRIEF:',
        briefArea?.value.trim() ?? '',
      ].join('\r\n'),
    };
  };

  const fillSummary = (): void => {
    const set = (sel: string, text: string): void => {
      const el = form.querySelector<HTMLElement>(sel);
      if (el) el.textContent = text || '—';
    };
    set('[data-sum-from]', `${value('name')} <${value('email')}>`);
    set('[data-sum-org]', value('org') || '—');
    set('[data-sum-domains]', checked('domain').join(', '));
    set('[data-sum-scope]', checked('scope')[0] ?? '—');
    set('[data-sum-timeline]', checked('timeline')[0] ?? '—');
    set('[data-sum-brief]', briefArea?.value.trim() ?? '—');

    const { subject, body } = buildMessage();
    const send = form.querySelector<HTMLAnchorElement>('[data-send]');
    if (send) {
      const to = send.href.replace(/^mailto:/, '').split('?')[0];
      send.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

  const show = (idx: number): void => {
    current = idx;
    steps.forEach((s, i) => (s.hidden = i !== idx));
    dots.forEach((d, i) => {
      d.style.backgroundColor =
        i <= Math.min(idx, DATA_STEPS - 1)
          ? 'var(--color-accent)'
          : 'var(--color-line)';
    });
    if (stepLabel)
      stepLabel.textContent =
        idx < DATA_STEPS ? `STEP ${idx + 1} OF ${DATA_STEPS}` : 'COMPILED';
    if (stepName) stepName.textContent = NAMES[idx] ?? '';
    backBtn.disabled = idx === 0;
    nextBtn.hidden = idx === steps.length - 1;
    setError(null);
    steps[idx]?.querySelector<HTMLElement>('[data-step-heading]')?.focus();
  };

  nextBtn.addEventListener('click', () => {
    const err = validate(current);
    if (err) {
      setError(err);
      return;
    }
    if (current === DATA_STEPS - 1) fillSummary();
    show(current + 1);
  });
  backBtn.addEventListener('click', () => {
    if (current > 0) show(current - 1);
  });
  form.addEventListener('submit', (e) => e.preventDefault());

  // Clipboard fallback for the compiled message.
  const copyBtn = form.querySelector<HTMLButtonElement>('[data-copy-brief]');
  const copyLabel = form.querySelector<HTMLElement>('[data-copy-brief-label]');
  const copyStatus =
    copyBtn?.parentElement?.querySelector<HTMLElement>('[role="status"]');
  copyBtn?.addEventListener('click', async () => {
    const { subject, body } = buildMessage();
    const text = `Subject: ${subject}\r\n\r\n${body}`;
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
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
    if (copyLabel) copyLabel.textContent = ok ? 'COPIED' : 'COPY_MESSAGE';
    if (copyStatus)
      copyStatus.textContent = ok
        ? 'Message copied'
        : 'Copy failed — select manually';
    window.setTimeout(() => {
      if (copyLabel) copyLabel.textContent = 'COPY_MESSAGE';
      if (copyStatus) copyStatus.textContent = '';
    }, 1800);
  });

  // Initial state: dots on, only step 1 visible.
  show(0);
}

initWizard();

// Module marker: keeps this file in module scope (own const scope,
// enables global augmentation elsewhere).
export {};
