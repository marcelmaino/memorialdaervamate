(() => {
  const openBtn = document.querySelector('[data-video-open]');
  const dialog = document.querySelector('[data-video-dialog]');
  const closeBtn = document.querySelector('[data-video-close]');
  const mount = document.querySelector('[data-video-mount]');
  const shield = document.querySelector('[data-video-toggle]');
  const controlBtn = document.querySelector('[data-video-control]');
  const controlLabel = document.querySelector('[data-video-control-label]');
  const idleScreen = document.querySelector('[data-idle-screen]');

  if (!openBtn || !dialog || !mount) return;

  const VIDEO_ID = '1-C9FXP51j4';
  const PLAYER_VARS = {
    autoplay: 1,
    controls: 0,
    disablekb: 1,
    fs: 0,
    iv_load_policy: 3,
    modestbranding: 1,
    playsinline: 1,
    rel: 0,
    cc_load_policy: 0,
    origin: window.location.origin
  };

  let lastFocus = null;
  let player = null;
  let playing = false;
  let apiPromise = null;

  const isOpen = () => dialog.dataset.active === 'true';

  const setPlaying = (nextPlaying) => {
    playing = nextPlaying;
    const label = playing ? 'Pausar' : 'Reproduzir';
    if (shield) {
      shield.dataset.state = playing ? 'playing' : 'paused';
      shield.setAttribute('aria-label', label);
    }
    if (controlLabel) controlLabel.textContent = label;
  };

  const loadYouTubeApi = () => {
    if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
    if (apiPromise) return apiPromise;

    apiPromise = new Promise((resolve) => {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof previous === 'function') previous();
        resolve(window.YT);
      };
      const src = 'https://www.youtube.com/iframe_api';
      if (!document.querySelector(`script[src="${src}"]`)) {
        const script = document.createElement('script');
        script.src = src;
        document.head.appendChild(script);
      }
    });

    return apiPromise;
  };

  const togglePlayback = () => {
    if (!player) return;
    const state = player.getPlayerState();
    const PlayerState = window.YT?.PlayerState || {};
    if (state === PlayerState.PLAYING || state === PlayerState.BUFFERING) {
      player.pauseVideo();
      return;
    }
    if (state === PlayerState.ENDED) player.seekTo(0);
    player.playVideo();
  };

  const destroyPlayer = () => {
    if (player && typeof player.destroy === 'function') {
      try {
        player.destroy();
      } catch (error) {
        /* player already gone */
      }
    }
    player = null;
    playing = false;
    mount.innerHTML = '';
    setPlaying(false);
  };

  const createPlayer = (YT) => {
    const target = document.createElement('div');
    mount.innerHTML = '';
    mount.appendChild(target);

    player = new YT.Player(target, {
      videoId: VIDEO_ID,
      width: '100%',
      height: '100%',
      host: 'https://www.youtube-nocookie.com',
      playerVars: PLAYER_VARS,
      events: {
        onReady: (event) => {
          event.target.playVideo();
        },
        onStateChange: (event) => {
          const { PLAYING, BUFFERING } = YT.PlayerState;
          setPlaying(event.data === PLAYING || event.data === BUFFERING);
        }
      }
    });
  };

  const openDialog = async () => {
    lastFocus = document.activeElement;
    dialog.dataset.active = 'true';
    dialog.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setPlaying(false);
    closeBtn?.focus();

    try {
      const YT = await loadYouTubeApi();
      if (!isOpen()) return;
      createPlayer(YT);
    } catch (error) {
      destroyPlayer();
    }
  };

  const closeDialog = () => {
    if (!isOpen()) return;
    dialog.dataset.active = 'false';
    dialog.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    destroyPlayer();
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  };

  openBtn.addEventListener('click', openDialog);
  closeBtn?.addEventListener('click', closeDialog);
  shield?.addEventListener('click', (event) => {
    event.stopPropagation();
    togglePlayback();
  });
  controlBtn?.addEventListener('click', (event) => {
    event.stopPropagation();
    togglePlayback();
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });

  document.addEventListener('keydown', (event) => {
    if (!isOpen()) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDialog();
      return;
    }
    if (event.key === ' ' || event.key === 'k' || event.key === 'K') {
      const tag = event.target?.tagName;
      if (tag === 'BUTTON' || tag === 'A' || tag === 'INPUT') return;
      event.preventDefault();
      togglePlayback();
    }
  });

  if (idleScreen) {
    const observer = new MutationObserver(() => {
      if (idleScreen.dataset.active === 'true') closeDialog();
    });
    observer.observe(idleScreen, { attributes: true, attributeFilter: ['data-active'] });
  }
})();
