// ──────────────────────────────────────────────────────────────────────────────
// Pulseid Assistant — content.js (injected into clicsante.ca)
// Built from real ClicSante HTML: Vuetify 2.x + Vue 2 (data-testid selectors)
// ──────────────────────────────────────────────────────────────────────────────

console.log("[Pulseid] Content script loaded on ClicSante.");

// ── HELPERS ───────────────────────────────────────────────────────────────────

/**
 * Fill a Vuetify 2.x / Vue 2 input.
 * Vue 2 replaces each input's `value` property with a reactive getter/setter
 * via Object.defineProperty. We must trigger the Vue setter, not the native one.
 */
function fillInput(el, value) {
  if (!el || value === undefined || value === null || value === "") return false;

  // 1. Try Vue 2's reactive setter via the element's __vue__ component
  try {
    const vueInstance = el.__vue__;
    if (vueInstance && typeof vueInstance.$emit === "function") {
      vueInstance.$emit("input", value);
      vueInstance.$emit("change", value);
    }
  } catch {}

  // 2. Walk up to find the Vuetify v-text-field __vue__ wrapper
  try {
    let parent = el.parentElement;
    for (let i = 0; i < 8 && parent; i++) {
      if (parent.__vue__ && parent.__vue__.lazyValue !== undefined) {
        parent.__vue__.lazyValue = value;
        parent.__vue__.$emit("input", value);
        break;
      }
      parent = parent.parentElement;
    }
  } catch {}

  // 3. Native setter fallback (for non-Vue fields)
  const nativeSetter =
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  if (nativeSetter) {
    nativeSetter.call(el, value);
  } else {
    el.value = value;
  }

  // 4. Full event chain — Vue 2 + Vuetify needs all of these
  el.focus();
  el.dispatchEvent(new Event("focus",  { bubbles: true }));
  el.dispatchEvent(new Event("input",  { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
  el.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true, key: "End" }));
  el.dispatchEvent(new Event("blur",   { bubbles: true }));

  return true;
}

/**
 * Auto-fill ClicSante Step 5 form using exact selectors from the real HTML.
 * Fields use Vuetify's v-text-field with `name` attributes and `data-testid`.
 */
function doAutoFill(bundle) {
  const p = bundle?.profile ?? {};
  let count = 0;

  // ── EXACT SELECTORS from real ClicSante HTML ──────────────────────

  // 1. Prénom  →  input#first_name[name="first_name"] / data-testid="first-name-input"
  const firstName = document.querySelector(
    'input#first_name, input[name="first_name"], input[data-testid="first-name-input"]'
  );
  if (firstName && fillInput(firstName, p.firstName)) {
    console.log("[Pulseid] ✓ Filled: Prénom");
    count++;
  }

  // 2. Nom de famille  →  input#last_name[name="last_name"] / data-testid="last-name-input"
  const lastName = document.querySelector(
    'input#last_name, input[name="last_name"], input[data-testid="last-name-input"]'
  );
  if (lastName && fillInput(lastName, p.lastName)) {
    console.log("[Pulseid] ✓ Filled: Nom de famille");
    count++;
  }

  // 3. Courriel  →  input#email[name="email"] / data-testid="email-input"
  const email = document.querySelector(
    'input#email, input[name="email"], input[data-testid="email-input"]'
  );
  if (email && fillInput(email, p.email)) {
    console.log("[Pulseid] ✓ Filled: Courriel");
    count++;
  }

  // 4. Confirmation du courriel  →  input[name="confirmEmail"] / data-testid="confirm-email-input"
  const confirmEmail = document.querySelector(
    'input[name="confirmEmail"], input[data-testid="confirm-email-input"]'
  );
  if (confirmEmail && fillInput(confirmEmail, p.email)) {
    console.log("[Pulseid] ✓ Filled: Confirmation courriel");
    count++;
  }

  // 5. Date de naissance  →  input#birthday[name="birthday"]
  const birthday = document.querySelector(
    'input#birthday, input[name="birthday"]'
  );
  if (birthday && fillInput(birthday, p.dateOfBirth)) {
    console.log("[Pulseid] ✓ Filled: Date de naissance");
    count++;
  }

  // 6. Téléphone  →  input#phone[name="phone"] / data-testid="phone-input"
  const phone = document.querySelector(
    'input#phone, input[name="phone"], input[data-testid="phone-input"]'
  );
  if (phone && fillInput(phone, p.phone)) {
    console.log("[Pulseid] ✓ Filled: Téléphone");
    count++;
  }

  return count;
}

/**
 * Detect if we're on Step 5 (the personal info form).
 * ClicSante uses a Vuetify v-stepper with numbered steps.
 */
function isOnPersonalInfoStep() {
  // Check for the presence of the first_name input (only exists on Step 5)
  return !!document.querySelector(
    'input#first_name, input[name="first_name"], input[data-testid="first-name-input"]'
  );
}

/**
 * Inject a floating badge onto the page for user guidance.
 */
