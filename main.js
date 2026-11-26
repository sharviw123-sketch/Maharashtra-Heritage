// ═══════════════════════════════════════════════════
//  main.js — Maharashtra Heritage
//  Plain JavaScript (no libraries, no backend).
//
//  1. Helpers
//  2. Page routing (hash based: index.html#/bhaja)
//  3. Navigation (mobile menu)
//  4. Quiz engine
//  5. Accounts + saved scores (localStorage)
//  6. Modals (login / sign up / scores)
//  7. Small interactions (gallery, scroll, reveal, loader)
// ═══════════════════════════════════════════════════

document.documentElement.classList.add('js');

/* ───────────────────────────────────────────
   1. HELPERS
─────────────────────────────────────────── */
const $  = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// localStorage can be blocked (private mode, some file:// setups), so wrap it.
const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      return false;
    }
  },
  remove(key) {
    try { localStorage.removeItem(key); } catch (err) { /* ignore */ }
  }
};

/* ───────────────────────────────────────────
   2. PAGE ROUTING
   Every "page" is a <div class="page"> in index.html.
   The URL hash decides which one is visible, so the
   browser Back / Forward buttons work.
─────────────────────────────────────────── */
const SITE_NAME = 'Maharashtra Heritage';
const pages = $$('.page');
let firstRender = true;

// Which nav link should be highlighted for each page
const navGroup = {
  home: 'home', bhuleswar: 'home', sangameshwar: 'home', bhaja: 'home',
  iks: 'iks', about: 'about', quizzes: 'quizzes', quiz: 'quizzes', result: 'quizzes'
};

function parseHash() {
  // "#/quiz/bhaja" -> { page: "quiz", param: "bhaja" }
  const parts = window.location.hash.replace(/^#\/?/, '').split('/');
  return { page: parts[0] || 'home', param: parts[1] || null };
}

function showPage(pageId) {
  let found = false;

  pages.forEach(page => {
    const isTarget = page.id === 'page-' + pageId;
    page.classList.toggle('active', isTarget);
    if (isTarget) found = true;
  });

  return found;
}

function updateNavHighlight(pageId) {
  const activeLink = navGroup[pageId];
  $$('.nav-links a').forEach(link => {
    const isActive = link.dataset.page === activeLink;
    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function router() {
  let { page, param } = parseHash();

  // Quiz pages need a valid quiz id; the result page needs a finished quiz.
  if (page === 'quiz') {
    if (!param || !quizData[param]) { window.location.hash = '#/quizzes'; return; }
    startQuiz(param);
  }
  if (page === 'result' && !lastResult) { window.location.hash = '#/quizzes'; return; }

  if (!showPage(page)) { window.location.hash = '#/home'; return; }

  closeNavMenu();
  updateNavHighlight(page);
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

  // Tell the browser tab and screen readers where we are
  const activePage = $('.page.active');
  const title = page === 'quiz' ? quizData[param].name + ' Quiz' : activePage.dataset.title;
  document.title = (page === 'home' ? '' : title + ' | ') + SITE_NAME;
  $('#route-announcer').textContent = title + ' page';

  // Move keyboard focus to the page heading (skip on the very first load)
  if (!firstRender) {
    const heading = $('[tabindex="-1"]', activePage) || $('#main');
    heading.focus({ preventScroll: true });
  }
  firstRender = false;

  // Make sure reveal-on-scroll sections of the new page get watched
  observeReveals();
}

window.addEventListener('hashchange', router);

// Buttons that scroll to a section on the same page
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-scroll-to]');
  if (!trigger) return;
  const target = document.getElementById(trigger.dataset.scrollTo);
  if (target) {
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  }
});

/* ───────────────────────────────────────────
   3. NAVIGATION (mobile menu)
─────────────────────────────────────────── */
const navToggle = $('#nav-toggle');
const navLinks  = $('#nav-links');

function openNavMenu() {
  navLinks.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
  navToggle.setAttribute('aria-label', 'Close menu');
  navToggle.textContent = '✕';
}

function closeNavMenu() {
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open menu');
  navToggle.textContent = '☰';
}

navToggle.addEventListener('click', () => {
  if (navLinks.classList.contains('open')) { closeNavMenu(); } else { openNavMenu(); }
});

/* ───────────────────────────────────────────
   4. QUIZ ENGINE
─────────────────────────────────────────── */
let currentQuizId = null;   // e.g. "bhaja"
let currentQ = 0;           // index of the question being shown
let score = 0;
let answered = false;
let userAnswers = [];       // one entry per question: true (correct) or false
let lastResult = null;      // { quizId, score, total } once a quiz is finished

const optionKeys = ['A', 'B', 'C', 'D'];

function startQuiz(quizId) {
  currentQuizId = quizId;
  currentQ = 0;
  score = 0;
  answered = false;
  userAnswers = [];
  lastResult = null;
  renderQuestion();
}

function renderQuestion() {
  const quiz = quizData[currentQuizId];
  const question = quiz.questions[currentQ];
  const total = quiz.questions.length;

  // Progress bar + counters
  const progressPercent = Math.round((currentQ / total) * 100);
  $('#quiz-progress').style.width = progressPercent + '%';
  $('#quiz-progress-wrap').setAttribute('aria-valuenow', progressPercent);
  $('#quiz-temple-tag').textContent = quiz.name;
  $('#quiz-q-num').textContent = currentQ + 1;
  $('#quiz-q-total').textContent = total;
  $('#quiz-q-number').textContent = String(currentQ + 1).padStart(2, '0');
  $('#quiz-question-text').textContent = question.q;

  const image = $('#quiz-img');
  image.src = quiz.img;
  image.alt = quiz.alt;

  // Build the answer buttons with a for loop
  const optionsBox = $('#quiz-options');
  optionsBox.innerHTML = '';

  for (let i = 0; i < question.opts.length; i++) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quiz-option';
    button.dataset.index = i;

    const key = document.createElement('span');
    key.className = 'quiz-option-key';
    key.textContent = optionKeys[i];
    key.setAttribute('aria-hidden', 'true');

    const text = document.createElement('span');
    text.className = 'quiz-option-text';
    text.textContent = question.opts[i];

    button.append(key, text);
    button.addEventListener('click', () => selectAnswer(i));
    optionsBox.appendChild(button);
  }

  // Reset feedback area
  $('#quiz-explanation').classList.remove('show');
  $('#quiz-explanation-text').textContent = '';
  $('#quiz-feedback').textContent = '';
  $('#quiz-next-btn').hidden = true;
  answered = false;
}

