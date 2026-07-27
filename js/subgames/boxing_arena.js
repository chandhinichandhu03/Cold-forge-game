/* =========================================================
   GAMETHON — Sub-Game 1: AI Boxing Arena
   Pre-Game Interactive Setup Wizard (Mode, 30s Round Timing, Odd Rounds),
   Instant Knockout Round Transitions, and Early Majority Match Victory Logic
   ========================================================= */

window.GAMETHON = window.GAMETHON || {};
window.GAMETHON.SubGames = window.GAMETHON.SubGames || {};

class AIBoxingArena {
  constructor(canvasElement, consoleElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.console = consoleElement;
    this.isRunning = false;
    this.isPaused = false;

    this.mode = 'AI'; // 'AI', 'Multiplayer', 'Tournament'
    this.roundDuration = 30; // 30 seconds per round (default)
    this.totalRounds = 3; // ODD NUMBER ONLY (1, 3, 5, 7)
    this.currentRound = 1;
    this.roundTimeRemaining = 30;
    this.lastSecondTick = 0;

    this.playerRoundWins = 0;
    this.opponentRoundWins = 0;
    this.isRoundTransitioning = false;

    const playerName = window.GAMETHON.App ? window.GAMETHON.App.currentUser : 'Player 1';
    const playerAvatar = window.GAMETHON.App ? window.GAMETHON.App.currentAvatar : '👨‍🦱';

    this.player = {
      x: 320,
      y: 280,
      radius: 40,
      hp: 100,
      stamina: 100,
      state: 'idle',
      avatar: playerAvatar,
      name: playerName,
      color: '#00f0ff',
      targetGloveX: 320,
      targetGloveY: 280
    };

    this.opponent = {
      x: 640,
      y: 280,
      radius: 40,
      hp: 100,
      stamina: 100,
      state: 'idle',
      avatar: '🧔',
      name: 'Titan AI (Pro)',
      color: '#ff0077',
      targetGloveX: 640,
      targetGloveY: 280,
      lastAiMoveTime: 0,
      lastAiAttackTime: 0
    };

    this.hitSparks = [];
    this.screenShake = 0;

    this.audienceDensity = 'mega'; // 'none', 'standard', 'mega' (100+)
    this.audienceAudioEnabled = true;
    this.audience = [];
    this.isTrophyAwarding = false;
    this.trophyProgress = 0;
    this.winnerName = '';

    this.setupListeners();
  }

  start() {
    this.showPreGameSetupModal();
  }

