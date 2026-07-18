(() => {
  const data = window.MemorialMapData;
  const mapStage = document.querySelector('[data-map-stage]');
  const pointsLayer = document.querySelector('[data-map-points]');
  const listEl = document.querySelector('[data-map-list]');
  const detailPanel = document.querySelector('[data-map-detail]');
  const mapImage = document.querySelector('[data-map-image]');

  if (!data?.points?.length || !pointsLayer || !listEl || !detailPanel) {
    console.warn('Mapa: dados ou elementos da página não encontrados.');
    return;
  }

  let activeId = data.points[0].id;

  const getPoint = (id) => data.points.find((point) => point.id === id) ?? data.points[0];

  if (mapImage) {
    mapImage.src = data.image;
    mapImage.alt = data.imageAlt || '';
  }

  const renderPoints = () => {
    pointsLayer.innerHTML = data.points
      .map((point) => {
        const isActive = point.id === activeId;
        return `
          <button
            type="button"
            class="map-pin${isActive ? ' is-active' : ''}"
            style="left:${point.x}%; top:${point.y}%"
            data-point-id="${point.id}"
            aria-pressed="${isActive}"
            aria-label="${point.name}"
          >
            <span class="map-pin-number">${point.number}</span>
            <span class="map-pin-name">${point.name}</span>
          </button>
        `;
      })
      .join('');
  };

  const renderList = () => {
    listEl.innerHTML = data.points
      .map((point) => {
        const isActive = point.id === activeId;
        return `
          <button
            type="button"
            class="map-list-item${isActive ? ' is-active' : ''}"
            data-point-id="${point.id}"
            aria-pressed="${isActive}"
          >
            <span class="map-list-number">${point.number}</span>
            <span class="map-list-copy">
              <span class="map-list-name">${point.name}</span>
              <span class="map-list-short">${point.short}</span>
            </span>
          </button>
        `;
      })
      .join('');
  };

  const renderDetail = () => {
    const point = getPoint(activeId);
    const tags = (point.tags ?? [])
      .map((tag) => `<span class="ds-chip">${tag}</span>`)
      .join('');

    detailPanel.innerHTML = `
      <p class="ds-accent font-mono text-sm font-bold">Ponto ${point.number}</p>
      <h2 class="ds-display mt-2 text-3xl md:text-4xl">${point.name}</h2>
      <p class="ds-muted mt-4 text-lg leading-relaxed">${point.short}</p>
      <div class="map-detail-body mt-6">
        <p class="leading-relaxed">${point.detail}</p>
      </div>
      ${tags ? `<div class="mt-6 flex flex-wrap gap-2">${tags}</div>` : ''}
      <p class="ds-muted mt-8 text-sm">Conteúdo demonstrativo para validação da experiência.</p>
    `;
  };

  const selectPoint = (id) => {
    activeId = id;
    renderPoints();
    renderList();
    renderDetail();
  };

  const onSelect = (event) => {
    const button = event.target.closest('[data-point-id]');
    if (!button) return;
    selectPoint(button.dataset.pointId);
  };

  pointsLayer.addEventListener('click', onSelect);
  listEl.addEventListener('click', onSelect);

  if (mapStage) {
    mapStage.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      const index = data.points.findIndex((point) => point.id === activeId);
      if (index < 0) return;
      event.preventDefault();
      const next =
        event.key === 'ArrowRight'
          ? data.points[(index + 1) % data.points.length]
          : data.points[(index - 1 + data.points.length) % data.points.length];
      selectPoint(next.id);
    });
  }

  renderPoints();
  renderList();
  renderDetail();
})();
