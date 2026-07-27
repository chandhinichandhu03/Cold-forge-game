/* =========================================================
   GAMETHON — Sub-Game 5: Chronicles of Two Worlds
   Interactive Obstacle Proximity Speech, Unique Positive AI Messages,
   On-Screen Popup with Close/Delete Buttons, & Dual-World Obstacle Deletion
   ========================================================= */

window.GAMETHON = window.GAMETHON || {};
window.GAMETHON.SubGames = window.GAMETHON.SubGames || {};

class ChroniclesOfTwoWorlds {
  constructor(containerElement, consoleElement) {
    this.container = containerElement;
    this.console = consoleElement;
    this.viewWorld = 'Real';
    this.isRunning = false;
    this.isPaused = false;

    this.player = { x: 140, y: 160, avatar: '🧍' };
    this.lastSpokenObstacleId = null;
    this.activeInteractObstacle = null;
    this.loveCelebrationActive = false;
    this.heartBubbles = [];

    // Real vs Imaginary World Element Models + Permanent Heart Emoji Obstacle (Item 3)
    this.items = [
      { id: 999, x: 480, y: 200, real: '💖 Heart Emoji (Permanent)', imaginary: '💖 Eternal Heart Shrine', lore: 'Permanent sacred Heart obstacle requiring PIN & Password authentication.', msg: 'I LOVE YOU CHANDHINI', isHeartObstacle: true },
      { id: 1, x: 180, y: 100, real: '🌱 Seed', imaginary: '🌳 100m World Tree', lore: 'Planted in earth. Awakens into an ancient elemental World Tree.', msg: 'Greetings Traveler! Growth begins with small roots. Nurture your inner strength!' },
      { id: 2, x: 300, y: 120, real: '🐾 Small Pet', imaginary: '🐉 Thunder Dragon', lore: 'Small pet that unveils its ancient draconic bloodline.', msg: 'Loyalty creates true strength. I stand as your guardian across all realities!' },
      { id: 3, x: 440, y: 160, real: '🏙️ Building', imaginary: '🏙️ Cyber Citadel', lore: 'Skyscraper morphing into an illuminated Cyber Citadel.', msg: 'Wisdom builds citadel walls. Pursue your goals with courage and vision!' },
      { id: 4, x: 560, y: 120, real: '🌉 Bridge', imaginary: '🌉 Bifrost Crystal Bridge', lore: 'River bridge morphing into a glowing Bifrost Crystal Bridge.', msg: 'Bridges connect worlds and hearts. Walk forward with confidence!' },
      { id: 5, x: 220, y: 240, real: '🪨 Rock', imaginary: '🏔️ Ancient Mountain', lore: 'Simple boulder morphing into a 5000m Ancient Mountain.', msg: 'Steadfast like the mountain, your determination can overcome any hardship!' },
      { id: 6, x: 360, y: 240, real: '🛕 Temple Shrine', imaginary: '✨ Celestial Temple', lore: 'Sanctified temple channeling holy energy across realities.', msg: 'Harmony and peace illuminate your path. Trust your journey!' },
      { id: 7, x: 480, y: 320, real: '🕌 Grand Mosque', imaginary: '🌙 Moon Citadel', lore: 'Architectural marvel illuminating the night sky.', msg: 'Light shines brightest in the dark. Keep your hope steadfast!' },
      { id: 8, x: 600, y: 240, real: '⛪ High Church', imaginary: '⭐ Solar Sanctuary', lore: 'High cathedral summoning protective Solar Guardians.', msg: 'Solar warmth protects all who seek truth. You are capable of greatness!' },
      { id: 9, x: 720, y: 240, real: '🥚 Golden Egg', imaginary: '🐉 Elemental Dragon Hatchling', lore: 'Ancient egg hatching into an elemental dragon in Imaginary World.', msg: 'New possibilities hatch every day. Believe in your unlimited potential!' },
      { id: 10, x: 840, y: 240, real: '⛵ Wooden Skiff Boat', imaginary: '🚢 Sky Galleon', lore: 'Coastal skiff boat morphing into a flying sky galleon vessel.', msg: 'Sail boldly toward new horizons. Destiny awaits your arrival!' }
    ];
  }

  start() {
    this.isRunning = true;
    this.isPaused = false;
    this.renderUI();
    this.logConsole("🌱 Chronicles of Two Worlds loaded. Permanent 💖 Heart Emoji obstacle active in center!");
    this.loop();
  }