  showPreGameSetupModal() {
    let modal = document.getElementById('boxing-setup-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'boxing-setup-modal';
      modal.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(4,6,18,0.95); backdrop-filter:blur(15px); z-index:100; display:flex; flex-direction:column; justify-content:center; align-items:center; color:#fff;";
      this.canvas.parentNode.appendChild(modal);
    }

    modal.style.display = 'flex';
    modal.innerHTML = `
      <div style="background:rgba(14,18,42,0.95); border:2px solid var(--border-neon); padding:25px; border-radius:14px; max-width:580px; width:92%; text-align:center; box-shadow:0 0 30px rgba(0,240,255,0.4);">
        <h2 style="font-family:var(--font-title); color:var(--border-neon); margin-bottom:6px;">🥊 BOXING MATCH SETUP</h2>
        <p style="color:#aaa; font-family:var(--font-code); margin-bottom:15px; font-size:0.9rem;">Configure mode, rounds, 100+ audience crowd, & cheering sound:</p>
        
        <div style="display:flex; flex-direction:column; gap:10px; text-align:left; margin-bottom:20px; max-height:300px; overflow-y:auto; padding-right:5px;">
          <div>
            <label style="display:block; color:var(--accent-yellow); font-family:var(--font-title); font-size:0.8rem; margin-bottom:4px;">1. MATCH MODE:</label>
            <select id="boxing-mode-select" style="width:100%; padding:8px; background:#0a0e20; color:#fff; border:1px solid #444; border-radius:6px; font-family:var(--font-code);">
              <option value="AI">🎮 User vs Pro AI</option>
              <option value="Multiplayer">👥 User vs Another User (2P Local)</option>
              <option value="Tournament">🏆 Championship Tournament Mode</option>
            </select>
          </div>

          <div>
            <label style="display:block; color:var(--accent-yellow); font-family:var(--font-title); font-size:0.8rem; margin-bottom:4px;">2. ROUND TIME LIMIT (SECONDS):</label>
            <select id="boxing-time-select" style="width:100%; padding:8px; background:#0a0e20; color:#fff; border:1px solid #444; border-radius:6px; font-family:var(--font-code);">
              <option value="30" selected>⚡ 30 Seconds per Round</option>
              <option value="60">⏱️ 60 Seconds per Round</option>
              <option value="90">⏳ 90 Seconds per Round</option>
            </select>
          </div>

          <div>
            <label style="display:block; color:var(--accent-yellow); font-family:var(--font-title); font-size:0.8rem; margin-bottom:4px;">3. NUMBER OF ROUNDS (ODD NUMBER):</label>
            <select id="boxing-rounds-select" style="width:100%; padding:8px; background:#0a0e20; color:#fff; border:1px solid #444; border-radius:6px; font-family:var(--font-code);">
              <option value="1">1 Round Match</option>
              <option value="3" selected>3 Rounds Match (First to 2 Wins)</option>
              <option value="5">5 Rounds Match (First to 3 Wins)</option>
            </select>
          </div>

          <div>
            <label style="display:block; color:var(--accent-yellow); font-family:var(--font-title); font-size:0.8rem; margin-bottom:4px;">4. AUDIENCE CROWD SELECTION (MENU OPTION):</label>
            <select id="boxing-crowd-select" style="width:100%; padding:8px; background:#0a0e20; color:#fff; border:1px solid #00f0ff; border-radius:6px; font-family:var(--font-code);">
              <option value="none">🚫 No Audience around ring</option>
              <option value="standard">👥 Standard Crowd (15 Spectators)</option>
              <option value="mega" selected>🏟️ Mega Crowded (100+ People Standing & Sitting around Ring)</option>
            </select>
          </div>

          <div>
            <label style="display:block; color:var(--accent-yellow); font-family:var(--font-title); font-size:0.8rem; margin-bottom:4px;">5. AUDIENCE CHEERING NOISE & VOICE:</label>
            <select id="boxing-noise-select" style="width:100%; padding:8px; background:#0a0e20; color:#fff; border:1px solid #00f0ff; border-radius:6px; font-family:var(--font-code);">
              <option value="enabled" selected>🔊 Audience Noise & Voice Active</option>
              <option value="disabled">🔇 Audience Muted</option>
            </select>
          </div>
        </div>

        <button class="btn-neon" style="width:100%; font-size:1.05rem; padding:12px;" onclick="window.activeBoxing.confirmPreGameSetup()">🥊 ENTER ARENA & START FIGHT</button>
      </div>
    `;
    window.activeBoxing = this;
  }

  confirmPreGameSetup() {
    const modeSel = document.getElementById('boxing-mode-select');
    const timeSel = document.getElementById('boxing-time-select');
    const roundsSel = document.getElementById('boxing-rounds-select');
    const crowdSel = document.getElementById('boxing-crowd-select');
    const noiseSel = document.getElementById('boxing-noise-select');
    const modal = document.getElementById('boxing-setup-modal');

    this.mode = modeSel ? modeSel.value : 'AI';
    this.roundDuration = parseInt(timeSel ? timeSel.value : '30');
    this.totalRounds = parseInt(roundsSel ? roundsSel.value : '3');
    this.audienceDensity = crowdSel ? crowdSel.value : 'mega';
    this.audienceAudioEnabled = noiseSel ? noiseSel.value === 'enabled' : true;

    // Build Audience Array based on user menu choice
    this.buildAudienceCrowd();

    if (this.totalRounds % 2 === 0) this.totalRounds += 1;

    if (modal) modal.style.display = 'none';

    this.currentRound = 1;
    this.playerRoundWins = 0;
    this.opponentRoundWins = 0;
    this.roundTimeRemaining = this.roundDuration;
    this.lastSecondTick = Date.now();
    this.isRoundTransitioning = false;
    this.isTrophyAwarding = false;
    this.trophyProgress = 0;

    this.opponent.name = (this.mode === 'Multiplayer') ? 'Player 2 (Human)' : (this.mode === 'Tournament' ? 'Tournament AI Legend' : 'Titan AI (Pro)');

    this.isRunning = true;
    this.isPaused = false;
    this.player.hp = 100;
    this.opponent.hp = 100;

    const overlay = document.getElementById('celebration-overlay');
    if (overlay) overlay.classList.remove('active');

    this.logConsole(`🥊 CHAMPIONSHIP MATCH STARTED! Crowd: [${this.audienceDensity.toUpperCase()} - ${this.audience.length} People], Noise: [${this.audienceAudioEnabled ? 'ON' : 'OFF'}].`);
    this.renderOnscreenActionButtons();

    if (window.GAMETHON.VoiceEngine && this.audienceAudioEnabled) {
      window.GAMETHON.VoiceEngine.speak(`Round One! Fight! Audience cheering active.`);
      window.GAMETHON.VoiceEngine.playCheering();
    }

    this.loop();
  }

