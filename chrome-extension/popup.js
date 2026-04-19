// ──────────────────────────────────────────────────────────────────────────────
// Pulseid Assistant — popup.js
// ──────────────────────────────────────────────────────────────────────────────

const logBox   = document.getElementById("logBox");
const fillBtn  = document.getElementById("fillBtn");
const pilotBtn = document.getElementById("autoPilotBtn");
const saveBtn  = document.getElementById("saveBtn");
const savedBadge = document.getElementById("savedBadge");

// ── TAB SWITCHING ─────────────────────────────────────────────────────────────
function switchTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  document.getElementById(`tab-${tab}`).classList.add("active");
  document.getElementById(`panel-${tab}`).classList.add("active");
}
window.switchTab = switchTab;

// ── CHROME STORAGE HELPERS ────────────────────────────────────────────────────
function saveProfile(profile) {
  return new Promise(resolve => chrome.storage.local.set({ pulseid_profile: profile }, resolve));
}

function loadProfile() {
  return new Promise(resolve => {
    chrome.storage.local.get("pulseid_profile", data => {
      resolve(data.pulseid_profile ?? null);
    });
  });
}

// ── LOAD SAVED PROFILE INTO FORM ──────────────────────────────────────────────
loadProfile().then(profile => {
  if (!profile) return;
  document.getElementById("inp-fname").value  = profile.firstName  ?? "";
  document.getElementById("inp-lname").value  = profile.lastName   ?? "";
  document.getElementById("inp-email").value  = profile.email      ?? "";
  document.getElementById("inp-dob").value    = profile.dateOfBirth ?? "";
  document.getElementById("inp-phone").value  = profile.phone      ?? "";
  document.getElementById("inp-ramq").value   = profile.ramq       ?? "";
});

// ── SAVE PROFILE ──────────────────────────────────────────────────────────────
saveBtn.addEventListener("click", async () => {
  const profile = {
    firstName:   document.getElementById("inp-fname").value.trim(),
    lastName:    document.getElementById("inp-lname").value.trim(),
    email:       document.getElementById("inp-email").value.trim(),
    dateOfBirth: document.getElementById("inp-dob").value.trim(),
    phone:       document.getElementById("inp-phone").value.trim(),
    ramq:        document.getElementById("inp-ramq").value.trim(),
  };
  await saveProfile(profile);
  savedBadge.style.display = "block";
  setTimeout(() => { savedBadge.style.display = "none"; }, 3000);
});

// ── LOGGING ───────────────────────────────────────────────────────────────────
function log(msg, type = "info") {
  const br   = document.createElement("br");
  const span = document.createElement("span");
  span.className   = `log-${type}`;
  span.textContent = msg;
  logBox.appendChild(br);
  logBox.appendChild(span);
  logBox.scrollTop = logBox.scrollHeight;
}

function setLoading(isLoading) {
  fillBtn.disabled  = isLoading;
  pilotBtn.disabled = isLoading;
}

// ── LOAD PROFILE FOR SENDING ──────────────────────────────────────────────────
async function getBundle() {
  const profile = await loadProfile();
  if (!profile || !profile.firstName) {
    return null; // no profile saved
  }
  return { profile };
}

// ── TAB HELPERS ───────────────────────────────────────────────────────────────
async function getActiveClicSanteTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab  = tabs[0];
  return (tab?.url?.includes("clicsante.ca")) ? tab : null;
}

function sendToTab(tabId, action, data) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, { action, data }, response => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      else resolve(response);
    });
  });
}

// ── AUTO-FILL ─────────────────────────────────────────────────────────────────
fillBtn.addEventListener("click", async () => {
  setLoading(true);
  log("● Connecting to ClicSante…", "info");

  const tab = await getActiveClicSanteTab();
  if (!tab) {
    log("✕ Navigate to clicsante.ca first.", "error");
    setLoading(false);
    return;
  }

  const bundle = await getBundle();
  if (!bundle) {
    log("⚠ No profile saved yet.", "warn");
    log("  → Go to My Info tab and fill in your details.", "warn");
    setLoading(false);
    return;
  }

  try {
    const response = await sendToTab(tab.id, "AUTO_FILL", bundle);
    if (response?.count > 0) {
      log(`✓ Filled ${response.count} field(s)!`, "success");
    } else if (response?.success === false) {
      log("⚠ Not on Step 5 yet.", "warn");
      log("  → Complete steps 1–4, then click here.", "warn");
    } else {
      log("⚠ Fields found but empty values.", "warn");
      log("  → Check your info in the My Info tab.", "warn");
    }
  } catch (e) {
    log("✕ Error — reload the ClicSante tab.", "error");
  }

  setLoading(false);
});

// ── AUTO-PILOT ────────────────────────────────────────────────────────────────
pilotBtn.addEventListener("click", async () => {
  setLoading(true);
  log("🚀 Auto-Pilot starting…", "info");

  const tab = await getActiveClicSanteTab();
  if (!tab) {
    log("✕ Navigate to clicsante.ca first.", "error");
    setLoading(false);
    return;
  }

  const bundle = await getBundle();
  if (!bundle) {
    log("⚠ No profile saved yet.", "warn");
    log("  → Go to My Info tab and fill in your details.", "warn");
    setLoading(false);
    return;
  }

  try {
    const response = await sendToTab(tab.id, "START_AUTOPILOT", bundle);
    if (response?.status === "stopped_at_step5") {
      log("✓ Step 5 reached — review and click Soumettre.", "success");
    } else if (response?.status === "needs_user_action") {
      log("⚠ Auto-Pilot paused — select the current option.", "warn");
    } else if (response?.status === "already_at_form") {
      log("✓ Form filled — review and click Soumettre.", "success");
    } else {
      log(`ℹ Status: ${response?.status ?? "done"}`, "info");
    }
  } catch (e) {
    log("✕ Error — reload the ClicSante tab and retry.", "error");
  }

  setLoading(false);
});
