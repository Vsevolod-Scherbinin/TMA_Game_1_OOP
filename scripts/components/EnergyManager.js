class EnergyManager {
  constructor(user) {
    this.user = user;
  }

  energyUpgradeLimiter() {
    const currentEnergyLevel = energyUpgrade.levels.find(upgrade => upgrade.level === this.user.activeUpgrades.find(upgrade => upgrade.id === 2).level);
    const currentEnergyLimit = currentEnergyLevel.energyLimit;
    return currentEnergyLimit;
  }

  energyAchievementLimiter() {
    const energyAchievement = achievements.find(obj => obj.id === 5);
    const userAchGathered = this.user.gatheredAchievements.find(obj => obj.id === energyAchievement.id);
    if(userAchGathered) {
      const currentEnergyAchievementLimit = energyAchievement.levels.find(obj => obj.level = userAchGathered.level).effect;
      console.log(currentEnergyAchievementLimit);
      return currentEnergyAchievementLimit;
    }
  }

  energyLimiterTotal() {
    let total;
    // energyAchievementLimiter()
    //   ? total = this.energyUpgradeLimiter() + energyAchievementLimiter()
      // : total = this.energyUpgradeLimiter();
      total = this.energyUpgradeLimiter();
    return total;
  }

  energyLimitRenderer() {
    const energyLimitField = document.querySelector('.energyArea__limit');
    energyLimitField.textContent = formatNumberWithSpaces(this.energyLimiterTotal());
  }

  energyRenderer() {
    const energyScoreField = document.querySelector('.energyArea__score');
    energyScoreField.textContent = formatNumberWithSpaces(this.user.energy);
  }

  energyCounter() {
    if (this.user.energy >= this.user.delta) {
      this.user.energy = this.user.energy - this.user.delta;
    }
  }

  energyRecoveryLooper(start, type) {
    let energyRecoveryInterval;
    let cycleTime;
    type === 'normal' && (cycleTime = 1000);
    if(type === 'fast') {
      cycleTime = 25;
      btnMain.removeEventListener('click', mainClick);
    }
    if(start) {
      energyRecoveryInterval = setInterval(() => {
        energyRecovery();
        if(this.user.energy >= this.energyUpgradeLimiter()) {
          clearInterval(energyRecoveryInterval);
          type === 'fast' && btnMain.addEventListener('click', mainClick);
        }
      }, cycleTime);
    } else {
      clearInterval(energyRecoveryInterval);
    }
  }

  energyRecovery() {
    if(this.user.energy < this.energyUpgradeLimiter()) {
      this.user.energy = this.user.energy + 3;
      if(this.user.energy >= this.energyUpgradeLimiter()) {
        this.user.energy = this.energyUpgradeLimiter();
      }
    }
    this.energyRenderer();
    this.user.saveUserData();
  }

  setEnergyRecoveryTimeout(start) {
    if(start) {
      energyRecoveryTimeout = setTimeout(() => {
        this.energyRecoveryLooper(true, 'normal');
      }, 1000);

    } else {
      clearTimeout(energyRecoveryTimeout);
    }
  }

}
