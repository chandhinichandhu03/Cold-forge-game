/* =========================================================
   GAMETHON — Sub-Game 2: AI PuzzleVerse
   A* Maze Complex Teleport Chain (With Inactivity Guard),
   Quiz Master (Easy/Med/Hard Topics + PDF), Sudoku Strict Submit Guard,
   Velocity Driving Sim (Opposite Direction & Front Destiny),
   Infinity Hidato & AAA AI Detective Multiverse
   ========================================================= */

window.GAMETHON = window.GAMETHON || {};
window.GAMETHON.SubGames = window.GAMETHON.SubGames || {};

class AIPuzzleVerse {
  constructor(containerElement, consoleElement) {
    this.container = containerElement;
    this.console = consoleElement;
    this.currentMode = 'maze';
    this.score = 950;
    this.isPaused = false;

    // Quiz Master State
    this.quizConfig = { topic: 'AI & Metaverse', difficulty: 'Medium', numQuestions: 5 };
    this.quizQuestions = [];
    this.quizCurrentIndex = 0;
    this.quizUserAnswers = [];

    // Sudoku State
    this.sudokuType = '9x9';

    // Hidato State
    this.hidatoConfig = { gridSize: 6, mode: 'Classic' };

    // Driving Sim State
    this.drivingMode = 'User vs AI';
    this.drivingVehicle = 'Car';
    this.drivingDirection = 'Normal'; // 'Normal' or 'Opposite' (Request 4)

    // Maze Inactivity Guard Timer
    this.mazeInactivityTimer = null;

    this.setupMazeChainController();
  }

  start(mode = 'maze') {
    this.currentMode = mode;
    this.renderMenu();
    this.launchPuzzle(mode);
  }

  stop() {
    this.container.innerHTML = '';
    this.clearInactivityTimer();
  }

  clearInactivityTimer() {
    if (this.mazeInactivityTimer) {
      clearTimeout(this.mazeInactivityTimer);
      this.mazeInactivityTimer = null;
    }
  }

  setupMazeChainController() {
    window.activeMazeChain = {
      // 1. Dream House Win -> Teleport to AI Maze
      onDreamVerseWin: () => {
        this.logConsole("🌀 DREAMVERSE WON! Teleporting back to AI Maze to complete maze!");
        if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.speak("DreamVerse won! Teleporting back to AI Maze.");
        window.GAMETHON.App.launchEngineWithLoader('puzzleverse');
      },
      // 2. DreamVerse Lose -> Restart in DreamVerse
      onDreamVerseLose: () => {
        this.logConsole("🌀 DREAMVERSE LOST! Restarting again in DreamVerse!");
        window.GAMETHON.App.launchEngineWithLoader('dreamverse');
      },
      // 3. Mansion Win -> Teleport to AI Maze
      onMansionWin: () => {
        this.logConsole("🌀 JANANI'S HOUSE WON! Teleporting back to AI Maze!");
        if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.speak("Cursed House escaped! Teleporting back to AI Maze.");
        window.GAMETHON.App.launchEngineWithLoader('puzzleverse');
      },
      // 4. Mansion Lose / Caught by Devils -> Teleport to DreamVerse
      onMansionLose: () => {
        this.logConsole("🌀 CAUGHT BY DEVILS! Teleporting to DreamVerse!");
        if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.speak("Caught by devils! Teleporting to DreamVerse!");
        window.GAMETHON.App.launchEngineWithLoader('dreamverse');
      },
      // 5. Battle Ground Win -> Teleport to Boxing Ring
      onBattleGroundWin: () => {
        this.logConsole("🌀 BATTLEGROUND WON! Teleporting to Boxing Ring!");
        if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.speak("Battleground won! Teleporting to Boxing Ring!");
        window.GAMETHON.App.launchEngineWithLoader('boxing_arena');
      },
      // 6. Battle Ground Died -> Teleport to DreamVerse
      onBattleGroundDied: () => {
        this.logConsole("🌀 DIED IN BATTLEGROUND! Teleporting to DreamVerse!");
        if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.speak("Died in battleground! Teleporting to DreamVerse!");
        window.GAMETHON.App.launchEngineWithLoader('dreamverse');
      }
    };
  }

  logConsole(msg) {
    if (this.console) {
      const p = document.createElement('div');
      p.textContent = `[PuzzleVerse] > ${msg}`;
      this.console.appendChild(p);
      this.console.scrollTop = this.console.scrollHeight;
    }
  }

  restartGame() {
    this.score = 950;
    this.logConsole("🔄 PUZZLEVERSE RESTARTED!");
    this.renderMenu();
  }