  buildAudienceCrowd() {
    this.audience = [];
    if (this.audienceDensity === 'none') return;

    const emojis = ['👏', '🙌', '🥳', '🙋‍♂️', '🤩', '🗣️', '👊', '🔥', '🎉', '😃', '🙋‍♀️', '💪', '👑'];

    if (this.audienceDensity === 'standard') {
      for (let i = 0; i < 15; i++) {
        this.audience.push({
          x: 60 + i * 58,
          y: 35,
          icon: emojis[i % emojis.length],
          isStanding: false
        });
      }
    } else if (this.audienceDensity === 'mega') {
      // 100+ People both Standing & Sitting around the ring perimeter (Request 1)
      // Top sitting rows (Rows 1 & 2)
      for (let r = 0; r < 2; r++) {
        for (let i = 0; i < 30; i++) {
          this.audience.push({
            x: 25 + i * 31,
            y: 15 + r * 22,
            icon: emojis[(i + r) % emojis.length],
            isStanding: false
          });
        }
      }
      // Left standing column
      for (let i = 0; i < 12; i++) {
        this.audience.push({
          x: 20 + (i % 2) * 20,
          y: 75 + i * 30,
          icon: emojis[i % emojis.length],
          isStanding: true
        });
      }
      // Right standing column
      for (let i = 0; i < 12; i++) {
        this.audience.push({
          x: 910 + (i % 2) * 20,
          y: 75 + i * 30,
          icon: emojis[(i + 3) % emojis.length],
          isStanding: true
        });
      }
      // Bottom ground crowd (Standing & Sitting in front row around ring floor)
      for (let i = 0; i < 28; i++) {
        this.audience.push({
          x: 35 + i * 32,
          y: 445,
          icon: emojis[i % emojis.length],
          isStanding: i % 2 === 0
        });
      }
    }
  }

  confirmPreGameSetup() {
    const modeSel = document.getElementById('boxing-mode-select');
    const timeSel = document.getElementById('boxing-time-select');
    const roundsSel = document.getElementById('boxing-rounds-select');
    const modal = document.getElementById('boxing-setup-modal');

    this.mode = modeSel ? modeSel.value : 'AI';
    this.roundDuration = parseInt(timeSel ? timeSel.value : '30');
    this.totalRounds = parseInt(roundsSel ? roundsSel.value : '3');

    // Ensure ODD NUMBER of rounds
    if (this.totalRounds % 2 === 0) this.totalRounds += 1;

    if (modal) modal.style.display = 'none';

    this.currentRound = 1;
    this.playerRoundWins = 0;
    this.opponentRoundWins = 0;
    this.roundTimeRemaining = this.roundDuration;
    this.lastSecondTick = Date.now();
    this.isRoundTransitioning = false;

    this.opponent.name = (this.mode === 'Multiplayer') ? 'Player 2 (Human)' : (this.mode === 'Tournament' ? 'Tournament AI Legend' : 'Titan AI (Pro)');

    this.isRunning = true;
    this.isPaused = false;
    this.player.hp = 100;
    this.opponent.hp = 100;

    const overlay = document.getElementById('celebration-overlay');
    if (overlay) overlay.classList.remove('active');

    this.logConsole(`🥊 CHAMPIONSHIP MATCH STARTED! Mode: [${this.mode}], Rounds: ${this.totalRounds} (Odd), Time: ${this.roundDuration}s per round.`);
    this.renderOnscreenActionButtons();

    if (window.GAMETHON.VoiceEngine) {
      window.GAMETHON.VoiceEngine.speak(`Round One! ${this.totalRounds} odd rounds match. Fight!`);
      window.GAMETHON.VoiceEngine.playCheering();
    }

    this.loop();
  }

