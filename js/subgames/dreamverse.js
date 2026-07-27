/* =========================================================
   GAMETHON — Sub-Game 3: DreamVerse Metaverse
   3 Dimensions, 5 Multi-Directional Obstacles per World,
   100 HP Health, 10 HP/s Proximity Damage, 2s Auto-Hiding Voice Alerts,
   and Reaching Destiny Flag Victory Sound & Voice
   ========================================================= */

window.GAMETHON = window.GAMETHON || {};
window.GAMETHON.SubGames = window.GAMETHON.SubGames || {};

class DreamVerseMetaverse {
  constructor(containerElement, consoleElement) {
    this.container = containerElement;
    this.console = consoleElement;
    this.currentWorld = 'Real'; // Phase 1: Real World (Item 4)
    this.player = { x: 120, y: 180, hp: 100, maxHp: 100, avatar: '🧍' };
    this.isRunning = false;
    this.isPaused = false;

    // 5 Multi-directional Obstacles per World
    this.worldObstacles = {
      Real: [
        { id: 1, x: 250, y: 100, vx: 2.0, vy: 1.5, type: '🚘 Traffic Car' },
        { id: 2, x: 450, y: 220, vx: -2.5, vy: 2.0, type: '🚁 Security Drone' },
        { id: 3, x: 620, y: 160, vx: 1.8, vy: -2.2, type: '⚡ Electric Fence' },
        { id: 4, x: 350, y: 300, vx: -1.5, vy: -1.8, type: '🚚 Heavy Truck' },
        { id: 5, x: 750, y: 260, vx: 2.2, vy: 1.2, type: '🤖 Security Mech' }
      ],
      Dream: [
        { id: 1, x: 250, y: 100, vx: 1.8, vy: 2.2, type: '👻 Nightmare Spectre' },
        { id: 2, x: 450, y: 220, vx: -2.2, vy: -1.8, type: '🌀 Temporal Vortex' },
        { id: 3, x: 620, y: 160, vx: 2.5, vy: -1.5, type: '🔮 Levitating Prism' },
        { id: 4, x: 350, y: 300, vx: -1.8, vy: 2.5, type: '🐉 Shadow Serpent' },
        { id: 5, x: 750, y: 260, vx: 2.0, vy: -2.0, type: '💀 Phantom Ghoul' }
      ],
      Hidden: [
        { id: 1, x: 250, y: 100, vx: 2.5, vy: 1.8, type: '👤 Shadow Phantom' },
        { id: 2, x: 450, y: 220, vx: -3.0, vy: -2.2, type: '🕳️ Dark Matter Rift' },
        { id: 3, x: 620, y: 160, vx: 2.0, vy: 2.8, type: '👁️ Phantom Trap' },
        { id: 4, x: 350, y: 300, vx: -2.2, vy: 2.0, type: '🖤 Void Abomination' },
        { id: 5, x: 750, y: 260, vx: 1.5, vy: -2.5, type: '🕸️ Cosmic Anomaly' }
      ]
    };

    this.destinyFlag = { x: 860, y: 280 };
    this.lastDamageTime = 0;
    this.alertTimer = null;
    this.lastVoiceAlertTime = 0;
  }

