/* =========================================================
   GAMETHON — Main Application Studio Router & Multi-User Login
   ========================================================= */

window.GAMETHON = window.GAMETHON || {};

window.GAMETHON.authenticateHeartObstacle = function(onSuccessCallback) {
  const pin = prompt("🔐 PERMANENT HEART SECURITY AUTHENTICATION:\nPlease enter the 6-digit Security PIN:");
  if (pin !== '030708') {
    alert("⚠️ ACCESS DENIED! Invalid Security PIN.");
    return false;
  }

  const password = prompt("🔑 ENTER PASSWORD:\nPlease enter the Password:");
  if (password !== 'Chandhini') {
    alert("⚠️ ACCESS DENIED! Invalid Password.");
    return false;
  }

  // Speak Voice Speech after EXACTLY 2 SECONDS (Request 2)
  setTimeout(() => {
    if (window.GAMETHON.VoiceEngine) {
      window.GAMETHON.VoiceEngine.speak("I LOVE YOU CHANDHINI");
    }
  }, 2000);

  if (typeof onSuccessCallback === 'function') {
    onSuccessCallback();
  }
  return true;
};

class GAMETHONApp {
  constructor() {
    this.activeSubgameInstance = null;
    this.activeGameId = null;
    this.currentUser = 'CyberVanguard_01';
    this.currentAvatar = '🧑‍✈️';
    this.currentLevel = 4;
    this.isBigAiBrain = false;
    this.isPaused = false;
    this.accounts = [];
  }

  init() {
    console.log("🎮 GAMETHON Studio Router Initializing...");
    this.loadUserAccounts();
    this.renderHeaderUserBar();
    this.renderGamesGrid();
    this.setupGlobalVoiceListener();
  }

  loadUserAccounts() {
    const saved = localStorage.getItem('gamethon_users_db');
    if (saved) {
      try { this.accounts = JSON.parse(saved); } catch (e) { this.accounts = []; }
    }
    if (!this.accounts || this.accounts.length === 0) {
      this.accounts = [
        { name: 'CyberVanguard_01', avatar: '🧑‍✈️', level: 5, pin: '' },
        { name: 'ShadowHunter_88', avatar: '🥷', level: 7, pin: '' },
        { name: 'TitanMaster', avatar: '🥊', level: 4, pin: '' }
      ];
      this.saveUserAccounts();
    }
  }

  saveUserAccounts() {
    localStorage.setItem('gamethon_users_db', JSON.stringify(this.accounts));
  }

  togglePauseActiveSubgame() {
    const overlay = document.getElementById('pause-overlay');
    const btn = document.getElementById('btn-pause-game-hdr');
    this.isPaused = !this.isPaused;

    if (this.activeSubgameInstance) {
      this.activeSubgameInstance.isPaused = this.isPaused;
      if (this.isPaused && typeof this.activeSubgameInstance.pause === 'function') {
        this.activeSubgameInstance.pause();
      } else if (!this.isPaused && typeof this.activeSubgameInstance.unpause === 'function') {
        this.activeSubgameInstance.unpause();
      }
    }

    if (overlay) {
      if (this.isPaused) overlay.classList.add('active');
      else overlay.classList.remove('active');
    }

    if (btn) {
      btn.textContent = this.isPaused ? '▶️ RESUME GAME' : '⏸️ PAUSE GAME';
    }

    if (window.GAMETHON.VoiceEngine) {
      window.GAMETHON.VoiceEngine.speak(this.isPaused ? "Game paused." : "Resuming game.");
    }
  }