  setupListeners() {
    if (this.canvas) {
      this.canvas.onclick = (e) => {
        // canvas click handler reserved for normal gameplay
      };
    }

    if (window.GAMETHON.launchedFromMaze) {
      this.reset30sMazeInactivityTimer();
    }

    this.keyDownHandler = (e) => {
      if (!this.isRunning || this.isPaused || this.isRoundTransitioning) return;

      if (window.GAMETHON.launchedFromMaze) {
        this.reset30sMazeInactivityTimer();
      }

      // P1 Controls (WASD)
      if (e.key === 'a' || e.key === 'A') this.moveFighter(this.player, -20);
      if (e.key === 'd' || e.key === 'D') this.moveFighter(this.player, 20);
      if (e.key === 'w' || e.key === 'W') this.executeAttack(this.player, this.opponent, 'head');
      if (e.key === 's' || e.key === 'S') this.executeAttack(this.player, this.opponent, 'torso');
      if (e.key === 'b' || e.key === 'B') this.executeBlock(this.player);

      // Heart Obstacle Auth Key (F key when near heart)
      if (e.key === 'f' || e.key === 'F') {
        if (Math.hypot(this.player.x - 480, this.player.y - 260) < 60) {
          window.GAMETHON.authenticateHeartObstacle();
        }
      }

      // P2 Controls in 1v1 Multiplayer
      if (this.mode === 'Multiplayer') {
        if (e.key === 'ArrowLeft') this.moveFighter(this.opponent, -20);
        if (e.key === 'ArrowRight') this.moveFighter(this.opponent, 20);
        if (e.key === 'ArrowUp') this.executeAttack(this.opponent, this.player, 'head');
        if (e.key === 'ArrowDown') this.executeAttack(this.opponent, this.player, 'torso');
        if (e.key === 'k' || e.key === 'K') this.executeBlock(this.opponent);
      }
    };

    window.addEventListener('keydown', this.keyDownHandler);
  }

  reset30sMazeInactivityTimer() {
    if (window.GAMETHON.mazeInactivityTimer) clearTimeout(window.GAMETHON.mazeInactivityTimer);
    window.GAMETHON.mazeInactivityTimer = setTimeout(() => {
      if (window.GAMETHON.launchedFromMaze) {
        this.logConsole("⏰ 30 SECONDS INACTIVITY DETECTED! Teleporting back to AI Maze...");
        if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.speak("30 seconds inactivity detected. Teleporting back to AI Maze.");
        window.GAMETHON.App.launchEngineWithLoader('puzzleverse');
      }
    }, 30000);
  }

  renderOnscreenActionButtons() {
    let container = document.getElementById('boxing-controls-area');
    if (!container) {
      container = document.createElement('div');
      container.id = 'boxing-controls-area';
      container.style.cssText = "display:flex; flex-direction:column; gap:10px; margin-top:12px; align-items:center; width:100%;";
      this.canvas.parentNode.appendChild(container);
    }

    container.innerHTML = `
      <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">
        <button class="btn-neon" onclick="window.activeBoxing.showPreGameSetupModal()">⚙️ SETUP WIZARD (MODE / ROUNDS / TIME)</button>
      </div>

      <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center;">
        <span style="color:#00f0ff; font-family:var(--font-title); align-self:center; font-size:0.9rem;">${this.player.name} Controls:</span>
        <button class="dpad-btn" onclick="window.activeBoxing.moveFighter(window.activeBoxing.player, -20)">⬅️ Left [A]</button>
        <button class="dpad-btn" onclick="window.activeBoxing.moveFighter(window.activeBoxing.player, 20)">➡️ Right [D]</button>
        <button class="dpad-btn" onclick="window.activeBoxing.executeAttack(window.activeBoxing.player, window.activeBoxing.opponent, 'head')">🥊 Head [W]</button>
        <button class="dpad-btn" onclick="window.activeBoxing.executeAttack(window.activeBoxing.player, window.activeBoxing.opponent, 'torso')">💥 Body [S]</button>
        <button class="dpad-btn" onclick="window.activeBoxing.executeBlock(window.activeBoxing.player)">🛡️ Guard [B]</button>
      </div>

      ${this.mode === 'Multiplayer' ? `
        <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center;">
          <span style="color:#ff0077; font-family:var(--font-title); align-self:center; font-size:0.9rem;">P2 Controls:</span>
          <button class="dpad-btn" onclick="window.activeBoxing.moveFighter(window.activeBoxing.opponent, -20)">⬅️ P2 Left</button>
          <button class="dpad-btn" onclick="window.activeBoxing.moveFighter(window.activeBoxing.opponent, 20)">➡️ P2 Right</button>
          <button class="dpad-btn" onclick="window.activeBoxing.executeAttack(window.activeBoxing.opponent, window.activeBoxing.player, 'head')">🥊 P2 Head</button>
          <button class="dpad-btn" onclick="window.activeBoxing.executeAttack(window.activeBoxing.opponent, window.activeBoxing.player, 'torso')">💥 P2 Body</button>
          <button class="dpad-btn" onclick="window.activeBoxing.executeBlock(window.activeBoxing.opponent)">🛡️ P2 Guard</button>
        </div>
      ` : ''}
    `;
    window.activeBoxing = this;
  }