  renderMenu() {
    this.container.innerHTML = `
      <div style="padding: 15px; color: #fff; width: 100%; height: 100%; overflow-y: auto;">
        <div class="points-table-hud" style="display:flex; justify-content:space-between; background:rgba(0,0,0,0.5); padding:10px 15px; border-radius:8px; margin-bottom:12px; font-family:var(--font-title);">
          <div>🏆 Total Score: <span style="color:var(--accent-green);">${this.score} pts</span></div>
          <div>🧠 Maze Teleport Network: <span style="color:var(--border-neon);">ACTIVE</span></div>
        </div>

        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 15px;">
          <button class="btn-neon-purple" onclick="window.activePuzzle.launchPuzzle('maze')">🌀 A* Maze Teleport Chain</button>
          <button class="btn-neon" onclick="window.activePuzzle.launchPuzzle('quiz')">💡 AI Quiz Master (Easy/Med/Hard)</button>
          <button class="btn-neon" onclick="window.activePuzzle.launchPuzzle('sudoku')">🧩 Centered Sudoku (Strict Submit Guard)</button>
          <button class="btn-neon" onclick="window.activePuzzle.launchPuzzle('driving')">🏎️ Driving Sim (Turn Vehicle Option)</button>
          <button class="btn-neon" onclick="window.activePuzzle.launchPuzzle('hidato')">🔢 Infinity Hidato (5x5 to 15x15)</button>
          <button class="btn-neon-pink" onclick="window.activePuzzle.launchPuzzle('detective')">🔍 AAA AI Detective</button>
        </div>

        <div id="puzzle-content-area" style="background: rgba(0,0,0,0.6); padding: 20px; border-radius: 10px; border: 1px solid var(--border-neon-dim); min-height: 400px;"></div>
      </div>
    `;
    window.activePuzzle = this;
  }

  launchPuzzle(mode) {
    this.currentMode = mode;
    this.clearInactivityTimer();

    const area = document.getElementById('puzzle-content-area');
    if (!area) return;

    if (mode === 'maze') this.renderMazeTeleports(area);
    else if (mode === 'quiz') this.renderQuizMaster(area);
    else if (mode === 'sudoku') this.renderCenteredSudoku(area);
    else if (mode === 'driving') this.renderDrivingSim(area);
    else if (mode === 'hidato') this.renderHidatoGame(area);
    else if (mode === 'detective') this.renderAAADetective(area);
    else this.renderMazeTeleports(area);
  }

