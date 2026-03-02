const screens = Array.from(document.querySelectorAll(".screen"));
const nextButtons = Array.from(document.querySelectorAll(".next"));
const backButtons = Array.from(document.querySelectorAll(".back"));

const progressLabel = document.getElementById("progressLabel");
const progressFill = document.getElementById("progressFill");

let currentScreen = 0;

const score = {
  p1: false,
  p2: false,
  p3: false,
  p4: false
};

function updateProgress(){
  const total = screens.length;
  const step = currentScreen + 1;
  progressLabel.textContent = `Step ${step} of ${total}`;
  const pct = Math.round((step / total) * 100);
  progressFill.style.width = `${pct}%`;
}

function countCorrect(){
  return Object.values(score).filter(Boolean).length;
}

function renderResults(){
  const correct = countCorrect();
  const scoreText = document.getElementById("scoreText");
  const masteryText = document.getElementById("masteryText");

  if (scoreText) scoreText.textContent = `${correct} / 4`;

  if (masteryText){
    if (correct >= 3){
      masteryText.textContent = "Mastery achieved. You met the goal by applying the procedure across varied contexts.";
    } else {
      masteryText.textContent = "Not yet. Review feedback and try again. Focus on identifying role first, then writing role-appropriate alt text.";
    }
  }
}

function showScreen(index){
  screens.forEach(s => s.classList.remove("active"));
  screens[index].classList.add("active");
  currentScreen = index;
  updateProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });

  const id = screens[index].id;

  // Shuffle choices when entering any practice screen
  shuffleForScreenId(id);

  if (id === "results") renderResults();
}

nextButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (currentScreen < screens.length - 1) showScreen(currentScreen + 1);
  });
});

backButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (currentScreen > 0) showScreen(currentScreen - 1);
  });
});

function setFeedback(el, type, text){
  if (!el) return;
  el.classList.remove("good", "warn", "bad");
  if (type) el.classList.add(type);
  el.textContent = text;
}

function normalize(s){
  return (s || "").trim().toLowerCase();
}

function hasRedundantPrefix(alt){
  return alt.includes("image of") || alt.includes("picture of") || alt.includes("photo of");
}

/* Transcript toggle (Demo) */
const toggleTranscriptBtn = document.getElementById("toggleTranscript");
const transcriptEl = document.getElementById("transcript");

if (toggleTranscriptBtn && transcriptEl) {
  toggleTranscriptBtn.addEventListener("click", () => {
    const isHidden = transcriptEl.hasAttribute("hidden");
    if (isHidden) {
      transcriptEl.removeAttribute("hidden");
      toggleTranscriptBtn.setAttribute("aria-expanded", "true");
      toggleTranscriptBtn.textContent = "Hide transcript";
    } else {
      transcriptEl.setAttribute("hidden", "");
      toggleTranscriptBtn.setAttribute("aria-expanded", "false");
      toggleTranscriptBtn.textContent = "View transcript";
    }
  });
}

const demoAudio = document.getElementById("demoAudio");
const transcriptLines = Array.from(document.querySelectorAll(".tline"));

function setActiveTranscriptLine(currentTime){
  let activeFound = false;

  transcriptLines.forEach(line => {
    const start = parseFloat(line.dataset.start);
    const end = parseFloat(line.dataset.end);

    const isActive = currentTime >= start && currentTime < end;
    line.classList.toggle("active", isActive);

    if (isActive) activeFound = true;
  });

  if (!activeFound) {
    transcriptLines.forEach(line => line.classList.remove("active"));
  }
}

if (demoAudio && transcriptLines.length > 0) {
  demoAudio.addEventListener("timeupdate", () => {
    setActiveTranscriptLine(demoAudio.currentTime);
  });

  transcriptLines.forEach(line => {
    line.addEventListener("click", () => {
      const start = parseFloat(line.dataset.start);
      if (!Number.isNaN(start)) {
        demoAudio.currentTime = start;
        demoAudio.play();
      }
    });
  });
}

/* Practice 1 */
const fb1 = document.getElementById("feedback1");
const check1 = document.getElementById("check1");
const reset1 = document.getElementById("reset1");