  moveFighter(fighter, dx) {
    if (this.isPaused || this.isRoundTransitioning) return;
    if (fighter === this.player) {
      this.player.x = Math.max(160, Math.min(this.opponent.x - 55, this.player.x + dx));
    } else {
      this.opponent.x = Math.max(this.player.x + 55, Math.min(800, this.opponent.x + dx));
    }
  }

  restartGame() {
    this.showPreGameSetupModal();
  }

  stop() {
    this.isRunning = false;
    window.removeEventListener('keydown', this.keyDownHandler);
    const container = document.getElementById('boxing-controls-area');
    if (container) container.remove();
    const modal = document.getElementById('boxing-setup-modal');
    if (modal) modal.remove();
  }

  logConsole(msg) {
    if (this.console) {
      const p = document.createElement('div');
      p.textContent = `> ${msg}`;
      this.console.appendChild(p);
      this.console.scrollTop = this.console.scrollHeight;
    }
  }

  executeAttack(attacker, defender, targetArea) {
    if (this.isPaused || this.isRoundTransitioning || attacker.stamina < 15 || attacker.state !== 'idle') return;

    attacker.state = 'punch';
    attacker.stamina -= 15;

    const targetY = targetArea === 'head' ? defender.y - 25 : defender.y + 15;
    attacker.targetGloveX = defender.x;
    attacker.targetGloveY = targetY;

    if (window.GAMETHON.VoiceEngine) {
      window.GAMETHON.VoiceEngine.playPunchSound();
    }

    let damage = targetArea === 'head' ? 40 : 25;

    const dist = Math.abs(attacker.x - defender.x);
    if (dist > 380) {
      this.logConsole("⚠️ Too far away! Step closer to strike!");
      setTimeout(() => { attacker.state = 'idle'; }, 200);
      return;
    }

    if (defender.state === 'block') {
      this.logConsole(`🛡️ ${defender.name} BLOCKED ${targetArea.toUpperCase()} STRIKE! 0 Damage.`);
    } else {
      defender.hp = Math.max(0, defender.hp - damage);
      this.screenShake = 12;
      this.hitSparks.push({ x: defender.x, y: targetY, life: 1.0 });
      this.logConsole(`💥 ${attacker.name} landed ${targetArea.toUpperCase()} STRIKE on ${defender.name}! -${damage} HP`);

      // INSTANT KNOCKOUT TRANSITION IF HP REACHES 0
      if (defender.hp <= 0) {
        this.evaluateRoundEnd(attacker.name);
        return;
      }
    }

    setTimeout(() => {
      attacker.state = 'idle';
      defender.state = 'idle';
    }, 280);
  }

  executeBlock(fighter) {
    if (this.isPaused || this.isRoundTransitioning) return;
    fighter.state = 'block';
    this.logConsole(`🛡️ ${fighter.name} raised high defensive guard!`);
    setTimeout(() => { fighter.state = 'idle'; }, 450);
  }

  updateProAI() {
    if (this.isPaused || this.isRoundTransitioning || this.mode === 'Multiplayer' || !this.isRunning || this.opponent.hp <= 0) return;

    const now = Date.now();
    const dist = Math.abs(this.player.x - this.opponent.x);

    if (now - this.opponent.lastAiMoveTime > 400) {
      this.opponent.lastAiMoveTime = now;
      if (dist > 180) this.moveFighter(this.opponent, -25);
      else if (dist < 100) this.moveFighter(this.opponent, 20);
      else this.moveFighter(this.opponent, Math.random() < 0.5 ? -15 : 15);
    }

    if (now - this.opponent.lastAiAttackTime > 900 && dist <= 220) {
      this.opponent.lastAiAttackTime = now;
      const rand = Math.random();
      if (rand < 0.45) this.executeAttack(this.opponent, this.player, 'head');
      else if (rand < 0.8) this.executeAttack(this.opponent, this.player, 'torso');
      else this.executeBlock(this.opponent);
    }
  }

