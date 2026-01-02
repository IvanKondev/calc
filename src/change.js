import './style.css'
import './branding.css'
import './mobile.css'
import './desktop.css'

/* --- State & Constants --- */
const RATE = 1.95583;

// Theme State
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';
let currentTheme = localStorage.getItem('theme') || THEME_LIGHT;

const state = {
  values: {
    totalEur: '',
    paidEur: '',
  },
  activeInput: 'totalEur',
};

/* --- UI Rendering --- */
document.querySelector('#app').innerHTML = `
  <div class="container">
    <div class="header-row-single">
      <button class="theme-toggle" id="btn-back" title="Назад към Калкулатор" style="font-size: 1rem; margin-right: 0.5rem;">
        ←
      </button>
      <h1 style="flex: 1; font-size: 1rem; margin: 0;">
        <span style="color: var(--color-primary)">UnrealSoft Calc</span>
      </h1>
      <button class="theme-toggle" id="btn-fullscreen" title="Цял Екран" style="font-size: 1rem;">
        ⛶
      </button>
      <button class="theme-toggle" id="btn-theme" title="Смени Тема">
        ${currentTheme === THEME_LIGHT ? '🌙' : '☀️'}
      </button>
    </div>

    <!-- MAIN SCROLLABLE AREA -->
    <div class="view-content" id="view-change">
      <div class="input-group" data-target="totalEur">
        <label class="input-label">ТОТАЛ EUR</label>
        <div class="currency-badge">EUR</div>
        <div class="currency-input" id="input-totalEur">0</div>
      </div>

      <label class="payment-label">Клиентът Плаща С:</label>

      <div class="input-group" data-target="paidEur">
        <label class="input-label">ДАДЕНИ EUR</label>
        <div class="currency-badge">EUR</div>
        <div class="currency-input" id="input-paidEur">0</div>
      </div>

      <!-- RESULT SECTION -->
      <div class="totals-section">
        <div class="total-card total-card-primary">
          <div class="total-label">ОСТАВА В ЛЕВА</div>
          <div class="total-value" id="result-bgn">0.00 лв</div>
        </div>
      </div>
    </div>

    <!-- BOTTOM FIXED SECTION -->
    <div class="bottom-section">
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
        <button class="num-btn btn-clear" data-key="clear">ИЗЧИСТИ</button>
      </div>

      <div class="branding-footer">
        <div>Powered by <span class="brand-name">UnrealSoft</span></div>
      </div>
    </div>
  </div>
`;

/* --- Apply Theme --- */
if (currentTheme === THEME_DARK) {
  document.body.classList.add('dark-theme');
}

/* --- Hide Fullscreen on iOS --- */
const isiOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
if (isiOS) {
  const fullscreenBtn = document.getElementById('btn-fullscreen');
  if (fullscreenBtn) {
    fullscreenBtn.style.display = 'none';
  }
}

/* --- Theme Toggle --- */
document.getElementById('btn-theme').addEventListener('click', () => {
  currentTheme = currentTheme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
  document.body.classList.toggle('dark-theme');
  localStorage.setItem('theme', currentTheme);
  document.getElementById('btn-theme').textContent = currentTheme === THEME_LIGHT ? '🌙' : '☀️';
});

/* --- Back Button --- */
document.getElementById('btn-back').addEventListener('click', () => {
  window.location.href = '/';
});

/* --- Fullscreen Toggle --- */
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

/* --- Logic --- */

const updateUI = () => {
  // Active Input Highlight
  document.querySelectorAll('.currency-input').forEach(el => {
    el.classList.remove('active-input');
  });

  let activeElId = '';
  if (state.activeInput === 'totalEur') activeElId = 'input-totalEur';
  else if (state.activeInput === 'paidEur') activeElId = 'input-paidEur';

  const activeEl = document.getElementById(activeElId);
  if (activeEl) {
    activeEl.classList.add('active-input');
  }

  // Render Values
  document.getElementById('input-totalEur').textContent = state.values.totalEur || '0';
  document.getElementById('input-paidEur').textContent = state.values.paidEur || '0';

  // Calculate
  const totalEur = parseFloat(state.values.totalEur) || 0;
  const paidEur = parseFloat(state.values.paidEur) || 0;

  // Calculate remaining in EUR
  const remainingEur = totalEur - paidEur;
  
  // Convert remaining EUR to BGN
  const remainingBgn = remainingEur * RATE;

  // Update result - show in BGN (лева)
  const resultEl = document.getElementById('result-bgn');
  resultEl.textContent = remainingBgn.toFixed(2) + ' лв';
  
  // Color coding: green if positive/zero, red if negative
  if (remainingBgn >= 0) {
    resultEl.style.color = 'var(--color-secondary)';
  } else {
    resultEl.style.color = '#ef4444';
  }
};

const handleInput = (key) => {
  const currentField = state.activeInput;
  let currentVal = state.values[currentField];

  if (key === 'clear') {
    state.values.totalEur = '';
    state.values.paidEur = '';
    state.activeInput = 'totalEur';

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
