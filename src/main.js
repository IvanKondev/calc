import './style.css'
import './branding.css'
import './mobile.css'
import './desktop.css'

/* --- State & Constants --- */
const RATE = 1.95583;
const MODE_CHANGE = 'change';

// Theme State
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';
let currentTheme = localStorage.getItem('theme') || THEME_LIGHT;

const state = {
  mode: MODE_CHANGE,
  values: {
    billEur: '',
    paidBgn: '',
    paidEur: '',
  },
  activeInput: 'billEur',
};

/* --- UI Rendering --- */
document.querySelector('#app').innerHTML = `
  <div class="container">
    <div class="header-row-single">
      <h1 style="flex: 1; font-size: 1rem; margin: 0;">
        <span style="color: var(--color-primary)">UnrealSoft Calc</span>
      </h1>
      <button class="theme-toggle" id="btn-change" title="Сумиране" style="font-size: 1rem;">
        ➕
      </button>
      <button class="theme-toggle" id="btn-fullscreen" title="Цял Екран" style="font-size: 1rem;">
        ⛶
      </button>
      <button class="theme-toggle" id="btn-theme" title="Смени Тема">
        ${currentTheme === THEME_LIGHT ? '🌙' : '☀️'}
      </button>
    </div>

    <div id="install-hint" class="install-hint hidden">
      <button id="btn-dismiss-install" class="install-dismiss" type="button" aria-label="Скрий подсказката">×</button>
      <div class="install-copy">
        <div class="install-hint__title">Добави приложението на телефона</div>
        <div class="install-hint__subtitle">Работи офлайн и се стартира мигновено.</div>
        <div id="install-help" class="install-help hidden">
          В менюто ⋮ избери „Добавяне към начален екран".
        </div>
      </div>
      <button id="btn-install-app" class="install-btn" type="button">
        <span id="install-btn-text">⬇️ Инсталирай</span>
      </button>
    </div>

    <!-- MAIN SCROLLABLE AREA - KASA ONLY -->
    <div id="view-change" class="view-content" style="display: flex;">
      <div class="input-group" data-target="billEur">
        <label class="input-label">Дължима Сума (Сметка)</label>
        <div class="currency-badge">EUR</div>
        <div class="currency-input" id="input-billEur">0</div>
        <div id="bill-bgn-equiv" style="text-align: right; margin-top: 0.25rem; color: var(--color-text-muted); font-size: 0.8rem; font-weight: 500;">
          (= 0.00 лв)
        </div>
      </div>

      <div class="payment-label" style="margin: 0.75rem 0 0.5rem; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">
        Клиентът плаща с:
      </div>

      <div class="payment-fields-grid">
        <div class="input-group" id="group-paid-bgn" data-target="paidBgn">
          <label class="input-label">Лева</label>
          <div class="currency-badge">ЛВ</div>
          <div class="currency-input" id="input-paidBgn">0</div>
        </div>
        
        <div class="input-group" id="group-paid-eur" data-target="paidEur">
          <label class="input-label">Евро</label>
          <div class="currency-badge">EUR</div>
          <div class="currency-input" id="input-paidEur">0</div>
        </div>
      </div>

      <!-- Info section removed to save space for taller numpad -->
    </div>

    <!-- BOTTOM FIXED SECTION -->
    <div class="bottom-section">
      <!-- Result moved inside bottom section for mobile layout -->
      <div id="result-container" class="result-box" style="display:flex">
         <div style="font-size: 0.7rem; color: var(--color-text-muted); font-weight: 600;">РЕСТО:</div>
         
         <div class="result-values" style="display:flex; align-items:baseline; gap: 0.5rem;">
            <div id="output-change-eur" style="font-size: 1.5rem; line-height: 1; font-weight: 800; color: var(--color-secondary);">
              0.00 €
            </div>
            <div id="output-change-bgn" style="color: var(--color-text-muted); font-size: 0.9rem; font-weight: 500;">
              (= 0.00 лв)
            </div>
         </div>
      </div>

      <!-- Numpad -->
      <div class="numpad">
        <button class="num-btn" data-key="1">1</button>
        <button class="num-btn" data-key="2">2</button>
        <button class="num-btn" data-key="3">3</button>
        <button class="num-btn" data-key="4">4</button>
        <button class="num-btn" data-key="5">5</button>
        <button class="num-btn" data-key="6">6</button>
        <button class="num-btn" data-key="7">7</button>
        <button class="num-btn" data-key="8">8</button>
        <button class="num-btn" data-key="9">9</button>
        <button class="num-btn" data-key=".">.</button>
        <button class="num-btn" data-key="0">0</button>
        <button class="num-btn" data-key="back" style="color: #ef4444;">⌫</button>
        <button class="num-btn btn-clear" data-key="clear">СЛЕДВАЩ КЛИЕНТ</button>
      </div>

      <div class="branding-footer">
        <div>Powered by <span class="brand-name">UnrealSoft</span></div>
      </div>
    </div>
  </div>
`;