  handleRoundTimer() {
    if (this.isPaused || !this.isRunning || this.isRoundTransitioning) return;

    const now = Date.now();
    if (now - this.lastSecondTick >= 1000) {
      this.lastSecondTick = now;
      this.roundTimeRemaining--;

      if (this.roundTimeRemaining <= 0) {
        this.evaluateRoundEnd(null);
      }
    }
  }

  evaluateRoundEnd(forcedWinnerName = null) {
    if (this.isRoundTransitioning) return;
    this.isRoundTransitioning = true;

    let roundWinner = forcedWinnerName;
    if (!roundWinner) {
      if (this.player.hp > this.opponent.hp) roundWinner = this.player.name;
      else if (this.opponent.hp > this.player.hp) roundWinner = this.opponent.name;
      else roundWinner = 'Draw';
    }

    if (roundWinner === this.player.name) this.playerRoundWins++;
    else if (roundWinner === this.opponent.name) this.opponentRoundWins++;

    this.logConsole(`🔔 END OF ROUND ${this.currentRound}! Winner: ${roundWinner.toUpperCase()}! (Score: ${this.player.name} ${this.playerRoundWins} - ${this.opponentRoundWins} ${this.opponent.name})`);
    
    if (window.GAMETHON.VoiceEngine) {
      window.GAMETHON.VoiceEngine.speak(`End of Round ${this.currentRound}. Round winner: ${roundWinner}`);
    }

    // EARLY MAJORITY VICTORY CONSTRAINT (Request 1)
    // Majority wins needed = Math.ceil(this.totalRounds / 2) (e.g. 2 wins out of 3 rounds, 3 out of 5 rounds)
    const majorityNeeded = Math.ceil(this.totalRounds / 2);

    if (this.playerRoundWins >= majorityNeeded || this.opponentRoundWins >= majorityNeeded) {
      // Majority wins achieved! DO NOT GO TO NEXT ROUND!
      setTimeout(() => {
        this.finishChampionshipMatch();
      }, 1000);
      return;
    }

    // Next Round Transition
    setTimeout(() => {
      this.currentRound++;
      this.player.hp = 100;
      this.opponent.hp = 100;
      this.player.x = 320;
      this.opponent.x = 640;
      this.roundTimeRemaining = this.roundDuration;
      this.isRoundTransitioning = false;

      this.logConsole(`🥊 ROUND ${this.currentRound} OF ${this.totalRounds} BEGINS!`);
      if (window.GAMETHON.VoiceEngine) {
        window.GAMETHON.VoiceEngine.speak(`Round ${this.currentRound}! Fight!`);
      }
    }, 1200);
  }

  finishChampionshipMatch() {
    this.isRoundTransitioning = false;
    this.isTrophyAwarding = true;
    this.trophyProgress = 0;

    let overallWinner = "";
    const isPlayerWin = this.playerRoundWins >= this.opponentRoundWins;
    if (this.playerRoundWins > this.opponentRoundWins) {
      overallWinner = this.player.name;
    } else if (this.opponentRoundWins > this.playerRoundWins) {
      overallWinner = this.opponent.name;
    } else {
      overallWinner = this.player.hp >= this.opponent.hp ? this.player.name : this.opponent.name;
    }

    this.winnerName = overallWinner;

    const winningScore = Math.max(this.playerRoundWins, this.opponentRoundWins);
    this.logConsole(`🏆 CHAMPIONSHIP VICTORY! ${overallWinner.toUpperCase()} HAS WON THE MAJORITY ROUNDS (${winningScore}/${this.totalRounds})! Judges Awarding Champion Cup!`);

    if (window.GAMETHON.VoiceEngine) {
      window.GAMETHON.VoiceEngine.speak(`Judges present the Championship Cup to ${overallWinner}! Match Champion!`);
      window.GAMETHON.VoiceEngine.playTrophyAwardSound();
    }

    setTimeout(() => {
      this.isRunning = false;
      const subtitle = document.getElementById('celebration-subtitle');
      if (subtitle) {
        subtitle.innerHTML = `🏆 JUDGES AWARD CHAMPION CUP TO ${overallWinner.toUpperCase()}! (${this.playerRoundWins} - ${this.opponentRoundWins}) 🥇`;
      }
      const overlay = document.getElementById('celebration-overlay');
      if (overlay) overlay.classList.add('active');

      if (window.GAMETHON.App) {
        window.GAMETHON.App.awardSubgameRewards('boxing_arena', isPlayerWin ? 'WIN' : 'LOSS');
      }
    }, 4500);
  }