if (check1){
  check1.addEventListener("click", () => {
    const role = document.querySelector('input[name="role1"]:checked');
    const alt = normalize(document.getElementById("alt1")?.value);

    score.p1 = false;

    if (!role) return setFeedback(fb1, "warn", "Select an image role first, then write alt text.");
    if (role.value !== "informative") return setFeedback(fb1, "bad", "Not quite. In an article where the image adds meaning, the role is Informative.");

    if (!alt) return setFeedback(fb1, "warn", "Write alt text that communicates what the image adds to the article.");
    if (hasRedundantPrefix(alt)) return setFeedback(fb1, "bad", "Remove “image/picture/photo of”. That wording is redundant for screen readers.");
    if (alt.length < 22) return setFeedback(fb1, "warn", "Too brief. Include the key meaning or action (for example, traders working on the NYSE floor).");

    score.p1 = true;
    setFeedback(fb1, "good", "Correct. Informative role + purpose-focused alt text that avoids redundancy.");
  });
}

if (reset1){
  reset1.addEventListener("click", () => {
    const r = document.querySelector('input[name="role1"]:checked');
    if (r) r.checked = false;
    const alt1 = document.getElementById("alt1");
    if (alt1) alt1.value = "";
    score.p1 = false;
    setFeedback(fb1, "", "");
  });
}

/* Practice 2 */
const fb2 = document.getElementById("feedback2");
const check2 = document.getElementById("check2");
const reset2 = document.getElementById("reset2");

if (check2){
  check2.addEventListener("click", () => {
    const role = document.querySelector('input[name="role2"]:checked');
    const alt = normalize(document.getElementById("alt2")?.value);

    score.p2 = false;

    if (!role)
      return setFeedback(fb2, "warn", "Select an image role first, then write alt text.");

    if (role.value !== "functional")
      return setFeedback(fb2, "bad", "Because this image is used as an interactive control, the correct role is Functional.");

    if (!alt)
      return setFeedback(fb2, "warn", "Write alt text that describes what happens when this control is activated.");

    if (hasRedundantPrefix(alt))
      return setFeedback(fb2, "bad", "Avoid “image of” or describing appearance. Functional alt text focuses on the action.");

    const hasAction =
      alt.includes("select") ||
      alt.includes("choose") ||
      alt.includes("change") ||
      alt.includes("display") ||
      alt.includes("preference") ||
      alt.includes("option") ||
      alt.includes("settings");

    if (!hasAction)
      return setFeedback(fb2, "warn", "Describe the action performed (for example, “Choose display preference” or “Change display option”).");

    score.p2 = true;
    setFeedback(fb2, "good", "Correct. Functional images require action-based alt text that reflects what the control does.");
  });
}

if (reset2){
  reset2.addEventListener("click", () => {
    const r = document.querySelector('input[name="role2"]:checked');
    if (r) r.checked = false;
    const alt2 = document.getElementById("alt2");
    if (alt2) alt2.value = "";
    score.p2 = false;
    setFeedback(fb2, "", "");
  });
}

/* Practice 3 */
const fb3 = document.getElementById("feedback3");
const check3 = document.getElementById("check3");
const reset3 = document.getElementById("reset3");

if (check3){
  check3.addEventListener("click", () => {
    const role = document.querySelector('input[name="role3"]:checked');

    score.p3 = false;

    if (!role) return setFeedback(fb3, "warn", "Select an image role.");
    if (role.value !== "decorative") return setFeedback(fb3, "bad", "Not quite. In this context it’s a background image, so it is Decorative and should use empty alt text.");

    score.p3 = true;
    setFeedback(fb3, "good", "Correct. Decorative images should use empty alt text: alt=\"\".");
  });
}

if (reset3){
  reset3.addEventListener("click", () => {
    const r = document.querySelector('input[name="role3"]:checked');
    if (r) r.checked = false;
    score.p3 = false;
    setFeedback(fb3, "", "");
  });
}

/* Practice 4 */
const fb4 = document.getElementById("feedback4");
const check4 = document.getElementById("check4");
const reset4 = document.getElementById("reset4");

