class EnergyManager {
  constructor(user) {
    this.user = user;
    this.energyRecoveryTimeout;
    this.energyLimitField = document.querySelector('.energyArea__limit');
    this.energyScoreField = document.querySelector('.energyArea__score');
    this.btnMain = document.querySelector('.mainScreen__button');
    this.energyRecoveryInterval;
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
    this.energyLimitField.textContent = formatNumber(this.energyLimiterTotal());
  }

  energyRenderer() {
    this.energyScoreField.textContent = formatNumber(this.user.energy);
  }

  energyCounter() {
    if (this.user.energy >= this.user.delta) {
      this.user.energy = this.user.energy - this.user.delta;
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
    this.user.saveUserDataLocal();
  }

  energyRecoveryLooper(start, type) {
    let cycleTime;
    // const btnMain = document.querySelector('.mainScreen__button');
    type === 'normal' && (cycleTime = 1000);
    if(type === 'fast') {
      cycleTime = 25;
      this.btnMain.removeEventListener('click', mainClick);
    }
    if(start) {
      this.energyRecoveryInterval = setInterval(() => {
        // console.log(this.user.energy);

        this.energyRecovery();
        if(this.user.energy >= this.energyUpgradeLimiter()) {
          clearInterval(this.energyRecoveryInterval);
          type === 'fast' && this.btnMain.addEventListener('click', mainClick);
        }
      }, cycleTime);
    } else {
      clearInterval(this.energyRecoveryInterval);
    }
  }

  setEnergyRecoveryTimeout(start) {
    if(start) {
      this.energyRecoveryTimeout = setTimeout(() => {
        this.energyRecoveryLooper(true, 'normal');
      }, 1000);

    } else {
      clearTimeout(this.energyRecoveryTimeout);
    }
  }

  async offlineEnergyCounter() {
    const seconds = this.user.offlineTimeCounter();
    // const seconds = await offlineTimeCounter();
    const offlineEnergy = seconds * 3;
    const totalEnergy = this.user.energy + offlineEnergy;
    const energyLimit = this.energyUpgradeLimiter();
    console.log('totalEnergy', totalEnergy);

    if(totalEnergy < energyLimit) {
      this.user.energy = totalEnergy;
    } else {
      this.user.energy = energyLimit;
    }
  }
}
