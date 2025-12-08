import './style.css'
import './branding.css'
import './mobile.css'
import './desktop.css'

/* --- State & Constants --- */
const RATE = 1.95583;
const MODE_CONVERT = 'convert';
const MODE_CHANGE = 'change';

// Theme State
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';
let currentTheme = localStorage.getItem('theme') || THEME_LIGHT;

const state = {
  mode: MODE_CONVERT,
  values: {
    eur: '',
    bgn: '',
    billEur: '',
    paidBgn: '',
    paidEur: '',
  },
  activeInput: 'eur',
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

    <div class="mode-switch">
      <button class="mode-btn active" data-mode="${MODE_CONVERT}">Конвертор</button>
      <button class="mode-btn" data-mode="${MODE_CHANGE}">Каса (Ресто)</button>
    </div>

    <!-- MAIN SCROLLABLE AREA -->
    <div id="view-convert" class="view-content">
      <div class="input-group" data-target="eur">
        <label class="input-label">Сума в Евро (€)</label>
        <div class="currency-badge">
          <span class="currency-flag">🇪🇺</span> EUR
        </div>
        <div class="currency-input" id="input-eur">0</div>
      </div>
      
      <div class="text-center" style="margin: -0.25rem 0 0.25rem; color: var(--color-text-muted); font-size: 0.8rem; font-weight: 500;">
        1 EUR = ${RATE} BGN
      </div>

      <div class="input-group" data-target="bgn">
        <label class="input-label">Сума в Лева (лв)</label>
        <div class="currency-badge">
          <span class="currency-flag">🇧🇬</span> BGN
        </div>
        <div class="currency-input" id="input-bgn">0</div>
      </div>
      
      <!-- Spacer to push content up if needed -->
      <div style="flex: 1;"></div>
    </div>

    <div id="view-change" class="view-content" style="display: none;">
      <div class="input-group" data-target="billEur">
        <label class="input-label">Дължима Сума (Сметка)</label>
        <div class="currency-badge">🇪🇺 EUR</div>
        <div class="currency-input" id="input-billEur">0</div>
      </div>
      <div id="bill-bgn-equiv" style="text-align: right; margin-top: -0.25rem; margin-bottom: 1rem; color: var(--color-text-muted); font-size: 0.8rem; font-weight: 500;">
        (= 0.00 лв)
      </div>

      <div style="margin: 0.75rem 0 0.5rem; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">
        Клиентът плаща:
      </div>

      <div class="payment-fields-grid">
        <div class="input-group" id="group-paid-eur" data-target="paidEur">
          <label class="input-label">Евро</label>
          <div class="currency-badge" style="font-size: 0.8em; top: 1.8rem;">🇪🇺</div>
          <div class="currency-input" id="input-paidEur">0</div>
        </div>
        
        <div class="input-group" id="group-paid-bgn" data-target="paidBgn">
          <label class="input-label">Лева</label>
          <div class="currency-badge" style="font-size: 0.8em; top: 1.8rem;">🇧🇬</div>
          <div class="currency-input" id="input-paidBgn">0</div>
        </div>
      </div>
      
      <!-- Info section for mobile empty space -->
      <div class="info-section">
        <div class="info-item">
          <span class="info-icon">ℹ️</span>
          <span class="info-text">Попълнете сумата в Евро и/или Лева</span>
        </div>
        <div class="info-item">
          <span class="info-icon">💱</span>
          <span class="info-text">1 EUR = ${RATE} BGN</span>
        </div>
      </div>
    </div>

    <!-- BOTTOM FIXED SECTION -->
    <div class="bottom-section">
      <!-- Result moved inside bottom section for mobile layout -->
      <div id="result-container" class="result-box" style="display:none">
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
        <button class="num-btn" data-key="7">7</button>
        <button class="num-btn" data-key="8">8</button>
        <button class="num-btn" data-key="9">9</button>
        <button class="num-btn" data-key="4">4</button>
        <button class="num-btn" data-key="5">5</button>
        <button class="num-btn" data-key="6">6</button>
        <button class="num-btn" data-key="1">1</button>
        <button class="num-btn" data-key="2">2</button>
        <button class="num-btn" data-key="3">3</button>
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
  // Toggle Views
  const viewConvert = document.getElementById('view-convert');
  const viewChange = document.getElementById('view-change');

  if (state.mode === MODE_CONVERT) {
    if (viewConvert.style.display !== 'block') {
      viewConvert.style.display = 'block';
      viewConvert.classList.add('fade-in');
      setTimeout(() => viewConvert.classList.remove('fade-in'), 300);
    }
    viewChange.style.display = 'none';
  } else {
    viewConvert.style.display = 'none';
    if (viewChange.style.display !== 'block') {
      viewChange.style.display = 'block';
      viewChange.classList.add('fade-in');
      setTimeout(() => viewChange.classList.remove('fade-in'), 300);
    }
  }

  // Toggle Result Container Visibility in Bottom Section
  const resultContainer = document.getElementById('result-container');
  if (state.mode === MODE_CHANGE) {
    if (resultContainer) resultContainer.style.display = 'flex';
  } else {
    if (resultContainer) resultContainer.style.display = 'none';
  }

  // Update Mode Buttons
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === state.mode);
  });

  // Active Input Highlight
  document.querySelectorAll('.currency-input').forEach(el => {
    el.classList.remove('active-input');
  });

  let activeElId = '';
  if (state.mode === MODE_CONVERT) {
    activeElId = state.activeInput === 'eur' ? 'input-eur' : 'input-bgn';
  } else {
    if (state.activeInput === 'billEur') activeElId = 'input-billEur';
    else if (state.activeInput === 'paidBgn') activeElId = 'input-paidBgn';
    else if (state.activeInput === 'paidEur') activeElId = 'input-paidEur';
  }

  const activeEl = document.getElementById(activeElId);
  if (activeEl) {
    activeEl.classList.add('active-input');
  }

  // Render Values
  document.getElementById('input-eur').textContent = state.values.eur || '0';
  document.getElementById('input-bgn').textContent = state.values.bgn || '0';
  document.getElementById('input-billEur').textContent = state.values.billEur || '0';
  document.getElementById('input-paidBgn').textContent = state.values.paidBgn || '0';
  document.getElementById('input-paidEur').textContent = state.values.paidEur || '0';

  // Calculate Change
  if (state.mode === MODE_CHANGE) {
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
  }
};