  stop() {
    this.isRunning = false;
    this.container.innerHTML = '';
    const modal = document.getElementById('obstacle-speech-modal');
    if (modal) modal.classList.remove('active');
  }

  logConsole(msg) {
    if (this.console) {
      const p = document.createElement('div');
      p.textContent = `[TwoWorlds] > ${msg}`;
      this.console.appendChild(p);
      this.console.scrollTop = this.console.scrollHeight;
    }
  }

  restartGame() {
    this.player = { x: 140, y: 160, avatar: '🧍' };
    this.lastSpokenObstacleId = null;
    this.loveCelebrationActive = false;
    this.heartBubbles = [];
    this.logConsole("🔄 ECOSYSTEM RESTARTED!");
  }

  openEnterBuilderPrompt() {
    const choice = prompt(
      "🌱 KEYBOARD BUILDER MENU:\nSelect an element to place at your location:\n" +
      "1: Plant 🌱\n2: Animal 🐾\n3: Building 🏙️\n4: Bridge 🌉\n5: Mountain 🏔️\n" +
      "6: Temple 🛕\n7: Mosque 🕌\n8: Church ⛪\n9: Birds 🕊️\n10: Dragon Egg 🥚\n11: Boat ⛵\n12: Sky Ship 🚢",
      "1"
    );

    if (!choice) return;

    let realName = '', imagName = '', loreText = '', msgText = '';

    if (choice === '1') { realName = '🌱 Seed'; imagName = '🌳 100m World Tree'; loreText = 'Seed planted in earth.'; msgText = 'Great trees grow from small seeds. Keep striving!'; }
    else if (choice === '2') { realName = '🐾 Small Pet'; imagName = '🐉 Thunder Dragon'; loreText = 'Pet morphed into draconic guardian.'; msgText = 'Your pet watches over your journey with courage!'; }
    else if (choice === '3') { realName = '🏙️ Building'; imagName = '🏙️ Cyber Citadel'; loreText = 'Building morphed into Cyber Citadel.'; msgText = 'Build your dreams strong and luminous!'; }
    else if (choice === '4') { realName = '🌉 Bridge'; imagName = '🌉 Bifrost Crystal Bridge'; loreText = 'Bridge morphed into crystal bridge.'; msgText = 'Cross new bridges into bright horizons!'; }
    else if (choice === '5') { realName = '🪨 Rock'; imagName = '🏔️ Ancient Mountain'; loreText = 'Rock morphed into 5000m Mountain.'; msgText = 'Stand firm and resilient through all challenges!'; }
    else if (choice === '6') { realName = '🛕 Temple Shrine'; imagName = '✨ Celestial Temple'; loreText = 'Sanctified temple shrine.'; msgText = 'Peace and wisdom shine within you!'; }
    else if (choice === '7') { realName = '🕌 Grand Mosque'; imagName = '🌙 Moon Citadel'; loreText = 'Illuminated mosque.'; msgText = 'Hope illuminates the darkest paths!'; }
    else if (choice === '8') { realName = '⛪ High Church'; imagName = '⭐ Solar Sanctuary'; loreText = 'High cathedral.'; msgText = 'Believe in your strength every single day!'; }
    else if (choice === '9') { realName = '🕊️ White Dove'; imagName = '🦅 Sky Phoenix'; loreText = 'Dove morphing into radiant Phoenix.'; msgText = 'Fly high above obstacles toward freedom!'; }
    else if (choice === '10') { realName = '🥚 Golden Egg'; imagName = '🐉 Dragon Hatchling'; loreText = 'Egg hatching into elemental dragon.'; msgText = 'Pure magic lives within your spirit!'; }
    else if (choice === '11') { realName = '⛵ Wooden Skiff Boat'; imagName = '⛵ Celestial Skiff'; loreText = 'Skiff boat.'; msgText = 'Navigate life with joy and confidence!'; }
    else if (choice === '12') { realName = '🚢 Cargo Boat'; imagName = '🚢 Flying Sky Galleon'; loreText = 'Ship morphing into sky galleon.'; msgText = 'Set sail for magnificent victories!'; }
    else return;

    const newObj = {
      id: Date.now(),
      x: this.player.x,
      y: this.player.y,
      real: realName,
      imaginary: imagName,
      lore: loreText,
      msg: msgText
    };

    this.items.push(newObj);
    this.logConsole(`✨ PLACED [${realName}] via Keyboard Enter at X: ${Math.round(this.player.x)}, Y: ${Math.round(this.player.y)}!`);
    if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.speak(`Placed ${realName}`);
  }

