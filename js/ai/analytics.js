/* =========================================================
   GAMETHON — The Living AI Universe
   Analytics & Playstyle Machine Learning Engine
   ========================================================= */

window.GAMETHON = window.GAMETHON || {};

class GamethonAnalytics {
  constructor() {
    this.sessionData = {
      startTime: Date.now(),
      matchesPlayed: 0,
      totalDamageDealt: 0,
      totalPunchesThrown: 0,
      totalPunchesLanded: 0,
      hidingTimeSeconds: 0,
      playstyleVector: {
        aggression: 0.5,
        stealth: 0.5,
        puzzleSpeed: 0.5
      }
    };
  }

  recordPunch(landed = false, damage = 0) {
    this.sessionData.totalPunchesThrown++;
    if (landed) {
      this.sessionData.totalPunchesLanded++;
      this.sessionData.totalDamageDealt += damage;
    }
    this.updatePlaystyle();
  }

  updatePlaystyle() {
    const accuracy = this.sessionData.totalPunchesThrown > 0 
      ? (this.sessionData.totalPunchesLanded / this.sessionData.totalPunchesThrown) 
      : 0;
    
    // Dynamic aggression index adjustment
    if (accuracy > 0.65) {
      this.sessionData.playstyleVector.aggression = Math.min(1.0, this.sessionData.playstyleVector.aggression + 0.05);
    }
  }

  getSummary() {
    const accuracyPct = this.sessionData.totalPunchesThrown > 0 
      ? Math.round((this.sessionData.totalPunchesLanded / this.sessionData.totalPunchesThrown) * 100)
      : 0;

    return {
      accuracy: `${accuracyPct}%`,
      totalDamage: this.sessionData.totalDamageDealt,
      aggressionScore: Math.round(this.sessionData.playstyleVector.aggression * 100),
      stealthScore: Math.round(this.sessionData.playstyleVector.stealth * 100)
    };
  }
}

window.GAMETHON.Analytics = new GamethonAnalytics();
