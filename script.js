const screens = Array.from(document.querySelectorAll(".screen"));
const nextButtons = Array.from(document.querySelectorAll(".next"));
const backButtons = Array.from(document.querySelectorAll(".back"));

const progressLabel = document.getElementById("progressLabel");
const progressFill = document.getElementById("progressFill");

let currentScreen = 0;

const score = {
  a1: false,
  a2: false,
  a3: false,
  a4: false,
  a5: false
};

function updateProgress() {
  const total = screens.length;
  const step = currentScreen + 1;
  progressLabel.textContent = `Step ${step} of ${total}`;
  progressFill.style.width = `${(step / total) * 100}%`;
}

function showScreen(index) {
  const currentId = screens[currentScreen].id;
  const nextId = screens[index].id;

  if (currentId === "demo2" && nextId !== "demo2") {
    stopDemoAudio();
  }

  screens.forEach(screen => screen.classList.remove("active"));
  screens[index].classList.add("active");
  currentScreen = index;

  updateProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (nextId === "results") {
    renderResults();
  }
}

nextButtons.forEach(button => {
  button.addEventListener("click", () => {
    if (currentScreen < screens.length - 1) {
      showScreen(currentScreen + 1);
    }
  });
});

backButtons.forEach(button => {
  button.addEventListener("click", () => {
    if (currentScreen > 0) {
      showScreen(currentScreen - 1);
    }
  });
});

function setFeedback(el, type, text) {
  if (!el) return;
  el.classList.remove("good", "warn", "bad");
  if (type) el.classList.add(type);
  el.textContent = text;
}

