(() => {
  const data = window.MemorialCuriosidadesData;
  const listEl = document.querySelector('[data-cur-list]');
  const panelEl = document.querySelector('[data-cur-panel]');

  if (!data?.items?.length || !listEl || !panelEl) {
    console.warn('Curiosidades: dados ou elementos da página não encontrados.');
    return;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canAnimate = typeof window.gsap !== 'undefined' && !reduceMotion;
  let activeId = data.items[0].id;

  const escapeHtml = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const getItem = (id) => data.items.find((item) => item.id === id) ?? data.items[0];

  const renderList = () => {
    listEl.innerHTML = data.items
      .map((item, index) => {
        const isActive = item.id === activeId;
        return `
          <button
            type="button"
            class="cur-item${isActive ? ' is-active' : ''}"
            data-cur-id="${item.id}"
            aria-pressed="${isActive}"
          >
            <span class="cur-item-index">${String(index + 1).padStart(2, '0')}</span>
            <span class="cur-item-copy">
              <span class="cur-item-title">${escapeHtml(item.title)}</span>
              <span class="cur-item-question">${escapeHtml(item.question)}</span>
            </span>
          </button>
        `;
      })
      .join('');
  };

  const renderCompare = (compare) => {
    if (!compare?.length) return '';
    return `
      <div class="cur-compare">
        ${compare
          .map(
            (card) => `
              <article class="cur-compare-card">
                <h3>${escapeHtml(card.place)}</h3>
                <p>${escapeHtml(card.note)}</p>
                <ul>
                  ${card.points.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}
                </ul>
              </article>
            `
          )
          .join('')}
      </div>
    `;
  };

  const renderPanel = () => {
    const item = getItem(activeId);
    const index = data.items.findIndex((entry) => entry.id === item.id);
    const body = (item.body ?? []).map((text) => `<p>${escapeHtml(text)}</p>`).join('');

    panelEl.innerHTML = `
      <p class="ds-accent font-mono text-sm font-bold">${String(index + 1).padStart(2, '0')}</p>
      <h2 class="ds-display mt-2 text-3xl md:text-4xl">${escapeHtml(item.title)}</h2>
      <p class="ds-muted mt-4 text-lg leading-relaxed">${escapeHtml(item.question)}</p>
      <div class="cur-body mt-6">${body}</div>
      ${renderCompare(item.compare)}
      <div class="tl-stepper mt-8">
        <button class="ds-button ds-button-secondary" type="button" data-cur-step="-1"${index === 0 ? ' disabled' : ''}>Anterior</button>
        <button class="ds-button ds-button-primary" type="button" data-cur-step="1"${index === data.items.length - 1 ? ' disabled' : ''}>Próxima</button>
      </div>
    `;

    if (canAnimate) {
      window.gsap.fromTo(
        panelEl,
        { autoAlpha: 0.4, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      );
    }
  };

  const selectItem = (id) => {
    activeId = id;
    renderList();
    renderPanel();
    const activeButton = listEl.querySelector('.cur-item.is-active');
    if (activeButton) {
      activeButton.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  };

  const stepItem = (direction) => {
    const index = data.items.findIndex((item) => item.id === activeId);
    const next = data.items[index + direction];
    if (!next) return;
    selectItem(next.id);
  };

  listEl.addEventListener('click', (event) => {
    const button = event.target.closest('[data-cur-id]');
    if (!button) return;
    selectItem(button.dataset.curId);
  });

  panelEl.addEventListener('click', (event) => {
    const step = event.target.closest('[data-cur-step]');
    if (!step || step.disabled) return;
    stepItem(Number(step.dataset.curStep));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') stepItem(-1);
    if (event.key === 'ArrowRight') stepItem(1);
  });

  renderList();
  renderPanel();
})();