const handleInput = (key) => {
  const currentField = state.activeInput;
  let currentVal = state.values[currentField];

  if (key === 'clear') {
    state.values.eur = '';
    state.values.bgn = '';
    state.values.billEur = '';
    state.values.paidBgn = '';
    state.values.paidEur = '';

    if (state.mode === MODE_CHANGE) state.activeInput = 'billEur';
    else state.activeInput = 'eur';

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

  // Recalculate Converter Mode
  if (state.mode === MODE_CONVERT && key !== 'clear') {
    const val = parseFloat(state.values[currentField]);
    if (!isNaN(val)) {
      if (currentField === 'eur') {
        state.values.bgn = (val * RATE).toFixed(2);
      } else {
        state.values.eur = (val / RATE).toFixed(2);
      }
    } else {
      if (state.values[currentField] === '') {
        state.values.eur = '';
        state.values.bgn = '';
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

let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

/* --- Event Listeners --- */

document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    state.mode = e.target.dataset.mode;
    if (state.mode === MODE_CONVERT) {
      state.activeInput = 'eur';
    } else {
      state.activeInput = 'billEur';
      // Auto-scroll on mobile to hide header and focus on content
      setTimeout(() => {
        const inputContainer = document.getElementById('view-change');
        if (inputContainer) {
          inputContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
    updateUI();
  });
});


document.querySelectorAll('.input-group').forEach(group => {
  group.addEventListener('click', (e) => {
    const target = group.dataset.target;
    if (target) {
      state.activeInput = target;
      updateUI();
    }
  });
});

document.querySelector('.numpad').addEventListener('click', (e) => {
  if (e.target.classList.contains('num-btn')) {
    const key = e.target.dataset.key;
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