  loop() {
    if (!this.isRunning) return;

    if (!this.isPaused && !this.isRoundTransitioning && !this.isTrophyAwarding) {
      this.player.stamina = Math.min(100, this.player.stamina + 0.35);
      this.opponent.stamina = Math.min(100, this.opponent.stamina + 0.35);
      if (this.screenShake > 0) this.screenShake -= 1;

      this.handleRoundTimer();
      this.updateProAI();
    }

    if (this.isTrophyAwarding) {
      this.trophyProgress = Math.min(1.0, this.trophyProgress + 0.015);
    }

    this.draw();
    requestAnimationFrame(() => this.loop());
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    if (this.screenShake > 0) {
      ctx.translate((Math.random() - 0.5) * this.screenShake, (Math.random() - 0.5) * this.screenShake);
      this.screenShake *= 0.85;
    }

    ctx.fillStyle = '#050714';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Audience
    ctx.font = '24px sans-serif';
    this.audience.forEach((aud, i) => {
      const offsetY = Math.sin(Date.now() * 0.006 + i) * (aud.isStanding ? 6 : 3);
      ctx.fillText(aud.icon, aud.x, aud.y + offsetY);
    });

    // Center Heart Obstacle (Item 2)
    ctx.strokeStyle = '#ff0077'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(480, 260, 28, 0, Math.PI * 2); ctx.stroke();
    ctx.font = '32px sans-serif'; ctx.fillText('💖', 464, 272);
    if (Math.hypot(this.player.x - 480, this.player.y - 260) < 60) {
      ctx.font = 'bold 12px Orbitron'; ctx.fillStyle = '#ff0077';
      ctx.fillText("PRESS 'F' FOR PIN AUTH 🔐", 385, 225);
    }

    // Spotlights
    const lightPosts = [{ x: 120, y: 70 }, { x: 840, y: 70 }, { x: 120, y: 430 }, { x: 840, y: 430 }];
    lightPosts.forEach(lp => {
      ctx.fillStyle = 'rgba(255, 240, 180, 0.12)';
      ctx.beginPath(); ctx.moveTo(lp.x, lp.y); ctx.lineTo(lp.x - 70, 430); ctx.lineTo(lp.x + 70, 430); ctx.fill();
      ctx.fillStyle = '#ffea00'; ctx.fillRect(lp.x - 6, lp.y - 12, 12, 16);
    });

    // Ring Canvas & Ropes
    const ringLeft = 140, ringRight = 820, ringTop = 80, ringBottom = 420;
    ctx.fillStyle = '#0a1128';
    ctx.fillRect(ringLeft, ringTop, ringRight - ringLeft, ringBottom - ringTop);

    const ropeColors = ['#ff0055', '#ffffff', '#00f0ff'];
    ropeColors.forEach((color, i) => {
      ctx.strokeStyle = color; ctx.lineWidth = 3; const offset = i * 8;
      ctx.strokeRect(ringLeft + offset, ringTop + offset, (ringRight - ringLeft) - offset * 2, (ringBottom - ringTop) - offset * 2);
    });

    // Judges Presentation Animation (Request 1)
    if (this.isTrophyAwarding) {
      const judgeX = 480 - (1 - this.trophyProgress) * 150;
      const judgeY = 250;

      // Draw Judges stepping into center ring
      ctx.font = '50px sans-serif';
      ctx.fillText('👩‍⚖️', judgeX - 40, judgeY);
      ctx.fillText('👨‍⚖️', judgeX + 30, judgeY);

      // Chief Judge holding out Golden Champion Cup 🏆
      ctx.font = '70px sans-serif';
      ctx.fillText('🏆', judgeX - 10, judgeY - 45);

      // Light beam & sparkles around trophy
      ctx.fillStyle = 'rgba(255, 215, 0, 0.25)';
      ctx.beginPath();
      ctx.arc(judgeX + 25, judgeY - 20, 90 * this.trophyProgress, 0, Math.PI * 2);
      ctx.fill();

      // Text banner
      ctx.fillStyle = '#ffcc00';
      ctx.font = 'bold 24px Orbitron';
      ctx.textAlign = 'center';
      ctx.fillText(`🏆 JUDGES AWARD CHAMPION CUP TO ${this.winnerName.toUpperCase()}! 🏆`, 480, 160);
      ctx.textAlign = 'left';
    } else {
      // Normal Judges at ringside
      ctx.fillStyle = '#fff'; ctx.font = '12px Orbitron';
      ctx.fillText('👨‍⚖️ Judge 1', 100, 485);
      ctx.fillText('👩‍⚖️ Chief Judge', 420, 485);
      ctx.fillText('👨‍⚖️ Judge 3', 760, 485);
    }

    // Round & Timer HUD
    ctx.fillStyle = '#ffcc00';
    ctx.font = 'bold 20px Orbitron';
    ctx.fillText(`ROUND ${this.currentRound} / ${this.totalRounds}`, 380, 30);
    ctx.fillStyle = this.roundTimeRemaining <= 10 ? '#ff0055' : '#00ff88';
    ctx.fillText(`⏱️ 00:${this.roundTimeRemaining < 10 ? '0' : ''}${this.roundTimeRemaining}`, 410, 60);

    // Fighter Round Score Pills
    ctx.fillStyle = '#00f0ff'; ctx.font = '14px Orbitron';
    ctx.fillText(`Rounds Won: ${this.playerRoundWins}`, 150, 65);
    ctx.fillStyle = '#ff0055';
    ctx.fillText(`Rounds Won: ${this.opponentRoundWins}`, 640, 65);

    // Fighters
    this.drawFighter(this.player, true);
    this.drawFighter(this.opponent, false);

    // Hit Sparks
    this.hitSparks.forEach((hs, index) => {
      ctx.fillStyle = '#ffea00'; ctx.beginPath(); ctx.arc(hs.x, hs.y, hs.life * 18, 0, Math.PI * 2); ctx.fill();
      hs.life -= 0.1; if (hs.life <= 0) this.hitSparks.splice(index, 1);
    });

    // HUD Health & Stamina Bars
    ctx.fillStyle = '#fff'; ctx.font = '15px Orbitron';
    ctx.fillText(`${this.player.avatar} ${this.player.name}`, 150, 25);
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(150, 30, 200, 10);
    ctx.fillStyle = '#00ff88'; ctx.fillRect(150, 30, (this.player.hp / 100) * 200, 10);

    ctx.fillStyle = '#fff';
    ctx.fillText(`${this.opponent.avatar} ${this.opponent.name}`, 640, 25);
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(640, 30, 200, 10);
    ctx.fillStyle = '#ff0055'; ctx.fillRect(640, 30, (this.opponent.hp / 100) * 200, 10);

    ctx.restore();
  }

