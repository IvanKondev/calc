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
    <div class="header-row">
       <h1>
        <span style="color: var(--color-primary)">€</span>
        <span style="color: var(--color-text-muted)">⇔</span>
        <span style="color: var(--color-secondary)">Лв</span>
        <span class="desktop-only" style="margin-left:5px">Калкулатор</span>
      </h1>
      <div class="header-actions">
        <button class="theme-toggle" id="btn-fullscreen" title="Цял Екран" style="font-size: 1rem;">
          ⛶
        </button>
        <button class="theme-toggle" id="btn-theme" title="Смени Тема">
          ${currentTheme === THEME_LIGHT ? '🌙' : '☀️'}
        </button>
      </div>
    </div>

    <!-- MAIN SCROLLABLE AREA - KASA ONLY -->
    <div id="view-change" class="view-content" style="display: flex;">
      <div class="input-group" data-target="billEur">
        <label class="input-label">Дължима Сума (Сметка)</label>
        <div class="currency-badge">🇪🇺 EUR</div>
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
          <div class="currency-badge" style="font-size: 0.8em; top: 1.8rem;">🇧🇬</div>
          <div class="currency-input" id="input-paidBgn">0</div>
        </div>
        
        <div class="input-group" id="group-paid-eur" data-target="paidEur">
          <label class="input-label">Евро</label>
          <div class="currency-badge" style="font-size: 0.8em; top: 1.8rem;">🇪🇺</div>
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

document.querySelector('.numpad').addEventListener('pointerdown', (e) => {
  // Instant Haptic Feedback on 'Touch Down'
  if (e.target.closest('.num-btn')) {
    if (navigator.vibrate) {
      try {
        navigator.vibrate(50);
      } catch (err) {
        // Ignore vibration errors
      }
    }
    // Visual feedback helper if needed in future
  }
});

document.querySelector('.numpad').addEventListener('click', (e) => {
  // Handle Input
  const btn = e.target.closest('.num-btn');
  if (btn) {
    const key = btn.dataset.key;
    handleInput(key);
  }
});

document.addEventListener('keydown', (e) => {
  const key = e.key;
  if (!isNaN(key)) handleInput(key);
  if (key === '.') handleInput('.');
  if (key === 'Backspace') handleInput('back');
  if (key === 'Escape') handleInput('clear');
});

// Init
updateUI();