function normalizeText(value) {
  return (value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function hasFullSentence(text) {
  return countWords(text) >= 8;
}

function containsAny(text, keywords) {
  return keywords.some(keyword => text.includes(keyword));
}

function countKeywordGroups(text, groups) {
  let count = 0;
  groups.forEach(group => {
    if (containsAny(text, group)) count++;
  });
  return count;
}

function renderResults() {
  const correct = Object.values(score).filter(Boolean).length;
  const scoreText = document.getElementById("scoreText");
  const masteryText = document.getElementById("masteryText");

  if (scoreText) scoreText.textContent = `${correct} / 5`;

  if (masteryText) {
    if (correct >= 4) {
      masteryText.textContent =
        "Mastery achieved. You successfully applied the informative image procedure across multiple contexts.";
    } else {
      masteryText.textContent =
        "Not yet. Review the procedure and try again. Focus on identifying the image’s essential meaning, checking surrounding text, and removing unnecessary detail.";
    }
  }
}

/* Demo audio + transcript */
const demoAudio = document.getElementById("demoAudio");
const transcriptLines = Array.from(document.querySelectorAll(".tline"));
const toggleTranscriptBtn = document.getElementById("toggleTranscript");
const transcriptEl = document.getElementById("transcript");

function stopDemoAudio() {
  if (!demoAudio) return;
  demoAudio.pause();
  demoAudio.currentTime = 0;
  transcriptLines.forEach(line => line.classList.remove("active"));
}

function setActiveTranscriptLine(currentTime) {
  let found = false;

  transcriptLines.forEach(line => {
    const start = parseFloat(line.dataset.start);
    const end = parseFloat(line.dataset.end);
    const isActive = currentTime >= start && currentTime < end;
    line.classList.toggle("active", isActive);
    if (isActive) found = true;
  });

  if (!found) {
    transcriptLines.forEach(line => line.classList.remove("active"));
  }
}

if (toggleTranscriptBtn && transcriptEl) {
  toggleTranscriptBtn.addEventListener("click", () => {
    const hidden = transcriptEl.hasAttribute("hidden");
    if (hidden) {
      transcriptEl.removeAttribute("hidden");
      toggleTranscriptBtn.textContent = "Hide transcript";
      toggleTranscriptBtn.setAttribute("aria-expanded", "true");
    } else {
      transcriptEl.setAttribute("hidden", "");
      toggleTranscriptBtn.textContent = "View transcript";
      toggleTranscriptBtn.setAttribute("aria-expanded", "false");
    }
  });
}

const audioStatus = document.getElementById("audioStatus");

if (demoAudio) {
  demoAudio.addEventListener("loadstart", () => {
    if (audioStatus) audioStatus.textContent = "Audio status: attempting to load...";
  });

  demoAudio.addEventListener("loadeddata", () => {
    if (audioStatus) audioStatus.textContent = "Audio status: audio loaded and ready.";
  });

  demoAudio.addEventListener("canplaythrough", () => {
    if (audioStatus) audioStatus.textContent = "Audio status: can play through with no buffering.";
  });

  demoAudio.addEventListener("waiting", () => {
    if (audioStatus) audioStatus.textContent = "Audio status: buffering / waiting for data...";
  });

  demoAudio.addEventListener("error", event => {
    const err = demoAudio.error;
    let msg = "Audio status: failed to load.";
    if (err) {
      msg += ` Error code ${err.code} (${err.message || 'unknown'}).`;
    }
    console.error("Demo audio playback error:", event, demoAudio.error);
    if (audioStatus) audioStatus.textContent = msg + " See console for details.";
  });

  demoAudio.addEventListener("timeupdate", () => {
    setActiveTranscriptLine(demoAudio.currentTime);
  });
}

transcriptLines.forEach(line => {
  line.addEventListener("click", () => {
    if (!demoAudio) return;
    const start = parseFloat(line.dataset.start);
    if (!Number.isNaN(start)) {
      demoAudio.currentTime = start;
      demoAudio.play();
    }
  });
});

/* Activity 1 */
const feedback1 = document.getElementById("feedback1");
const check1 = document.getElementById("check1");
const reset1 = document.getElementById("reset1");

if (check1) {
  check1.addEventListener("click", () => {
    const s1 = document.getElementById("step1")?.value || "";
    const s2 = document.getElementById("step2")?.value || "";
    const s3 = document.getElementById("step3")?.value || "";
    const s4 = document.getElementById("step4")?.value || "";
    const s5 = document.getElementById("step5")?.value || "";

    score.a1 = false;

    if (!s1 || !s2 || !s3 || !s4 || !s5) {
      return setFeedback(feedback1, "warn", "Complete all five steps before checking your answer.");
    }

    const allCorrect = s1 === "1" && s2 === "2" && s3 === "3" && s4 === "4" && s5 === "5";

    if (allCorrect) {
      score.a1 = true;
      return setFeedback(feedback1, "good", "Correct. You placed all five procedure steps in the correct order.");
    }

    return setFeedback(
      feedback1,
      "bad",
      "Not quite. The correct order is: Look at the image → Identify what information the image adds → Check surrounding text → Write essential meaning → Remove extra details."
    );
  });
}

if (reset1) {
  reset1.addEventListener("click", () => {
    ["step1", "step2", "step3", "step4", "step5"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.selectedIndex = 0;
    });
    score.a1 = false;
    setFeedback(feedback1, "", "");
  });
}

/* Activity 2 */
const feedback2 = document.getElementById("feedback2");
const check2 = document.getElementById("check2");
const reset2 = document.getElementById("reset2");

if (check2) {
  check2.addEventListener("click", () => {
    const selected = document.querySelector('input[name="a2"]:checked');
    score.a2 = false;

    if (!selected) {
      return setFeedback(feedback2, "warn", "Select the best alt text.");
    }

    if (selected.value === "b") {
      score.a2 = true;
      return setFeedback(
        feedback2,
        "good",
        "Correct. This option communicates the image’s purpose and meaning without unnecessary visual detail."
      );
    }

    if (selected.value === "a" || selected.value === "c") {
      return setFeedback(
        feedback2,
        "bad",
        "Not quite. That answer focuses too much on visible details instead of the image’s essential meaning."
      );
    }

    return setFeedback(
      feedback2,
      "bad",
      "Not quite. That answer is too vague to help the user understand the image’s purpose."
    );
  });
}

if (reset2) {
  reset2.addEventListener("click", () => {
    const checked = document.querySelector('input[name="a2"]:checked');
    if (checked) checked.checked = false;
    score.a2 = false;
    setFeedback(feedback2, "", "");
  });
}

/* Activity 3 */
const feedback3 = document.getElementById("feedback3");
const check3 = document.getElementById("check3");
const reset3 = document.getElementById("reset3");
const alt3 = document.getElementById("alt3");

if (check3) {
  check3.addEventListener("click", () => {
    const value = normalizeText(alt3?.value || "");
    score.a3 = false;

    if (!value) {
      return setFeedback(feedback3, "warn", "Write one full sentence before checking your answer.");
    }

    if (!hasFullSentence(value)) {
      return setFeedback(feedback3, "warn", "Write a full sentence, not just a few words.");
    }

    const groups = [
      ["chart", "graph", "bar chart", "stacked"],
      ["revenue", "sales", "earnings"],
      ["nvidia"],
      ["increase", "growth", "rising", "rise", "grew", "expanded", "higher"],
      ["data center", "ai", "segment", "segments", "business segments"]
    ];

    const matchedGroups = countKeywordGroups(value, groups);

    const tooDetailed = containsAny(value, [
      "green bars",
      "red bars",
      "axis",
      "labels",
      "q1",
      "q2",
      "q3",
      "q4",
      "legend",
      "every quarter"
    ]);

    if (tooDetailed) {
      return setFeedback(feedback3, "bad", "Focus on the chart’s main takeaway, not every chart detail.");
    }

    if (matchedGroups >= 4) {
      score.a3 = true;
      return setFeedback(feedback3, "good", "Correct. Your sentence clearly communicates the chart’s main takeaway.");
    }

    if (matchedGroups === 3) {
      score.a3 = true;
      return setFeedback(feedback3, "good", "Good. Your alt text is reasonable and communicates the main idea.");
    }

    return setFeedback(
      feedback3,
      "bad",
      "Revise your sentence so it explains the company, the topic, and the main trend more clearly."
    );
  });
}

if (reset3) {
  reset3.addEventListener("click", () => {
    if (alt3) alt3.value = "";
    score.a3 = false;
    setFeedback(feedback3, "", "");
  });
}

/* Activity 4 */
const feedback4 = document.getElementById("feedback4");
const check4 = document.getElementById("check4");
const reset4 = document.getElementById("reset4");
const alt4 = document.getElementById("alt4");

if (check4) {
  check4.addEventListener("click", () => {
    const value = normalizeText(alt4?.value || "");
    score.a4 = false;

    if (!value) {
      return setFeedback(feedback4, "warn", "Write one full sentence before checking your answer.");
    }

    if (!hasFullSentence(value)) {
      return setFeedback(feedback4, "warn", "Write a full sentence, not just a few words.");
    }

    const groups = [
      ["nvidia"],
      ["price", "stock", "share", "trading"],
      ["increase", "decrease", "drop", "fall", "decline", "rise", "rebound", "recovery", "downward", "upward"],
      ["over time", "trend", "during trading", "throughout the day", "movement"],
      ["chart", "graph", "market", "analysis"]
    ];

    const matchedGroups = countKeywordGroups(value, groups);

    const tooDetailed = containsAny(value, [
      "macd",
      "toolbar",
      "watchlist",
      "volume bars",
      "interface",
      "candlesticks",
      "menu",
      "left panel",
      "indicator"
    ]);

    if (tooDetailed) {
      return setFeedback(feedback4, "bad", "Focus on the main price movement, not interface details.");
    }

    if (matchedGroups >= 4) {
      score.a4 = true;
      return setFeedback(feedback4, "good", "Correct. Your sentence clearly explains the main movement in the chart.");
    }

    if (matchedGroups === 3) {
      score.a4 = true;
      return setFeedback(feedback4, "good", "Good. Your alt text is reasonable and captures the main trend.");
    }

    return setFeedback(
      feedback4,
      "bad",
      "Revise your sentence so it communicates the most important price movement more clearly."
    );
  });
}

if (reset4) {
  reset4.addEventListener("click", () => {
    if (alt4) alt4.value = "";
    score.a4 = false;
    setFeedback(feedback4, "", "");
  });
}

/* Activity 5 */
const feedback5 = document.getElementById("feedback5");
const check5 = document.getElementById("check5");
const reset5 = document.getElementById("reset5");
const alt5 = document.getElementById("alt5");

if (check5) {
  check5.addEventListener("click", () => {
    const value = normalizeText(alt5?.value || "");
    score.a5 = false;

    if (!value) {
      return setFeedback(feedback5, "warn", "Write one full sentence before checking your answer.");
    }

    if (!hasFullSentence(value)) {
      return setFeedback(feedback5, "warn", "Write a full sentence, not just a few words.");
    }

    const groups = [
      ["trader", "traders", "trading floor", "stock exchange", "wall street"],
      ["market", "financial", "volatility", "markets"],
      ["responding", "monitoring", "reacting", "working", "trading", "watching"],
      ["busy", "active", "activity"],
      ["news", "article", "market day", "trading day"]
    ];

    const matchedGroups = countKeywordGroups(value, groups);

    const tooDetailed = containsAny(value, [
      "american flag",
      "many screens",
      "monitors",
      "blue jackets",
      "televisions",
      "background signs",
      "large screen"
    ]);

    if (tooDetailed) {
      return setFeedback(feedback5, "bad", "Focus on the article context and main meaning, not background details.");
    }

    if (matchedGroups >= 4) {
      score.a5 = true;
      return setFeedback(
        feedback5,
        "good",
        "Correct. Your sentence fits the news context and communicates the image’s main meaning."
      );
    }

    if (matchedGroups === 3) {
      score.a5 = true;
      return setFeedback(feedback5, "good", "Good. Your alt text is reasonable and context-appropriate.");
    }

    return setFeedback(
      feedback5,
      "bad",
      "Revise your sentence so it explains the people, activity, and market context more clearly."
    );
  });
}

if (reset5) {
  reset5.addEventListener("click", () => {
    if (alt5) alt5.value = "";
    score.a5 = false;
    setFeedback(feedback5, "", "");
  });
}

/* Restart */
const restartBtn = document.getElementById("restart");

if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    score.a1 = false;
    score.a2 = false;
    score.a3 = false;
    score.a4 = false;
    score.a5 = false;

    ["step1", "step2", "step3", "step4", "step5"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.selectedIndex = 0;
    });

    const checkedA2 = document.querySelector('input[name="a2"]:checked');
    if (checkedA2) checkedA2.checked = false;

    if (alt3) alt3.value = "";
    if (alt4) alt4.value = "";
    if (alt5) alt5.value = "";

    setFeedback(feedback1, "", "");
    setFeedback(feedback2, "", "");
    setFeedback(feedback3, "", "");
    setFeedback(feedback4, "", "");
    setFeedback(feedback5, "", "");

    if (transcriptEl && !transcriptEl.hasAttribute("hidden")) {
      transcriptEl.setAttribute("hidden", "");
      if (toggleTranscriptBtn) {
        toggleTranscriptBtn.textContent = "View transcript";
        toggleTranscriptBtn.setAttribute("aria-expanded", "false");
      }
    }

    stopDemoAudio();
    showScreen(5);
  });
}

updateProgress();