  restartActiveSubgame() {
    this.isPaused = false;
    const overlay = document.getElementById('pause-overlay');
    if (overlay) overlay.classList.remove('active');
    const btn = document.getElementById('btn-pause-game-hdr');
    if (btn) btn.textContent = '⏸️ PAUSE GAME';

    if (this.activeSubgameInstance) {
      this.activeSubgameInstance.isPaused = false;
      console.log(`🔄 Restarting subgame instance: ${this.activeGameId}`);
      if (typeof this.activeSubgameInstance.restartGame === 'function') {
        this.activeSubgameInstance.restartGame();
      } else if (typeof this.activeSubgameInstance.restartFight === 'function') {
        this.activeSubgameInstance.restartFight();
      } else if (typeof this.activeSubgameInstance.start === 'function') {
        this.activeSubgameInstance.start();
      }
    }
  }

  loginUser(username) {
    const acc = this.accounts.find(a => a.name === username);
    if (acc) {
      this.currentUser = acc.name;
      this.currentAvatar = acc.avatar || '👤';
      this.currentLevel = acc.level || 1;
    } else {
      this.currentUser = username;
      this.currentAvatar = '👤';
      this.currentLevel = 1;
    }
    this.renderHeaderUserBar();
    this.closeLoginModal();
    if (window.GAMETHON.VoiceEngine) {
      window.GAMETHON.VoiceEngine.speak(`Welcome back ${this.currentUser}! Identity Authenticated.`);
    }
  }

  createNewUserAccount() {
    const nameInput = document.getElementById('new-username-input');
    const avatarSelect = document.getElementById('new-avatar-select');
    const pinInput = document.getElementById('new-pin-input');

    const name = nameInput ? nameInput.value.trim() : '';
    const avatar = avatarSelect ? avatarSelect.value : '👤';
    const pin = pinInput ? pinInput.value.trim() : '';

    if (!name) {
      alert("⚠️ Please enter a valid username!");
      return;
    }

    if (this.accounts.some(a => a.name.toLowerCase() === name.toLowerCase())) {
      alert("⚠️ Account username already exists! Please choose another name or login.");
      return;
    }

    const newAcc = { name, avatar, level: 1, pin };
    this.accounts.push(newAcc);
    this.saveUserAccounts();
    this.loginUser(name);
  }

  openLoginModal() {
    this.renderLoginAccountList();
    document.getElementById('login-modal').classList.add('active');
  }

  closeLoginModal() {
    document.getElementById('login-modal').classList.remove('active');
  }

  renderLoginAccountList() {
    const container = document.getElementById('login-account-list');
    if (!container) return;

    container.innerHTML = this.accounts.map(acc => `
      <div class="user-auth-card" onclick="window.GAMETHON.App.loginUser('${acc.name}')">
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-size:1.6rem;">${acc.avatar || '👤'}</span>
          <div>
            <div style="font-family:var(--font-title); font-weight:bold; color:var(--text-main);">${acc.name}</div>
            <div style="font-size:0.8rem; color:#aaa;">Level ${acc.level || 1} Champion</div>
          </div>
        </div>
        <button class="btn-neon" style="padding:6px 14px; font-size:0.8rem;">SELECT PROFILE ➔</button>
      </div>
    `).join('');
  }

  logoutUser() {
    this.currentUser = 'Guest Player';
    this.currentAvatar = '👤';
    this.currentLevel = 1;
    this.renderHeaderUserBar();
    this.openLoginModal();
    if (window.GAMETHON.VoiceEngine) {
      window.GAMETHON.VoiceEngine.speak("Logged out of Cold Forge Games session. Select or create an account to log back in.");
    }
  }

