(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function s(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(a){if(a.ep)return;a.ep=!0;const o=s(a);fetch(a.href,o)}})();const d=1.95583,p="convert",y="change",u="pay_bgn",v="pay_eur",B="pay_mixed",E="light",M="dark";let g=localStorage.getItem("theme")||E;const e={mode:p,payMode:u,values:{eur:"",bgn:"",billEur:"",paidBgn:"",paidEur:""},activeInput:"eur"};document.querySelector("#app").innerHTML=`
  <div class="container">
    <div class="header-row">
       <h1>
        <span style="color: var(--color-primary)">€</span>uro
        <span style="color: var(--color-text-muted)">⇔</span>
        <span style="color: var(--color-secondary)">Лев</span>
      </h1>
      <button class="theme-toggle" id="btn-theme" title="Смени Тема">
        ${g===E?"🌙":"☀️"}
      </button>
    </div>

    <div class="mode-switch">
      <button class="mode-btn active" data-mode="${p}">КОНВЕРТОР</button>
      <button class="mode-btn" data-mode="${y}">Kаса (РЕСТО)</button>
    </div>

    <!-- Convert Mode UI -->
    <div id="view-convert">
      <div class="input-group" data-target="eur">
        <label class="input-label">Сума в Евро (€)</label>
        <div class="currency-badge">
          <span class="currency-flag">🇪🇺</span> EUR
        </div>
        <div class="currency-input" id="input-eur">0</div>
      </div>
      
      <div class="text-center" style="margin: -0.5rem 0 0.5rem; color: var(--color-text-muted); font-size: 0.9rem; font-weight: 500;">
        1 EUR = ${d} BGN
      </div>

      <div class="input-group" data-target="bgn">
        <label class="input-label">Сума в Лева (лв)</label>
        <div class="currency-badge">
          <span class="currency-flag">🇧🇬</span> BGN
        </div>
        <div class="currency-input" id="input-bgn">0</div>
      </div>
    </div>

    <!-- Change Mode UI -->
    <div id="view-change" style="display: none;">
      <div class="input-group" data-target="billEur">
        <label class="input-label">Дължима Сума (Сметка)</label>
        <div class="currency-badge">🇪🇺 EUR</div>
        <div class="currency-input" id="input-billEur">0</div>
      </div>
      <!-- NEW: BGN Equivalent for Bill -->
      <div id="bill-bgn-equiv" style="text-align: right; margin-top: -0.5rem; margin-bottom: 1rem; color: var(--color-text-muted); font-size: 0.9rem; font-weight: 500;">
        (= 0.00 лв)
      </div>

      <div style="margin: 1.5rem 0 0.5rem; font-size: 0.8rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em;">
        Клиентът плаща с:
      </div>

      <!-- Payment Toggles -->
      <div class="payment-toggles">
        <button class="payment-toggle-btn active" data-pay="${u}">🇧🇬 САМО ЛЕВА</button>
        <button class="payment-toggle-btn" data-pay="${v}">🇪🇺 САМО ЕВРО</button>
        <button class="payment-toggle-btn" data-pay="${B}">🔀 СМЕСЕНО</button>
      </div>

      <div class="flex" style="gap: 1rem;">
        <div class="input-group" style="flex: 1;" id="group-paid-bgn" data-target="paidBgn">
          <label class="input-label">Лева</label>
          <div class="currency-badge" style="font-size: 0.9em;">🇧🇬</div>
          <div class="currency-input" id="input-paidBgn">0</div>
        </div>
        
        <div class="input-group" style="flex: 1; display: none;" id="group-paid-eur" data-target="paidEur">
          <label class="input-label">Евро</label>
          <div class="currency-badge" style="font-size: 0.9em;">🇪🇺</div>
          <div class="currency-input" id="input-paidEur">0</div>
        </div>
      </div>

      <div class="result-box" style="margin-top: 1.5rem; padding: 1.5rem; background: var(--color-surface-hover); border-radius: var(--radius-lg); border: 2px solid var(--color-secondary);">
        <label class="input-label" id="label-result" style="color: var(--color-secondary); font-size: 1rem;">РЕСТО ЗА ВРЪЩАНЕ (ЕВРО)</label>
        <div id="output-change-eur" style="font-size: 3rem; line-height: 1; font-weight: 800; color: var(--color-secondary); text-align: right; margin: 0.5rem 0;">
          0.00 €
        </div>
        <div id="output-change-bgn" style="text-align: right; color: var(--color-text-muted); font-size: 1rem; font-weight: 500;">
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
  </div>
`;const w=()=>{g===M?(document.body.classList.add("dark-theme"),document.getElementById("btn-theme").textContent="☀️"):(document.body.classList.remove("dark-theme"),document.getElementById("btn-theme").textContent="🌙"),localStorage.setItem("theme",g)};w();document.getElementById("btn-theme").addEventListener("click",()=>{g=g===E?M:E,w()});const b=()=>{const n=document.getElementById("view-convert"),t=document.getElementById("view-change");e.mode===p?(n.style.display!=="block"&&(n.style.display="block",n.classList.add("fade-in"),setTimeout(()=>n.classList.remove("fade-in"),300)),t.style.display="none"):(n.style.display="none",t.style.display!=="block"&&(t.style.display="block",t.classList.add("fade-in"),setTimeout(()=>t.classList.remove("fade-in"),300))),document.querySelectorAll(".mode-btn").forEach(l=>{l.classList.toggle("active",l.dataset.mode===e.mode)}),document.querySelectorAll(".payment-toggle-btn").forEach(l=>{l.classList.toggle("active",l.dataset.pay===e.payMode)});const s=document.getElementById("group-paid-bgn"),i=document.getElementById("group-paid-eur");e.mode===y&&(e.payMode===u?(s.style.display="block",i.style.display="none"):e.payMode===v?(s.style.display="none",i.style.display="block"):(s.style.display="block",i.style.display="block")),document.querySelectorAll(".currency-input").forEach(l=>{l.classList.remove("active-input")});let a="";e.mode===p?a=e.activeInput==="eur"?"input-eur":"input-bgn":e.activeInput==="billEur"?a="input-billEur":e.activeInput==="paidBgn"?a="input-paidBgn":e.activeInput==="paidEur"&&(a="input-paidEur");const o=document.getElementById(a);if(o&&o.parentElement.parentElement.style.display!=="none"&&o.parentElement.style.display!=="none"?o.classList.add("active-input"):e.mode===y&&(e.payMode===u&&e.activeInput==="paidEur"?(e.activeInput="paidBgn",document.getElementById("input-paidBgn").classList.add("active-input")):e.payMode===v&&e.activeInput==="paidBgn"&&(e.activeInput="paidEur",document.getElementById("input-paidEur").classList.add("active-input"))),document.getElementById("input-eur").textContent=e.values.eur||"0",document.getElementById("input-bgn").textContent=e.values.bgn||"0",document.getElementById("input-billEur").textContent=e.values.billEur||"0",document.getElementById("input-paidBgn").textContent=e.values.paidBgn||"0",document.getElementById("input-paidEur").textContent=e.values.paidEur||"0",e.mode===y){const l=parseFloat(e.values.billEur)||0,N=l*d;document.getElementById("bill-bgn-equiv").textContent=`(= ${N.toFixed(2)} лв)`;let x=0,k=0;(e.payMode===u||e.payMode===B)&&(x=parseFloat(e.values.paidBgn)||0),(e.payMode===v||e.payMode===B)&&(k=parseFloat(e.values.paidEur)||0);const q=x/d,f=k+q,C=f-l,A=C*d,r=document.getElementById("output-change-eur"),h=document.getElementById("output-change-bgn"),c=document.getElementById("label-result"),I=document.querySelector(".result-box");if(l>0&&f>=l)r.textContent=C.toFixed(2)+" €",h.textContent=`(= ${A.toFixed(2)} лв)`,r.style.color="var(--color-secondary)",c.textContent="РЕСТО ЗА ВРЪЩАНЕ (ЕВРО)",c.style.color="var(--color-secondary)",I.style.borderColor="var(--color-secondary)";else if(l>0&&f<l){const L=l-f,F=L*d;r.textContent="Още "+L.toFixed(2)+" €",h.textContent=`(Още ${F.toFixed(2)} лв)`,r.style.color="#ef4444",c.textContent="НЕДОСТАТЪЧНО (ОСТАВАТ)",c.style.color="#ef4444",I.style.borderColor="#ef4444"}else r.textContent="0.00 €",h.textContent="(= 0.00 лв)",r.style.color="var(--color-text-muted)",c.textContent="РЕСТО ЗА ВРЪЩАНЕ (ЕВРО)",c.style.color="var(--color-secondary)",I.style.borderColor="var(--color-secondary)"}},m=n=>{const t=e.activeInput;let s=e.values[t];if(n==="clear"?(e.values.eur="",e.values.bgn="",e.values.billEur="",e.values.paidBgn="",e.values.paidEur="",e.mode===y?e.activeInput="billEur":e.activeInput="eur"):n==="back"?e.values[t]=s.slice(0,-1):n==="."?s.includes(".")||(e.values[t]=s?s+".":"0."):s==="0"&&n!=="."?e.values[t]=n:s.length<10&&(e.values[t]+=n),e.mode===p&&n!=="clear"){const i=parseFloat(e.values[t]);isNaN(i)?e.values[t]===""&&(e.values.eur="",e.values.bgn=""):t==="eur"?e.values.bgn=(i*d).toFixed(2):e.values.eur=(i/d).toFixed(2)}b()};document.querySelectorAll(".mode-btn").forEach(n=>{n.addEventListener("click",t=>{e.mode=t.target.dataset.mode,e.mode===p?e.activeInput="eur":e.activeInput="billEur",b()})});document.querySelectorAll(".payment-toggle-btn").forEach(n=>{n.addEventListener("click",t=>{e.payMode=t.target.dataset.pay,e.payMode===u?e.activeInput="paidBgn":e.payMode===v&&(e.activeInput="paidEur"),b()})});document.querySelectorAll(".input-group").forEach(n=>{n.addEventListener("click",t=>{const s=n.dataset.target,i=document.getElementById("input-"+s);i&&i.parentElement.style.display!=="none"&&i.parentElement.parentElement.style.display!=="none"&&(e.activeInput=s,b())})});document.querySelector(".numpad").addEventListener("click",n=>{if(n.target.classList.contains("num-btn")){const t=n.target.dataset.key;m(t)}});document.addEventListener("keydown",n=>{const t=n.key;isNaN(t)||m(t),t==="."&&m("."),t==="Backspace"&&m("back"),t==="Escape"&&m("clear")});b();