/* --- Themes --- */
const applyTheme = () => {
  if (currentTheme === THEME_DARK) {
    document.body.classList.add('dark-theme');
    document.getElementById('btn-theme').textContent = '☀️';
  } else {
    document.body.classList.remove('dark-theme');
    document.getElementById('btn-theme').textContent = '🌙';
  }
  localStorage.setItem('theme', currentTheme);
};
applyTheme();

document.getElementById('btn-theme').addEventListener('click', () => {
  currentTheme = currentTheme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
  applyTheme();
});

document.getElementById('btn-change').addEventListener('click', () => {
  window.location.href = '/change.html';
});

/* --- PWA Install Prompt --- */
const isiOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
const isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);

if (isiOS) {
  const fullscreenBtn = document.getElementById('btn-fullscreen');
  if (fullscreenBtn) {
    fullscreenBtn.style.display = 'none';
  }
}

const installHintEl = document.getElementById('install-hint');
const installHelpEl = document.getElementById('install-help');
const installBtnEl = document.getElementById('btn-install-app');
const installBtnTextEl = document.getElementById('install-btn-text');
const dismissInstallBtn = document.getElementById('btn-dismiss-install');

let deferredInstallPrompt = null;
const INSTALL_DISMISS_KEY = 'installHintDismissed';
let installDismissed = localStorage.getItem(INSTALL_DISMISS_KEY) === '1';

const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
const prefersInstallHint = () => window.matchMedia('(pointer: coarse)').matches;

const hideInstallHint = () => {
  if (installHintEl) {
    installHintEl.classList.add('hidden');
  }
};

const showInstallHint = () => {
  if (!installHintEl || installDismissed) return;
  if (isStandalone() || !prefersInstallHint()) {
    hideInstallHint();
    return;
  }
  installHintEl.classList.remove('hidden');
  if (installHelpEl) installHelpEl.classList.add('hidden');
  
  // Update button text for iOS
  if (isiOS && installBtnTextEl) {
    installBtnTextEl.textContent = '📖 Как да инсталирам?';
  }
};

const markInstallDismissed = () => {
  installDismissed = true;
  localStorage.setItem(INSTALL_DISMISS_KEY, '1');
  hideInstallHint();
};

const standaloneMedia = window.matchMedia('(display-mode: standalone)');
const handleDisplayModeChange = (event) => {
  if (event.matches) hideInstallHint();
  else showInstallHint();
};
if (standaloneMedia?.addEventListener) {
  standaloneMedia.addEventListener('change', handleDisplayModeChange);
} else if (standaloneMedia?.addListener) {
  standaloneMedia.addListener(handleDisplayModeChange);
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  showInstallHint();
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  markInstallDismissed();
});

if (!isStandalone()) {
  showInstallHint();
}

if (installBtnEl) {
  installBtnEl.addEventListener('click', async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const choiceResult = await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      if (choiceResult?.outcome === 'accepted') {
        markInstallDismissed();
      } else {
        markInstallDismissed();
      }
      return;
    }

    if (installHelpEl) {
      if (isiOS) {
        if (isSafari) {
          installHelpEl.innerHTML = '1. Натисни <strong>Share</strong> бутона (⎙) <strong>горе в дясно</strong><br>2. Скролни надолу и избери <strong>"Add to Home Screen"</strong><br>3. Натисни <strong>Add</strong>';
        } else {
          installHelpEl.innerHTML = 'Моля, отвори в <strong>Safari</strong> за да инсталираш приложението.';
        }
      } else {
        installHelpEl.textContent = 'В Chrome натисни ⋮ (горе-вдясно) и избери „Добавяне към начален екран".';
      }
      installHelpEl.classList.remove('hidden');
    }
  });
}

if (dismissInstallBtn) {
  dismissInstallBtn.addEventListener('click', () => {
    markInstallDismissed();
  });
}


/* --- Logic --- */