  renderHeaderUserBar() {
    const container = document.getElementById('user-profile-bar');
    if (!container) return;

    let coins = 1500;
    let gems = 50;
    let cash = 250;

    if (window.GAMETHON.PlayerProfile && window.GAMETHON.PlayerProfile.data) {
      coins = window.GAMETHON.PlayerProfile.data.coins || 1500;
      gems = window.GAMETHON.PlayerProfile.data.diamonds || window.GAMETHON.PlayerProfile.data.gems || 50;
      cash = window.GAMETHON.PlayerProfile.getTotalWithdrawableCash();
    }

    container.innerHTML = `
      <div class="stat-pill">${this.currentAvatar} ${this.currentUser}</div>
      <div class="stat-pill">🏆 Lvl ${this.currentLevel}</div>
      <div class="stat-pill" style="color:var(--accent-yellow);">🟡 ${coins}</div>
      <div class="stat-pill" style="color:var(--border-neon);">💎 ${gems}</div>
      <button class="btn-neon" style="border-color:var(--accent-green); color:var(--accent-green);" onclick="window.GAMETHON.App.openGPayModal()">💳 GPAY (₹${cash})</button>
      <button class="btn-neon" onclick="window.GAMETHON.App.openLoginModal()">🔑 LOGIN / SWITCH</button>
      <button class="btn-neon-pink" onclick="window.GAMETHON.App.logoutUser()">🚪 LOGOUT</button>
    `;
  }

  openGPayModal() {
    const modal = document.getElementById('gpay-modal');
    if (!modal) return;

    const profile = window.GAMETHON.PlayerProfile ? window.GAMETHON.PlayerProfile.data : {};
    const totalCash = window.GAMETHON.PlayerProfile ? window.GAMETHON.PlayerProfile.getTotalWithdrawableCash() : 250;
    const coins = profile.coins || 1500;
    const vouchers = profile.giftVouchers || 100;

    const cashVal = document.getElementById('gpay-cash-val');
    const coinsVal = document.getElementById('gpay-coins-val');
    const vouchersVal = document.getElementById('gpay-vouchers-val');
    const txLog = document.getElementById('gpay-tx-log');

    if (cashVal) cashVal.textContent = `₹${totalCash}`;
    if (coinsVal) coinsVal.textContent = coins;
    if (vouchersVal) vouchersVal.textContent = `₹${vouchers}`;
    if (txLog) { txLog.style.display = 'none'; txLog.innerHTML = ''; }

    modal.classList.add('active');
  }

  closeGPayModal() {
    const modal = document.getElementById('gpay-modal');
    if (modal) modal.classList.remove('active');
  }

