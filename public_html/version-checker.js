(function () {
  if (window.__APP_VERSION_CHECKER_LOADED__) return;
  window.__APP_VERSION_CHECKER_LOADED__ = true;

  // 1. Unregister any stale service workers
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (var i = 0; i < registrations.length; i++) {
          registrations[i].unregister();
        }
      }).catch(function () {});
    } catch (e) {}
  }

  var STORAGE_KEY = 'zidan_app_version';
  var RELOAD_ATTEMPTS_KEY = 'zidan_reload_attempts';
  var isChecking = false;

  function clearAllCaches(callback) {
    if (typeof window !== 'undefined' && 'caches' in window) {
      caches.keys().then(function (names) {
        return Promise.all(
          names.map(function (name) {
            return caches.delete(name);
          })
        );
      }).then(function () {
        if (callback) callback();
      }).catch(function () {
        if (callback) callback();
      });
    } else {
      if (callback) callback();
    }
  }

  function doReload(newVersion) {
    clearAllCaches(function () {
      try {
        var currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('_v', newVersion || Date.now());
        window.location.replace(currentUrl.toString());
      } catch (err) {
        window.location.reload(true);
      }
    });
  }

  function checkUpdate(force) {
    if (isChecking) return;
    isChecking = true;

    var url = '/version.json?_t=' + Date.now();
    fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        isChecking = false;
        if (!data || !data.v) return;

        var serverVer = String(data.v);
        var currentVer = localStorage.getItem(STORAGE_KEY);

        if (!currentVer) {
          localStorage.setItem(STORAGE_KEY, serverVer);
          sessionStorage.removeItem(RELOAD_ATTEMPTS_KEY);
          return;
        }

        if (currentVer !== serverVer) {
          console.info('[AppUpdate] New version detected:', serverVer, '(current:', currentVer, '). Updating...');
          localStorage.setItem(STORAGE_KEY, serverVer);
          sessionStorage.removeItem(RELOAD_ATTEMPTS_KEY);
          doReload(serverVer);
        } else if (force) {
          var attempts = parseInt(sessionStorage.getItem(RELOAD_ATTEMPTS_KEY) || '0', 10);
          if (attempts < 2) {
            sessionStorage.setItem(RELOAD_ATTEMPTS_KEY, String(attempts + 1));
            console.info('[AppUpdate] Forced reload attempt', attempts + 1);
            doReload(serverVer + '_' + Date.now());
          }
        }
      })
      .catch(function () {
        isChecking = false;
      });
  }

  // Initial check on load
  checkUpdate(false);

  // Check when returning to tab / app in mobile or desktop
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') {
        checkUpdate(false);
      }
    });
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('focus', function () {
      checkUpdate(false);
    });

    // bfcache (back-forward cache) handling
    window.addEventListener('pageshow', function (event) {
      if (event.persisted) {
        checkUpdate(false);
      }
    });

    // Periodic check every 30 seconds
    setInterval(function () {
      if (document.visibilityState === 'visible') {
        checkUpdate(false);
      }
    }, 30000);

    // Auto-recovery from ChunkLoadError / failed dynamic imports
    function isChunkLoadError(msg) {
      if (!msg) return false;
      var str = String(msg).toLowerCase();
      return str.indexOf('chunk') !== -1 ||
             str.indexOf('loading chunk') !== -1 ||
             str.indexOf('loading css chunk') !== -1 ||
             str.indexOf('failed to fetch dynamically imported module') !== -1 ||
             str.indexOf('unexpected token <') !== -1;
    }

    window.addEventListener('error', function (e) {
      var msg = (e && (e.message || (e.error && e.error.message))) || '';
      if (isChunkLoadError(msg)) {
        console.warn('[AppUpdate] Chunk error intercepted, recovering with reload...', msg);
        checkUpdate(true);
      }
    });

    window.addEventListener('unhandledrejection', function (e) {
      var reason = (e && e.reason && (e.reason.message || e.reason)) || '';
      if (isChunkLoadError(reason)) {
        console.warn('[AppUpdate] Unhandled rejection intercepted, recovering with reload...', reason);
        checkUpdate(true);
      }
    });
  }
})();
