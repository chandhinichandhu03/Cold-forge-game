/* =========================================================
   GAMETHON — The Living AI Universe
   Player Profile & Progression Engine
   ========================================================= */

window.GAMETHON = window.GAMETHON || {};

class GamethonPlayerProfile {
  constructor() {
    this.data = JSON.parse(JSON.stringify(window.GAMETHON.Config.DEFAULT_PLAYER));
  }

  addXP(amount) {
    this.data.xp += amount;
    const nextLevelXP = this.data.level * 500;
    if (this.data.xp >= nextLevelXP) {
      this.data.level++;
      this.data.coins += 500;
      this.data.gems += 10;
      if (window.GAMETHON.UI) {
        window.GAMETHON.UI.notify(`🎉 LEVEL UP! You reached Level ${this.data.level}! Reward: +500 Coins, +10 Gems`);
      }
    }
    this.save();
  }

  addCoins(amount) {
    this.data.coins = (this.data.coins || 0) + Math.round(amount);
    this.save();
  }

  addPoints(amount) {
    this.data.points = (this.data.points || 0) + Math.round(amount);
    this.addXP(Math.round(amount / 2));
    this.save();
  }

  addDiamonds(amount) {
    this.data.diamonds = (this.data.diamonds || 0) + Math.round(amount);
    this.data.gems = (this.data.gems || 0) + Math.round(amount);
    this.save();
  }

  addGiftVouchers(amount) {
    this.data.giftVouchers = (this.data.giftVouchers || 0) + Math.round(amount);
    this.save();
  }

  getTotalWithdrawableCash() {
    const coinValue = Math.floor((this.data.coins || 0) / 10); // 10 Coins = ₹1
    const voucherValue = this.data.giftVouchers || 0; // ₹1 Voucher = ₹1 Cash
    return coinValue + voucherValue;
  }

  withdrawFunds(amountInRupees) {
    let cashNeeded = amountInRupees;

    // Deduct from gift vouchers first
    if ((this.data.giftVouchers || 0) > 0) {
      const deductVoucher = Math.min(this.data.giftVouchers, cashNeeded);
      this.data.giftVouchers -= deductVoucher;
      cashNeeded -= deductVoucher;
    }

    // Deduct remaining from coins
    if (cashNeeded > 0) {
      const coinsNeeded = cashNeeded * 10;
      this.data.coins = Math.max(0, (this.data.coins || 0) - coinsNeeded);
    }

    this.save();
  }

  unlockAchievement(achId) {
    if (!this.data.achievements.includes(achId)) {
      this.data.achievements.push(achId);
      const ach = window.GAMETHON.Config.ACHIEVEMENTS[achId];
      if (ach && window.GAMETHON.UI) {
        window.GAMETHON.UI.notify(`🏆 ACHIEVEMENT UNLOCKED: ${ach.icon} ${ach.name}!`);
      }
      this.addXP(200);
      this.save();
    }
  }

  save() {
    if (window.GAMETHON.SaveSystem) {
      window.GAMETHON.SaveSystem.savePlayer(this.data);
    }
    if (window.GAMETHON.App && typeof window.GAMETHON.App.renderHeaderUserBar === 'function') {
      window.GAMETHON.App.renderHeaderUserBar();
    }
  }

  load(savedData) {
    if (savedData) {
      this.data = Object.assign({}, this.data, savedData);
    }
  }
}

window.GAMETHON.PlayerProfile = new GamethonPlayerProfile();