  executeGPayWithdrawal() {
    const upiInput = document.getElementById('gpay-upi-input');
    const amountInput = document.getElementById('gpay-amount-input');
    const txLog = document.getElementById('gpay-tx-log');

    const upiId = upiInput ? upiInput.value.trim() : '';
    const amount = amountInput ? parseInt(amountInput.value) : 0;

    if (!upiId || !upiId.includes('@')) {
      alert("⚠️ Please enter a valid GPay UPI ID or Mobile UPI ID (e.g. 9876543210@paytm or user@okicici)!");
      return;
    }

    const availableCash = window.GAMETHON.PlayerProfile ? window.GAMETHON.PlayerProfile.getTotalWithdrawableCash() : 0;
    if (amount <= 0 || amount > availableCash) {
      alert(`⚠️ Invalid withdrawal amount! Available cash balance is ₹${availableCash}. Requested: ₹${amount}`);
      return;
    }

    if (txLog) {
      txLog.style.display = 'block';
      txLog.innerHTML = `<div>> 🔄 Initiating Real-Time Google Pay (UPI) Transfer...</div>`;
    }

    const steps = [
      `> 📡 Connecting to Google Pay UPI Server Gateway...`,
      `> 🔐 Validating UPI ID: [${upiId}]...`,
      `> 💰 Authenticating Bank Transfer of ₹${amount}...`,
      `> ⚡ Processing Instant IMPS/UPI Settlement...`,
      `> ✅ SUCCESS! ₹${amount} Transferred to GPay UPI [${upiId}]!`
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        if (txLog) {
          const div = document.createElement('div');
          div.textContent = steps[currentStep];
          txLog.appendChild(div);
          txLog.scrollTop = txLog.scrollHeight;
        }
        currentStep++;
      } else {
        clearInterval(interval);
        const refNo = "GPI-" + Math.floor(100000000000 + Math.random() * 900000000000);

        if (window.GAMETHON.PlayerProfile) {
          window.GAMETHON.PlayerProfile.withdrawFunds(amount);
        }

        this.openGPayModal(); // Refresh Modal balance

        if (window.GAMETHON.VoiceEngine) {
          window.GAMETHON.VoiceEngine.speak(`Success! ₹${amount} withdrawn to GPay UPI ID ${upiId}.`);
        }

        setTimeout(() => {
          alert(`🎉 GPAY WITHDRAWAL SUCCESSFUL!\n\nAmount: ₹${amount}\nTo UPI ID: ${upiId}\nUPI Ref ID: ${refNo}\nStatus: PROCESSED & CREDITED TO GPAY`);
        }, 300);
      }
    }, 600);
  }

  awardSubgameRewards(gameId, result, stats = {}) {
    // WIN: 100%, DRAW: 50%, LOSS: 25% (Request 4)
    let percent = 1.0;
    let label = "100% VICTORY REWARDS";
    let badge = "🏆";

    if (result === 'DRAW') {
      percent = 0.5;
      label = "50% DRAW MATCH REWARDS";
      badge = "🤝";
    } else if (result === 'LOSS') {
      percent = 0.25;
      label = "25% PARTICIPATION REWARDS";
      badge = "🛡️";
    }

    let baseCoins = 1000;
    let baseDiamonds = 100;
    let basePoints = 500;
    let baseVouchers = 100; // ₹100 Gift Voucher

    // Extra kill bonus for Project ARES
    if (stats.kills && stats.kills > 0) {
      baseCoins += stats.kills * 100;
      baseDiamonds += stats.kills * 10;
      basePoints += stats.kills * 50;
      baseVouchers += stats.kills * 10;
    }

    const earnedCoins = Math.round(baseCoins * percent);
    const earnedDiamonds = Math.round(baseDiamonds * percent);
    const earnedPoints = Math.round(basePoints * percent);
    const earnedVouchers = Math.round(baseVouchers * percent);

    if (window.GAMETHON.PlayerProfile) {
      window.GAMETHON.PlayerProfile.addCoins(earnedCoins);
      window.GAMETHON.PlayerProfile.addDiamonds(earnedDiamonds);
      window.GAMETHON.PlayerProfile.addPoints(earnedPoints);
      window.GAMETHON.PlayerProfile.addGiftVouchers(earnedVouchers);
    }

    // Populate Modal
    const modal = document.getElementById('subgame-reward-modal');
    const modalBadge = document.getElementById('reward-modal-badge');
    const modalTitle = document.getElementById('reward-modal-title');
    const modalSubtitle = document.getElementById('reward-modal-subtitle');
    const rwCoins = document.getElementById('rw-coins');
    const rwDiamonds = document.getElementById('rw-diamonds');
    const rwPoints = document.getElementById('rw-points');
    const rwVouchers = document.getElementById('rw-vouchers');

    if (modalBadge) modalBadge.textContent = badge;
    if (modalTitle) modalTitle.textContent = `${gameId.toUpperCase().replace('_', ' ')} ${result}!`;
    if (modalSubtitle) modalSubtitle.textContent = `${label} CREDITED TO PROFILE!`;
    if (rwCoins) rwCoins.textContent = `+${earnedCoins}`;
    if (rwDiamonds) rwDiamonds.textContent = `+${earnedDiamonds}`;
    if (rwPoints) rwPoints.textContent = `+${earnedPoints}`;
    if (rwVouchers) rwVouchers.textContent = `₹${earnedVouchers}`;

    if (modal) modal.classList.add('active');

    if (window.GAMETHON.VoiceEngine) {
      window.GAMETHON.VoiceEngine.speak(`Rewards dispatched! You earned ${earnedCoins} Coins, ${earnedDiamonds} Diamonds, and ${earnedVouchers} Rupees GPay Gift Voucher.`);
    }

    this.renderHeaderUserBar();
  }


  toggleBigAiBrain() {
    const sidebar = document.getElementById('game-ai-brain-sidebar');
    const btn = document.getElementById('btn-toggle-ai-brain');
    this.isBigAiBrain = !this.isBigAiBrain;

    if (sidebar) {
      if (this.isBigAiBrain) {
        sidebar.classList.add('expanded');
        if (btn) btn.textContent = '🧠 NORMAL AI SIDEBAR';
        if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.speak("Big AI Brain viewport expanded.");
      } else {
        sidebar.classList.remove('expanded');
        if (btn) btn.textContent = '🧠 BIG AI BRAIN SCREEN';
      }
    }
  }

  async askAiBrainQuery() {
    const input = document.getElementById('ai-brain-query-input');
    const consoleArea = document.getElementById('game-ai-console');
    if (!input || !input.value.trim()) return;

    const query = input.value.trim();
    input.value = '';

    if (consoleArea) {
      const pUser = document.createElement('div');
      pUser.style.color = '#00f0ff';
      pUser.textContent = `> Player: ${query}`;
      consoleArea.appendChild(pUser);

      const pAi = document.createElement('div');
      pAi.style.color = '#00ff88';
      pAi.textContent = `> AI Brain: Analyzing tactical query...`;
      consoleArea.appendChild(pAi);

      let reply = "";
      if (window.GAMETHON.AIBrain) {
        reply = await window.GAMETHON.AIBrain.generateResponse("System AI Assistant", query, { game: this.activeGameId });
      } else {
        reply = `Analyzing ${this.activeGameId}: Position clear. Recommending aggressive forward tactical strike!`;
      }

      pAi.textContent = `> AI Brain: ${reply}`;
      consoleArea.scrollTop = consoleArea.scrollHeight;

      if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.speak(reply);
    }
  }

  switchTab(tabId) {
    document.querySelectorAll('.tab-link').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content-panel').forEach(panel => panel.classList.remove('active'));

    const btn = document.getElementById(`nav-btn-${tabId}`);
    const panel = document.getElementById(`tab-${tabId}`);
    if (btn) btn.classList.add('active');
    if (panel) panel.classList.add('active');
  }

  renderGamesGrid() {
    const grid = document.getElementById('games-grid-container');
    if (!grid) return;

    const games = [
      { id: 'boxing_arena', name: 'AI Boxing Arena', icon: '🥊', tag: 'tag-sports', tagText: 'SPORTS & AI', desc: 'Full human body combat, stadium audience cheering, turnbuckle spotlights, judges, and championship award mode.' },
      { id: 'cursed_mansion', name: "Janani's Cursed House", icon: '👵', tag: 'tag-horror', tagText: 'HORROR SURVIVAL', desc: 'Flush wall doors with auto-close/open proximity, Gun/Sword weapons, obstacle drops, and teleporting devils.' },
      { id: 'puzzleverse', name: 'AI PuzzleVerse', icon: '🧩', tag: 'tag-puzzle', tagText: 'PUZZLE & LOGIC', desc: 'Sudoku, AI Quiz Master with downloadable PDF, Driving Sim, 15x15 Hidato, AAA Detective, and Maze Warps.' },
      { id: 'project_ares', name: 'Project ARES', icon: '🎯', tag: 'tag-action', tagText: 'BATTLE ROYALE', desc: '50-Member Battle Royale, Clash Squad 4v4 (Red vs Blue), 1v1 TDM, and spacebar firing.' },
      { id: 'dreamverse', name: 'DreamVerse Metaverse', icon: '🌌', tag: 'tag-meta', tagText: 'METAVERSE & RPG', desc: '3 reality dimensions with 5 multi-directional obstacles per world, 100 HP, and 2s auto-hiding voice alerts.' },
      { id: 'two_worlds', name: 'Chronicles of Two Worlds', icon: '🌱', tag: 'tag-adventure', tagText: 'ADVENTURE', desc: 'Real vs Imaginary morphing ecosystem with expanded Keyboard Builder Menu [ENTER] (Birds, Eggs, Ships, Boats).' }
    ];

    grid.innerHTML = games.map(g => `
      <div class="game-card" onclick="window.GAMETHON.App.launchEngineWithLoader('${g.id}')">
        <div class="game-card-bg"></div>
        <div class="card-header">
          <span class="card-icon">${g.icon}</span>
          <span class="card-tag ${g.tag}">${g.tagText}</span>
        </div>
        <div class="card-body">
          <h3>${g.name}</h3>
          <p>${g.desc}</p>
        </div>
        <div class="card-footer">
          <button class="launch-btn">🚀 LAUNCH ENGINE</button>
        </div>
      </div>
    `).join('');
  }

  launchEngineWithLoader(gameId) {
    this.activeGameId = gameId;
    const loader = document.getElementById('engine-loader-modal');
    if (loader) loader.classList.add('active');

    setTimeout(() => {
      if (loader) loader.classList.remove('active');
      this.openSubGame(gameId);
    }, 700);
  }

  openSubGame(gameId) {
    const modal = document.getElementById('game-modal');
    const viewport = document.getElementById('game-viewport-area');
    const consoleArea = document.getElementById('game-ai-console');
    const modalTitle = document.getElementById('modal-game-title');

    // Dynamic Sub-game Titles
    const titles = {
      'boxing_arena': '🥊 AC GAMES: AI BOXING ARENA (PRO CHAMPIONSHIP)',
      'cursed_mansion': "👵 AC GAMES: JANANI'S CURSED HOUSE (SURVIVAL HORROR)",
      'puzzleverse': '🧩 AC GAMES: AI PUZZLEVERSE, HIDATO & DETECTIVE',
      'project_ares': '🎯 AC GAMES: PROJECT ARES (50-MEMBER BATTLEGROUND)',
      'dreamverse': '🌌 AC GAMES: DREAMVERSE METAVERSE (3 DIMENSIONS)',
      'two_worlds': '🌱 AC GAMES: CHRONICLES OF TWO WORLDS (ECOSYSTEM)'
    };

    if (modalTitle) {
      modalTitle.innerHTML = titles[gameId] || '🎮 AC GAMES SUB-GAME ENGINE VIEWPORT';
    }

    this.isPaused = false;
    const pauseOverlay = document.getElementById('pause-overlay');
    if (pauseOverlay) pauseOverlay.classList.remove('active');
    const pauseBtn = document.getElementById('btn-pause-game-hdr');
    if (pauseBtn) pauseBtn.textContent = '⏸️ PAUSE GAME';

    viewport.innerHTML = `
      <div id="celebration-overlay">
        <h1 class="celebration-title">🏆 VICTORY CHAMPION!</h1>
        <p style="color: #fff; font-family: var(--font-title); margin-top: 10px;" id="celebration-subtitle">Match Won!</p>
      </div>

      <div id="pause-overlay">
        <h1 style="font-family: var(--font-title); font-size: 3rem; color: var(--accent-yellow); text-shadow: 0 0 25px rgba(255,204,0,0.8); margin-bottom: 10px;">
          ⏸️ GAME PAUSED
        </h1>
        <p style="color: #ccc; font-family: var(--font-code); margin-bottom: 25px; font-size: 1.1rem;">Game state frozen. Click resume to continue session.</p>
        <div style="display: flex; gap: 15px; justify-content: center;">
          <button class="btn-neon" style="font-size: 1.1rem; padding: 12px 28px;" onclick="window.GAMETHON.App.togglePauseActiveSubgame()">▶️ RESUME GAME</button>
          <button class="restart-btn" style="font-size: 1.1rem; padding: 12px 28px;" onclick="window.GAMETHON.App.restartActiveSubgame()">🔄 RESTART GAME</button>
          <button class="btn-exit-portal" onclick="window.GAMETHON.App.closeSubGame()">❌ EXIT TO STUDIO PORTAL</button>
        </div>
      </div>

      <canvas id="subgame-canvas" width="960" height="500"></canvas>
    `;

    const canvas = document.getElementById('subgame-canvas');
    if (modal) modal.classList.add('active');

    // Launch Engine
    if (gameId === 'boxing_arena') this.activeSubgameInstance = new window.GAMETHON.SubGames.AIBoxingArena(canvas, consoleArea);
    else if (gameId === 'cursed_mansion') this.activeSubgameInstance = new window.GAMETHON.SubGames.JananisCursedMansion(canvas, consoleArea);
    else if (gameId === 'puzzleverse') this.activeSubgameInstance = new window.GAMETHON.SubGames.AIPuzzleVerse(viewport, consoleArea);
    else if (gameId === 'project_ares') this.activeSubgameInstance = new window.GAMETHON.SubGames.ProjectARES(canvas, consoleArea);
    else if (gameId === 'dreamverse') this.activeSubgameInstance = new window.GAMETHON.SubGames.DreamVerseMetaverse(viewport, consoleArea);
    else if (gameId === 'two_worlds') this.activeSubgameInstance = new window.GAMETHON.SubGames.ChroniclesOfTwoWorlds(viewport, consoleArea);

    if (this.activeSubgameInstance && typeof this.activeSubgameInstance.start === 'function') {
      this.activeSubgameInstance.start();
    }
  }

  closeSubGame() {
    if (this.activeSubgameInstance && typeof this.activeSubgameInstance.stop === 'function') {
      this.activeSubgameInstance.stop();
    }
    this.activeSubgameInstance = null;
    const modal = document.getElementById('game-modal');
    if (modal) modal.classList.remove('active');
  }

  setupGlobalVoiceListener() {
    const btn = document.getElementById('ai-fab-btn');
    if (btn) {
      btn.onclick = () => {
        this.triggerVoiceCommandListener();
      };
    }
  }

  triggerVoiceCommandListener() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      if (window.GAMETHON.VoiceEngine) {
        window.GAMETHON.VoiceEngine.speak("Cold Forge Games Voice Engine Listening. Speak a game name like open boxing game!");
      }

      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log("🎙️ Voice Command Transcript:", transcript);
        this.processVoiceGameCommand(transcript);
      };

      recognition.onerror = () => {
        this.fallbackVoicePrompt();
      };
    } else {
      this.fallbackVoicePrompt();
    }
  }

  fallbackVoicePrompt() {
    const spoken = prompt("🎙️ Cold Forge Games Voice Command Engine:\nSpeak or type your voice command (e.g., 'open boxing game', 'open cursed house', 'open project ares', 'open puzzleverse'):", "open boxing game");
    if (spoken) {
      this.processVoiceGameCommand(spoken.toLowerCase());
    }
  }

  processVoiceGameCommand(text) {
    if (window.GAMETHON.VoiceEngine) {
      window.GAMETHON.VoiceEngine.speak(`Opening ${text}`);
    }

    if (text.includes('boxing')) {
      this.launchEngineWithLoader('boxing_arena');
    } else if (text.includes('cursed') || text.includes('janani') || text.includes('house') || text.includes('mansion')) {
      this.launchEngineWithLoader('cursed_mansion');
    } else if (text.includes('ares') || text.includes('battle') || text.includes('project')) {
      this.launchEngineWithLoader('project_ares');
    } else if (text.includes('puzzle') || text.includes('sudoku') || text.includes('maze') || text.includes('quiz')) {
      this.launchEngineWithLoader('puzzleverse');
    } else if (text.includes('dream') || text.includes('metaverse')) {
      this.launchEngineWithLoader('dreamverse');
    } else if (text.includes('two') || text.includes('world') || text.includes('chronicles')) {
      this.launchEngineWithLoader('two_worlds');
    } else {
      alert(`🎙️ Voice Engine: Command "${text}" not recognized. Try saying "open boxing game" or "open cursed house"!`);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.GAMETHON.App = new GAMETHONApp();
  window.GAMETHON.App.init();
});