const updateUI = () => {
  // Always show result container
  const resultContainer = document.getElementById('result-container');
  if (resultContainer) resultContainer.style.display = 'flex';

  // Active Input Highlight
  document.querySelectorAll('.currency-input').forEach(el => {
    el.classList.remove('active-input');
  });

  let activeElId = '';
  if (state.activeInput === 'billEur') activeElId = 'input-billEur';
  else if (state.activeInput === 'paidBgn') activeElId = 'input-paidBgn';
  else if (state.activeInput === 'paidEur') activeElId = 'input-paidEur';

  const activeEl = document.getElementById(activeElId);
  if (activeEl) {
    activeEl.classList.add('active-input');
  }

  // Render Values
  document.getElementById('input-billEur').textContent = state.values.billEur || '0';
  document.getElementById('input-paidBgn').textContent = state.values.paidBgn || '0';
  document.getElementById('input-paidEur').textContent = state.values.paidEur || '0';

  // Calculate Change
  const billEur = parseFloat(state.values.billEur) || 0;

  // Render Bill BGN Equivalent
  const billBgnEquiv = billEur * RATE;
  document.getElementById('bill-bgn-equiv').textContent = `(= ${billBgnEquiv.toFixed(2)} лв)`;

  // Always use both payment fields
  const paidBgnVal = parseFloat(state.values.paidBgn) || 0;
  const paidEurVal = parseFloat(state.values.paidEur) || 0;

  const paidBgnInEur = paidBgnVal / RATE;
  const totalPaidEur = paidEurVal + paidBgnInEur;

  const changeEur = totalPaidEur - billEur;
  const changeBgn = changeEur * RATE;

  const outEur = document.getElementById('output-change-eur');
  const outBgn = document.getElementById('output-change-bgn');
  const resultBox = document.querySelector('.result-box');

  if (billEur > 0 && totalPaidEur >= billEur) {
    outEur.textContent = changeEur.toFixed(2) + ' €';
    outBgn.textContent = `(= ${changeBgn.toFixed(2)} лв)`;
    outEur.style.color = 'var(--color-secondary)';
    if (resultBox) resultBox.style.borderColor = 'var(--color-secondary)';

  } else if (billEur > 0 && totalPaidEur < billEur) {
    const neededEur = billEur - totalPaidEur;
    const neededBgn = neededEur * RATE;

    outEur.textContent = 'Още ' + neededEur.toFixed(2) + ' €';
    outBgn.textContent = `(Още ${neededBgn.toFixed(2)} лв)`;
    outEur.style.color = '#ef4444';
    if (resultBox) resultBox.style.borderColor = '#ef4444';

  } else {
    outEur.textContent = '0.00 €';
    outBgn.textContent = '(= 0.00 лв)';
    outEur.style.color = 'var(--color-text-muted)';
    if (resultBox) resultBox.style.borderColor = 'var(--color-secondary)';
  }
};

const handleInput = (key) => {
  const currentField = state.activeInput;
  let currentVal = state.values[currentField];

  if (key === 'clear') {
    state.values.billEur = '';
    state.values.paidBgn = '';
    state.values.paidEur = '';
    state.activeInput = 'billEur';

  } else if (key === 'back') {
    state.values[currentField] = currentVal.slice(0, -1);
  } else if (key === '.') {
    if (!currentVal.includes('.')) {
      state.values[currentField] = currentVal ? currentVal + '.' : '0.';
    }
  } else {
    if (currentVal === '0' && key !== '.') {
      state.values[currentField] = key;
    } else {
      if (currentVal.length < 10) {
        state.values[currentField] += key;
      }
    }
  }

  updateUI();
};


document.getElementById('btn-fullscreen').addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((e) => {
      console.log('Fullscreen blocked:', e);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
});

// Prevent Pinch Zoom
document.addEventListener('touchmove', function (event) {
  if (event.scale !== 1) {
    event.preventDefault();
  }
}, { passive: false });

/* --- Event Listeners --- */

document.querySelectorAll('.input-group').forEach(group => {
  group.addEventListener('click', (e) => {
    const target = group.dataset.target;
    if (target) {
      state.activeInput = target;
      updateUI();
    }
  });
});

const numpadEl = document.querySelector('.numpad');
if (numpadEl) {
  numpadEl.addEventListener('pointerdown', (e) => {
    const btn = e.target.closest('.num-btn');
    if (!btn || !e.isPrimary) return;
    e.preventDefault();

    const key = btn.dataset.key;
    if (!key) return;

    // Instant Haptic Feedback on 'Touch Down'
    if (navigator.vibrate && (e.pointerType === 'touch' || e.pointerType === 'pen' || !e.pointerType)) {
      try {
        navigator.vibrate(40);
      } catch (err) {
        // Ignore vibration errors
      }
    }

    handleInput(key);
  });
}

document.addEventListener('keydown', (e) => {
  const key = e.key;
  if (!isNaN(key)) handleInput(key);
  if (key === '.') handleInput('.');
  if (key === 'Backspace') handleInput('back');
  if (key === 'Escape') handleInput('clear');
});

// Init
updateUI();
