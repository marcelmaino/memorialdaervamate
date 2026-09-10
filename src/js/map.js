(() => {
  const data = window.MemorialMapData;
  const mapStage = document.querySelector('[data-map-stage]');
  const pointsLayer = document.querySelector('[data-map-points]');
  const listEl = document.querySelector('[data-map-list]');
  const detailPanel = document.querySelector('[data-map-detail]');
  const filterEl = document.querySelector('[data-map-filters]');

  if (!data?.points?.length || !pointsLayer || !listEl || !detailPanel) {
    console.warn('Mapa: dados ou elementos da página não encontrados.');
    return;
  }

  const groups = [
    { id: 'all', label: 'Todos' },
    { id: 'producao', label: 'Produção' },
    { id: 'lazer', label: 'Lazer' },
    { id: 'memoria', label: 'Memória' },
    { id: 'natureza', label: 'Natureza' },
    { id: 'familia', label: 'Família' }
  ];

  let activeId = data.points[0].id;
  let activeGroup = 'all';

  const escapeHtml = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const getPoint = (id) => data.points.find((point) => point.id === id) ?? data.points[0];
  const visiblePoints = () =>
    activeGroup === 'all' ? data.points : data.points.filter((point) => point.group === activeGroup);

  const renderFilters = () => {
    if (!filterEl) return;
    filterEl.innerHTML = groups
      .map((group) => {
        const isActive = group.id === activeGroup;
        return `
          <button
            type="button"
            class="map-filter${isActive ? ' is-active' : ''}"
            data-group="${group.id}"
            aria-pressed="${isActive}"
          >${escapeHtml(group.label)}</button>
        `;
      })
      .join('');
  };

  const renderPoints = () => {
    pointsLayer.innerHTML = data.points
      .map((point) => {
        const isActive = point.id === activeId;
        const isDimmed = activeGroup !== 'all' && point.group !== activeGroup;
        return `
          <button
            type="button"
            class="map-pin${isActive ? ' is-active' : ''}${isDimmed ? ' is-dimmed' : ''}"
            style="left:${point.x}%; top:${point.y}%"
            data-point-id="${point.id}"
            aria-pressed="${isActive}"
            aria-label="Ponto ${point.number}: ${escapeHtml(point.name)}"
          >
            <span class="map-pin-number">${point.number}</span>
          </button>
        `;
      })
      .join('');
  };

  const renderList = () => {
    const points = visiblePoints();
    let lastGroup = '';
    listEl.innerHTML = points
      .map((point) => {
        const isActive = point.id === activeId;
        const heading =
          point.groupLabel !== lastGroup
            ? `<p class="map-list-group">${escapeHtml(point.groupLabel)}</p>`
            : '';
        lastGroup = point.groupLabel;
        return `
          ${heading}
          <button
            type="button"
            class="map-list-item${isActive ? ' is-active' : ''}"
            data-point-id="${point.id}"
            aria-pressed="${isActive}"
          >
            <span class="map-list-number">${point.number}</span>
            <span class="map-list-copy">
              <span class="map-list-name">${escapeHtml(point.name)}</span>
              <span class="map-list-short">${escapeHtml(point.short)}</span>
            </span>
          </button>
        `;
      })
      .join('');

    const activeItem = listEl.querySelector('.map-list-item.is-active');
    activeItem?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };

  const renderDetail = () => {
    const point = getPoint(activeId);
    const index = data.points.findIndex((item) => item.id === activeId);
    const isFirst = index <= 0;
    const isLast = index >= data.points.length - 1;
    const body = point.detail
      ? `<div class="map-detail-body mt-6"><p class="leading-relaxed">${escapeHtml(point.detail)}</p></div>`
      : '';

    detailPanel.innerHTML = `
      <p class="ds-accent font-mono text-sm font-bold">Ponto ${point.number}</p>
      <p class="ds-chip mt-3">${escapeHtml(point.groupLabel)}</p>
      <h2 class="ds-display mt-3 text-3xl md:text-4xl">${escapeHtml(point.name)}</h2>
      <p class="ds-muted mt-4 text-lg leading-relaxed">${escapeHtml(point.short)}</p>
      ${body}
      <div class="tl-stepper mt-8">
        <button class="ds-button ds-button-secondary" type="button" data-map-step="-1"${isFirst ? ' disabled' : ''}>Anterior</button>
        <button class="ds-button ds-button-primary" type="button" data-map-step="1"${isLast ? ' disabled' : ''}>Próximo</button>
      </div>
    `;
  };

  const selectPoint = (id) => {
    activeId = id;
    renderPoints();
    renderList();
    renderDetail();
  };

  const stepPoint = (direction) => {
    const index = data.points.findIndex((point) => point.id === activeId);
    const next = data.points[index + direction];
    if (!next) return;
    if (activeGroup !== 'all' && next.group !== activeGroup) {
      activeGroup = 'all';
      renderFilters();
    }
    selectPoint(next.id);
  };

  const setGroup = (groupId) => {
    activeGroup = groupId;
    const visible = visiblePoints();
    if (!visible.some((point) => point.id === activeId) && visible[0]) {
      activeId = visible[0].id;
    }
    renderFilters();
    renderPoints();
    renderList();
    renderDetail();
  };

  filterEl?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-group]');
    if (!button) return;
    setGroup(button.dataset.group);
  });

  const onSelect = (event) => {
    const button = event.target.closest('[data-point-id]');
    if (!button) return;
    selectPoint(button.dataset.pointId);
  };

  pointsLayer.addEventListener('click', onSelect);
  listEl.addEventListener('click', onSelect);

  detailPanel.addEventListener('click', (event) => {
    const step = event.target.closest('[data-map-step]');
    if (!step || step.disabled) return;
    stepPoint(Number(step.dataset.mapStep));
  });

  if (mapStage) {
    mapStage.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      stepPoint(event.key === 'ArrowRight' ? 1 : -1);
    });
  }

  renderFilters();
  renderPoints();
  renderList();
  renderDetail();
})();