function selectAnswer(chosenIndex) {
  if (answered) return;
  answered = true;

  const quiz = quizData[currentQuizId];
  const question = quiz.questions[currentQ];
  const buttons = $$('.quiz-option');
  const feedback = $('#quiz-feedback');
  const isCorrect = chosenIndex === question.ans;

  // Lock all options and reveal the right one
  buttons.forEach(btn => {
    btn.classList.add('disabled');
    btn.setAttribute('aria-disabled', 'true');
  });
  buttons[question.ans].classList.add('correct');

  if (isCorrect) {
    score++;
    feedback.innerHTML = '<span class="ok">✓ Correct!</span>';
  } else {
    buttons[chosenIndex].classList.add('incorrect');
    feedback.innerHTML = '<span class="no">✗ Incorrect. The correct answer is ' +
      optionKeys[question.ans] + '.</span>';
  }
  userAnswers.push(isCorrect);

  $('#quiz-explanation-text').textContent = question.exp;
  $('#quiz-explanation').classList.add('show');

  const nextBtn = $('#quiz-next-btn');
  const isLast = currentQ === quiz.questions.length - 1;
  nextBtn.textContent = isLast ? 'See Results →' : 'Next Question →';
  nextBtn.hidden = false;
  nextBtn.focus();
}

function nextQuestion() {
  currentQ++;
  if (currentQ >= quizData[currentQuizId].questions.length) {
    showResults();
  } else {
    renderQuestion();
    $('#quiz-question-text').setAttribute('tabindex', '-1');
    $('#quiz-question-text').focus({ preventScroll: true });
  }
}

function resultMessage(percent) {
  if (percent === 1)  return ['Perfect Score!', "Extraordinary mastery of Maharashtra's sacred heritage."];
  if (percent >= 0.8) return ['Excellent!', "You have a deep grasp of this monument's history and significance."];
  if (percent >= 0.6) return ['Good Work!', 'A solid understanding with room to explore further.'];
  if (percent >= 0.4) return ['Keep Learning', 'Revisit the temple page and try again — the knowledge will come.'];
  return ['A Beginning', 'Every great scholar started with curiosity. Read the temple page and retry.'];
}