  start() {
    this.isRunning = true;
    this.isPaused = false;
    this.currentWorld = 'Real';
    this.player.hp = 100;
    this.player.x = 120; this.player.y = 180;
    this.heartObstacle = { x: 480, y: 200, icon: '💖' };
    this.renderUI();
    this.logConsole("🌌 DreamVerse Metaverse Loaded! Starting Phase 1: Real World. Reach destiny to advance!");

    // 30-Second Inactivity Guard if launched from Maze (Item 4)
    if (window.GAMETHON.launchedFromMaze) {
      this.reset30sMazeInactivityTimer();
    }

    this.loop();
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

  stop() {
    this.isRunning = false;
    if (window.GAMETHON.mazeInactivityTimer) clearTimeout(window.GAMETHON.mazeInactivityTimer);
    this.container.innerHTML = '';
  }

  logConsole(msg) {
    if (this.console) {
      const p = document.createElement('div');
      p.textContent = `[DreamVerse] > ${msg}`;
      this.console.appendChild(p);
      this.console.scrollTop = this.console.scrollHeight;
    }
  }

  restartGame() {
    this.currentWorld = 'Real';
    this.player = { x: 120, y: 180, hp: 100, maxHp: 100, avatar: '🧍' };
    this.isRunning = true;
    this.isPaused = false;
    const overlay = document.getElementById('celebration-overlay');
    if (overlay) overlay.classList.remove('active');
    this.logConsole("🔄 DIMENSION RESTARTED FROM PHASE 1 REAL WORLD!");
    this.loop();
  }

  switchWorld(worldName) {
    this.currentWorld = worldName;
    this.logConsole(`🌌 DIMENSION PORTAL -> Switched to [${worldName.toUpperCase()} WORLD]!`);
    if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.speak(`Warping to ${worldName} World.`);
    this.renderUI();
  }

  showAlertMessage(msgText) {
    const banner = document.getElementById('dream-alert-banner');
    if (banner) {
      banner.textContent = msgText;
      banner.style.display = 'block';

      if (this.alertTimer) clearTimeout(this.alertTimer);
      this.alertTimer = setTimeout(() => {
        if (banner) banner.style.display = 'none';
      }, 2000);
    }
  }

  renderUI() {
    this.container.innerHTML = `
      <div style="padding: 15px; color: #fff; height: 100%; overflow-y: auto;">
        <h2 style="font-family: var(--font-title); color: var(--accent-purple); margin-bottom: 10px;">🌌 DreamVerse Metaverse (${this.currentWorld} World Phase)</h2>

        <div id="dream-alert-banner" style="display:none; background:rgba(255,0,85,0.9); border:2px solid #fff; color:#fff; font-family:var(--font-title); padding:10px 20px; border-radius:8px; margin-bottom:12px; font-weight:bold; font-size:1.1rem; text-align:center; box-shadow:0 0 20px rgba(255,0,85,0.8);"></div>

        <div style="display: flex; gap: 12px; margin-bottom: 12px;">
          <button class="btn-neon" onclick="window.activeDreamverse.switchWorld('Real')">🌍 Phase 1: Real World</button>
          <button class="btn-neon-purple" onclick="window.activeDreamverse.switchWorld('Dream')">💭 Phase 2: Dream World</button>
          <button class="btn-neon-pink" onclick="window.activeDreamverse.switchWorld('Hidden')">👁️ Phase 3: Hidden World</button>
        </div>

        <div style="display:flex; gap:20px; align-items:flex-start;">
          <canvas id="dreamverse-canvas" width="960" height="400" style="border: 2px solid var(--accent-purple); background: #060515; border-radius: 10px; cursor:pointer;"></canvas>

          <div style="width:280px; background: rgba(0,0,0,0.6); padding: 15px; border-radius: 8px; font-family: var(--font-code); font-size: 0.85rem;" id="dream-ml-log">
            <div style="color: var(--accent-yellow); font-family: var(--font-title); margin-bottom: 8px;">📷 ML PROXIMITY DETECTION</div>
            <div>[ML Detection] Active Phase: ${this.currentWorld}...</div>
          </div>
        </div>
      </div>
    `;

    window.activeDreamverse = this;
    this.setupListeners();
  }

  setupListeners() {
    window.onkeydown = (e) => {
      if (!this.isRunning || this.isPaused) return;

      if (window.GAMETHON.launchedFromMaze) {
        this.reset30sMazeInactivityTimer();
      }

      const speed = 16;
      let nextX = this.player.x, nextY = this.player.y;

      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') nextX = Math.min(920, this.player.x + speed);
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') nextX = Math.max(20, this.player.x - speed);
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') nextY = Math.min(360, this.player.y + speed);
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') nextY = Math.max(20, this.player.y - speed);

      this.player.x = nextX;
      this.player.y = nextY;

      // Heart Obstacle Auth Key (F key when near heart)
      if (e.key === 'f' || e.key === 'F') {
        if (Math.hypot(this.player.x - this.heartObstacle.x, this.player.y - this.heartObstacle.y) < 60) {
          window.GAMETHON.authenticateHeartObstacle();
        }
      }

      // 3-Phase Destiny Progression (Item 4)
      if (Math.hypot(this.player.x - this.destinyFlag.x, this.player.y - this.destinyFlag.y) < 35) {
        if (this.currentWorld === 'Real') {
          this.logConsole("🎉 PHASE 1 REAL WORLD COMPLETED! Advancing to Phase 2: Dream World!");
          if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.speak("Phase 1 Real World completed! Advancing to Phase 2: Dream World!");
          this.player.x = 120; this.player.y = 180; this.player.hp = 100;
          this.switchWorld('Dream');
        } else if (this.currentWorld === 'Dream') {
          this.logConsole("🎉 PHASE 2 DREAM WORLD COMPLETED! Advancing to Phase 3: Hidden World!");
          if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.speak("Phase 2 Dream World completed! Advancing to Final Phase 3: Hidden World!");
          this.player.x = 120; this.player.y = 180; this.player.hp = 100;
          this.switchWorld('Hidden');
        } else if (this.currentWorld === 'Hidden') {
          this.isRunning = false;
          this.logConsole("🏆 CHAMPION TROPHY AWARDED! All 3 Phases of DreamVerse Metaverse Completed!");

          if (window.GAMETHON.VoiceEngine) {
            window.GAMETHON.VoiceEngine.playVictoryFanfare();
            window.GAMETHON.VoiceEngine.speak("Destiny reached in Hidden World! Champion Trophy awarded!");
          }

          const subtitle = document.getElementById('celebration-subtitle');
          if (subtitle) subtitle.innerHTML = "🏆 CHAMPION TROPHY AWARDED! All 3 Phases Completed! 🥇";
          const overlay = document.getElementById('celebration-overlay');
          if (overlay) overlay.classList.add('active');

          if (window.GAMETHON.App) {
            window.GAMETHON.App.awardSubgameRewards('dreamverse', 'WIN');
          }

          // Return to AI Maze if launched from maze (Item 4)
          if (window.GAMETHON.launchedFromMaze) {
            setTimeout(() => {
              window.GAMETHON.App.launchEngineWithLoader('puzzleverse');
            }, 2500);
          }
        }
      }
    };
  }

  loop() {
    if (!this.isRunning) return;

    if (!this.isPaused) {
      const now = Date.now();
      const activeObs = this.worldObstacles[this.currentWorld];

      activeObs.forEach(o => {
        o.x += o.vx;
        o.y += o.vy;

        if (o.x > 900 || o.x < 50) o.vx *= -1;
        if (o.y > 350 || o.y < 40) o.vy *= -1;

        const dist = Math.hypot(this.player.x - o.x, this.player.y - o.y);
        if (dist < 45) {
          if (now - this.lastDamageTime > 1000) {
            this.lastDamageTime = now;
            this.player.hp = Math.max(0, this.player.hp - 10);
            this.logConsole(`⚠️ OBSTACLE PROXIMITY HIT! -10 HP (HP: ${this.player.hp}/100)`);

            this.showAlertMessage(`⚠️ WARNING! ${o.type.toUpperCase()} NEARBY! -10 HP DAMAGE!`);

            if (now - this.lastVoiceAlertTime > 2500) {
              this.lastVoiceAlertTime = now;
              if (window.GAMETHON.VoiceEngine) {
                window.GAMETHON.VoiceEngine.speak("Warning! Dangerous obstacle nearby!");
              }
            }
          }
        }
      });

      // Defeat Rule: If user loses in ANY world, restart from Phase 1 Real World (Item 4)
      if (this.player.hp <= 0) {
        this.isRunning = false;
        this.logConsole(`💀 HERO DEFEATED IN ${this.currentWorld.toUpperCase()} WORLD!`);

        if (window.GAMETHON.VoiceEngine) {
          window.GAMETHON.VoiceEngine.speak("Hero defeated!");
        }

        if (window.GAMETHON.App) {
          window.GAMETHON.App.awardSubgameRewards('dreamverse', 'LOSS');
        }

        // Return to AI Maze if launched from maze (Item 4)
        if (window.GAMETHON.launchedFromMaze) {
          setTimeout(() => {
            window.GAMETHON.App.launchEngineWithLoader('puzzleverse');
          }, 1500);
        } else {
          setTimeout(() => {
            this.restartGame();
          }, 1500);
        }
      }
    }

    const canvas = document.getElementById('dreamverse-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(157, 0, 255, 0.15)';
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }

      ctx.font = '36px sans-serif';
      ctx.fillText('🏁', this.destinyFlag.x, this.destinyFlag.y);

      // Render Center Heart Emoji Obstacle (Item 2)
      ctx.strokeStyle = '#ff0077'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(this.heartObstacle.x + 16, this.heartObstacle.y - 12, 28, 0, Math.PI * 2); ctx.stroke();
      ctx.fillText(this.heartObstacle.icon, this.heartObstacle.x, this.heartObstacle.y);
      if (Math.hypot(this.player.x - this.heartObstacle.x, this.player.y - this.heartObstacle.y) < 60) {
        ctx.font = 'bold 12px Orbitron'; ctx.fillStyle = '#ff0077';
        ctx.fillText("PRESS 'F' FOR PIN AUTH 🔐", this.heartObstacle.x - 65, this.heartObstacle.y - 45);
      }

      const activeObs = this.worldObstacles[this.currentWorld];
      activeObs.forEach(o => {
        ctx.fillText(o.type.split(' ')[0], o.x, o.y);
      });

      ctx.fillText(this.player.avatar, this.player.x, this.player.y);

      ctx.fillStyle = '#fff'; ctx.font = '14px Orbitron';
      ctx.fillText(`Dimension: ${this.currentWorld} | Hero HP: ${this.player.hp}/100 | Proximity Rate: -10 HP/s`, 20, 30);

      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(20, 40, 200, 10);
      ctx.fillStyle = this.player.hp > 40 ? '#00ff88' : '#ff0055';
      ctx.fillRect(20, 40, (this.player.hp / 100) * 200, 10);
    }

    requestAnimationFrame(() => this.loop());
  }
}

window.GAMETHON.SubGames.DreamVerseMetaverse = DreamVerseMetaverse;
