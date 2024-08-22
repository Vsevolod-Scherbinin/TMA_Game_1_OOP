class EnergyManager {
  constructor(user) {
    this.user = user;
  }

  energyUpgradeLimiter() {
    const currentEnergyLevel = energyUpgrade.levels.find(upgrade => upgrade.level === user.activeUpgrades.find(upgrade => upgrade.id === 2).level);
    const currentEnergyLimit = currentEnergyLevel.energyLimit;
    return currentEnergyLimit;
  }

  energyAchievementLimiter() {
    const energyAchievement = achievements.find(obj => obj.id === 5);
    const userAchGathered = this.user.gatheredAchievements.find(obj => obj.id === energyAchievement.id);
    if (userAchGathered) {
      return energyAchievement.levels.find(obj => obj.level = userAchGathered.level).effect;
    }
  }

  energyLimiterTotal() {
    let total;
    // energyAchievementLimiter()
    //   ? total = energyUpgradeLimiter() + energyAchievementLimiter()
      // : total = energyUpgradeLimiter();
      total = energyUpgradeLimiter();
    return total;
  }

  energyLimitRenderer() {
    const energyLimitField = document.querySelector('.energyArea__limit');
    energyLimitField.textContent = formatNumberWithSpaces(this.energyLimiterTotal());
  }

  energyRenderer() {
    console.log('class');

    energyScoreField.textContent = formatNumberWithSpaces(this.user.energy);
  }

  energyCounter() {
    if (this.user.energy >= this.user.delta) {
      this.user.energy = this.user.energy - this.user.delta;
      // this.energyRecoveryLooper(true, 'fast');
    }
  }

  energyRecovery() {
    if (this.user.energy < this.energyUpgradeLimiter()) {
      this.user.energy = this.user.energy + 3;
      if (this.user.energy >= this.energyUpgradeLimiter()) {
        this.user.energy = this.energyUpgradeLimiter();
        this.energyRenderer();
        // this.saveUserData();
      }
    }
  }

  energyRecoveryLooper(start, type) {
    let cycleTime;
    type === 'normal' && (cycleTime = 1000);
    if (type === 'fast') {
      cycleTime = 25;
      btnMain.removeEventListener('click', mainClick);
      if (start) {
        energyRecoveryInterval = setInterval(() => {
          this.energyRecovery();
          if (this.user.energy >= this.energyUpgradeLimiter()) {
            clearInterval(energyRecoveryInterval);
            type === 'fast' && btnMain.addEventListener('click', mainClick);
          }
        }, cycleTime);
      } else {
        clearInterval(energyRecoveryInterval);
      }
    }
  }
}
