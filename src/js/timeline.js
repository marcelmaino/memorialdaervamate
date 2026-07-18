(() => {
  const timelinePeriods = window.MemorialTimelineData?.periods ?? [];
  const periodTrack = document.querySelector('[data-period-track]');
  const eventsList = document.querySelector('[data-events-list]');
  const detailPanel = document.querySelector('[data-detail-panel]');
  const periodSummary = document.querySelector('[data-period-summary]');

  if (!periodTrack || !eventsList || !detailPanel || !timelinePeriods.length) {
    console.warn('Linha do tempo: dados ou elementos da página não encontrados.');
    return;
  }

  let activePeriodId = timelinePeriods[0].id;
  let activeEventId = timelinePeriods[0].events[0]?.id ?? null;

  const getPeriod = (id) => timelinePeriods.find((period) => period.id === id) ?? timelinePeriods[0];
  const getEvent = (period, eventId) =>
    period.events.find((event) => event.id === eventId) ?? period.events[0];

  const renderPeriods = () => {
    periodTrack.innerHTML = timelinePeriods
      .map((period) => {
        const isActive = period.id === activePeriodId;
        return `
          <button
            type="button"
            class="tl-period${isActive ? ' is-active' : ''}"
            data-period-id="${period.id}"
            aria-pressed="${isActive}"
          >
            <span class="tl-period-range">${period.range}</span>
            <span class="tl-period-label">${period.label}</span>
          </button>
        `;
      })
      .join('');
  };

  const renderEvents = () => {
    const period = getPeriod(activePeriodId);
    if (periodSummary) periodSummary.textContent = period.summary;

    eventsList.innerHTML = period.events
      .map((event) => {
        const isActive = event.id === activeEventId;
        return `
          <button
            type="button"
            class="tl-event${isActive ? ' is-active' : ''}"
            data-event-id="${event.id}"
            aria-pressed="${isActive}"
          >
            <span class="tl-event-year">${event.year}</span>
            <span class="tl-event-title">${event.title}</span>
            <span class="tl-event-summary">${event.summary}</span>
          </button>
        `;
      })
      .join('');
  };

  const renderDetail = () => {
    const period = getPeriod(activePeriodId);
    const event = getEvent(period, activeEventId);

    if (!event) {
      detailPanel.innerHTML = '<p class="ds-muted">Selecione um acontecimento para ler o detalhe.</p>';
      return;
    }

    const tags = (event.tags ?? [])
      .map((tag) => `<span class="ds-chip">${tag}</span>`)
      .join('');

    detailPanel.innerHTML = `
      <p class="ds-accent font-mono text-sm font-bold">${event.year}</p>
      <h2 class="ds-display mt-2 text-3xl md:text-4xl">${event.title}</h2>
      <p class="ds-muted mt-4 text-lg leading-relaxed">${event.summary}</p>
      <div class="tl-detail-body mt-6">
        <p class="leading-relaxed">${event.detail}</p>
      </div>
      ${tags ? `<div class="mt-6 flex flex-wrap gap-2">${tags}</div>` : ''}
      <p class="ds-muted mt-8 text-sm">Conteúdo demonstrativo para validação da experiência.</p>
    `;
  };

  const selectPeriod = (periodId) => {
    const period = getPeriod(periodId);
    activePeriodId = period.id;
    activeEventId = period.events[0]?.id ?? null;
    renderPeriods();
    renderEvents();
    renderDetail();
  };

  const selectEvent = (eventId) => {
    activeEventId = eventId;
    renderEvents();
    renderDetail();
  };

  periodTrack.addEventListener('click', (event) => {
    const button = event.target.closest('[data-period-id]');
    if (!button) return;
    selectPeriod(button.dataset.periodId);
  });

  eventsList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-event-id]');
    if (!button) return;
    selectEvent(button.dataset.eventId);
  });

  renderPeriods();
  renderEvents();
  renderDetail();
})();
