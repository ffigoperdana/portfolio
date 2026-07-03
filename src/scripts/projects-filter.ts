/**
 * PROJECTS filter pills: aria-pressed toggle buttons show/hide project rows
 * by category. The pill bar ships [hidden] and is revealed here — no-JS
 * users just see every project. Count announced via a sr-only role="status".
 */
function initProjectsFilter(): void {
  const bar = document.querySelector<HTMLElement>('[data-project-filters]');
  const cards = document.querySelectorAll<HTMLElement>(
    '[data-project-category]',
  );
  if (!bar || cards.length === 0) return;

  bar.hidden = false;
  const buttons = bar.querySelectorAll<HTMLButtonElement>(
    'button[data-filter]',
  );
  const status = bar.querySelector<HTMLElement>('[data-project-status]');

  for (const btn of buttons) {
    btn.addEventListener('click', () => {
      const key = btn.dataset.filter ?? 'all';
      for (const b of buttons)
        b.setAttribute('aria-pressed', String(b === btn));

      let shown = 0;
      for (const card of cards) {
        const visible = key === 'all' || card.dataset.projectCategory === key;
        card.hidden = !visible;
        if (visible) shown++;
      }
      if (status) {
        status.textContent = `${shown} ${shown === 1 ? 'project' : 'projects'} shown`;
      }
    });
  }
}

initProjectsFilter();
