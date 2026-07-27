/* =========================================================
   GAMETHON — Sub-Game 6: Janani's Cursed House
   1-Step Proximity Devil Attacks, Manageable Chase Speed,
   Clean Reset from Beginning, Flush Auto-Proximity Doors
   ========================================================= */

window.GAMETHON = window.GAMETHON || {};
window.GAMETHON.SubGames = window.GAMETHON.SubGames || {};

class JananisCursedMansion {
  constructor(canvasElement, consoleElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.console = consoleElement;
    this.isRunning = false;
    this.isPaused = false;

    this.player = {
      x: 80,
      y: 80,
      radius: 16,
      hp: 100,
      maxHp: 100,
      avatar: '🧍',
      hasGun: false,
      hasSword: false,
      hasKey: false,
      ammo: 0
    };

    // Screen Border Walls 🧱
    this.borderWalls = { left: 20, right: 940, top: 20, bottom: 480 };

    // 3 Flush Interior Room Walls with Auto-Proximity Sliding Doors 🚪
    this.doors = [
      { id: 1, wallX: 250, doorY: 200, doorH: 80, isOpen: false, prevOpen: false },
      { id: 2, wallX: 500, doorY: 100, doorH: 80, isOpen: false, prevOpen: false },
      { id: 3, wallX: 750, doorY: 300, doorH: 80, isOpen: false, prevOpen: false }
    ];

    // Devils: Granny 👵, Grandpa 👴, Queen Janani 👑
    this.hunters = [
      { name: "Granny", avatar: '👵', x: 380, y: 150, speed: 1.4, state: 'walk', isInvisible: false, lastTeleport: 0 },
      { name: "Grandpa", avatar: '👴', x: 620, y: 350, speed: 1.6, state: 'walk', isInvisible: false, lastTeleport: 0 },
      { name: "Queen Janani", avatar: '👑', x: 820, y: 180, speed: 2.2, state: 'run', isInvisible: false, lastTeleport: 0 }
    ];

    // Boxes & Drawers
    this.boxes = [
      { x: 140, y: 140, searched: false, item: '🔫 Gun' },
      { x: 380, y: 100, searched: false, item: '🗡️ Sword' },
      { x: 620, y: 380, searched: false, item: '🔑 Gate Key' },
      { x: 820, y: 100, searched: false, item: '💊 Medikit' }
    ];

    // Home Furniture Obstacles (Chairs, Cots, Tables, Sofas, Wardrobes, TVs) (Requests 2 & 3)
    this.furnitureObstacles = [
      { id: 101, x: 180, y: 350, name: '🪑 Wooden Chair', item: '🍖 Food (+15 HP)', searched: false },
      { id: 102, x: 440, y: 340, name: '🛏️ Bedroom Cot', item: '🔑 Gate Key', searched: false },
      { id: 103, x: 340, y: 220, name: '🪵 Dining Table', item: '💊 Medikit (+25 HP)', searched: false },
      { id: 104, x: 640, y: 160, name: '🛋️ Living Sofa', item: '🔫 Extra Ammo', searched: false },
      { id: 105, x: 740, y: 110, name: '🗄️ Wardrobe', item: '🗡️ Silver Sword', searched: false },
      { id: 106, x: 840, y: 380, name: '📺 Vintage TV', item: '💊 Medikit (+25 HP)', searched: false }
    ];

    // Removable Obstacles
    this.obstacles = [
      { id: 1, x: 180, y: 280, type: '📦 Wooden Crate', item: '🍖 Food (+15 HP)', cleared: false },
      { id: 2, x: 420, y: 220, type: '🪨 Rubble Pile', item: '💊 Medikit (+25 HP)', cleared: false },
      { id: 3, x: 680, y: 120, type: '🕸️ Spider Nest', item: '🔫 Extra Ammo', cleared: false },
      { id: 4, x: 580, y: 420, type: '📦 Sealed Trunk', item: '🗡️ Silver Sword', cleared: false }
    ];

    // Center Heart Emoji Obstacle (Item 2)
    this.heartObstacle = { x: 480, y: 240, icon: '💖' };

    // Final Victory Gate Door
    this.exitDoor = { x: 900, y: 220, w: 30, h: 70 };

    this.setupListeners();

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

  setupListeners() {
    this.moveHandler = (e) => {
      if (!this.isRunning || this.isPaused) return;

      if (window.GAMETHON.launchedFromMaze) {
        this.reset30sMazeInactivityTimer();
      }

      const speed = 14;
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') this.movePlayer(0, -speed);
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') this.movePlayer(0, speed);
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') this.movePlayer(-speed, 0);
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') this.movePlayer(speed, 0);
      if (e.key === 'f' || e.key === 'F') {
        if (Math.hypot(this.player.x - this.heartObstacle.x, this.player.y - this.heartObstacle.y) < 60) {
          window.GAMETHON.authenticateHeartObstacle();
        } else {
          this.interactWithObject();
        }
      }
      if (e.key === ' ' || e.key === 'Spacebar') this.attackDevil();
    };

    window.addEventListener('keydown', this.moveHandler);
  }

  movePlayer(dx, dy) {
    const nextX = Math.max(this.borderWalls.left + 15, Math.min(this.borderWalls.right - 15, this.player.x + dx));
    const nextY = Math.max(this.borderWalls.top + 15, Math.min(this.borderWalls.bottom - 15, this.player.y + dy));

    let wallBlocked = false;
    this.doors.forEach(d => {
      if (nextX > d.wallX - 10 && nextX < d.wallX + 10) {
        if (nextY < d.doorY || nextY > d.doorY + d.doorH || !d.isOpen) {
          wallBlocked = true;
        }
      }
    });

    if (!wallBlocked) {
      this.player.x = nextX;
      this.player.y = nextY;
    }
  }

  start() {
    this.restartFromBeginning();
  }

  restartFromBeginning() {
    this.isRunning = true;
    this.isPaused = false;
    this.player.hp = 100;
    this.player.x = 80;
    this.player.y = 80;
    this.player.hasGun = false;
    this.player.hasSword = false;
    this.player.hasKey = false;
    this.player.ammo = 0;

    this.boxes.forEach(b => b.searched = false);
    this.obstacles.forEach(o => o.cleared = false);
    this.furnitureObstacles.forEach(f => f.searched = false);
    this.doors.forEach(d => d.isOpen = false);

    this.hunters[0].x = 380; this.hunters[0].y = 150;
    this.hunters[1].x = 620; this.hunters[1].y = 350;
    this.hunters[2].x = 820; this.hunters[2].y = 180;

    const overlay = document.getElementById('celebration-overlay');
    if (overlay) overlay.classList.remove('active');

    this.logConsole("👵 RESTARTED CURSED HOUSE! Search furniture & boxes for 🔑 Gate Key to unlock Final Door!");
    if (window.GAMETHON.VoiceEngine) {
      window.GAMETHON.VoiceEngine.speak("Cursed House restarted. Find the Gate Key to unlock the final door!");
    }

    this.loop();
  }

  restartGame() {
    this.restartFromBeginning();
  }

  stop() {
    this.isRunning = false;
    window.removeEventListener('keydown', this.moveHandler);
  }

  logConsole(msg) {
    if (this.console) {
      const p = document.createElement('div');
      p.textContent = `[MANSION] > ${msg}`;
      this.console.appendChild(p);
      this.console.scrollTop = this.console.scrollHeight;
    }
  }

  interactWithObject() {
    if (this.isPaused) return;

    // Search Boxes
    this.boxes.forEach(b => {
      if (!b.searched && Math.hypot(this.player.x - b.x, this.player.y - b.y) < 40) {
        b.searched = true;
        this.logConsole(`📦 SEARCHED BOX: Found [${b.item}]!`);
        if (b.item.includes('Gun')) { this.player.hasGun = true; this.player.ammo += 10; }
        if (b.item.includes('Sword')) { this.player.hasSword = true; }
        if (b.item.includes('Key')) { this.player.hasKey = true; this.logConsole("🔑 GATE KEY ACQUIRED! Final Door can now be opened!"); }
        if (b.item.includes('Medikit')) { this.player.hp = Math.min(100, this.player.hp + 25); }

        if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.playItemPickupSound();
      }
    });

    // Search Home Furniture Obstacles (Request 2 & 3)
    this.furnitureObstacles.forEach(f => {
      if (!f.searched && Math.hypot(this.player.x - f.x, this.player.y - f.y) < 45) {
        f.searched = true;
        this.logConsole(`🪑 SEARCHED FURNITURE [${f.name}]: Found [${f.item}]!`);
        if (f.item.includes('Key')) {
          this.player.hasKey = true;
          this.logConsole("🔑 GATE KEY ACQUIRED! You can now unlock the Final Door!");
          if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.speak("Gate Key acquired! Go to final exit door!");
        }
        if (f.item.includes('Food')) this.player.hp = Math.min(100, this.player.hp + 15);
        if (f.item.includes('Medikit')) this.player.hp = Math.min(100, this.player.hp + 25);
        if (f.item.includes('Sword')) this.player.hasSword = true;
        if (f.item.includes('Ammo')) { this.player.hasGun = true; this.player.ammo += 10; }

        if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.playItemPickupSound();
      }
    });

    // Removable Obstacles
    this.obstacles.forEach(o => {
      if (!o.cleared && Math.hypot(this.player.x - o.x, this.player.y - o.y) < 45) {
        o.cleared = true;
        this.logConsole(`💥 CLEARED OBSTACLE [${o.type}]: Found [${o.item}]!`);
        if (o.item.includes('Food')) this.player.hp = Math.min(100, this.player.hp + 15);
        if (o.item.includes('Medikit')) this.player.hp = Math.min(100, this.player.hp + 25);
        if (o.item.includes('Sword')) this.player.hasSword = true;
        if (o.item.includes('Ammo')) { this.player.hasGun = true; this.player.ammo += 10; }

        if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.playItemPickupSound();
      }
    });
  }

  attackDevil() {
    if (this.isPaused) return;
    if (!this.player.hasGun && !this.player.hasSword) {
      this.logConsole("⚠️ No weapon equipped! Find Gun 🔫 or Sword 🗡️ in furniture/boxes!");
      return;
    }

    let attacked = false;
    this.hunters.forEach(h => {
      const dist = Math.hypot(this.player.x - h.x, this.player.y - h.y);
      if (dist < 120) {
        attacked = true;
        this.logConsole(`⚔️ HERO ATTACKED ${h.name.toUpperCase()} WITH ${this.player.hasGun ? 'GUN 🔫' : 'SWORD 🗡️'}!`);
        
        if (window.GAMETHON.VoiceEngine) {
          if (this.player.hasGun) window.GAMETHON.VoiceEngine.playGunshot();
          else window.GAMETHON.VoiceEngine.playSwordSlashSound();
          window.GAMETHON.VoiceEngine.playTeleportSound();
        }

        h.x = Math.random() * 700 + 100;
        h.y = Math.random() * 350 + 60;
        this.logConsole(`🌀 ${h.name.toUpperCase()} TELEPORTED AWAY IMMEDIATELY!`);
      }
    });

    if (!attacked) {
      this.logConsole("⚠️ No devil in range to attack!");
    }
  }

  loop() {
    if (!this.isRunning) return;
    if (!this.isPaused) {
      this.update();
    }
    this.draw();
    requestAnimationFrame(() => this.loop());
  }

  update() {
    // 1. Flush Auto Doors
    this.doors.forEach(d => {
      const distToDoor = Math.hypot(this.player.x - d.wallX, this.player.y - (d.doorY + d.doorH / 2));
      d.isOpen = distToDoor < 55;

      if (d.isOpen && !d.prevOpen) {
        this.logConsole(`🚪 DOOR FLUSH OPENED AT WALL #${d.id}!`);
        if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.playDoorOpenSound();
      }
      d.prevOpen = d.isOpen;
    });

    // 2. Devils AI Movement & 1-Step Attack Proximity
    const now = Date.now();
    this.hunters.forEach(h => {
      if (Math.random() < 0.005) h.isInvisible = !h.isInvisible;

      if (now - h.lastTeleport > 10000 && Math.random() < 0.015) {
        h.lastTeleport = now;
        h.x = this.player.x + (Math.random() - 0.5) * 160;
        h.y = this.player.y + (Math.random() - 0.5) * 160;
        if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.playTeleportSound();
      }

      const dx = this.player.x - h.x;
      const dy = this.player.y - h.y;
      const dist = Math.hypot(dx, dy);

      if (dist <= 40) {
        this.player.hp = Math.max(0, this.player.hp - 5);
        this.logConsole(`💀 STEPPED NEAR ${h.name.toUpperCase()}! Devil attacked! -5 HP (HP: ${this.player.hp}/100)`);
        
        if (window.GAMETHON.VoiceEngine) {
          window.GAMETHON.VoiceEngine.playDevilAttackSound();
          window.GAMETHON.VoiceEngine.speakDevilVoice(h.name, "You came too close!");
        }

        this.player.x += (dx / dist) * 20;
        this.player.y += (dy / dist) * 20;
      }
    });

    // Defeat
    if (this.player.hp <= 0) {
      this.isRunning = false;
      this.logConsole("☠️ YOU WERE DEFEATED! Game Over.");
      if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.speak("You were defeated in Janani's Cursed House!");
      if (window.GAMETHON.App) window.GAMETHON.App.awardSubgameRewards('cursed_mansion', 'LOSS');

      if (window.GAMETHON.launchedFromMaze) {
        setTimeout(() => {
          window.GAMETHON.App.launchEngineWithLoader('puzzleverse');
        }, 1500);
      }
    }

    // Final Escape Door Victory (ONLY IF HAS KEY) (Requests 2 & 3)
    const distExit = Math.hypot(this.player.x - this.exitDoor.x, this.player.y - (this.exitDoor.y + 35));
    if (distExit < 40) {
      if (!this.player.hasKey) {
        // Door stays LOCKED without key!
        this.player.x -= 20;
        this.logConsole("🔒 FINAL DOOR IS LOCKED! Search furniture (cot, table, chair) or boxes to find 🔑 Gate Key first!");
        if (window.GAMETHON.VoiceEngine) {
          window.GAMETHON.VoiceEngine.speak("Final door is locked! Find the Gate Key in furniture first!");
        }
      } else {
        // Key present -> WIN THE GAME!
        this.isRunning = false;
        this.logConsole("🏆 GATE KEY USED! UNLOCKED FINAL DOOR AND ESCAPED!");

        if (window.GAMETHON.VoiceEngine) {
          window.GAMETHON.VoiceEngine.playVictoryFanfare();
          window.GAMETHON.VoiceEngine.speak("Victory! Unlocked final door with Gate Key and escaped!");
        }

        const overlay = document.getElementById('celebration-overlay');
        const subtitle = document.getElementById('celebration-subtitle');
        if (subtitle) subtitle.textContent = "Unlocked Final Door with Gate Key & Escaped!";
        if (overlay) overlay.classList.add('active');

        if (window.GAMETHON.App) {
          window.GAMETHON.App.awardSubgameRewards('cursed_mansion', 'WIN');
        }
      }
    }
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = '#06060c';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Outer Screen Border Walls 🧱
    ctx.strokeStyle = '#9d00ff';
    ctx.lineWidth = 6;
    ctx.strokeRect(this.borderWalls.left, this.borderWalls.top, this.borderWalls.right - this.borderWalls.left, this.borderWalls.bottom - this.borderWalls.top);

    // Doors 🚪
    this.doors.forEach(d => {
      ctx.fillStyle = '#2a2640';
      ctx.fillRect(d.wallX - 5, this.borderWalls.top, 10, d.doorY - this.borderWalls.top);
      ctx.fillRect(d.wallX - 5, d.doorY + d.doorH, 10, this.borderWalls.bottom - (d.doorY + d.doorH));

      if (d.isOpen) {
        ctx.fillStyle = 'rgba(0, 255, 136, 0.3)';
        ctx.fillRect(d.wallX - 4, d.doorY, 8, d.doorH);
        ctx.fillStyle = '#00ff88'; ctx.font = '12px Orbitron';
        ctx.fillText('🚪 OPEN', d.wallX - 24, d.doorY + d.doorH / 2);
      } else {
        ctx.fillStyle = '#ff0055';
        ctx.fillRect(d.wallX - 5, d.doorY, 10, d.doorH);
        ctx.fillStyle = '#ff0055'; ctx.font = '12px Orbitron';
        ctx.fillText('🔒 FLUSH CLOSED', d.wallX - 35, d.doorY + d.doorH / 2);
      }
    });

    // Boxes
    this.boxes.forEach(b => {
      ctx.fillStyle = b.searched ? '#222' : '#ffaa00';
      ctx.fillRect(b.x - 12, b.y - 12, 24, 24);
      ctx.fillStyle = '#fff'; ctx.font = '14px sans-serif';
      ctx.fillText('📦', b.x - 8, b.y + 5);
    });

    // Home Furniture Obstacles (Chairs, Cots, Tables, Sofas, Wardrobes, TVs) (Requests 2 & 3)
    this.furnitureObstacles.forEach(f => {
      ctx.font = '24px sans-serif';
      const icon = f.name.split(' ')[0];
      ctx.fillText(icon, f.x - 12, f.y + 8);
      if (!f.searched) {
        ctx.fillStyle = '#ffea00'; ctx.font = '9px Orbitron';
        ctx.fillText('🔍 [F]', f.x - 12, f.y - 14);
      }
    });

    // Removable Obstacles
    this.obstacles.forEach(o => {
      if (!o.cleared) {
        ctx.font = '22px sans-serif';
        ctx.fillText(o.type.split(' ')[0], o.x - 10, o.y + 8);
      }
    });

    // Victory Door
    ctx.fillStyle = this.player.hasKey ? '#00ff88' : '#ff0055';
    ctx.fillRect(this.exitDoor.x, this.exitDoor.y, this.exitDoor.w, this.exitDoor.h);
    ctx.fillStyle = '#fff'; ctx.font = '12px Orbitron';
    ctx.fillText(this.player.hasKey ? '🔑 UNLOCKED DOOR' : '🔒 LOCKED (NEED KEY)', this.exitDoor.x - 50, this.exitDoor.y - 10);

    // Center Heart Obstacle (Item 2)
    ctx.strokeStyle = '#ff0077'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(this.heartObstacle.x + 12, this.heartObstacle.y - 10, 26, 0, Math.PI * 2); ctx.stroke();
    ctx.font = '28px sans-serif';
    ctx.fillText(this.heartObstacle.icon, this.heartObstacle.x - 4, this.heartObstacle.y + 2);
    if (Math.hypot(this.player.x - this.heartObstacle.x, this.player.y - this.heartObstacle.y) < 60) {
      ctx.font = 'bold 12px Orbitron'; ctx.fillStyle = '#ff0077';
      ctx.fillText("PRESS 'F' FOR PIN AUTH 🔐", this.heartObstacle.x - 70, this.heartObstacle.y - 45);
    }

    // Player 🧍
    ctx.font = '32px sans-serif';
    ctx.fillText(this.player.avatar, this.player.x - 16, this.player.y + 12);
    if (this.player.hasGun) ctx.fillText('🔫', this.player.x + 10, this.player.y);
    if (this.player.hasSword) ctx.fillText('🗡️', this.player.x - 22, this.player.y);
    if (this.player.hasKey) ctx.fillText('🔑', this.player.x - 5, this.player.y - 20);

    // Devils
    this.hunters.forEach(h => {
      ctx.save();
      if (h.isInvisible) ctx.globalAlpha = 0.25;
      ctx.font = '36px sans-serif';
      ctx.fillText(h.avatar, h.x - 18, h.y + 12);
      ctx.restore();
    });

    // HUD Info
    ctx.fillStyle = '#fff'; ctx.font = '14px Orbitron';
    ctx.fillText(`Hero HP: ${this.player.hp}/100 | Key: ${this.player.hasKey ? '🔑 Acquired' : '❌ Search Furniture'} | Weapons: ${this.player.hasGun ? '🔫 Gun' : ''} ${this.player.hasSword ? '🗡️ Sword' : 'None'} | [F] Search | [SPACE] Attack`, 25, 470);
  }
}

window.GAMETHON.SubGames.JananisCursedMansion = JananisCursedMansion;