function showResults() {
  const quiz = quizData[currentQuizId];
  const total = quiz.questions.length;
  lastResult = { quizId: currentQuizId, score: score, total: total };

  $('#quiz-progress').style.width = '100%';
  $('#result-score').textContent = score;
  $('#result-total').textContent = total;

  const [title, subtitle] = resultMessage(score / total);
  $('#result-title').textContent = title;
  $('#result-sub').textContent = subtitle;

  // Question-by-question breakdown (uses the real answers, not a guess)
  const breakdown = $('#result-breakdown');
  breakdown.innerHTML = '';
  quiz.questions.forEach((question, i) => {
    const row = document.createElement('div');
    row.className = 'breakdown-row';

    const label = document.createElement('span');
    label.textContent = 'Q' + (i + 1) + ': ' + question.q.substring(0, 48) + '…';

    const mark = document.createElement('span');
    mark.className = userAnswers[i] ? 'mark-ok' : 'mark-no';
    mark.textContent = userAnswers[i] ? '✓' : '✗';
    mark.setAttribute('aria-label', userAnswers[i] ? 'Correct' : 'Incorrect');

    row.append(label, mark);
    breakdown.appendChild(row);
  });

  // Save the score if someone is logged in
  const notice = $('#save-notice');
  notice.classList.remove('show');
  notice.textContent = '';
  const user = getLoggedInUser();
  if (user && saveScore(user.id, quiz.name, score, total)) {
    notice.textContent = '✦ Score saved to your profile';
    notice.classList.add('show');
  } else if (!user) {
    notice.textContent = 'Log in before a quiz to save your scores.';
    notice.classList.add('show');
  }

  window.location.hash = '#/result';
}

$('#quiz-next-btn').addEventListener('click', nextQuestion);
$('#result-retry-btn').addEventListener('click', () => {
  if (lastResult) {
    const id = lastResult.quizId;
    lastResult = null;
    window.location.hash = '#/quiz/' + id;
  }
});

// Keyboard shortcuts: A-D (or 1-4) answer, Enter/Right Arrow moves on
document.addEventListener('keydown', event => {
  const quizVisible = $('#page-quiz').classList.contains('active');
  if (!quizVisible || event.ctrlKey || event.metaKey || event.altKey) return;
  if (isModalOpen()) return;

  const key = event.key.toLowerCase();
  const letterIndex = ['a', 'b', 'c', 'd'].indexOf(key);
  const numberIndex = ['1', '2', '3', '4'].indexOf(key);
  const index = letterIndex !== -1 ? letterIndex : numberIndex;

  if (index !== -1 && !answered) {
    selectAnswer(index);
  } else if (key === 'arrowright' && answered) {
    nextQuestion();
  }
});

/* ───────────────────────────────────────────
   5. ACCOUNTS + SAVED SCORES
   There is no server, so accounts and scores are kept in
   the browser's localStorage. This is a front-end demo:
   it does NOT make passwords truly secure.
─────────────────────────────────────────── */
const USERS_KEY  = 'mh_users';
const SESSION_KEY = 'mh_user';
const SCORES_KEY = 'mh_scores';

function getLoggedInUser() { return store.get(SESSION_KEY, null); }

