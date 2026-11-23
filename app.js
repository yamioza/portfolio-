/**
 * SYED SARFARAZ HUSSAIN ZAIDI — PORTFOLIO INTERACTIVITY
 * Pocket Rocket Console, Gestulator Kinematic Hand, Live Clock & UI Interactions
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. AUDIO SYNTHESIZER (Web Audio API - No external files required)
     ========================================================================== */
  class SoundFX {
    constructor() {
      this.enabled = true;
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
    }

    playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.05) {
      if (!this.enabled) return;
      try {
        this.init();
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // audio might be blocked before user interaction
      }
    }

    click() {
      this.playTone(700, 'triangle', 0.04, 0.04);
    }
    servo() {
      this.playTone(280, 'sawtooth', 0.12, 0.03);
    }
    jump() {
      this.playTone(440, 'square', 0.1, 0.05);
    }
    score() {
      this.playTone(880, 'sine', 0.15, 0.06);
    }
    gameover() {
      this.playTone(180, 'sawtooth', 0.3, 0.08);
    }
  }

  const sfx = new SoundFX();

  // Sound FX Toggle
  const soundToggleBtn = document.getElementById('soundToggle');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      sfx.enabled = !sfx.enabled;
      soundToggleBtn.style.opacity = sfx.enabled ? '1' : '0.4';
      if (sfx.enabled) sfx.click();
    });
  }

  /* ==========================================================================
     2. THEME TOGGLE (Dark / Light)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('sarfaraz_portfolio_theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      sfx.click();
      const currentTheme = document.body.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', nextTheme);
      localStorage.setItem('sarfaraz_portfolio_theme', nextTheme);
    });
  }

  /* ==========================================================================
     3. HERO PHOTO UPLOADER & LOCAL STORAGE PERSISTENCE
     ========================================================================== */
  const photoUploadInput = document.getElementById('photoUploadInput');
  const userHeroPhoto = document.getElementById('userHeroPhoto');
  const defaultAvatar = document.getElementById('defaultAvatar');
  const resetPhotoBtn = document.getElementById('resetPhotoBtn');
  const photoBtnLabel = document.getElementById('photoBtnLabel');

  function loadSavedHeroPhoto() {
    const savedImg = localStorage.getItem('sarfaraz_hero_photo');
    if (savedImg && userHeroPhoto && defaultAvatar) {
      userHeroPhoto.src = savedImg;
      userHeroPhoto.classList.remove('hidden');
      defaultAvatar.classList.add('hidden');
      if (resetPhotoBtn) resetPhotoBtn.classList.remove('hidden');
      if (photoBtnLabel) photoBtnLabel.textContent = 'Change Photo';
    }
  }
  loadSavedHeroPhoto();

  if (photoUploadInput) {
    photoUploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        sfx.click();
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          userHeroPhoto.src = dataUrl;
          userHeroPhoto.classList.remove('hidden');
          defaultAvatar.classList.add('hidden');
          if (resetPhotoBtn) resetPhotoBtn.classList.remove('hidden');
          if (photoBtnLabel) photoBtnLabel.textContent = 'Change Photo';
          localStorage.setItem('sarfaraz_hero_photo', dataUrl);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (resetPhotoBtn) {
    resetPhotoBtn.addEventListener('click', () => {
      sfx.click();
      localStorage.removeItem('sarfaraz_hero_photo');
      userHeroPhoto.src = '';
      userHeroPhoto.classList.add('hidden');
      defaultAvatar.classList.remove('hidden');
      resetPhotoBtn.classList.add('hidden');
      if (photoBtnLabel) photoBtnLabel.textContent = 'Upload Your Photo';
    });
  }

  /* ==========================================================================
     4. TABS COMPONENT (Pocket Rocket Deep Dive)
     ========================================================================== */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.click();
      const targetId = btn.getAttribute('data-tab');
      
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  /* ==========================================================================
     5. POCKET ROCKET ARCADE CONSOLE SIMULATOR
     ========================================================================== */
  const canvas = document.getElementById('consoleCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const gameScoreEl = document.getElementById('gameScore');
  const gameStatusEl = document.getElementById('gameStatus');
  const btnStartGame = document.getElementById('btnStartGame');
  const btnResetGame = document.getElementById('btnResetGame');

  let gameState = 'IDLE'; // IDLE, RUNNING, GAMEOVER
  let score = 0;
  let animFrameId = null;

  // Mini Runner Physics
  const player = {
    x: 25,
    y: 110,
    width: 14,
    height: 18,
    vy: 0,
    gravity: 0.55,
    jumpPower: -8.5,
    isGrounded: true
  };

  let obstacles = [];
  let obstacleTimer = 0;
  let bgOffset = 0;

  function resetGame() {
    gameState = 'IDLE';
    score = 0;
    player.y = 110;
    player.vy = 0;
    player.isGrounded = true;
    obstacles = [];
    obstacleTimer = 0;
    if (gameScoreEl) gameScoreEl.textContent = 'SCORE: 00';
    if (gameStatusEl) gameStatusEl.textContent = 'PRESS START';
    drawConsoleScreen();
  }

  function startGame() {
    if (gameState === 'RUNNING') {
      playerJump();
      return;
    }
    sfx.click();
    gameState = 'RUNNING';
    score = 0;
    obstacles = [];
    if (gameStatusEl) gameStatusEl.textContent = 'PLAYING...';
    lastTime = performance.now();
    runGameLoop();
  }

  function playerJump() {
    if (gameState === 'RUNNING' && player.isGrounded) {
      player.vy = player.jumpPower;
      player.isGrounded = false;
      sfx.jump();
    }
  }

  let lastTime = 0;
  function runGameLoop(now = performance.now()) {
    if (gameState !== 'RUNNING') return;

    updateGame();
    drawGame();

    animFrameId = requestAnimationFrame(runGameLoop);
  }

  function updateGame() {
    // Player physics
    player.vy += player.gravity;
    player.y += player.vy;
    if (player.y >= 110) {
      player.y = 110;
      player.vy = 0;
      player.isGrounded = true;
    }

    // Scroll Background
    bgOffset = (bgOffset + 2) % 40;

    // Obstacle Spawning
    obstacleTimer++;
    if (obstacleTimer > 65 + Math.random() * 40) {
      obstacles.push({
        x: canvas.width,
        y: 116,
        width: 10,
        height: 12,
        speed: 2.5
      });
      obstacleTimer = 0;
    }

    // Move & Check Obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obs = obstacles[i];
      obs.x -= obs.speed;

      // Collision Detection
      if (
        player.x < obs.x + obs.width &&
        player.x + player.width > obs.x &&
        player.y < obs.y + obs.height &&
        player.y + player.height > obs.y
      ) {
        // Game Over!
        gameState = 'GAMEOVER';
        sfx.gameover();
        if (gameStatusEl) gameStatusEl.textContent = 'GAME OVER!';
        cancelAnimationFrame(animFrameId);
        drawGame();
        return;
      }

      // Passed obstacle
      if (obs.x + obs.width < 0) {
        obstacles.splice(i, 1);
        score += 10;
        sfx.score();
        if (gameScoreEl) gameScoreEl.textContent = `SCORE: ${score.toString().padStart(2, '0')}`;
      }
    }
  }

  function drawGame() {
    if (!ctx) return;

    // Clear Screen (Retro CRT Matrix Green Tint)
    ctx.fillStyle = '#0a160c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = '#122c19';
    ctx.lineWidth = 1;
    for (let x = -bgOffset; x < canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Ground Plane
    ctx.fillStyle = '#1c4a28';
    ctx.fillRect(0, 128, canvas.width, 22);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0, 128, canvas.width, 2);

    // Draw Pixel Character (Mini Robot/Rocket Maker)
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    // Visor
    ctx.fillStyle = '#ffd000';
    ctx.fillRect(player.x + 8, player.y + 4, 5, 4);
    // Legs
    ctx.fillStyle = '#ffffff';
    if (!player.isGrounded) {
      ctx.fillRect(player.x + 2, player.y + player.height, 3, 2);
    } else {
      ctx.fillRect(player.x + 2, player.y + player.height, 4, 3);
      ctx.fillRect(player.x + 8, player.y + player.height, 4, 3);
    }

    // Draw Obstacles (Gears / Spikes)
    ctx.fillStyle = '#ef4444';
    obstacles.forEach(obs => {
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      ctx.fillStyle = '#fca5a5';
      ctx.fillRect(obs.x + 2, obs.y + 2, obs.width - 4, obs.height - 4);
      ctx.fillStyle = '#ef4444';
    });

    // Scanline Filter Effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    for (let y = 0; y < canvas.height; y += 4) {
      ctx.fillRect(0, y, canvas.width, 1);
    }

    // Game Over Overlay
    if (gameState === 'GAMEOVER') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ef4444';
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CRASHED!', canvas.width / 2, 65);
      ctx.fillStyle = '#38ef7d';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('PRESS A / START TO RETRY', canvas.width / 2, 85);
    }
  }

  function drawConsoleScreen() {
    if (!ctx) return;
    ctx.fillStyle = '#0a160c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#38ef7d';
    ctx.font = '12px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SARFARAZ - D LITE', canvas.width / 2, 50);
    ctx.fillStyle = '#00f0ff';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText('POCKET ROCKET v1.0', canvas.width / 2, 70);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText('[PRESS START / A TO PLAY]', canvas.width / 2, 105);

    // Draw ground line
    ctx.fillStyle = '#1c4a28';
    ctx.fillRect(0, 128, canvas.width, 22);
  }

  // Initial Screen Render
  if (canvas) {
    drawConsoleScreen();
  }

  // Console Button Listeners
  if (btnStartGame) btnStartGame.addEventListener('click', startGame);
  if (btnResetGame) btnResetGame.addEventListener('click', resetGame);

  const btnA = document.getElementById('btnA');
  const btnB = document.getElementById('btnB');
  if (btnA) {
    btnA.addEventListener('click', () => {
      sfx.click();
      if (gameState === 'RUNNING') playerJump();
      else startGame();
    });
  }
  if (btnB) {
    btnB.addEventListener('click', () => {
      sfx.click();
      resetGame();
    });
  }

  // D-Pad Feedback
  ['btnUp', 'btnDown', 'btnLeft', 'btnRight'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', () => {
        sfx.click();
        if (id === 'btnUp') playerJump();
      });
    }
  });

  // Keyboard controls for game
  window.addEventListener('keydown', (e) => {
    if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
      if (gameState === 'RUNNING') {
        e.preventDefault();
        playerJump();
      }
    }
  });

  /* ==========================================================================
     6. GESTULATOR KINEMATIC ROBOTIC HAND & CALCULATOR SIMULATOR
     ========================================================================== */
  const fingerThumb = document.getElementById('fingerThumb');
  const fingerIndex = document.getElementById('fingerIndex');
  const fingerMiddle = document.getElementById('fingerMiddle');
  const fingerRing = document.getElementById('fingerRing');
  const fingerPinky = document.getElementById('fingerPinky');
  const currentPoseName = document.getElementById('currentPoseName');
  const handStatusBadge = document.getElementById('handStatusBadge');

  const fingers = {
    thumb: fingerThumb,
    index: fingerIndex,
    middle: fingerMiddle,
    ring: fingerRing,
    pinky: fingerPinky
  };

  /**
   * Kinematic Finger Mapping for Digits 0 to 9
   * true = extended, false = curled
   */
  const GESTURE_MAP = {
    0: { name: 'CLOSED FIST (0)', states: { thumb: false, index: false, middle: false, ring: false, pinky: false } },
    1: { name: 'INDEX FINGER (1)', states: { thumb: false, index: true, middle: false, ring: false, pinky: false } },
    2: { name: 'PEACE SIGN (2)', states: { thumb: false, index: true, middle: true, ring: false, pinky: false } },
    3: { name: 'THREE FINGERS (3)', states: { thumb: false, index: true, middle: true, ring: true, pinky: false } },
    4: { name: 'FOUR EXTENDED (4)', states: { thumb: false, index: true, middle: true, ring: true, pinky: true } },
    5: { name: 'OPEN PALM (5)', states: { thumb: true, index: true, middle: true, ring: true, pinky: true } },
    6: { name: 'SHAKA COMBO (6)', states: { thumb: true, index: false, middle: false, ring: false, pinky: true } },
    7: { name: 'THREE DIGIT PIN (7)', states: { thumb: true, index: true, middle: true, ring: false, pinky: false } },
    8: { name: 'POINTER COMBO (8)', states: { thumb: true, index: true, middle: false, ring: false, pinky: false } },
    9: { name: 'HOOK GRIP (9)', states: { thumb: true, index: true, middle: true, ring: true, pinky: false } }
  };

  function setHandGesture(digit) {
    const config = GESTURE_MAP[digit];
    if (!config) return;

    sfx.servo();
    if (currentPoseName) currentPoseName.textContent = config.name;

    Object.keys(config.states).forEach(key => {
      const el = fingers[key];
      if (el) {
        if (config.states[key]) {
          el.classList.remove('finger-curled');
          el.classList.add('finger-extended');
        } else {
          el.classList.remove('finger-extended');
          el.classList.add('finger-curled');
        }
      }
    });
  }

  // Initial Open Hand
  setHandGesture(5);

  // Gesture Chip Clicks
  const gestureChips = document.querySelectorAll('.g-chip');
  gestureChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const g = parseInt(chip.getAttribute('data-gesture'), 10);
      if (!isNaN(g)) {
        setHandGesture(g);
      }
    });
  });

  /* Calculator Logic */
  const calcFormula = document.getElementById('calcFormula');
  const calcValue = document.getElementById('calcValue');
  const calcKeys = document.querySelectorAll('.calc-key');
  let currentExpression = '';
  let isSequencePlaying = false;

  calcKeys.forEach(key => {
    key.addEventListener('click', () => {
      sfx.click();
      const val = key.getAttribute('data-key');
      handleCalcInput(val);
    });
  });

  function handleCalcInput(val) {
    if (isSequencePlaying) return;

    if (val === 'C') {
      currentExpression = '';
      if (calcFormula) calcFormula.textContent = 'Enter equation...';
      if (calcValue) calcValue.textContent = '0';
      setHandGesture(0);
      return;
    }

    if (val === '=') {
      computeAndArticulateResult();
      return;
    }

    currentExpression += val;
    if (calcFormula) calcFormula.textContent = currentExpression;
    if (calcValue) calcValue.textContent = currentExpression;

    // Direct digit kinematic feedback
    if (!isNaN(parseInt(val, 10))) {
      setHandGesture(parseInt(val, 10));
    }
  }

  function computeAndArticulateResult() {
    if (!currentExpression) return;
    try {
      // Safe math evaluation with sanitized characters
      const sanitized = currentExpression.replace(/[^0-9+\-*/().]/g, '');
      // Evaluate arithmetic expression safely
      const result = Function(`'use strict'; return (${sanitized})`)();
      
      const resultStr = Math.round(result).toString();
      if (calcValue) calcValue.textContent = resultStr;
      if (calcFormula) calcFormula.textContent = `${currentExpression} = ${resultStr}`;

      // Sequentially articulate the digits via the robotic hand!
      articulateDigitSequence(resultStr);
    } catch (e) {
      if (calcValue) calcValue.textContent = 'ERR';
    }
  }

  async function articulateDigitSequence(numStr) {
    isSequencePlaying = true;
    if (handStatusBadge) {
      handStatusBadge.textContent = 'ARTICULATING';
      handStatusBadge.style.color = '#ffd000';
    }

    const digits = numStr.split('').filter(ch => !isNaN(parseInt(ch, 10)));
    for (let i = 0; i < digits.length; i++) {
      const d = parseInt(digits[i], 10);
      setHandGesture(d);
      await new Promise(r => setTimeout(r, 650));
    }

    if (handStatusBadge) {
      handStatusBadge.textContent = 'READY';
      handStatusBadge.style.color = '#10b981';
    }
    isSequencePlaying = false;
  }

  // Demo Button: 234 + 1111 = 1345
  const btnDemoCalc = document.getElementById('btnDemoCalc');
  if (btnDemoCalc) {
    btnDemoCalc.addEventListener('click', () => {
      sfx.click();
      currentExpression = '234+1111';
      if (calcFormula) calcFormula.textContent = currentExpression;
      computeAndArticulateResult();
    });
  }

  /* ==========================================================================
     7. LIVE KINETIC CLOCK SIMULATION
     ========================================================================== */
  function updateKineticClock() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const s = now.getSeconds().toString().padStart(2, '0');

    const clkH1 = document.getElementById('clkH1');
    const clkH2 = document.getElementById('clkH2');
    const clkM1 = document.getElementById('clkM1');
    const clkM2 = document.getElementById('clkM2');
    const clkS1 = document.getElementById('clkS1');
    const clkS2 = document.getElementById('clkS2');

    if (clkH1) clkH1.textContent = h[0];
    if (clkH2) clkH2.textContent = h[1];
    if (clkM1) clkM1.textContent = m[0];
    if (clkM2) clkM2.textContent = m[1];
    if (clkS1) clkS1.textContent = s[0];
    if (clkS2) clkS2.textContent = s[1];
  }
  setInterval(updateKineticClock, 1000);
  updateKineticClock();

  /* ==========================================================================
     8. EMAIL COPY TO CLIPBOARD
     ========================================================================== */
  const emailPill = document.getElementById('emailPill');
  const copyBadge = document.getElementById('copyBadge');
  const emailText = document.getElementById('emailText');

  if (emailPill && copyBadge && emailText) {
    emailPill.addEventListener('click', (e) => {
      e.preventDefault();
      sfx.click();
      const email = emailText.textContent.trim();
      navigator.clipboard.writeText(email).then(() => {
        copyBadge.textContent = 'Copied!';
        copyBadge.style.background = '#10b981';
        copyBadge.style.color = '#fff';
        setTimeout(() => {
          copyBadge.textContent = 'Copy';
          copyBadge.style.background = '';
          copyBadge.style.color = '';
        }, 2200);
      }).catch(() => {
        window.location.href = `mailto:${email}`;
      });
    });
  }

});