  drawFighter(f, isPlayer) {
    const ctx = this.ctx;
    const isPunching = f.state === 'punch';

    ctx.font = '55px sans-serif'; ctx.fillText(f.avatar, f.x - 28, f.y - 20);
    ctx.fillStyle = f.color; ctx.fillRect(f.x - 18, f.y + 15, 36, 55);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(f.x - 14, f.y + 70, 12, 45); ctx.fillRect(f.x + 2, f.y + 70, 12, 45);

    ctx.font = '28px sans-serif';
    if (isPunching) {
      ctx.strokeStyle = f.color; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(f.x, f.y + 25); ctx.lineTo(f.targetGloveX, f.targetGloveY); ctx.stroke();
      ctx.fillText('🥊', f.targetGloveX - 14, f.targetGloveY + 10);
    } else if (f.state === 'block') {
      ctx.fillText('🥊', f.x - 20, f.y - 10); ctx.fillText('🥊', f.x + 4, f.y - 10);
    } else {
      const dir = isPlayer ? 1 : -1;
      ctx.fillText('🥊', f.x + (15 * dir), f.y + 25); ctx.fillText('🥊', f.x + (30 * dir), f.y + 35);
    }
  }
}

window.GAMETHON.SubGames.AIBoxingArena = AIBoxingArena;