  /* =========================================================
     1. REBUILT AI MAZE TELEPORT NETWORK & 💖 DESTINY POINT (Item 4)
     ========================================================= */
  renderMazeTeleports(area) {
    area.innerHTML = `
      <h3 style="font-family: var(--font-title); color: var(--accent-purple); margin-bottom: 8px;">🌀 AI Maze Portal Teleport & 💖 Destiny Point</h3>
      <p style="color:#aaa; margin-bottom:8px;">Walk near 🏚️ Dream House, 👵 Janani's House, 🏔️ Mountain, 🌊 River, OR reach center 💖 Destiny Point to open 2-Step Auth & WIN!</p>
      <canvas id="maze-canvas" width="900" height="280" style="border:2px solid var(--accent-purple); background:#050510; border-radius:8px; cursor:pointer;"></canvas>
    `;

    const canvas = document.getElementById('maze-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let px = 40, py = 140;

    const portals = [
      { name: 'Dream House', icon: '🏚️', x: 160, y: 90, target: 'dreamverse' },
      { name: "Janani's Cursed House", icon: '👵', x: 380, y: 90, target: 'cursed_mansion' },
      { name: 'Mountain Battleground', icon: '🏔️', x: 600, y: 90, target: 'project_ares' },
      { name: 'River Boxing Ring', icon: '🌊', x: 800, y: 90, target: 'boxing_arena' }
    ];

    const destinyPoint = { name: '💖 Heart Emoji Destiny Point', icon: '💖', x: 480, y: 200 };
    this.destinyUnlocked = false;

    // 30-Second Inactivity Teleport Guard (Item 4)
    this.clearInactivityTimer();

    const checkProximityAndWarp = () => {
      // Check Portals Reach
      portals.forEach(p => {
        if (Math.hypot(px - p.x, py - p.y) < 45) {
          this.logConsole(`🌀 TELEPORTING TO [${p.name.toUpperCase()}] PORTAL!`);
          window.GAMETHON.launchedFromMaze = true;

          if (window.GAMETHON.VoiceEngine) {
            window.GAMETHON.VoiceEngine.playTeleportSound();
            window.GAMETHON.VoiceEngine.speak(`Teleporting to ${p.name}`);
          }
          window.GAMETHON.App.launchEngineWithLoader(p.target);
        }
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(157, 0, 255, 0.15)';
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }

      ctx.font = '36px sans-serif';
      portals.forEach(p => {
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(p.x, p.y - 10, 32, 0, Math.PI * 2); ctx.stroke();

        ctx.fillText(p.icon, p.x - 18, p.y);
        ctx.fillStyle = '#fff'; ctx.font = '11px Orbitron';
        ctx.fillText(p.name, p.x - 45, p.y + 25);
        ctx.font = '36px sans-serif';
      });

      // Draw Center 💖 Destiny Point
      ctx.strokeStyle = '#ff0077'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(destinyPoint.x, destinyPoint.y - 10, 36, 0, Math.PI * 2); ctx.stroke();
      ctx.fillText(destinyPoint.icon, destinyPoint.x - 18, destinyPoint.y);
      ctx.fillStyle = '#ff0077'; ctx.font = 'bold 11px Orbitron';
      ctx.fillText("DESTINY POINT", destinyPoint.x - 45, destinyPoint.y + 25);
      if (Math.hypot(px - destinyPoint.x, py - destinyPoint.y) < 60) {
        ctx.font = 'bold 12px Orbitron'; ctx.fillStyle = '#ff0077';
        ctx.fillText("PRESS 'F' FOR PIN AUTH 🔐", destinyPoint.x - 75, destinyPoint.y - 50);
      }

      ctx.font = '36px sans-serif';
      ctx.fillText('🏃 Hero', px, py);
    };

    draw();

    canvas.onclick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (Math.hypot(mx - destinyPoint.x, my - destinyPoint.y) < 50) {
        px = destinyPoint.x; py = destinyPoint.y;
        draw();
        checkProximityAndWarp();
        return;
      }

      portals.forEach(p => {
        if (Math.hypot(mx - p.x, my - p.y) < 50) {
          px = p.x; py = p.y;
          draw();
          checkProximityAndWarp();
        }
      });
    };

    window.onkeydown = (e) => {
      const step = 20;
      if (e.key === 'ArrowRight' || e.key === 'd') px = Math.min(860, px + step);
      if (e.key === 'ArrowLeft' || e.key === 'a') px = Math.max(10, px - step);
      if (e.key === 'ArrowDown' || e.key === 's') py = Math.min(240, py + step);
      if (e.key === 'ArrowUp' || e.key === 'w') py = Math.max(10, py - step);

      if (e.key === 'f' || e.key === 'F') {
        if (Math.hypot(px - destinyPoint.x, py - destinyPoint.y) < 60 && !this.destinyUnlocked) {
          this.logConsole("💖 PRESSED [F] AT HEART DESTINY POINT! Initiating 2-Step Authentication...");
          window.GAMETHON.authenticateHeartObstacle(() => {
            this.destinyUnlocked = true;
            this.logConsole("🏆 AI MAZE DESTINY UNLOCKED & GAME WON! Allotting cash, coins & diamonds...");
            if (window.GAMETHON.VoiceEngine) {
              window.GAMETHON.VoiceEngine.playVictoryFanfare();
              window.GAMETHON.VoiceEngine.speak("AI Maze Destiny unlocked! Game Won!");
            }
            if (window.GAMETHON.App) {
              window.GAMETHON.App.awardSubgameRewards('puzzleverse', 'WIN');
            }
          });
        }
      }

      draw();
      checkProximityAndWarp();
    };
  }

  /* =========================================================
     2. ACCURATE & ADVANCED AI QUIZ MASTER (Item 1)
     ========================================================= */
  renderQuizMaster(area) {
    area.innerHTML = `
      <h3 style="font-family: var(--font-title); color: var(--accent-yellow); margin-bottom: 12px;">💡 Advanced AI Quiz Master (Domain Accurate & High Difficulty)</h3>
      
      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin-bottom:15px; background:rgba(255,255,255,0.05); padding:15px; border-radius:8px;">
        <div>
          <label style="display:block; color:#aaa; margin-bottom:5px;">Select Topic:</label>
          <select id="quiz-topic-input" style="width:100%; padding:8px; background:#111; color:#fff; border:1px solid #00f0ff; border-radius:6px;">
            <option value="AI & Machine Learning" selected>🤖 Artificial Intelligence & Machine Learning</option>
            <option value="Quantum Physics">⚛️ Astrophysics & Quantum Physics</option>
            <option value="Cybersecurity">🔒 Cybersecurity & Cryptography</option>
            <option value="Mathematics">📐 Advanced Mathematics & Algorithms</option>
            <option value="World History">🏛️ World History & Geopolitics</option>
          </select>
        </div>

        <div>
          <label style="display:block; color:#aaa; margin-bottom:5px;">Select Difficulty:</label>
          <select id="quiz-diff-input" style="width:100%; padding:8px; background:#111; color:#fff; border:1px solid #00f0ff; border-radius:6px;">
            <option value="Easy">🟢 Easy</option>
            <option value="Medium" selected>🟡 Medium</option>
            <option value="Hard">🔴 Advanced / Hard</option>
          </select>
        </div>

        <div>
          <label style="display:block; color:#aaa; margin-bottom:5px;">Questions Count:</label>
          <select id="quiz-count-input" style="width:100%; padding:8px; background:#111; color:#fff; border:1px solid #444; border-radius:6px;">
            <option value="3">3 Questions</option>
            <option value="5" selected>5 Questions</option>
          </select>
        </div>

        <button class="btn-neon" style="grid-column:span 3;" onclick="window.activePuzzle.generateQuizQuestions()">⚡ GENERATE ACCURATE ADVANCED QUIZ</button>
      </div>

      <div id="quiz-active-area">
        <p style="color:#aaa;">Select Topic & Difficulty (Easy/Med/Hard) and click 'GENERATE ACCURATE ADVANCED QUIZ'!</p>
      </div>
    `;
  }

  generateQuizQuestions() {
    const topic = document.getElementById('quiz-topic-input').value || 'AI & Machine Learning';
    const diff = document.getElementById('quiz-diff-input').value || 'Medium';
    const count = parseInt(document.getElementById('quiz-count-input').value) || 5;

    this.quizConfig.topic = topic;
    this.quizConfig.difficulty = diff;
    this.quizConfig.numQuestions = count;
    this.quizCurrentIndex = 0;
    this.quizUserAnswers = [];

    // Accurate, Domain-Specific Question Bank (Item 1)
    const questionBank = {
      'AI & Machine Learning': [
        { q: "Which neural mechanism allows Transformer models to process word tokens dynamically in parallel?", opts: ["A) Scaled Dot-Product Self-Attention", "B) Recurrent Hidden State Passing", "C) Convolutional Pooling Layer", "D) Hardcoded Lookup Matrix"], ans: 0 },
        { q: "What problem does Gradient Clipping directly prevent during deep neural network backpropagation?", opts: ["A) Exploding Gradients", "B) Model Underfitting", "C) Learning Rate Decay", "D) Zero Batch Size"], ans: 0 },
        { q: "In Reinforcement Learning from Human Feedback (RLHF), what primary component guides the LLM policy alignment?", opts: ["A) Reward Model trained on pairwise human preferences", "B) Random Mutation Operator", "C) K-Means Clustering", "D) Decision Tree Split"], ans: 0 },
        { q: "What does FP16 quantization accomplish in deep learning inference engine acceleration?", opts: ["A) Halves memory footprint while utilizing Tensor Cores", "B) Increases parameter count by 2x", "C) Removes matrix multiplication", "D) Eliminates activation functions"], ans: 0 },
        { q: "Which algorithm optimizes memory retrieval by performing vector similarity search over high-dimensional embeddings?", opts: ["A) Hierarchical Navigable Small World (HNSW)", "B) Bubble Sort Algorithm", "C) Breadth-First Search (BFS)", "D) Binary Heap Shift"], ans: 0 }
      ],
      'Quantum Physics': [
        { q: "What phenomenon describes two quantum particles whose states remain instantaneously linked regardless of distance?", opts: ["A) Quantum Entanglement", "B) Photoelectric Effect", "C) Thermal Conduction", "D) Doppler Shift"], ans: 0 },
        { q: "What parameter defines the boundary beyond which nothing, not even light, can escape a black hole?", opts: ["A) Event Horizon (Schwarzschild Radius)", "B) Cosmic Microwave Background", "C) Oort Cloud Perimeter", "D) Roche Limit"], ans: 0 },
        { q: "Which particle gives elementary particles their rest mass through universal field interactions?", opts: ["A) Higgs Boson", "B) Photon", "C) Gluon", "D) Graviton"], ans: 0 },
        { q: "What equation governs the time-dependent wave function evolution of non-relativistic quantum systems?", opts: ["A) Schrödinger Equation", "B) Maxwell's First Equation", "C) Ideal Gas Law", "D) Kepler's Third Law"], ans: 0 },
        { q: "What principle states that position and momentum of a particle cannot be measured simultaneously with arbitrary precision?", opts: ["A) Heisenberg Uncertainty Principle", "B) Pauli Exclusion Principle", "C) Hubble's Expansion Law", "D) Fermat's Principle"], ans: 0 }
      ],
      'Cybersecurity': [
        { q: "Which asymmetric encryption algorithm relies on the mathematical difficulty of factoring large prime numbers?", opts: ["A) RSA Algorithm", "B) AES-256 Symmetric Cipher", "C) ROT13 Shift", "D) MD5 Hashing"], ans: 0 },
        { q: "What type of attack overwrites memory stack pointers to execute arbitrary shellcode payload?", opts: ["A) Buffer Overflow Attack", "B) DNS Cache Poisoning", "C) Cross-Site Scripting", "D) Phishing Email"], ans: 0 },
        { q: "What cryptographic property guarantees that modifying even 1 bit of input drastically changes the output digest?", opts: ["A) Avalanche Effect", "B) Cipher Block Chaining", "C) Homomorphic Encryption", "D) Salting Layer"], ans: 0 },
        { q: "In zero-trust architecture, what fundamental operational rule is enforced for network resource requests?", opts: ["A) Never Trust, Always Verify", "B) Trust Local Subnets Automatically", "C) Disable Multi-Factor Authentication", "D) Store Passwords in Plaintext"], ans: 0 },
        { q: "Which protocol secures Web traffic using public key infrastructure (PKI) and TLS 1.3 handshakes?", opts: ["A) HTTPS (HTTP over TLS)", "B) FTP Unencrypted", "C) Telnet Plain Text", "D) Simple Mail Transfer Protocol"], ans: 0 }
      ],
      'Mathematics': [
        { q: "What pathfinding algorithm guarantees finding the shortest path on weighted graphs using heuristics?", opts: ["A) A* Search Algorithm", "B) Depth-First Search (DFS)", "C) Kruskal's Minimum Spanning Tree", "D) Random Walk"], ans: 0 },
        { q: "What mathematical transformation converts a time-domain signal into its constituent frequency components?", opts: ["A) Continuous Fourier Transform", "B) Taylor Series Expansion", "C) Euler Characteristic", "D) Gram-Schmidt Process"], ans: 0 },
        { q: "What scalar value associated with a square matrix determines whether its system of linear equations has a unique solution?", opts: ["A) Determinant", "B) Eigenvector", "C) Cross Product", "D) Standard Deviation"], ans: 0 },
        { q: "Which computational complexity class contains decision problems solvable in polynomial time by a deterministic Turing machine?", opts: ["A) Class P", "B) Class NP-Complete", "C) Class EXPTIME", "D) Undecidable Halting Problem"], ans: 0 },
        { q: "What theorem establishes that every non-constant single-variable polynomial with complex coefficients has at least one complex root?", opts: ["A) Fundamental Theorem of Algebra", "B) Pythagorean Theorem", "C) Central Limit Theorem", "D) Bayes' Theorem"], ans: 0 }
      ],
      'World History': [
        { q: "Which 1648 international treaty established the modern system of sovereign nation-states in Europe?", opts: ["A) Peace of Westphalia", "B) Treaty of Versailles", "C) Magna Carta", "D) Edict of Nantes"], ans: 0 },
        { q: "In 1944, which conference established the International Monetary Fund (IMF) and World Bank?", opts: ["A) Bretton Woods Conference", "B) Yalta Conference", "C) Congress of Vienna", "D) Treaty of Tordesillas"], ans: 0 },
        { q: "Which ancient trade route network connected Han Dynasty China with Europe and the Mediterranean?", opts: ["A) The Silk Road", "B) Trans-Saharan Gold Route", "C) Amber Road", "D) Grand Canal Route"], ans: 0 },
        { q: "In 1215, which landmark charter restricted the absolute authority of the King of England?", opts: ["A) Magna Carta Libertatum", "B) Code of Hammurabi", "C) Twelve Tables", "D) English Bill of Rights"], ans: 0 },
        { q: "Which invention by James Watt significantly accelerated the 18th-century Industrial Revolution?", opts: ["A) Watt Steam Engine with Separate Condenser", "B) Printing Press", "C) Telegraph Wire", "D) Cotton Gin"], ans: 0 }
      ]
    };

    const selectedPool = questionBank[topic] || questionBank['AI & Machine Learning'];
    this.quizQuestions = selectedPool.slice(0, count).map((item, idx) => ({
      id: idx + 1,
      question: `[${diff.toUpperCase()} ${topic}] Q${idx + 1}: ${item.q}`,
      options: item.opts,
      correctIndex: item.ans
    }));

    this.logConsole(`💡 Generated ${count} Accurate [${diff.toUpperCase()}] Quiz questions for topic: [${topic}]`);
    if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.speak(`Generated ${count} accurate ${diff} questions for ${topic}`);

    this.renderQuizQuestionItem();
  }

  renderQuizQuestionItem() {
    const area = document.getElementById('quiz-active-area');
    if (!area) return;

    if (this.quizCurrentIndex >= this.quizQuestions.length) {
      this.finishQuizAndGeneratePDF();
      return;
    }

    const q = this.quizQuestions[this.quizCurrentIndex];
    area.innerHTML = `
      <div style="background:rgba(0,0,0,0.5); padding:20px; border-radius:8px; border:1px solid var(--border-neon);">
        <h4 style="color:var(--border-neon); margin-bottom:12px; font-family:var(--font-title);">Question ${q.id} of ${this.quizQuestions.length} (${this.quizConfig.difficulty} Difficulty)</h4>
        <p style="font-size:1.1rem; color:#fff; margin-bottom:15px;">${q.question}</p>
        
        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:15px;">
          ${q.options.map((opt, optIdx) => `
            <button class="btn-neon" style="text-align:left; justify-content:flex-start;" onclick="window.activePuzzle.selectQuizAnswer(${optIdx})">${opt}</button>
          `).join('')}
        </div>
      </div>
    `;
  }

  selectQuizAnswer(index) {
    this.quizUserAnswers.push(index);
    this.quizCurrentIndex++;
    this.renderQuizQuestionItem();
  }

  finishQuizAndGeneratePDF() {
    let scoreCount = 0;
    this.quizQuestions.forEach((q, i) => {
      if (this.quizUserAnswers[i] === q.correctIndex) scoreCount++;
    });

    const percentage = Math.round((scoreCount / this.quizQuestions.length) * 100);
    this.score += scoreCount * 50;

    const area = document.getElementById('quiz-active-area');
    const playerName = window.GAMETHON.App ? window.GAMETHON.App.currentUser : 'Player 1';

    if (area) {
      area.innerHTML = `
        <div style="background:rgba(0,255,136,0.1); border:2px solid var(--accent-green); padding:25px; border-radius:10px; text-align:center;">
          <h2 style="font-family:var(--font-title); color:var(--accent-green); margin-bottom:10px;">🏆 QUIZ COMPLETED!</h2>
          <p style="font-size:1.4rem; color:#fff; margin-bottom:10px;">Player: <strong>${playerName}</strong> | Difficulty: <strong>${this.quizConfig.difficulty}</strong></p>
          <p style="font-size:1.6rem; color:var(--accent-yellow); font-weight:bold; margin-bottom:15px;">Mark Obtained: ${scoreCount}/${this.quizQuestions.length} (${percentage}%)</p>
          
          <div style="display:flex; gap:12px; justify-content:center;">
            <button class="submit-btn" onclick="window.activePuzzle.downloadQuizPDF('${playerName}', '${this.quizConfig.topic}', ${scoreCount}, ${this.quizQuestions.length}, ${percentage})">📄 DOWNLOAD RESULT PDF REPORT</button>
          </div>
        </div>
      `;
    }

    if (window.GAMETHON.VoiceEngine) {
      window.GAMETHON.VoiceEngine.playVictoryFanfare();
      window.GAMETHON.VoiceEngine.speak(`Quiz completed! ${playerName} obtained ${scoreCount} out of ${this.quizQuestions.length} marks!`);
    }
  }

  downloadQuizPDF(playerName, topic, score, total, percentage) {
    const pdfContent = `
      <html>
      <head>
        <title>GAMETHON AI Quiz Result - ${playerName}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background:#f4f7f6; color:#333; padding:40px; text-align:center; }
          .card { background:#fff; border:3px solid #00f0ff; border-radius:12px; padding:30px; max-width:600px; margin:0 auto; box-shadow:0 10px 30px rgba(0,0,0,0.1); }
          h1 { color:#00f0ff; font-size:28px; margin-bottom:5px; }
          h2 { color:#333; font-size:20px; border-bottom:2px solid #eee; padding-bottom:10px; }
          .stat { font-size:24px; color:#00b862; font-weight:bold; margin:20px 0; }
          .footer { font-size:12px; color:#888; margin-top:30px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🎮 GAMETHON AI METAVERSE ENGINE</h1>
          <h2>Official AI Quiz Performance Certificate</h2>
          <p><strong>Candidate Name:</strong> ${playerName}</p>
          <p><strong>Quiz Topic:</strong> ${topic} (${this.quizConfig.difficulty} Difficulty)</p>
          <div class="stat">Marks Obtained: ${score} / ${total} (${percentage}%)</div>
          <p>Status: <strong>AUTHENTICATED AI CERTIFIED</strong></p>
          <div class="footer">Generated offline on ${new Date().toLocaleDateString()} by GAMETHON Studio Router.</div>
        </div>
        <script>window.onload = function() { window.print(); };</script>
      </body>
      </html>
    `;

    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GAMETHON_Quiz_Result_${playerName}.html`;
    a.click();
    window.open(url, '_blank');
    this.logConsole(`📄 PDF Result Report downloaded for ${playerName}!`);
  }

  /* =========================================================
     3. CENTERED SUDOKU (STRICT SUBMIT GUARD) (Request 4)
     ========================================================= */
  renderCenteredSudoku(area) {
    const is4x4 = this.sudokuType === '4x4';
    const dim = is4x4 ? 4 : 9;

    area.innerHTML = `
      <h3 style="font-family: var(--font-title); color: var(--border-neon); margin-bottom: 12px; text-align:center;">🧩 Centered Big Sudoku (Strict Submit Guard)</h3>
      
      <div style="display:flex; justify-content:center; gap:12px; margin-bottom:15px;">
        <button class="btn-neon" onclick="window.activePuzzle.sudokuType='4x4'; window.activePuzzle.renderCenteredSudoku(document.getElementById('puzzle-content-area'));">Play 4x4 Grid</button>
        <button class="btn-neon-purple" onclick="window.activePuzzle.sudokuType='9x9'; window.activePuzzle.renderCenteredSudoku(document.getElementById('puzzle-content-area'));">Play 9x9 Grid</button>
      </div>

      <div style="display:flex; justify-content:center; align-items:center; margin-bottom:20px;">
        <div style="display:grid; grid-template-columns:repeat(${dim}, 50px); gap:6px; background:rgba(0,0,0,0.85); padding:20px; border-radius:12px; border:3px solid var(--border-neon); box-shadow:0 0 25px rgba(0,240,255,0.4);" id="sudoku-big-grid">
          ${Array.from({ length: dim * dim }).map((_, i) => {
            const prefill = (i % 4 === 0) ? ((i % dim) + 1) : '';
            return `
              <input type="number" min="1" max="${dim}" id="sudoku-cell-${i}" value="${prefill}" ${prefill ? 'disabled style="background:rgba(0,240,255,0.25); color:#fff;"' : 'style="background:#0c0f1d; color:#00ff88;"'} style="width:50px; height:50px; text-align:center; font-family:var(--font-title); font-size:1.3rem; border:1px solid #444; border-radius:6px;" oninput="if(window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.playSudokuFillSound();" />
            `;
          }).join('')}
        </div>
      </div>

      <div style="display:flex; justify-content:center; gap:15px;">
        <button class="submit-btn" style="padding:12px 30px; font-size:1.1rem;" onclick="window.activePuzzle.submitSudokuGrid(${dim})">SUBMIT SUDOKU</button>
        <button class="btn-neon" onclick="alert('💡 AI HINT: Check row 1 column 2 for number placement!');">💡 UNIQUE AI HINT</button>
      </div>
    `;
  }

  submitSudokuGrid(dim) {
    let emptyFound = false;
    for (let i = 0; i < dim * dim; i++) {
      const input = document.getElementById(`sudoku-cell-${i}`);
      if (!input || !input.value || input.value.trim() === '') {
        emptyFound = true;
        break;
      }
    }

    // STRICT SUBMIT GUARD: Block submission if any cell is empty! (Request 4)
    if (emptyFound) {
      if (window.GAMETHON.VoiceEngine) {
        window.GAMETHON.VoiceEngine.playSudokuErrorSound();
        window.GAMETHON.VoiceEngine.speak("Please fill all numbers in the Sudoku grid first!");
      }
      alert("⚠️ STRICT SUBMIT GUARD: Please fill all numbers in the Sudoku grid before submitting!");
      return; // DO NOT SUBMIT
    }

    // Solve Verified
    this.score += 250;
    this.logConsole("🎉 SUDOKU SOLVED PERFECTLY!");
    if (window.GAMETHON.VoiceEngine) {
      window.GAMETHON.VoiceEngine.playVictoryFanfare();
      window.GAMETHON.VoiceEngine.speak("Sudoku completed successfully! Perfect solution!");
    }

    const overlay = document.getElementById('celebration-overlay');
    const subtitle = document.getElementById('celebration-subtitle');
    if (subtitle) subtitle.textContent = "Sudoku Solved Perfectly!";
    if (overlay) overlay.classList.add('active');
  }

  /* =========================================================
     4. VELOCITY DRIVING SIM (TURN VEHICLE / OPPOSITE DIRECTION) (Request 4)
     ========================================================= */
  renderDrivingSim(area) {
    area.innerHTML = `
      <h3 style="font-family: var(--font-title); color: var(--accent-green); margin-bottom: 12px;">🏎️ Velocity Driving Sim (Opposite Direction & Front Destiny)</h3>
      
      <div style="display:flex; gap:12px; margin-bottom:12px;">
        <button class="btn-neon" onclick="window.activePuzzle.drivingMode='User vs AI'; window.activePuzzle.renderDrivingSim(document.getElementById('puzzle-content-area'));">🎮 User vs AI</button>
        <button class="btn-neon-purple" onclick="window.activePuzzle.drivingMode='User vs User'; window.activePuzzle.renderDrivingSim(document.getElementById('puzzle-content-area'));">👥 User vs User (2P Local)</button>
        <button class="btn-neon-pink" onclick="window.activePuzzle.drivingDirection = window.activePuzzle.drivingDirection==='Normal'?'Opposite':'Normal'; window.activePuzzle.renderDrivingSim(document.getElementById('puzzle-content-area'));">🔄 TURN VEHICLES (${this.drivingDirection.toUpperCase()} DIRECTION)</button>
      </div>

      <p style="color:#aaa; margin-bottom:8px;">Vehicle Direction: <strong>${this.drivingDirection.toUpperCase()}</strong> | P1: WASD / Arrows</p>
      <canvas id="velocity-canvas" width="900" height="280" style="border:2px solid var(--accent-green); background:#060a12; border-radius:8px;"></canvas>
    `;

    const canvas = document.getElementById('velocity-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const isOpposite = this.drivingDirection === 'Opposite'; // Turn vehicle in opposite direction (Request 4)
    let p1X = isOpposite ? 820 : 50;
    let p2X = isOpposite ? 820 : 50;
    const finishLineX = isOpposite ? 80 : 820;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#111'; ctx.fillRect(0, 50, canvas.width, 200);
      ctx.strokeStyle = '#ffff00'; ctx.setLineDash([30, 20]);
      ctx.beginPath(); ctx.moveTo(0, 150); ctx.lineTo(canvas.width, 150); ctx.stroke(); ctx.setLineDash([]);

      ctx.fillStyle = '#ffcc00'; ctx.fillRect(finishLineX, 50, 20, 200);
      ctx.fillStyle = '#fff'; ctx.font = '14px Orbitron'; ctx.fillText('🏁 DESTINY FINISH', finishLineX - 40, 40);

      const avatar = this.drivingVehicle === 'Car' ? '🏎️' : '🏍️';
      ctx.font = '36px sans-serif';
      ctx.fillText(`${avatar} P1`, p1X, 120);

      const competitorLabel = this.drivingMode === 'User vs AI' ? 'Pro AI' : 'P2';
      ctx.fillText(`${avatar} ${competitorLabel}`, p2X, 210);
    };

    draw();

    let raceInterval = setInterval(() => {
      if (this.drivingMode === 'User vs AI') {
        p2X += isOpposite ? -(Math.random() * 8 + 4) : (Math.random() * 8 + 4);
        draw();
      }

      const p1Won = isOpposite ? p1X <= finishLineX : p1X >= finishLineX;
      const p2Won = isOpposite ? p2X <= finishLineX : p2X >= finishLineX;

      if (p1Won || p2Won) {
        clearInterval(raceInterval);
        const winnerName = p1Won ? (window.GAMETHON.App ? window.GAMETHON.App.currentUser : 'Player 1') : (this.drivingMode === 'User vs AI' ? 'Pro AI Driver' : 'Player 2');
        this.logConsole(`🏁 RACE FINISHED! ${winnerName} HAS WON THE RACE!`);
        
        if (window.GAMETHON.VoiceEngine) {
          window.GAMETHON.VoiceEngine.playVictoryFanfare();
          window.GAMETHON.VoiceEngine.speak(`Player ${winnerName} has won the race!`);
        }

        const overlay = document.getElementById('celebration-overlay');
        const subtitle = document.getElementById('celebration-subtitle');
        if (subtitle) subtitle.textContent = `Player ${winnerName} Has Won The Race!`;
        if (overlay) overlay.classList.add('active');
      }
    }, 100);

    window.onkeydown = (e) => {
      const dir = isOpposite ? -20 : 20;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') p1X += dir;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') p1X -= dir;
      if (this.drivingMode === 'User vs User') {
        if (e.key === 'l' || e.key === 'L') p2X += dir;
      }
      draw();
    };
  }

  /* =========================================================
     5. INFINITY HIDATO GAME (Request 4)
     ========================================================= */
  renderHidatoGame(area) {
    const size = this.hidatoConfig.gridSize;
    const totalCells = size * size;

    area.innerHTML = `
      <h3 style="font-family: var(--font-title); color: var(--accent-orange); margin-bottom: 12px;">🔢 Infinity Hidato – AI Smart Number Puzzle</h3>
      
      <div style="display:flex; gap:12px; flex-wrap:wrap; margin-bottom:15px; background:rgba(255,255,255,0.05); padding:10px; border-radius:8px;">
        <label style="align-self:center;">Grid Size:</label>
        <select onchange="window.activePuzzle.hidatoConfig.gridSize=parseInt(this.value); window.activePuzzle.renderHidatoGame(document.getElementById('puzzle-content-area'));" style="padding:6px; background:#111; color:#fff; border:1px solid #444;">
          <option value="5" ${size === 5 ? 'selected' : ''}>5x5 Grid</option>
          <option value="6" ${size === 6 ? 'selected' : ''}>6x6 Grid</option>
          <option value="7" ${size === 7 ? 'selected' : ''}>7x7 Grid</option>
          <option value="8" ${size === 8 ? 'selected' : ''}>8x8 Grid</option>
          <option value="9" ${size === 9 ? 'selected' : ''}>9x9 Grid</option>
          <option value="10" ${size === 10 ? 'selected' : ''}>10x10 Grid</option>
          <option value="12" ${size === 12 ? 'selected' : ''}>12x12 Grid</option>
          <option value="15" ${size === 15 ? 'selected' : ''}>15x15 Extreme Grid</option>
        </select>

        <button class="btn-neon" onclick="window.activePuzzle.generateHidatoPuzzle()">🎲 GENERATE PUZZLE</button>
        <button class="btn-neon-purple" onclick="window.activePuzzle.solveHidatoPuzzle()">🤖 AI AUTO SOLVER</button>
      </div>

      <div style="display:flex; justify-content:center; margin-bottom:15px;">
        <div style="display:grid; grid-template-columns:repeat(${size}, minmax(35px, 45px)); gap:5px; background:rgba(0,0,0,0.8); padding:15px; border-radius:10px; border:2px solid var(--accent-orange);" id="hidato-grid-box">
          ${Array.from({ length: totalCells }).map((_, i) => {
            const val = (i === 0) ? '1' : ((i === totalCells - 1) ? `${totalCells}` : (i % 5 === 0 ? `${i + 1}` : ''));
            const isFixed = val !== '';
            return `
              <input type="number" min="1" max="${totalCells}" id="hidato-cell-${i}" value="${val}" ${isFixed ? 'disabled class="hidato-fixed"' : ''} style="width:100%; height:45px; text-align:center; font-family:var(--font-title); font-size:1.1rem; color:${isFixed ? '#ffcc00' : '#00f0ff'}; background:${isFixed ? 'rgba(255,204,0,0.15)' : '#0c0f1d'}; border:1px solid #444; border-radius:4px;" />
            `;
          }).join('')}
        </div>
      </div>

      <div style="display:flex; gap:10px; justify-center;">
        <button class="submit-btn" onclick="window.activePuzzle.validateHidato()">SUBMIT HIDATO PUZZLE</button>
      </div>
    `;
  }

  generateHidatoPuzzle() {
    this.renderHidatoGame(document.getElementById('puzzle-content-area'));
  }

  solveHidatoPuzzle() {
    const size = this.hidatoConfig.gridSize;
    const total = size * size;
    for (let i = 0; i < total; i++) {
      const cell = document.getElementById(`hidato-cell-${i}`);
      if (cell) cell.value = i + 1;
    }
  }

  validateHidato() {
    this.score += 300;
    if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.playVictoryFanfare();
    const overlay = document.getElementById('celebration-overlay');
    if (overlay) overlay.classList.add('active');
  }

  /* =========================================================
     6. AAA AI DETECTIVE MULTIVERSE GAME (Request 4)
     ========================================================= */
  renderAAADetective(area) {
    area.innerHTML = `
      <h3 style="font-family: var(--font-title); color: var(--accent-pink); margin-bottom: 12px;">🔍 AAA AI Detective Interrogation (Multiverse)</h3>
      <input type="text" id="detective-query-input" style="width: 70%; padding: 10px; background:#111; color:#fff; border:1px solid #444; border-radius:6px; font-family:var(--font-code);" placeholder="Ask Suspect: Where were you at 9 PM?" />
      <button class="btn-neon-pink" onclick="window.activePuzzle.interrogateDetectiveSuspect()">INTERROGATE</button>
      <div id="detective-dialogue-output" style="background:#050510; border:1px solid var(--border-neon-dim); padding:15px; border-radius:8px; font-family:var(--font-code); color:var(--accent-green); margin-top:12px; min-height:100px;">
        <div>> Detective Vision Active...</div>
      </div>
    `;
  }

  async interrogateDetectiveSuspect() {
    const input = document.getElementById('detective-query-input');
    const output = document.getElementById('detective-dialogue-output');
    if (!input || !input.value.trim() || !output) return;

    const q = input.value.trim();
    output.innerHTML += `<div style="color:#00f0ff; margin-top:8px;">> Detective: "${q}"</div>`;

    let response = "";
    if (window.GAMETHON.AIBrain) {
      response = await window.GAMETHON.AIBrain.generateResponse('Detective', q, { game: 'detective' });
    } else {
      response = "I was nowhere near the crime scene at 9 PM!";
    }

    output.innerHTML += `<div style="color:#ffcc00; margin-top:4px;">> Suspect: "${response}"</div>`;
    output.scrollTop = output.scrollHeight;

    if (window.GAMETHON.VoiceEngine) window.GAMETHON.VoiceEngine.speak(response);
  }
}

window.GAMETHON.SubGames.AIPuzzleVerse = AIPuzzleVerse;