  triggerObstacleSpeechModal(item) {
    // Permanent Heart Emoji Authentication Logic (Item 3)
    if (item.isHeartObstacle) {
      window.GAMETHON.authenticateHeartObstacle(() => {
        this.loveCelebrationActive = true;
        this.spawnHeartBubbles();
        this.logConsole("💖 AUTHENTICATION SUCCESSFUL!");
      });
      return;
    }

    this.activeInteractObstacle = item;
    const modal = document.getElementById('obstacle-speech-modal');
    const iconEl = document.getElementById('obstacle-modal-icon');
    const titleEl = document.getElementById('obstacle-modal-title');
    const textEl = document.getElementById('obstacle-modal-text');
    const deleteBtn = document.getElementById('btn-delete-obstacle-action');

    const displayName = this.viewWorld === 'Real' ? item.real : item.imaginary;
    const icon = displayName.split(' ')[0];

    if (iconEl) iconEl.textContent = icon;
    if (titleEl) titleEl.textContent = `${displayName} Speaks`;
    if (textEl) textEl.textContent = `"${item.msg}"`;

    if (deleteBtn) {
      deleteBtn.onclick = () => {
        this.deleteObstacleDualWorld(item);
      };
    }

    if (modal) modal.classList.add('active');

    if (window.GAMETHON.VoiceEngine) {
      window.GAMETHON.VoiceEngine.speak(item.msg);
    }
  }

  spawnHeartBubbles() {
    this.heartBubbles = [];
    const emojis = ['💖', '💕', '💗', '💓', '✨', '🌸', '💫'];
    for (let i = 0; i < 45; i++) {
      this.heartBubbles.push({
        x: Math.random() * 900 + 30,
        y: Math.random() * 200 + 200,
        vy: -(Math.random() * 1.8 + 0.8),
        vx: (Math.random() - 0.5) * 1.2,
        icon: emojis[i % emojis.length],
        size: Math.random() * 16 + 20
      });
    }
  }

  deleteObstacleDualWorld(item) {
    if (item.isHeartObstacle) {
      alert("⚠️ Permanent Heart Emoji obstacle cannot be deleted!");
      return;
    }

    const displayName = this.viewWorld === 'Real' ? item.real : item.imaginary;
    this.items = this.items.filter(i => i.id !== item.id);

    const modal = document.getElementById('obstacle-speech-modal');
    if (modal) modal.classList.remove('active');

    this.logConsole(`🗑️ DELETED OBSTACLE [${displayName}] from BOTH Real and Imaginary World realities!`);

    if (window.GAMETHON.VoiceEngine) {
      window.GAMETHON.VoiceEngine.speak(`${displayName} deleted from both Real and Imaginary worlds.`);
    }
  }

  switchWorld(w) {
    this.viewWorld = w;
    this.logConsole(`🔄 VIEW SWITCHED TO [${w.toUpperCase()} WORLD]!`);
    if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.speak(`Viewing ${w} World.`);
    this.renderUI();
  }

  renderUI() {
    this.container.innerHTML = `
      <div style="padding: 15px; color: #fff; height: 100%; overflow-y: auto;">
        <h2 style="font-family: var(--font-title); color: var(--accent-green); margin-bottom: 10px;">🌱 Chronicles of Two Worlds (Permanent 💖 Heart Obstacle Active)</h2>
        <p style="color:#aaa; margin-bottom:12px;">Click the 💖 Heart Emoji obstacle in center for 2-Step Security Authentication!</p>

        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
          <button class="btn-neon" onclick="window.activeTwoWorlds.switchWorld('Real')">🌍 Real World View</button>
          <button class="btn-neon-purple" onclick="window.activeTwoWorlds.switchWorld('Imaginary')">✨ Imaginary World View</button>
          <button class="btn-neon-pink" onclick="window.activeTwoWorlds.openEnterBuilderPrompt()">⌨️ OPEN BUILDER MENU [ENTER]</button>
        </div>

        <canvas id="twoworlds-canvas" width="960" height="400" style="border: 2px solid var(--accent-green); background: #06120a; border-radius: 10px; cursor:pointer;"></canvas>
      </div>
    `;

    window.activeTwoWorlds = this;
    this.setupListeners();
  }

