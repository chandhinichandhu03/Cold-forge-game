/* =========================================================
   GAMETHON — The Living AI Universe
   Universal Audio SFX Synthesizer & Voice Intent Engine
   ========================================================= */

window.GAMETHON = window.GAMETHON || {};

class GamethonVoiceEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.audioCtx = null;
    this.bgmOscillator = null;
    this.bgmPlaying = false;
    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("[Voice Engine] Heard:", transcript);
        this.processVoiceIntent(transcript);
      };
    }
  }

  toggleBGM() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (this.bgmPlaying) {
      if (this.bgmOscillator) this.bgmOscillator.stop();
      this.bgmPlaying = false;
      return false;
    } else {
      this.bgmOscillator = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();
      
      this.bgmOscillator.type = 'sine';
      this.bgmOscillator.frequency.setValueAtTime(120, this.audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.08, this.audioCtx.currentTime);

      this.bgmOscillator.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);
      
      this.bgmOscillator.start();
      this.bgmPlaying = true;
      return true;
    }
  }

  playPunchSound() {
    if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.15);
  }

  playGunshot() {
    if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(450, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.audioCtx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.5, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.12);
  }

  playCheering() {
    if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = this.audioCtx.sampleRate * 1.5;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = buffer;
    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 1.5);
    whiteNoise.connect(gain);
    gain.connect(this.audioCtx.destination);
    whiteNoise.start();
  }

  playDoorOpenSound() {
    if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(280, this.audioCtx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.25);
  }

  playDevilAttackSound() {
    if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(700, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, this.audioCtx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.35);
  }

  playSwordSlashSound() {
    if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.audioCtx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.35, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.18);
  }

  playItemPickupSound() {
    if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1040, this.audioCtx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.2);
  }

  playTeleportSound() {
    if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.audioCtx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.3);
  }

  playVictoryFanfare() {
    if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, i) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.01, this.audioCtx.currentTime + i * 0.12 + 0.3);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(this.audioCtx.currentTime + i * 0.12);
      osc.stop(this.audioCtx.currentTime + i * 0.12 + 0.3);
    });
  }

  playSudokuFillSound() {
    if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
    gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.1);
  }

  playSudokuErrorSound() {
    if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
    gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.25);
  }

  playTrophyAwardSound() {
    this.playVictoryFanfare();
    setTimeout(() => this.playCheering(), 300);
  }

  speakDevilVoice(character, text) {
    if (!this.synth) return;
    this.synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (character === "Granny") {
      utterance.pitch = 1.6; utterance.rate = 0.85; // High creepy voice
    } else if (character === "Grandpa") {
      utterance.pitch = 0.5; utterance.rate = 0.75; // Low rasp voice
    } else { // Queen Janani
      utterance.pitch = 1.2; utterance.rate = 1.1; // Echoing boss voice
    }

    const voices = this.synth.getVoices();
    if (voices.length > 0) {
      utterance.voice = voices.find(v => v.lang.includes('en')) || voices[0];
    }
    this.synth.speak(utterance);
  }

  processVoiceIntent(text) {
    const t = text.toLowerCase();
    console.log("[Voice Intent Engine] Parsing intent for:", t);

    if (t.includes("open boxing") || t.includes("boxing arena")) {
      window.GAMETHON.App.launchEngineWithLoader('boxing_arena');
      this.speak("Launching Boxing Arena.");
      return;
    }
    if (t.includes("open puzzle") || t.includes("puzzleverse")) {
      window.GAMETHON.App.launchEngineWithLoader('puzzleverse');
      this.speak("Launching AI PuzzleVerse.");
      return;
    }
    if (t.includes("open mansion") || t.includes("cursed mansion")) {
      window.GAMETHON.App.launchEngineWithLoader('cursed_mansion');
      this.speak("Launching Janani's Cursed Mansion.");
      return;
    }
    if (t.includes("open battle") || t.includes("project ares")) {
      window.GAMETHON.App.launchEngineWithLoader('project_ares');
      this.speak("Launching Project ARES Battle Royale.");
      return;
    }

    this.speak(`Voice Engine parsed: ${text}`);
  }

  speak(text, pitch = 1.0, rate = 1.0) {
    if (!this.synth) return;
    this.synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = pitch;
    utterance.rate = rate;
    
    const voices = this.synth.getVoices();
    if (voices.length > 0) {
      utterance.voice = voices.find(v => v.lang.includes('en')) || voices[0];
    }
    
    this.synth.speak(utterance);
  }
}

window.GAMETHON.VoiceEngine = new GamethonVoiceEngine();
