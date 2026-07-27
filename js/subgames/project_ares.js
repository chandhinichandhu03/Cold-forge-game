/* =========================================================
   GAMETHON — Sub-Game 4: Project ARES
   Instant Live Canvas Rendering, 50-Player Battle Royale (Free-For-All Bots),
   Clash Squad 4v4 (Red vs Blue), 1v1 TDM, Shrinking Safe Zone & Spacebar Firing
   ========================================================= */

window.GAMETHON = window.GAMETHON || {};
window.GAMETHON.SubGames = window.GAMETHON.SubGames || {};

class ProjectARES {
  constructor(canvasElement, consoleElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.console = consoleElement;
    this.isRunning = false;
    this.isPaused = false;

    this.mode = 'Battle Royale';
    this.playerHp = 100;
    this.kills = 0;
    this.ammo = 30;
    this.maxAmmo = 30;
    this.isReloading = false;

    this.player = {
      x: 120,
      y: 240,
      radius: 16,
      avatar: '🧑‍✈️',
      team: 'Team A',
      recoilOffset: 0
    };

    this.safeZoneRadius = 240;
    if (window.GAMETHON.launchedFromMaze) {
      this.reset30sMazeInactivityTimer();
    }
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

  movePlayer(dx, dy) {
    if (!this.isRunning || this.isPaused || this.playerHp <= 0) return;
    this.player.x = Math.max(30, Math.min(this.canvas.width - 30, this.player.x + dx));
    this.player.y = Math.max(30, Math.min(this.canvas.height - 30, this.player.y + dy));

    if (window.GAMETHON.launchedFromMaze) {
      this.reset30sMazeInactivityTimer();
    }
  }

  setupListeners() {
    if (this.canvas) {
      this.canvas.onclick = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;



        if (this.isRunning && !this.isPaused && this.playerHp > 0) {
          this.shoot();
        }
      };
    }

    this.moveHandler = (e) => {
      if (!this.isRunning || this.isPaused || this.playerHp <= 0) return;
      const speed = 16;
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') this.movePlayer(0, -speed);
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') this.movePlayer(0, speed);
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') this.movePlayer(-speed, 0);
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') this.movePlayer(speed, 0);
      if (e.key === 'r' || e.key === 'R') this.reloadAmmo();
      if (e.key === 'f' || e.key === 'F') {
        if (Math.hypot(this.player.x - 480, this.player.y - 230) < 60) {
          window.GAMETHON.authenticateHeartObstacle();
        }
      }

      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        this.shoot();
      }
    };

