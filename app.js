(() => {
  const body = document.body;
  const params = new URLSearchParams(window.location.search);
  const IDLE_MS = Number(getComputedStyle(document.documentElement).getPropertyValue('--idle-ms').trim()) || 90000;

  /* ---- Mode: web | totem ---- */
  const setMode = (mode) => {
    body.dataset.mode = mode === 'totem' ? 'totem' : 'web';
    document.documentElement.dataset.mode = body.dataset.mode;
  };

  const requestedMode = params.get('mode');
  const prefersCoarse = window.matchMedia('(pointer: coarse)').matches;
  const tallPortrait = window.matchMedia('(orientation: portrait) and (min-height: 900px)').matches;

  if (requestedMode === 'totem') setMode('totem');
  else if (requestedMode === 'web') setMode('web');
  else setMode(prefersCoarse && tallPortrait ? 'totem' : 'web');

  const withMode = (href) => {
    if (!href || href.startsWith('#')) return href;
    try {
      const url = new URL(href, window.location.href);
      if (body.dataset.mode === 'totem') url.searchParams.set('mode', 'totem');
      else url.searchParams.delete('mode');
      return `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return href;
    }
  };

  const homeHref = () => {
    const link = document.querySelector('[data-home]');
    const raw = link?.getAttribute('href') || 'index.html';
    return withMode(raw.startsWith('#') ? 'index.html' : raw);
  };

  /* Preserve mode on internal page links */
  document.querySelectorAll('a[href]').forEach((anchor) => {
    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) return;
    if (href.endsWith('.html') || href.includes('.html#') || href.startsWith('/') || href.startsWith('./')) {
      anchor.setAttribute('href', withMode(href));
    }
  });

  /* ---- Mobile menu ---- */
  const menuTrigger = document.querySelector('[data-menu-trigger]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuTrigger && mobileMenu) {
    menuTrigger.addEventListener('click', () => {
      const isOpen = mobileMenu.dataset.open === 'true';
      mobileMenu.dataset.open = String(!isOpen);
      menuTrigger.setAttribute('aria-expanded', String(!isOpen));
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.dataset.open = 'false';
        menuTrigger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Scroll reveal (web) ---- */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.ds-reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* ---- Totem idle attractor ----
   *
   * TEMPORÁRIO (desenvolvimento):
   * Com a tela "Toque para começar" aberta, ela só some com CLIQUE/TOQUE nela.
   * Passar o mouse (pointermove) NÃO deve fechar o overlay.
   *
   * ORIGINAL (restaurar no final do projeto):
   * Qualquer atividade (pointerdown, pointermove, keydown, touchstart, scroll)
   * deve chamar resetIdle() e esconder o overlay imediatamente, reiniciando o timer.
   * Ver PLANO_DO_PROJETO.md → seção "Ajustes temporários".
   * Flag: IDLE_DISMISS_CLICK_ONLY
   */
  const IDLE_DISMISS_CLICK_ONLY = true;

  const idleScreen = document.querySelector('[data-idle-screen]');
  let idleTimer = null;

  const isIdleOpen = () => idleScreen?.dataset.active === 'true';

  const goHome = () => {
    const file = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const onIndex = file === '' || file === 'index.html';
    const hashHome = document.querySelector('#inicio');

    if (onIndex && hashHome) {
      hashHome.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      return;
    }

    if (!onIndex) {
      window.location.href = homeHref();
      return;
    }

    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const showIdle = () => {
    if (body.dataset.mode !== 'totem' || !idleScreen) return;
    idleScreen.dataset.active = 'true';
  };

  const hideIdle = () => {
    if (!idleScreen) return;
    idleScreen.dataset.active = 'false';
  };

  const armIdleTimer = () => {
    if (body.dataset.mode !== 'totem') return;
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(showIdle, IDLE_MS);
  };

  const resetIdle = () => {
    if (body.dataset.mode !== 'totem') return;

    // TEMP: com overlay aberto, ignorar movimento/hover; só o clique no overlay fecha.
    if (IDLE_DISMISS_CLICK_ONLY && isIdleOpen()) return;

    hideIdle();
    armIdleTimer();
  };

  const dismissIdleByClick = () => {
    hideIdle();
    armIdleTimer();
    goHome();
  };

  if (idleScreen) {
    idleScreen.addEventListener('click', dismissIdleByClick);
  }

  const activityEvents = ['pointerdown', 'pointermove', 'keydown', 'touchstart', 'scroll'];
  activityEvents.forEach((type) => {
    window.addEventListener(type, resetIdle, { passive: true });
  });

  if (body.dataset.mode === 'totem') {
    armIdleTimer();
  }

  document.querySelector('[data-home]')?.addEventListener('click', (event) => {
    resetIdle();
    const href = homeHref();
    if (href && !href.startsWith('#')) {
      event.preventDefault();
      window.location.href = href;
    }
  });
})();