if (check4){
  check4.addEventListener("click", () => {
    const role = document.querySelector('input[name="role4"]:checked');
    const alt = normalize(document.getElementById("alt4")?.value);

    score.p4 = false;

    if (!role) return setFeedback(fb4, "warn", "Select an image role first, then write a short summary alt text.");
    if (role.value !== "complex") return setFeedback(fb4, "bad", "This is a data-dense chart, so the role is Complex.");

    if (!alt) return setFeedback(fb4, "warn", "Write a short summary of what the chart shows.");
    if (hasRedundantPrefix(alt)) return setFeedback(fb4, "bad", "Avoid “image of”. Start with what the chart shows.");
    if (alt.length < 18) return setFeedback(fb4, "warn", "Too brief. Mention what is being plotted (price vs time) and the general pattern.");

    const hasChartWord = alt.includes("chart") || alt.includes("candlestick") || alt.includes("graph");
    const hasTimeOrPrice = alt.includes("time") || alt.includes("price") || alt.includes("gbp") || alt.includes("usd");

    if (!hasChartWord || !hasTimeOrPrice){
      return setFeedback(fb4, "warn", "Include that it’s a chart/graph and what it represents (for example, GBP/USD price over time).");
    }

    score.p4 = true;
    setFeedback(fb4, "good", "Correct. Complex images need a short alt summary plus a longer description elsewhere.");
  });
}

if (reset4){
  reset4.addEventListener("click", () => {
    const r = document.querySelector('input[name="role4"]:checked');
    if (r) r.checked = false;
    const alt4 = document.getElementById("alt4");
    if (alt4) alt4.value = "";
    score.p4 = false;
    setFeedback(fb4, "", "");
  });
}

/* Restart */
const restartBtn = document.getElementById("restart");
if (restartBtn){
  restartBtn.addEventListener("click", () => {
    score.p1 = score.p2 = score.p3 = score.p4 = false;

    ["role1","role2","role3","role4"].forEach(name => {
      const checked = document.querySelector(`input[name="${name}"]:checked`);
      if (checked) checked.checked = false;
    });

    ["alt1","alt2","alt4"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });

    setFeedback(fb1, "", "");
    setFeedback(fb2, "", "");
    setFeedback(fb3, "", "");
    setFeedback(fb4, "", "");

    if (transcriptEl && !transcriptEl.hasAttribute("hidden")) {
      transcriptEl.setAttribute("hidden", "");
      if (toggleTranscriptBtn) {
        toggleTranscriptBtn.setAttribute("aria-expanded", "false");
        toggleTranscriptBtn.textContent = "View transcript";
      }
    }
    shuffleAllPracticeChoices();
    showScreen(4);
  });
}
function shuffleOptions(groupName){
  const options = Array.from(document.querySelectorAll(`input[name="${groupName}"]`));
  if(options.length === 0) return;

  const container = options[0].closest(".choices");
  const labels = options.map(input => input.closest("label"));

  // Fisher–Yates shuffle
  for(let i = labels.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [labels[i], labels[j]] = [labels[j], labels[i]];
  }

  labels.forEach(label => container.appendChild(label));
}

document.addEventListener("DOMContentLoaded", () => {
  shuffleOptions("role1");
  shuffleOptions("role2");
  shuffleOptions("role3");
  shuffleOptions("role4");
});

function shuffleOptions(groupName){
  const inputs = Array.from(document.querySelectorAll(`input[name="${groupName}"]`));
  if (inputs.length === 0) return;

  const container = inputs[0].closest(".choices");
  if (!container) return;

  const labels = inputs.map(input => input.closest("label")).filter(Boolean);

  for (let i = labels.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [labels[i], labels[j]] = [labels[j], labels[i]];
  }

  labels.forEach(label => container.appendChild(label));
}

function shuffleAllPracticeChoices(){
  shuffleOptions("role1");
  shuffleOptions("role2");
  shuffleOptions("role3");
  shuffleOptions("role4");
}

function shuffleForScreenId(screenId){
  if (screenId === "practice1") shuffleOptions("role1");
  if (screenId === "practice2") shuffleOptions("role2");
  if (screenId === "practice3") shuffleOptions("role3");
  if (screenId === "practice4") shuffleOptions("role4");
}
shuffleAllPracticeChoices();
updateProgress();