    window.addEventListener('keydown', this.moveHandler);
  }

  setMode(modeName) {
    this.mode = modeName;
    this.initModePlayers();
    this.logConsole(`🎯 Mode Switched to: [${modeName.toUpperCase()}]`);
    this.renderOnscreenActionButtons();
    if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.speak(`Switched to Project ARES ${modeName}`);
  }

  initModePlayers() {
    this.bots = [];
    this.bullets = [];
    this.kills = 0;
    this.ammo = 30;
    this.safeZoneRadius = 240;
    this.lastZoneShrinkTime = Date.now();
    this.isSpectating = false;

    const faces = ['🪖', '🥷', '🤖', '👺', '💂', '🕵️'];

    if (this.mode === 'Battle Royale') {
      // 50 Players Total: 200 HP for ALL Combatants (User + 49 Bots) (Item 2)
      this.playerHp = 200;
      this.playerMaxHp = 200;
      this.player.team = 'Hero';
      this.player.x = 120; this.player.y = 240;

      for (let i = 0; i < 49; i++) {
        this.bots.push({
          id: i,
          x: Math.random() * (this.canvas.width - 200) + 160,
          y: Math.random() * (this.canvas.height - 100) + 50,
          alive: true,
          hp: 200, maxHp: 200,
          team: `Bot_${i}`,
          avatar: faces[i % faces.length],
          lastShot: 0
        });
      }
    } else if (this.mode === 'Clash Squad') {
      // Clash Squad 4v4: 200 HP for ALL players (User + all 7 Bots)
      this.playerHp = 200;
      this.playerMaxHp = 200;
      this.player.team = 'Team A';
      this.player.x = 100; this.player.y = 240;

      for (let i = 1; i <= 3; i++) {
        this.bots.push({
          id: i, x: 100, y: 100 + i * 80, alive: true, hp: 200, maxHp: 200,
          team: 'Team A', dotColor: '#ff0055', avatar: '💂', lastShot: 0
        });
      }

      for (let i = 0; i < 4; i++) {
        this.bots.push({
          id: 10 + i, x: 820, y: 100 + i * 80, alive: true, hp: 200, maxHp: 200,
          team: 'Team B', dotColor: '#00f0ff', avatar: '🥷', lastShot: 0
        });
      }
    } else {
      // Team Deathmatch 1v1 vs Pro AI Robo: 200 HP for User and Robo Bot
      this.playerHp = 200;
      this.playerMaxHp = 200;
      this.player.team = 'Hero';
      this.player.x = 140; this.player.y = 240;

      this.bots.push({
        id: 99, x: 800, y: 240, alive: true, hp: 200, maxHp: 200,
        team: 'Pro AI Enemy', dotColor: '#ff0055', avatar: '🤖', lastShot: 0
      });
    }
  }

  renderOnscreenActionButtons() {
    let container = document.getElementById('ares-controls-area');
    if (!container) {
      container = document.createElement('div');
      container.id = 'ares-controls-area';
      container.style.cssText = "display:flex; flex-direction:column; gap:10px; margin-top:12px; align-items:center; width:100%;";
      this.canvas.parentNode.appendChild(container);
    }

    container.innerHTML = `
      <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center; margin-bottom:8px;">
        <button class="btn-neon" onclick="window.activeARES.setMode('Battle Royale')">🪖 50-Player Battle Royale</button>
        <button class="btn-neon-purple" onclick="window.activeARES.setMode('Clash Squad')">🔵🔴 Clash Squad (200 HP, 4v4)</button>
        <button class="btn-neon-pink" onclick="window.activeARES.setMode('Team Deathmatch')">🥊 1v1 TDM vs Robo (200 HP)</button>
      </div>

      <div style="display:flex; flex-direction:column; gap:6px; align-items:center;">
        <button class="dpad-btn" onclick="window.activeARES.movePlayer(0, -20)">⬆️ MOVE UP [W / UP]</button>
        <div style="display:flex; gap:10px; align-items:center;">
          <button class="dpad-btn" onclick="window.activeARES.movePlayer(-20, 0)">⬅️ LEFT [A]</button>
          <button class="dpad-btn" onclick="window.activeARES.shoot()" style="background:rgba(255,0,85,0.8); border:2px solid #ff0055; font-weight:bold; padding:10px 20px; font-size:1.05rem; box-shadow:0 0 15px rgba(255,0,85,0.5);">🔫 SHOOT RIFLE [SPACEBAR]</button>
          <button class="dpad-btn" onclick="window.activeARES.movePlayer(20, 0)">➡️ RIGHT [D]</button>
        </div>
        <div style="display:flex; gap:10px; align-items:center;">
          <button class="dpad-btn" onclick="window.activeARES.movePlayer(0, 20)">⬇️ MOVE DOWN [S / DOWN]</button>
          <button class="dpad-btn" onclick="window.activeARES.reloadAmmo()">🔄 RELOAD [R]</button>
        </div>
      </div>
    `;
    window.activeARES = this;
  }

  start() {
    this.showARESModeMenuModal();
  }

  showARESModeMenuModal() {
    let modal = document.getElementById('ares-menu-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'ares-menu-modal';
      modal.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(4,6,18,0.95); backdrop-filter:blur(15px); z-index:100; display:flex; flex-direction:column; justify-content:center; align-items:center; color:#fff;";
      this.canvas.parentNode.appendChild(modal);
    }

    modal.style.display = 'flex';
    modal.innerHTML = `
      <div style="background:rgba(14,18,42,0.95); border:2px solid var(--accent-pink); padding:30px; border-radius:14px; max-width:550px; width:90%; text-align:center; box-shadow:0 0 30px rgba(255,0,119,0.4);">
        <h2 style="font-family:var(--font-title); color:var(--accent-pink); margin-bottom:10px;">🎯 PROJECT ARES MODE SELECTION</h2>
        <p style="color:#aaa; font-family:var(--font-code); margin-bottom:20px; font-size:0.95rem;">Select combat game mode before entering the battleground:</p>
        
        <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:25px;">
          <label style="display:block; text-align:left; color:var(--accent-yellow); font-family:var(--font-title); font-size:0.85rem;">CHOOSE COMBAT MODE:</label>
          <select id="ares-mode-select-input" style="width:100%; padding:12px; background:#0a0e20; color:#fff; border:1px solid #ff0077; border-radius:8px; font-family:var(--font-code); font-size:1rem;">
            <option value="Battle Royale" selected>🪖 Battle Royale (50 Players Free-For-All, Kill Rewards)</option>
            <option value="Clash Squad">🔵🔴 Clash Squad (200 HP 4v4, Teammate AI Attack & Spectate on Death)</option>
            <option value="Team Deathmatch">🥊 Team Deathmatch (200 HP vs Active Aggressive Robo AI)</option>
          </select>
        </div>

        <button class="btn-neon" style="width:100%; font-size:1.1rem; padding:14px;" onclick="window.activeARES.confirmAndStartGame()">🚀 START GAME</button>
      </div>
    `;
    window.activeARES = this;
  }

  confirmAndStartGame() {
    const sel = document.getElementById('ares-mode-select-input');
    const modal = document.getElementById('ares-menu-modal');

    this.mode = sel ? sel.value : 'Battle Royale';
    if (modal) modal.style.display = 'none';

    this.initModePlayers();
    this.isRunning = true;
    this.isPaused = false;
    const overlay = document.getElementById('celebration-overlay');
    if (overlay) overlay.classList.remove('active');

    this.logConsole(`🎯 PROJECT ARES STARTED! Mode: [${this.mode.toUpperCase()}], Player & Bot HP: [${this.playerMaxHp} HP].`);
    this.renderOnscreenActionButtons();

    if (window.GAMETHON.VoiceEngine) {
      window.GAMETHON.VoiceEngine.speak(`Deployed in Project ARES ${this.mode}. Engage hostiles!`);
    }

    this.loop();
  }

  stop() {
    this.isRunning = false;
    window.removeEventListener('keydown', this.moveHandler);
    const container = document.getElementById('ares-controls-area');
    if (container) container.remove();
    const modal = document.getElementById('ares-menu-modal');
    if (modal) modal.remove();
  }

  logConsole(msg) {
    if (this.console) {
      const p = document.createElement('div');
      p.textContent = `[ARES] > ${msg}`;
      this.console.appendChild(p);
      this.console.scrollTop = this.console.scrollHeight;
    }
  }

  restartGame() {
    this.initModePlayers();
    this.isRunning = true;
    this.isPaused = false;
    const overlay = document.getElementById('celebration-overlay');
    if (overlay) overlay.classList.remove('active');
    this.logConsole("🔄 BATTLEGROUND RESTARTED!");
    this.loop();
  }

  shoot() {
    if (this.isPaused || this.isReloading || this.playerHp <= 0) return;
    if (this.ammo <= 0) {
      this.logConsole("⚠️ Ammo empty! Press [R] to reload!");
      return;
    }

    this.ammo--;
    this.player.recoilOffset = 10;

    if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.playGunshot();

    let target = null;
    let minDist = 999;

    this.bots.forEach(b => {
      if (b.alive && b.team !== this.player.team) {
        const dist = Math.hypot(this.player.x - b.x, this.player.y - b.y);
        if (dist < minDist) {
          minDist = dist;
          target = b;
        }
      }
    });

    if (target) {
      this.bullets.push({
        x: this.player.x, y: this.player.y,
        targetX: target.x, targetY: target.y,
        speed: 25, fromHero: true, targetBot: target
      });
    }
  }

  reloadAmmo() {
    if (this.isPaused) return;
    this.isReloading = true;
    this.logConsole("🔄 Reloading weapon...");
    setTimeout(() => {
      this.ammo = this.maxAmmo;
      this.isReloading = false;
      this.logConsole("🔄 Reload Complete!");
    }, 1000);
  }

  loop() {
    if (!this.isRunning) return;

    if (!this.isPaused) {
      if (this.player.recoilOffset > 0) this.player.recoilOffset -= 1;

      const now = Date.now();
      if (this.mode === 'Battle Royale' && now - this.lastZoneShrinkTime > 5000) {
        this.lastZoneShrinkTime = now;
        this.safeZoneRadius = Math.max(80, this.safeZoneRadius - 8);
      }

      this.bullets.forEach((b, index) => {
        const dx = b.targetX - b.x;
        const dy = b.targetY - b.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 20) {
          if (b.fromHero && b.targetBot && b.targetBot.alive) {
            b.targetBot.hp -= 50;
            if (b.targetBot.hp <= 0) {
              b.targetBot.alive = false;
              this.kills++;
              this.logConsole(`💥 ELIMINATED Enemy ${b.targetBot.avatar}! Total Kills: ${this.kills}`);
            }
          } else if (!b.fromHero) {
            if (b.targetTeamA) {
              b.targetTeamA.hp -= 25;
              if (b.targetTeamA.hp <= 0) b.targetTeamA.alive = false;
            } else if (this.playerHp > 0) {
              this.playerHp = Math.max(0, this.playerHp - 25);
              this.logConsole(`💥 TAKEN DAMAGE! Hero HP: ${this.playerHp}/${this.playerMaxHp}`);
              if (this.playerHp <= 0 && this.mode === 'Clash Squad') {
                this.isSpectating = true;
                this.logConsole("💀 HERO DIED! Entering Spectator Mode — Teammates are still fighting!");
                if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.speak("Hero down! Spectating alive teammates.");
              }
            }
          }
          this.bullets.splice(index, 1);
        } else {
          b.x += (dx / dist) * b.speed;
          b.y += (dy / dist) * b.speed;
        }
      });

      // AI Bots Movement & Shooting Logic (TDM Robo AI & Clash Squad Teammates AI) (Request 5)
      this.bots.forEach(b => {
        if (b.alive) {
          // Team Deathmatch Active Robo AI (Request 5)
          if (this.mode === 'Team Deathmatch') {
            const dx = (this.playerHp > 0 ? this.player.x : 480) - b.x;
            const dy = (this.playerHp > 0 ? this.player.y : 240) - b.y;
            const dist = Math.hypot(dx, dy);

            // Active aggressive tracking and strafing
            if (dist > 180) { b.x += (dx / dist) * 2.8; b.y += (dy / dist) * 2.8; }
            else { b.x += (Math.random() - 0.5) * 4.0; b.y += (Math.random() - 0.5) * 4.0; }

            if (now - b.lastShot > 1200 && this.playerHp > 0) {
              b.lastShot = now;
              if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.playGunshot();
              this.bullets.push({ x: b.x, y: b.y, targetX: this.player.x, targetY: this.player.y, speed: 20, fromHero: false });
            }
          }
          // Clash Squad Active Teammates AI (Team A) & Enemies AI (Team B) (Item 2)
          else if (this.mode === 'Clash Squad') {
            if (b.team === 'Team A') {
              // Teammate AI: Actively target and attack Team B enemies!
              const enemy = this.bots.find(e => e.team === 'Team B' && e.alive);
              if (enemy) {
                const dx = enemy.x - b.x;
                const dy = enemy.y - b.y;
                const dist = Math.hypot(dx, dy);

                if (dist > 150) { b.x += (dx / dist) * 2.2; b.y += (dy / dist) * 2.2; }
                else { b.x += (Math.random() - 0.5) * 3; b.y += (Math.random() - 0.5) * 3; }

                if (now - b.lastShot > 1500) {
                  b.lastShot = now;
                  if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.playGunshot();
                  this.bullets.push({ x: b.x, y: b.y, targetX: enemy.x, targetY: enemy.y, speed: 20, fromHero: true, targetBot: enemy });
                }
              }
            } else if (b.team === 'Team B') {
              // Enemy AI: Pick ANY random alive member of Team A (User OR Teammates) (Item 2)
              const teamAMembers = [];
              if (this.playerHp > 0) teamAMembers.push({ x: this.player.x, y: this.player.y, isUser: true });
              this.bots.filter(t => t.team === 'Team A' && t.alive).forEach(t => teamAMembers.push({ x: t.x, y: t.y, isUser: false, teammateObj: t }));

              if (teamAMembers.length > 0) {
                // Random target selection among Team A
                const target = teamAMembers[Math.floor(Math.random() * teamAMembers.length)];
                const dx = target.x - b.x;
                const dy = target.y - b.y;
                const dist = Math.hypot(dx, dy);

                if (dist > 160) { b.x += (dx / dist) * 2.2; b.y += (dy / dist) * 2.2; }
                else { b.x += (Math.random() - 0.5) * 3; b.y += (Math.random() - 0.5) * 3; }

                if (now - b.lastShot > 1600) {
                  b.lastShot = now;
                  if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.playGunshot();
                  this.bullets.push({ x: b.x, y: b.y, targetX: target.x, targetY: target.y, speed: 18, fromHero: false, targetTeamA: target.isUser ? null : target.teammateObj });
                }
              }
            }
          }
          // Battle Royale Free-for-all AI: All players attack ANY nearby living combatant! (Item 2)
          else {
            b.x += (Math.random() - 0.5) * 2.2;
            b.y += (Math.random() - 0.5) * 2.2;

            if (now - b.lastShot > 2200) {
              b.lastShot = now;

              // Build list of all potential targets in range (User + other living bots)
              const targets = [];
              if (this.playerHp > 0 && Math.hypot(this.player.x - b.x, this.player.y - b.y) < 320) {
                targets.push({ x: this.player.x, y: this.player.y, isUser: true });
              }

              this.bots.filter(o => o.id !== b.id && o.alive).forEach(o => {
                if (Math.hypot(o.x - b.x, o.y - b.y) < 320) {
                  targets.push({ x: o.x, y: o.y, isUser: false, botObj: o });
                }
              });

              if (targets.length > 0) {
                // Shoot a randomly chosen nearby target (Item 2)
                const chosenTarget = targets[Math.floor(Math.random() * targets.length)];
                if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.playGunshot();

                if (chosenTarget.isUser) {
                  this.bullets.push({ x: b.x, y: b.y, targetX: chosenTarget.x, targetY: chosenTarget.y, speed: 18, fromHero: false });
                } else if (chosenTarget.botObj) {
                  chosenTarget.botObj.hp -= 50;
                  if (chosenTarget.botObj.hp <= 0) {
                    chosenTarget.botObj.alive = false;
                    this.logConsole(`💥 BATTLE ROYALE FREE-FOR-ALL: ${b.avatar} Bot #${b.id} ELIMINATED ${chosenTarget.botObj.avatar} Bot #${chosenTarget.botObj.id}!`);
                  }
                }
              }
            }
          }
        }
      });

      this.checkMatchStatus();
    }

    this.draw();
    requestAnimationFrame(() => this.loop());
  }

  checkMatchStatus() {
    const subtitle = document.getElementById('celebration-subtitle');

    if (this.mode === 'Battle Royale') {
      if (this.playerHp <= 0) {
        this.isRunning = false;
        this.logConsole("💀 HERO ELIMINATED IN BATTLE ROYALE!");
        if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.speak("Hero is defeated in Battle Royale!");
        if (window.GAMETHON.App) window.GAMETHON.App.awardSubgameRewards('project_ares', 'LOSS', { kills: this.kills });
        return;
      }

      const remainingEnemies = this.bots.filter(b => b.alive).length;
      if (remainingEnemies === 0) {
        this.isRunning = false;
        this.logConsole(`🏆 BATTLE ROYALE VICTORY! Winner winner chicken dinner! Kills: ${this.kills}`);
        if (window.GAMETHON.VoiceEngine) {
          window.GAMETHON.VoiceEngine.playVictoryFanfare();
          window.GAMETHON.VoiceEngine.speak("Winner winner chicken dinner! Battle Royale Champion!");
        }
        if (subtitle) subtitle.textContent = `Winner Winner Chicken Dinner! 50-Player Champion (${this.kills} Kills)!`;
        const overlay = document.getElementById('celebration-overlay');
        if (overlay) overlay.classList.add('active');

        if (window.GAMETHON.App) window.GAMETHON.App.awardSubgameRewards('project_ares', 'WIN', { kills: this.kills });
      }
    } else if (this.mode === 'Clash Squad') {
      // Clash Squad: Game ends ONLY if all Team A (User + 3 Teammates) OR all Team B are dead (Request 5)
      const teamAAliveCount = (this.playerHp > 0 ? 1 : 0) + this.bots.filter(b => b.team === 'Team A' && b.alive).length;
      const teamBAliveCount = this.bots.filter(b => b.team === 'Team B' && b.alive).length;

      if (teamAAliveCount === 0) {
        this.isRunning = false;
        this.logConsole("💀 CLASH SQUAD DEFEAT! All Team A members eliminated!");
        if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.speak("Clash Squad Defeat! All Team A teammates down.");
        if (window.GAMETHON.App) window.GAMETHON.App.awardSubgameRewards('project_ares', 'LOSS', { kills: this.kills });
      } else if (teamBAliveCount === 0) {
        this.isRunning = false;
        this.logConsole(`🏆 CLASH SQUAD VICTORY! Team A (Red) Defeated Team B!`);
        if (window.GAMETHON.VoiceEngine) {
          window.GAMETHON.VoiceEngine.playVictoryFanfare();
          window.GAMETHON.VoiceEngine.speak("Clash Squad Victory! Team A defeated all enemies!");
        }
        if (subtitle) subtitle.textContent = "Team A (Red) Victory Champion!";
        const overlay = document.getElementById('celebration-overlay');
        if (overlay) overlay.classList.add('active');

        if (window.GAMETHON.App) window.GAMETHON.App.awardSubgameRewards('project_ares', 'WIN', { kills: this.kills });
      }
    } else if (this.mode === 'Team Deathmatch') {
      if (this.playerHp <= 0) {
        this.isRunning = false;
        this.logConsole("💀 TEAM DEATHMATCH DEFEAT! Robo AI won!");
        if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.speak("Defeated by active Robo AI in TDM!");
        if (window.GAMETHON.App) window.GAMETHON.App.awardSubgameRewards('project_ares', 'LOSS', { kills: this.kills });
        return;
      }

      const enemyAlive = this.bots.some(b => b.alive);
      if (!enemyAlive) {
        this.isRunning = false;
        this.logConsole("🏆 TEAM DEATHMATCH VICTORY! Active Robo AI Defeated!");
        if (window.GAMETHON.VoiceEngine) {
          window.GAMETHON.VoiceEngine.playVictoryFanfare();
          window.GAMETHON.VoiceEngine.speak("Team Deathmatch Victory! Active Robo AI Defeated!");
        }
        if (subtitle) subtitle.textContent = "Active Robo AI Defeated Victory!";
        const overlay = document.getElementById('celebration-overlay');
        if (overlay) overlay.classList.add('active');

        if (window.GAMETHON.App) window.GAMETHON.App.awardSubgameRewards('project_ares', 'WIN', { kills: this.kills });
      }
    }
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = '#070b19';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.mode === 'Battle Royale') {
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.safeZoneRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Center Heart Obstacle (Item 2)
    ctx.strokeStyle = '#ff0077'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(480, 230, 28, 0, Math.PI * 2); ctx.stroke();
    ctx.font = '32px sans-serif';
    ctx.fillText('💖', 464, 242);
    if (Math.hypot(this.player.x - 480, this.player.y - 230) < 60) {
      ctx.font = 'bold 12px Orbitron'; ctx.fillStyle = '#ff0077';
      ctx.fillText("PRESS 'F' FOR PIN AUTH 🔐", 385, 195);
    }

    ctx.fillStyle = '#ffea00';
    this.bullets.forEach(b => {
      ctx.beginPath(); ctx.arc(b.x, b.y, 4, 0, Math.PI * 2); ctx.fill();
    });

    this.bots.forEach(b => {
      if (b.alive) {
        ctx.font = '28px sans-serif';
        ctx.fillText(b.avatar, b.x - 12, b.y + 10);

        // HP Bar above bots
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(b.x - 15, b.y - 20, 30, 4);
        ctx.fillStyle = b.team === 'Team A' ? '#ff0055' : '#00f0ff';
        ctx.fillRect(b.x - 15, b.y - 20, (b.hp / (b.maxHp || 100)) * 30, 4);

        if (b.team === 'Team A') {
          ctx.fillStyle = '#ff0055';
          ctx.beginPath(); ctx.arc(b.x + 8, b.y + 8, 6, 0, Math.PI * 2); ctx.fill();
        } else if (b.team === 'Team B') {
          ctx.fillStyle = '#00f0ff';
          ctx.beginPath(); ctx.arc(b.x + 8, b.y + 8, 6, 0, Math.PI * 2); ctx.fill();
        }
      }
    });

    // Draw Player 🧑‍✈️
    if (this.playerHp > 0) {
      ctx.font = '36px sans-serif';
      ctx.fillText('🧑‍✈️🔫', this.player.x - 20 - this.player.recoilOffset, this.player.y + 12);
      if (this.mode === 'Clash Squad') {
        ctx.fillStyle = '#ff0055';
        ctx.beginPath(); ctx.arc(this.player.x + 12, this.player.y + 12, 7, 0, Math.PI * 2); ctx.fill();
      }
    } else if (this.isSpectating) {
      ctx.fillStyle = '#ff0055';
      ctx.font = 'bold 20px Orbitron';
      ctx.fillText('💀 YOU DIED — SPECTATING TEAMMATES 👁️', 260, 60);
    }

    ctx.fillStyle = '#fff';
    ctx.font = '14px Orbitron';
    const remaining = this.bots.filter(b => b.alive).length;
    ctx.fillText(`Mode: ${this.mode} | Hero HP: ${Math.max(0, this.playerHp)}/${this.playerMaxHp} | Kills: ${this.kills} | Combatants: ${remaining + (this.playerHp > 0 ? 1 : 0)} | Ammo: ${this.ammo}/30 [Space to Shoot]`, 25, 30);
  }
}

window.GAMETHON.SubGames.ProjectARES = ProjectARES;