function showBadge(message, type = "info") {
  document.getElementById("pulseid-badge")?.remove();

  const colors = {
    info:    { bg: "#0f0623e8", border: "#6366f1", dot: "#818cf8" },
    success: { bg: "#021a0fe8", border: "#10b981", dot: "#34d399" },
    warn:    { bg: "#1c1200e8", border: "#f59e0b", dot: "#fbbf24" },
  };
  const c = colors[type] ?? colors.info;

  const badge = document.createElement("div");
  badge.id = "pulseid-badge";
  badge.style.cssText = `
    position: fixed; bottom: 24px; right: 24px;
    z-index: 2147483647;
    background: ${c.bg};
    backdrop-filter: blur(12px);
    border: 1px solid ${c.border};
    border-radius: 16px;
    padding: 16px 20px;
    max-width: 320px;
    font-family: -apple-system, 'Inter', system-ui, sans-serif;
    font-size: 13px;
    color: #e8e8f0;
    box-shadow: 0 12px 48px rgba(0,0,0,0.7);
    display: flex; align-items: flex-start; gap: 10px;
    animation: pulseidSlideIn 0.35s cubic-bezier(.22,1,.36,1);
    line-height: 1.55;
  `;

  badge.innerHTML = `
    <style>@keyframes pulseidSlideIn { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }</style>
    <span style="width:8px;height:8px;border-radius:50%;background:${c.dot};flex-shrink:0;margin-top:5px;box-shadow:0 0 8px 3px ${c.dot}60;"></span>
    <div>
      <div style="font-weight:700;margin-bottom:4px;color:#fff;font-size:14px;">Pulseid Assistant</div>
      <div style="opacity:0.9;">${message}</div>
    </div>
    <button onclick="this.closest('#pulseid-badge').remove()" style="background:none;border:none;color:#6b6b8a;cursor:pointer;padding:4px;margin-left:auto;font-size:18px;line-height:1;">&times;</button>
  `;

  document.body.appendChild(badge);
  setTimeout(() => badge?.remove(), 12000);
}

// ── AUTO-PILOT ENGINE ─────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/**
 * Click "Non" radio buttons on eligibility question pages.
 * ClicSante uses custom radio divs with data-radio values.
 */
function answerEligibilityNo() {
  // ClicSante uses accessible-radio with data-radio="0" (Moi-même) etc.
  // For yes/no eligibility Qs, look for radio options containing "Non"
  const radioOptions = document.querySelectorAll('[role="radio"]');
  let clicked = false;
  for (const radio of radioOptions) {
    const text = radio.textContent?.trim().toLowerCase() ?? "";
    if (text.includes("non") || text.includes("no")) {
      radio.click();
      clicked = true;
    }
  }
  return clicked;
}

/**
 * Click the Vuetify "Suivant" / next step button.
 * ClicSante uses: button.button-secondary-color[data-testid] with "Suivant" text
 */
function clickNext() {
  const allButtons = [...document.querySelectorAll("button")];
  const nextWords = /suivant|next|continue|continuer/i;

  for (const btn of allButtons) {
    if (btn.disabled || btn.getAttribute("aria-disabled") === "true") continue;
    const text = btn.textContent?.trim() ?? "";
    if (nextWords.test(text)) {
      btn.click();
      return true;
    }
  }
  return false;
}

/**
 * Main Auto-Pilot loop.
 * Navigates through ClicSante steps, answering eligibility Qs.
 * STOPS at Step 5 (personal info form) and auto-fills it.
 */
async function runAutoPilot(bundle) {
  const MAX = 25;

  for (let i = 0; i < MAX; i++) {
    await sleep(800);
    console.log(`[Pulseid Auto-Pilot] Iteration ${i + 1}`);

    // ── Reached Step 5? Stop and fill ──────────────────────────────
    if (isOnPersonalInfoStep()) {
      await sleep(600);
      const filled = doAutoFill(bundle);
      showBadge(
        `Auto-Pilot complete ✓<br><br>` +
        `Filled <b>${filled}</b> field(s). Please <b>review</b> your information, then click <b>Soumettre</b>.`,
        "success"
      );
      return { status: "stopped_at_step5" };
    }

    // ── Try answering yes/no questions ─────────────────────────────
    const hasRadio = document.querySelector('[role="radio"], [role="radiogroup"]');
    if (hasRadio) {
      answerEligibilityNo();
      await sleep(500);
    }

    // ── Try clicking Next ──────────────────────────────────────────
    const advanced = clickNext();
    if (!advanced) {
      const filled = doAutoFill(bundle);
      if (filled > 0) {
        showBadge(`Auto-filled <b>${filled}</b> field(s). Review and confirm.`, "success");
        return { status: "already_at_form" };
      }

      showBadge(
        `Auto-Pilot needs your help.<br><br>` +
        `Please complete the current step (pick a service, date, etc.), then click <b>Auto-Pilot</b> again.`,
        "warn"
      );
      return { status: "needs_user_action" };
    }

    await sleep(1500);
  }

  showBadge("Auto-Pilot timed out. Try running it again from the current step.", "warn");
  return { status: "timeout" };
}

// ── MESSAGE LISTENER ──────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "AUTO_FILL") {
    const bundle = request.data ?? {};

    if (!isOnPersonalInfoStep()) {
      showBadge(
        `You're not on the personal info step yet.<br><br>` +
        `Please complete steps 1–4 (service, questions, location, date), then try <b>Auto-fill</b> on step 5.`,
        "warn"
      );
      sendResponse({ success: false, count: 0 });
      return true;
    }

    const count = doAutoFill(bundle);
    if (count > 0) {
      showBadge(`Filled <b>${count}</b> field(s) — please review before clicking <b>Soumettre</b>.`, "success");
    } else {
      showBadge(`Fields found but no profile data to fill. Set up your Pulseid profile first.`, "warn");
    }
    sendResponse({ success: true, count });
    return true;
  }

  if (request.action === "START_AUTOPILOT") {
    showBadge("Auto-Pilot engaged. Navigating through steps…", "info");
    runAutoPilot(request.data ?? {}).then(result => {
      sendResponse(result);
    });
    return true;
  }
});
