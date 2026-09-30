(() => {
  const data = window.MemorialBotanicaData;
  const topicsEl = document.querySelector('[data-bot-topics]');
  const panelEl = document.querySelector('[data-bot-panel]');
  const introEl = document.querySelector('[data-bot-intro]');
  const trayEl = document.querySelector('[data-bot-tray]');
  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImg = document.querySelector('[data-lightbox-image]');
  const lightboxCaption = document.querySelector('[data-lightbox-caption]');
  const lightboxCredit = document.querySelector('[data-lightbox-credit]');
  const lightboxClose = document.querySelector('[data-lightbox-close]');
  const lightboxPrev = document.querySelector('[data-lightbox-prev]');
  const lightboxNext = document.querySelector('[data-lightbox-next]');

  if (!data?.topics?.length || !topicsEl || !panelEl) {
    console.warn('Botânica: dados ou elementos da página não encontrados.');
    return;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canAnimate = typeof window.gsap !== 'undefined' && !reduceMotion;

  let activeId = data.topics[0].id;
  let lightboxImages = [];
  let lightboxIndex = 0;

  const escapeHtml = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const formatText = (value) =>
    escapeHtml(value).replace(/\{em\}(.+?)\{\/em\}/g, '<em class="bot-latin">$1</em>');

  const getTopic = (id) => data.topics.find((topic) => topic.id === id) ?? data.topics[0];
  const allImages = () => data.topics.flatMap((topic) => (topic.images ?? []).map((image) => ({ ...image, topicId: topic.id })));

  const renderIntro = () => {
    if (introEl) introEl.innerHTML = formatText(data.intro);
  };

  const renderTopics = () => {
    topicsEl.innerHTML = data.topics
      .map((topic) => {
        const isActive = topic.id === activeId;
        return `
          <button
            type="button"
            class="bot-topic${isActive ? ' is-active' : ''}"
            data-topic-id="${topic.id}"
            aria-pressed="${isActive}"
          >
            <span class="bot-topic-title">${escapeHtml(topic.title)}</span>
            <span class="bot-topic-summary">${escapeHtml(topic.summary)}</span>
          </button>
        `;
      })
      .join('');
  };

  const renderTray = () => {
    if (!trayEl) return;
    trayEl.innerHTML = allImages()
      .map((image, index) => `
        <button
          type="button"
          class="bot-tray-item${image.topicId === activeId ? ' is-current' : ''}"
          data-tray-index="${index}"
          data-topic-id="${image.topicId}"
          aria-label="${escapeHtml(image.caption)}"
        >
          <img src="${escapeHtml(image.src)}" alt="" />
          <span>${escapeHtml(image.caption)}</span>
        </button>
      `)
      .join('');
  };

  const renderPanel = () => {
    const topic = getTopic(activeId);
    const images = topic.images ?? [];
    const first = images[0];
    lightboxImages = images;

    const paragraphs = (topic.body ?? []).map((text) => `<p>${formatText(text)}</p>`).join('');
    const thumbs = images
      .map(
        (image, i) => `
          <button
            type="button"
            class="tl-gallery-item${i === 0 ? ' is-active' : ''}"
            data-gallery-index="${i}"
            aria-pressed="${i === 0}"
          >
            <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.caption)}" />
            <span>${escapeHtml(image.caption)}</span>
          </button>
        `
      )
      .join('');

    panelEl.innerHTML = `
      <h2 class="ds-display text-3xl md:text-4xl">${escapeHtml(topic.title)}</h2>
      <div class="bot-copy mt-5">${paragraphs}</div>
      <div class="tl-gallery mt-8" data-gallery>
        <p class="ds-muted text-sm">Toque numa miniatura para trocar. Toque na foto grande para ampliar.</p>
        <button class="tl-gallery-hero" type="button" data-open-image="0" aria-label="Ampliar ${escapeHtml(first?.caption || 'imagem')}">
          <img data-gallery-hero src="${escapeHtml(first?.src || '')}" alt="${escapeHtml(first?.caption || '')}" />
        </button>
        <p class="tl-gallery-caption" data-gallery-caption>${escapeHtml(first?.caption || '')}</p>
        <p class="tl-credit" data-gallery-credit>${escapeHtml(first?.credit || '')}</p>
        ${images.length > 1 ? `<div class="tl-gallery-track">${thumbs}</div>` : ''}
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

  const selectTopic = (id) => {
    activeId = id;
    renderTopics();
    renderTray();
    renderPanel();
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
    const many = lightboxImages.length > 1;
    if (lightboxPrev) lightboxPrev.hidden = !many;
    if (lightboxNext) lightboxNext.hidden = !many;
    lightbox.dataset.active = 'true';
    lightbox.setAttribute('aria-hidden', 'false');
    lightboxClose?.focus();
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.dataset.active = 'false';
    lightbox.setAttribute('aria-hidden', 'true');
  };

  const setGalleryIndex = (index) => {
    const gallery = panelEl.querySelector('[data-gallery]');
    if (!gallery) return;
    const image = lightboxImages[index];
    if (!image) return;
    const heroBtn = gallery.querySelector('[data-open-image]');
    const hero = gallery.querySelector('[data-gallery-hero]');
    const caption = gallery.querySelector('[data-gallery-caption]');
    const credit = gallery.querySelector('[data-gallery-credit]');
    gallery.querySelectorAll('[data-gallery-index]').forEach((item, i) => {
      item.classList.toggle('is-active', i === index);
      item.setAttribute('aria-pressed', String(i === index));
    });
    if (hero) {
      hero.src = image.src;
      hero.alt = image.caption || '';
    }
    if (heroBtn) heroBtn.dataset.openImage = String(index);
    if (caption) caption.textContent = image.caption || '';
    if (credit) {
      credit.textContent = image.credit || '';
      credit.hidden = !image.credit;
    }
  };

  const shiftLightbox = (direction) => {
    if (!lightboxImages.length) return;
    const next = (lightboxIndex + direction + lightboxImages.length) % lightboxImages.length;
    setGalleryIndex(next);
    openLightbox(next);
  };

  topicsEl.addEventListener('click', (event) => {
    const button = event.target.closest('[data-topic-id]');
    if (!button) return;
    selectTopic(button.dataset.topicId);
  });

  trayEl?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-topic-id]');
    if (!button) return;
    selectTopic(button.dataset.topicId);
    const localIndex = Number(button.dataset.trayIndex);
    const topic = getTopic(button.dataset.topicId);
    const start = allImages().findIndex((image) => image.topicId === topic.id);
    const offset = localIndex - start;
    requestAnimationFrame(() => {
      const thumb = panelEl.querySelector(`[data-gallery-index="${offset}"]`);
      if (thumb) thumb.click();
      else openLightbox(0);
    });
  });

  panelEl.addEventListener('click', (event) => {
    const thumb = event.target.closest('[data-gallery-index]');
    const gallery = event.target.closest('[data-gallery]');
    if (thumb && gallery) {
      const index = Number(thumb.dataset.galleryIndex);
      const image = lightboxImages[index];
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
      if (heroBtn) heroBtn.dataset.openImage = String(index);
      if (caption) caption.textContent = image?.caption || '';
      if (credit) {
        credit.textContent = image?.credit || '';
        credit.hidden = !image?.credit;
      }
      return;
    }

    const open = event.target.closest('[data-open-image]');
    if (open) openLightbox(Number(open.dataset.openImage));
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
    if (lightbox?.dataset.active !== 'true') return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') shiftLightbox(-1);
    if (event.key === 'ArrowRight') shiftLightbox(1);
  });

  renderIntro();
  renderTopics();
  renderTray();
  renderPanel();
})();
