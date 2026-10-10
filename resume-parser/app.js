// ---- Mock data ------------------------------------------------------------
// This is the fake "parser". When you ship the real thing, replace this with
// pdf.js (https://mozilla.github.io/pdf.js/) to extract text from the PDF and
// score it yourself — everything below stays the same.
const MOCK_RESULT = {
  score: 78,
  present: [
    'JavaScript', 'React', 'Node.js', 'MongoDB',
    'Express', 'Git', 'REST APIs', 'HTML & CSS',
  ],
  missing: ['TypeScript', 'Docker', 'Jest', 'CI/CD', 'SQL', 'AWS'],
};

// ---- Elements -------------------------------------------------------------
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('file-input');
const status = document.getElementById('status');
const statusText = document.getElementById('status-text');
const result = document.getElementById('result');
const scoreValue = document.getElementById('score-value');
const scoreLabel = document.getElementById('score-label');
const fileName = document.getElementById('file-name');
const resetBtn = document.getElementById('reset-btn');
const ringFg = document.getElementById('ring-fg');
const presentList = document.getElementById('present-skills');
const missingList = document.getElementById('missing-skills');
const presentCount = document.getElementById('present-count');
const missingCount = document.getElementById('missing-count');

const RING_LENGTH = 326.7; // must match stroke-dasharray in styles.css

// ---- Upload wiring --------------------------------------------------------
dropzone.addEventListener('click', () => fileInput.click());

dropzone.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fileInput.click();
  }
});

dropzone.addEventListener('dragover', (e) => {
  e.preventDefault(); // needed so the browser allows a drop
  dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));

dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('dragover');
  handleFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener('change', () => handleFile(fileInput.files[0]));

resetBtn.addEventListener('click', () => {
  result.hidden = true;
  fileInput.value = ''; // clear so picking the same file fires change again
  dropzone.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// ---- Flow -----------------------------------------------------------------
function handleFile(file) {
  if (!file) return;

  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (!isPdf) {
    showStatus('Only PDF files are accepted.', true);
    return;
  }

  showStatus(`Parsing ${file.name}…`);
  dropzone.style.opacity = '0.4';

  // Simulate the parse taking time. A real parser would read the PDF here.
  setTimeout(() => {
    hideStatus();
    dropzone.style.opacity = '';
    renderResult(file.name);
  }, 900);
}

function showStatus(text, isError = false) {
  status.hidden = false;
  statusText.textContent = text;
  status.style.borderColor = isError ? '#be123c' : '';
  statusText.style.color = isError ? '#fb7185' : '';
}

function hideStatus() {
  status.hidden = true;
}

function renderResult(name) {
  fileName.textContent = name;
  renderChips(presentList, MOCK_RESULT.present);
  renderChips(missingList, MOCK_RESULT.missing);
  presentCount.textContent = `(${MOCK_RESULT.present.length})`;
  missingCount.textContent = `(${MOCK_RESULT.missing.length})`;
  scoreLabel.textContent = labelFor(MOCK_RESULT.score);

  result.hidden = false;
  animateScore(MOCK_RESULT.score);
  result.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderChips(list, skills) {
  list.innerHTML = '';
  for (const skill of skills) {
    const li = document.createElement('li');
    li.textContent = skill;
    list.appendChild(li);
  }
}

function labelFor(score) {
  if (score >= 80) return 'Strong résumé';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs work';
  return 'Weak match';
}

// Animate the number and the ring from 0 up to the score.
function animateScore(target) {
  const duration = 900;
  const start = performance.now();

  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
    const current = Math.round(eased * target);

    scoreValue.textContent = current;
    ringFg.style.strokeDashoffset = RING_LENGTH * (1 - (current / 100));

    if (t < 1) requestAnimationFrame(tick);
  }

  // Restart the ring from zero in case a previous result is on screen.
  ringFg.style.transition = 'none';
  ringFg.style.strokeDashoffset = RING_LENGTH;
  requestAnimationFrame(() => {
    ringFg.style.transition = '';
    requestAnimationFrame(tick);
  });
}
