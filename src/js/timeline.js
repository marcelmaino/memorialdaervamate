(() => {
  const data = window.MemorialTimelineData;
  const timelinePeriods = data?.periods ?? [];
  const periodTrack = document.querySelector('[data-period-track]');
  const eventsList = document.querySelector('[data-events-list]');
  const detailPanel = document.querySelector('[data-detail-panel]');
  const periodSummary = document.querySelector('[data-period-summary]');
  const progressFill = document.querySelector('[data-tl-progress]');
  const refsList = document.querySelector('[data-refs-list]');
  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImg = document.querySelector('[data-lightbox-image]');
  const lightboxCaption = document.querySelector('[data-lightbox-caption]');
  const lightboxCredit = document.querySelector('[data-lightbox-credit]');
  const lightboxClose = document.querySelector('[data-lightbox-close]');
  const lightboxPrev = document.querySelector('[data-lightbox-prev]');
  const lightboxNext = document.querySelector('[data-lightbox-next]');

  if (!periodTrack || !eventsList || !detailPanel || !timelinePeriods.length) {
    console.warn('Linha do tempo: dados ou elementos da página não encontrados.');
    return;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canAnimate = typeof window.gsap !== 'undefined' && !reduceMotion;

  let activePeriodId = timelinePeriods[0].id;
  let activeEventId = timelinePeriods[0].events[0]?.id ?? null;
  let lightboxImages = [];
  let lightboxIndex = 0;
  let didIntro = false;

  const escapeHtml = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const getPeriod = (id) => timelinePeriods.find((period) => period.id === id) ?? timelinePeriods[0];
  const getEvent = (period, eventId) =>
    period.events.find((event) => event.id === eventId) ?? period.events[0];

  const firstImage = (event) => {
    for (const block of event.body ?? []) {
      if (block.type === 'figure') return block;
      if (block.type === 'gallery' && block.images?.length) return block.images[0];
    }
    return null;
  };

  const collectImages = (event) => {
    const images = [];
    for (const block of event.body ?? []) {
      if (block.type === 'figure') images.push(block);
      if (block.type === 'gallery') images.push(...(block.images ?? []));
    }
    return images;
  };

  const animateIn = (selector, extra = {}) => {
    if (!canAnimate) return;
    const nodes = detailPanel.querySelectorAll(selector);
    if (!nodes.length) return;
    window.gsap.fromTo(
      nodes,
      { autoAlpha: 0, y: 16 },
      { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power3.out', overwrite: 'auto', ...extra }
    );
  };

  const renderPeriods = () => {
    periodTrack.innerHTML = timelinePeriods
      .map((period, index) => {
        const isActive = period.id === activePeriodId;
        return `
          <button
            type="button"
            class="tl-period${isActive ? ' is-active' : ''}"
            data-period-id="${period.id}"
            aria-pressed="${isActive}"
          >
            <span class="tl-period-index">${String(index + 1).padStart(2, '0')}</span>
            <span class="tl-period-range">${escapeHtml(period.range)}</span>
            <span class="tl-period-label">${escapeHtml(period.label)}</span>
          </button>
        `;
      })
      .join('');

    if (canAnimate && !didIntro) {
      window.gsap.fromTo(
        periodTrack.querySelectorAll('.tl-period'),
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
      );
    }
  };

  const updateProgress = () => {
    if (!progressFill) return;
    const period = getPeriod(activePeriodId);
    const periodIndex = timelinePeriods.findIndex((item) => item.id === period.id);
    const eventIndex = Math.max(0, period.events.findIndex((item) => item.id === activeEventId));
    const total = timelinePeriods.reduce((sum, item) => sum + item.events.length, 0);
    const passed = timelinePeriods
      .slice(0, periodIndex)
      .reduce((sum, item) => sum + item.events.length, 0);
    const ratio = total ? (passed + eventIndex + 1) / total : 0;
    progressFill.style.width = `${Math.round(ratio * 100)}%`;
  };

  const renderEvents = (animateList = false) => {
    const period = getPeriod(activePeriodId);
    if (periodSummary) periodSummary.textContent = period.summary;

    eventsList.innerHTML = period.events
      .map((event, index) => {
        const isActive = event.id === activeEventId;
        const thumb = firstImage(event);
        const thumbHtml = thumb
          ? `<span class="tl-event-thumb"><img src="${escapeHtml(thumb.src)}" alt="" /></span>`
          : '';
        return `
          <button
            type="button"
            class="tl-event${isActive ? ' is-active' : ''}${thumb ? ' has-thumb' : ''}"
            data-event-id="${event.id}"
            aria-pressed="${isActive}"
          >
            <span class="tl-event-marker">${index + 1}</span>
            <span class="tl-event-copy">
              <span class="tl-event-year">${escapeHtml(event.year)}</span>
              <span class="tl-event-title">${escapeHtml(event.title)}</span>
              <span class="tl-event-summary">${escapeHtml(event.summary)}</span>
            </span>
            ${thumbHtml}
          </button>
        `;
      })
      .join('');

    if (canAnimate && animateList) {
      window.gsap.fromTo(
        eventsList.querySelectorAll('.tl-event'),
        { autoAlpha: 0, x: -14 },
        { autoAlpha: 1, x: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out' }
      );
    }
  };

  const renderFigure = (block, index) => `
    <figure class="tl-figure">
      <button class="tl-figure-btn" type="button" data-open-image="${index}" aria-label="Ampliar ${escapeHtml(block.caption || 'imagem')}">
        <img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.caption || '')}" />
      </button>
      ${block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : ''}
      ${block.credit ? `<p class="tl-credit">${escapeHtml(block.credit)}</p>` : ''}
    </figure>
  `;

  const renderGallery = (block, startIndex) => {
    const images = block.images ?? [];
    const slides = images
      .map((image, i) => {
        return `
          <button
            type="button"
            class="tl-gallery-item${i === 0 ? ' is-active' : ''}"
            data-gallery-index="${i}"
            aria-pressed="${i === 0}"
          >
            <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.caption || '')}" />
            <span>${escapeHtml(image.caption || '')}</span>
          </button>
        `;
      })
      .join('');

    const first = images[0];
    return `
      <div class="tl-gallery" data-gallery data-gallery-start="${startIndex}">
        ${block.title ? `<h3 class="tl-subhead">${escapeHtml(block.title)}</h3>` : ''}
        <p class="ds-muted text-sm">Toque numa miniatura para trocar. Toque na foto grande para ampliar.</p>
        <button class="tl-gallery-hero" type="button" data-open-image="${startIndex}" aria-label="Ampliar ${escapeHtml(first?.caption || 'imagem')}">
          <img data-gallery-hero src="${escapeHtml(first?.src || '')}" alt="${escapeHtml(first?.caption || '')}" />
        </button>
        <p class="tl-gallery-caption" data-gallery-caption>${escapeHtml(first?.caption || '')}</p>
        ${first?.credit ? `<p class="tl-credit" data-gallery-credit>${escapeHtml(first.credit)}</p>` : '<p class="tl-credit" data-gallery-credit hidden></p>'}
        <div class="tl-gallery-track">${slides}</div>
      </div>
    `;
  };

  const renderBody = (event) => {
    let imageCursor = 0;
    return (event.body ?? [])
      .map((block) => {
        if (block.type === 'p') return `<p>${escapeHtml(block.text)}</p>`;
        if (block.type === 'h') return `<h3 class="tl-subhead">${escapeHtml(block.text)}</h3>`;
        if (block.type === 'figure') {
          const html = renderFigure(block, imageCursor);
          imageCursor += 1;
          return html;
        }
        if (block.type === 'gallery') {
          const html = renderGallery(block, imageCursor);
          imageCursor += (block.images ?? []).length;
          return html;
        }
        if (block.type === 'reflect') {
          const items = (block.items ?? []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
          return `
            <aside class="tl-reflect">
              <h3>${escapeHtml(block.title || 'Para refletir')}</h3>
              <ul>${items}</ul>
            </aside>
          `;
        }
        return '';
      })
      .join('');
  };

  const renderDetail = () => {
    const period = getPeriod(activePeriodId);
    const event = getEvent(period, activeEventId);
    const periodIndex = timelinePeriods.findIndex((item) => item.id === period.id);
    const eventIndex = period.events.findIndex((item) => item.id === event.id);
    const isFirst = periodIndex === 0 && eventIndex === 0;
    const isLast =
      periodIndex === timelinePeriods.length - 1 && eventIndex === period.events.length - 1;

    if (!event) {
      detailPanel.innerHTML = '<p class="ds-muted">Selecione um acontecimento para ler o detalhe.</p>';
      return;
    }

    lightboxImages = collectImages(event);
    detailPanel.innerHTML = `
      <p class="ds-accent font-mono text-sm font-bold">${escapeHtml(event.year)}</p>
      <h2 class="ds-display mt-2 text-3xl md:text-4xl">${escapeHtml(event.title)}</h2>
      <p class="ds-muted mt-4 text-lg leading-relaxed">${escapeHtml(event.summary)}</p>
      <div class="tl-detail-body mt-6">
        ${renderBody(event)}
      </div>
      <div class="tl-stepper mt-8">
        <button class="ds-button ds-button-secondary" type="button" data-step="-1"${isFirst ? ' disabled' : ''}>Anterior</button>
        <button class="ds-button ds-button-primary" type="button" data-step="1"${isLast ? ' disabled' : ''}>Próximo</button>
      </div>
    `;

    if (canAnimate) {
      window.gsap.fromTo(
        detailPanel,
        { autoAlpha: 0.35, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      );
      animateIn('.tl-detail-body > *', { delay: 0.08 });
    }

    updateProgress();
  };

  const allEventsFlat = () =>
    timelinePeriods.flatMap((period) =>
      period.events.map((event) => ({ periodId: period.id, eventId: event.id }))
    );

  const stepEvent = (direction) => {
    const list = allEventsFlat();
    const current = list.findIndex((item) => item.periodId === activePeriodId && item.eventId === activeEventId);
    const next = list[current + direction];
    if (!next) return;
    const periodChanged = next.periodId !== activePeriodId;
    activePeriodId = next.periodId;
    activeEventId = next.eventId;
    if (periodChanged) {
      renderPeriods();
      renderEvents(true);
    } else {
      renderEvents(false);
    }
    renderDetail();
  };

  const selectPeriod = (periodId) => {
    const period = getPeriod(periodId);
    activePeriodId = period.id;
    activeEventId = period.events[0]?.id ?? null;
    renderPeriods();
    renderEvents(true);
    renderDetail();
  };

  const selectEvent = (eventId) => {
    activeEventId = eventId;
    renderEvents(false);
    renderDetail();
  };

  const openLightbox = (index) => {
    if (!lightbox || !lightboxImages[index]) return;
    lightboxIndex = index;
    const image = lightboxImages[index];
    if (lightboxImg) {
      lightboxImg.src = image.src;
      lightboxImg.alt = image.caption || '';
    }
    if (lightboxCaption) lightboxCaption.textContent = image.caption || '';
    if (lightboxCredit) {
      lightboxCredit.textContent = image.credit || '';
      lightboxCredit.hidden = !image.credit;
    }
    lightbox.dataset.active = 'true';
    lightbox.setAttribute('aria-hidden', 'false');
    const many = lightboxImages.length > 1;
    if (lightboxPrev) lightboxPrev.hidden = !many;
    if (lightboxNext) lightboxNext.hidden = !many;
    lightboxClose?.focus();
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.dataset.active = 'false';
    lightbox.setAttribute('aria-hidden', 'true');
  };

  const shiftLightbox = (direction) => {
    if (!lightboxImages.length) return;
    const next = (lightboxIndex + direction + lightboxImages.length) % lightboxImages.length;
    openLightbox(next);
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

  detailPanel.addEventListener('click', (event) => {
    const step = event.target.closest('[data-step]');
    if (step) {
      stepEvent(Number(step.dataset.step));
      return;
    }

    const thumb = event.target.closest('[data-gallery-index]');
    const gallery = event.target.closest('[data-gallery]');
    if (thumb && gallery) {
      const index = Number(thumb.dataset.galleryIndex);
      const start = Number(gallery.dataset.galleryStart || 0);
      const globalIndex = start + index;
      const image = lightboxImages[globalIndex];
      const heroBtn = gallery.querySelector('[data-open-image]');
      const hero = gallery.querySelector('[data-gallery-hero]');
      const caption = gallery.querySelector('[data-gallery-caption]');
      const credit = gallery.querySelector('[data-gallery-credit]');
      gallery.querySelectorAll('[data-gallery-index]').forEach((item, i) => {
        item.classList.toggle('is-active', i === index);
        item.setAttribute('aria-pressed', String(i === index));
      });
      if (hero && image) {
        hero.src = image.src;
        hero.alt = image.caption || '';
      }
      if (heroBtn) heroBtn.dataset.openImage = String(globalIndex);
      if (caption) caption.textContent = image?.caption || '';
      if (credit) {
        credit.textContent = image?.credit || '';
        credit.hidden = !image?.credit;
      }
      return;
    }

    const open = event.target.closest('[data-open-image]');
    if (open) {
      event.preventDefault();
      openLightbox(Number(open.dataset.openImage));
    }
  });

  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox || event.target.closest('[data-lightbox-close]')) closeLightbox();
  });
  lightboxPrev?.addEventListener('click', (event) => {
    event.stopPropagation();
    shiftLightbox(-1);
  });
  lightboxNext?.addEventListener('click', (event) => {
    event.stopPropagation();
    shiftLightbox(1);
  });

  document.addEventListener('keydown', (event) => {
    if (lightbox?.dataset.active === 'true') {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') shiftLightbox(-1);
      if (event.key === 'ArrowRight') shiftLightbox(1);
      return;
    }
    if (event.key === 'ArrowLeft') stepEvent(-1);
    if (event.key === 'ArrowRight') stepEvent(1);
  });

  if (refsList && data.references?.length) {
    refsList.innerHTML = data.references.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  }

  renderPeriods();
  renderEvents(true);
  renderDetail();
  didIntro = true;
})();
