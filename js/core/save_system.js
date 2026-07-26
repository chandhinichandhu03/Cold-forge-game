/* =========================================================
   GAMETHON — The Living AI Universe
   Offline Local Storage & SQLite Simulation Save System
   ========================================================= */

window.GAMETHON = window.GAMETHON || {};

class GamethonSaveSystem {
  constructor() {
    this.SAVE_KEY = "GAMETHON_PLAYER_SAVE_V1";
    this.initSaveState();
  }

  initSaveState() {
    const saved = localStorage.getItem(this.SAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (window.GAMETHON.PlayerProfile) {
          window.GAMETHON.PlayerProfile.load(parsed);
        }
        console.log("[SaveSystem] Successfully loaded player profile.");
      } catch (e) {
        console.error("[SaveSystem] Corrupted save state, resetting.", e);
      }
    }
  }

  savePlayer(playerData) {
    try {
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(playerData));
      console.log("[SaveSystem] Auto-saved player state.");
    } catch (e) {
      console.error("[SaveSystem] Save failed.", e);
    }
  }

  clearSave() {
    localStorage.removeItem(this.SAVE_KEY);
    location.reload();
  }
}

window.GAMETHON.SaveSystem = new GamethonSaveSystem();