async function hashPassword(password, salt) {
  const text = salt + ':' + password;
  if (window.crypto && window.crypto.subtle) {
    const bytes = new TextEncoder().encode(text);
    const digest = await window.crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback for very old browsers: simple (weak) hash
  let h = 5381;
  for (let i = 0; i < text.length; i++) { h = ((h << 5) + h + text.charCodeAt(i)) | 0; }
  return 'x' + (h >>> 0).toString(16);
}

function makeSalt() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function updateNavAuth() {
  const user = getLoggedInUser();
  $('#nav-auth').hidden = Boolean(user);
  $('#nav-user-info').hidden = !user;
  $('#nav-user-name').textContent = user ? user.name : '';
}

function setMessage(box, text, type) {
  box.className = 'auth-message' + (type ? ' ' + type : '');
  box.textContent = text;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function submitSignup(event) {
  event.preventDefault();
  const name     = $('#signup-name').value.trim();
  const email    = $('#signup-email').value.trim().toLowerCase();
  const password = $('#signup-password').value;
  const message  = $('#signup-message');

  if (!name || !email || !password) { setMessage(message, 'Please fill in all fields.', 'error'); return; }
  if (!emailPattern.test(email))    { setMessage(message, 'Enter a valid email address.', 'error'); return; }
  if (password.length < 6)          { setMessage(message, 'Password must be at least 6 characters.', 'error'); return; }

  const users = store.get(USERS_KEY, []);
  if (users.some(u => u.email === email)) {
    setMessage(message, 'An account with this email already exists. Try logging in.', 'error');
    return;
  }

  const salt = makeSalt();
  const newUser = { id: Date.now(), name: name, email: email, salt: salt, hash: await hashPassword(password, salt) };
  users.push(newUser);
  if (!store.set(USERS_KEY, users)) {
    setMessage(message, 'Could not save your account. Is browser storage blocked?', 'error');
    return;
  }

  store.set(SESSION_KEY, { id: newUser.id, name: newUser.name, email: newUser.email });
  updateNavAuth();
  setMessage(message, 'Account created! Welcome, ' + name + '.', 'success');
  event.target.reset();
  setTimeout(() => closeModal(authBackdrop), 900);
}

async function submitLogin(event) {
  event.preventDefault();
  const email    = $('#login-email').value.trim().toLowerCase();
  const password = $('#login-password').value;
  const message  = $('#login-message');

  if (!email || !password) { setMessage(message, 'Enter your email and password.', 'error'); return; }

  const user = store.get(USERS_KEY, []).find(u => u.email === email);
  if (!user) { setMessage(message, 'No account found with this email.', 'error'); return; }

  const hash = await hashPassword(password, user.salt);
  if (hash !== user.hash) { setMessage(message, 'Incorrect password.', 'error'); return; }

  store.set(SESSION_KEY, { id: user.id, name: user.name, email: user.email });
  updateNavAuth();
  setMessage(message, 'Welcome back, ' + user.name + '!', 'success');
  event.target.reset();
  setTimeout(() => closeModal(authBackdrop), 900);
}

function logoutUser() {
  store.remove(SESSION_KEY);
  updateNavAuth();
}

function saveScore(userId, quizName, scoreValue, total) {
  const scores = store.get(SCORES_KEY, []);
  scores.push({ userId: userId, quiz: quizName, score: scoreValue, total: total, date: new Date().toISOString() });
  return store.set(SCORES_KEY, scores);
}

function getUserScores(userId) {
  return store.get(SCORES_KEY, [])
    .filter(entry => entry.userId === userId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function renderScores() {
  const user = getLoggedInUser();
  if (!user) return;

  $('#scores-modal-username').textContent = user.name + "'s Quiz History";
  const list = $('#scores-list');
  list.innerHTML = '';

  const scores = getUserScores(user.id);
  $('#scores-clear').hidden = scores.length === 0;

  if (scores.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'scores-empty';
    empty.textContent = 'No quiz attempts yet. Take a quiz to see your scores here!';
    list.appendChild(empty);
    return;
  }

  scores.forEach(entry => {
    const percent = Math.round((entry.score / entry.total) * 100);
    const date = new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const row = document.createElement('div');
    row.className = 'score-entry';

    const left = document.createElement('div');
    const quizName = document.createElement('div');
    quizName.className = 'score-entry-quiz';
    quizName.textContent = entry.quiz;
    const meta = document.createElement('div');
    meta.className = 'score-entry-date';
    meta.textContent = date + ' · ' + percent + '%';
    left.append(quizName, meta);

    const right = document.createElement('div');
    right.className = 'score-entry-right';
    right.textContent = entry.score;
    const outOf = document.createElement('span');
    outOf.textContent = ' / ' + entry.total;
    right.appendChild(outOf);

    row.append(left, right);
    list.appendChild(row);
  });
}

/* ───────────────────────────────────────────
   6. MODALS (open, close, focus trap, Escape)
─────────────────────────────────────────── */
const authBackdrop   = $('#auth-modal-backdrop');
const scoresBackdrop = $('#scores-modal-backdrop');
let lastFocused = null;

function isModalOpen() {
  return authBackdrop.classList.contains('open') || scoresBackdrop.classList.contains('open');
}

function focusableIn(root) {
  return $$('button:not([hidden]), input, a[href], [tabindex]:not([tabindex="-1"])', root)
    .filter(el => !el.disabled && el.offsetParent !== null);
}

function openModal(backdrop) {
  lastFocused = document.activeElement;
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  const items = focusableIn(backdrop);
  // Focus the first form field (skip the close button)
  (items[1] || items[0]).focus();
}

function closeModal(backdrop) {
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
  if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
}

function switchAuthMode(mode) {
  const isLogin = mode === 'login';
  $('#auth-login-form').classList.toggle('active', isLogin);
  $('#auth-signup-form').classList.toggle('active', !isLogin);
  $('#auth-toggle-login').hidden = !isLogin;
  $('#auth-toggle-signup').hidden = isLogin;
  $('#auth-modal-title').textContent = isLogin ? 'Welcome Back' : 'Create Account';
  setMessage($('#login-message'), '', '');
  setMessage($('#signup-message'), '', '');
}

function openAuthModal(mode) {
  switchAuthMode(mode || 'login');
  openModal(authBackdrop);
}

// Keep Tab inside the open dialog, close on Escape
document.addEventListener('keydown', event => {
  const open = [authBackdrop, scoresBackdrop].find(b => b.classList.contains('open'));
  if (!open) return;

  if (event.key === 'Escape') { closeModal(open); return; }

  if (event.key === 'Tab') {
    const items = focusableIn(open);
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

// Click on the dark backdrop closes the modal
[authBackdrop, scoresBackdrop].forEach(backdrop => {
  backdrop.addEventListener('click', event => { if (event.target === backdrop) closeModal(backdrop); });
});

$('#nav-login-btn').addEventListener('click', () => openAuthModal('login'));
$('#auth-close').addEventListener('click', () => closeModal(authBackdrop));
$('#scores-close').addEventListener('click', () => closeModal(scoresBackdrop));
$('#go-signup').addEventListener('click', () => { switchAuthMode('signup'); $('#signup-name').focus(); });
$('#go-login').addEventListener('click', () => { switchAuthMode('login'); $('#login-email').focus(); });
$('#auth-login-form').addEventListener('submit', submitLogin);
$('#auth-signup-form').addEventListener('submit', submitSignup);
$('#nav-logout-btn').addEventListener('click', logoutUser);
$('#nav-scores-btn').addEventListener('click', () => { renderScores(); openModal(scoresBackdrop); });
$('#scores-clear').addEventListener('click', () => {
  const user = getLoggedInUser();
  if (!user) return;
  const others = store.get(SCORES_KEY, []).filter(entry => entry.userId !== user.id);
  store.set(SCORES_KEY, others);
  renderScores();
});

/* ───────────────────────────────────────────
   7. SMALL INTERACTIONS
─────────────────────────────────────────── */

// Photo galleries: click a thumbnail to swap it with the main photo
$$('[data-gallery]').forEach(gallery => {
  const mainImage = $('.temple-gallery-main', gallery);
  const thumbButtons = $$('.temple-gallery-row button', gallery);

  thumbButtons.forEach(button => {
    button.addEventListener('click', () => {
      const thumb = $('img', button);

      // swap the src and alt of the main image and the thumbnail
      const oldSrc = mainImage.getAttribute('src');
      const oldAlt = mainImage.getAttribute('alt');
      mainImage.setAttribute('src', thumb.getAttribute('src'));
      mainImage.setAttribute('alt', thumb.getAttribute('alt'));
      thumb.setAttribute('src', oldSrc);
      thumb.setAttribute('alt', oldAlt);
      button.setAttribute('aria-label', 'Show this photo larger: ' + oldAlt.toLowerCase());
    });
  });
});

// Fade sections in once as they scroll into view
let revealObserver = null;
function observeReveals() {
  const items = $$('.reveal:not(.visible)');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    items.forEach(item => item.classList.add('visible'));
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
  }
  items.forEach(item => revealObserver.observe(item));
}

// Loading screen
function hideLoader() {
  const loader = $('#loading');
  if (loader) loader.classList.add('hidden');
}
setTimeout(hideLoader, 1600);
window.addEventListener('load', () => setTimeout(hideLoader, 400));

// Footer year
$('#year').textContent = new Date().getFullYear();

/* ───────────────────────────────────────────
   START
─────────────────────────────────────────── */
updateNavAuth();
router();