  setupListeners() {
    const canvas = document.getElementById('twoworlds-canvas');
    if (canvas) {
      this.draggedItem = null;

      canvas.onmousedown = (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const found = this.items.find(item => Math.hypot(mx - item.x, my - item.y) < 45);
        if (found && !found.isHeartObstacle) {
          this.draggedItem = found;
          this.dragOffsetX = mx - found.x;
          this.dragOffsetY = my - found.y;
        }
      };

      canvas.onmousemove = (e) => {
        if (this.draggedItem) {
          const rect = canvas.getBoundingClientRect();
          const mx = e.clientX - rect.left;
          const my = e.clientY - rect.top;

          this.draggedItem.x = Math.max(30, Math.min(930, mx - this.dragOffsetX));
          this.draggedItem.y = Math.max(30, Math.min(370, my - this.dragOffsetY));
        }
      };

      canvas.onmouseup = () => {
        if (this.draggedItem) {
          const name = this.viewWorld === 'Real' ? this.draggedItem.real : this.draggedItem.imaginary;
          this.logConsole(`🖐️ DRAGGED & DROPPED [${name}] to new position in Real & Imaginary worlds!`);
          this.draggedItem = null;
        }
      };

      canvas.onclick = (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        this.items.forEach(item => {
          if (!item.isHeartObstacle && Math.hypot(mx - item.x, my - item.y) < 40) {
            this.triggerObstacleSpeechModal(item);
          }
        });
      };
    }

    window.onkeydown = (e) => {
      if (!this.isRunning || this.isPaused) return;
      const speed = 15;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.player.x = Math.min(920, this.player.x + speed);
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.player.x = Math.max(20, this.player.x - speed);
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') this.player.y = Math.min(360, this.player.y + speed);
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') this.player.y = Math.max(20, this.player.y - speed);

      if (e.key === 'f' || e.key === 'F') {
        const heart = this.items.find(i => i.isHeartObstacle);
        if (heart && Math.hypot(this.player.x - heart.x, this.player.y - heart.y) < 60) {
          this.triggerObstacleSpeechModal(heart);
        }
      }

      if (e.key === 'Enter') {
        this.openEnterBuilderPrompt();
      }
    };
  }

  loop() {
    if (!this.isRunning) return;

    if (!this.isPaused) {
      this.items.forEach(item => {
        const dist = Math.hypot(this.player.x - item.x, this.player.y - item.y);
        if (!item.isHeartObstacle && dist < 45 && this.lastSpokenObstacleId !== item.id) {
          this.lastSpokenObstacleId = item.id;
          this.triggerObstacleSpeechModal(item);
        }
      });
    }

    const canvas = document.getElementById('twoworlds-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = this.viewWorld === 'Real' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(157, 0, 255, 0.15)';
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }

      ctx.font = '32px sans-serif';
      this.items.forEach(item => {
        const icon = this.viewWorld === 'Real' ? item.real.split(' ')[0] : item.imaginary.split(' ')[0];
        ctx.fillText(icon, item.x, item.y);
        if (item.isHeartObstacle && Math.hypot(this.player.x - item.x, this.player.y - item.y) < 60) {
          ctx.font = 'bold 12px Orbitron'; ctx.fillStyle = '#ff0077';
          ctx.fillText("PRESS 'F' FOR PIN AUTH 🔐", item.x - 65, item.y - 45);
          ctx.font = '32px sans-serif';
        }
      });

      ctx.fillText(this.player.avatar, this.player.x, this.player.y);

      // Render Animated Heart Bubbles & Glitters on Success (Item 3)
      if (this.loveCelebrationActive) {
        this.heartBubbles.forEach(hb => {
          ctx.font = `${hb.size}px sans-serif`;
          ctx.fillText(hb.icon, hb.x, hb.y);
          hb.y += hb.vy;
          hb.x += hb.vx;
          if (hb.y < -30) hb.y = 420;
        });

        // Glowing Banner
        ctx.fillStyle = '#ff0077';
        ctx.font = 'bold 26px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText('💖 I LOVE YOU CHANDHINI 💖', 480, 70);
        ctx.textAlign = 'left';
      }
    }
    requestAnimationFrame(() => this.loop());
  }
}

window.GAMETHON.SubGames.ChroniclesOfTwoWorlds = ChroniclesOfTwoWorlds;

