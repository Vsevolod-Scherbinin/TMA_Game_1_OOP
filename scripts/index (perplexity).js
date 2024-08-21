class AchievementManager {
  constructor(userData) {
    this.userData = userData;
  }

  achievementGathering(obj, level) {
    const newAchievement = { id: obj.id, level: level };
    const isObjectPresent = this.userData.gatheredAchievements.some(obj => obj.id === newAchievement.id);

    if (isObjectPresent) {
      const gatheredAchievement = this.userData.gatheredAchievements.find(obj => obj.id === newAchievement.id);
      if (gatheredAchievement.level < newAchievement.level) {
        this.userData.gatheredAchievements.splice(this.userData.gatheredAchievements.indexOf(gatheredAchievement), 1);
        this.userData.gatheredAchievements.push(newAchievement);
      } else {
        this.userData.gatheredAchievements.push(newAchievement);
      }
    }
  }

  popupOpen(obj, level) {
    const objLevel = obj.levels.find(obj => obj.level === level);
    popup.classList.remove('popup_inactive');
    popup.querySelector('.popup__title').textContent = obj.title;
    popup.querySelector('.popup__message').textContent = `${objLevel.description} и получите $${this.formatNumberWithSpaces(objLevel.effect)}`;
    popup.querySelector('.popup__image').src = objLevel.mainIcon;
  }

  formatNumberWithSpaces(number) {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2, useGrouping: true }).format(number).replace(/,/g, '');
  }
}

class IncomeManager {
  constructor(userData) {
    this.userData = userData;
  }

  deltaCounter() {
    const currentDeltaLevel = deltaUpgrade.levels.find(upgrade => upgrade.level === this.userData.activeUpgrades.find(upgrade => upgrade.id === 1).level);
    this.userData.delta = currentDeltaLevel.delta;
  }

  passiveIncomeCounter() {
    let passiveIncome = 0;
    this.userData.passiveUpgrades.forEach((item) => {
      const upgradeFromConstant = passiveUpgrades.find(upgrade => upgrade.id === item.id);
      const upgradeFromConstantLevel = upgradeFromConstant.levels.find(upgrade => upgrade.level === item.level);
      passiveIncome = passiveIncome + upgradeFromConstantLevel.income;
    });
    return passiveIncome;
  }

  cummulativeIncomeCounter() {
    this.userData.cummulativeIncome = this.userData.cummulativeIncome + this.userData.delta;
    this.saveUserData();
  }

  scoreCounter() {
    this.userData.score = this.userData.score + this.userData.delta;
  }
}

class EnergyManager {
  constructor(userData) {
    this.userData = userData;
  }

  energyUpgradeLimiter() {
    const currentEnergyLevel = energyUpgrade.levels.find(upgrade => upgrade.level === this.userData.activeUpgrades.find(upgrade => upgrade.id === 2).level);
    return currentEnergyLevel.energyLimit;
  }

  energyAchievementLimiter() {
    const energyAchievement = achievements.find(obj => obj.id === 5);
    const userAchGathered = this.userData.gatheredAchievements.find(obj => obj.id === energyAchievement.id);
    if (userAchGathered) {
      return energyAchievement.levels.find(obj => obj.level = userAchGathered.level).effect;
    }
  }

  energyLimitRenderer() {
    energyLimitField.textContent = this.formatNumberWithSpaces(this.energyLimiterTotal());
  }

  energyRenderer() {
    energyScoreField.textContent = this.formatNumberWithSpaces(this.userData.energy);
  }

  energyCounter() {
    if (this.userData.energy >= this.userData.delta) {
      this.userData.energy = this.userData.energy - this.userData.delta;
      this.energyRecoveryLooper(true, 'fast');
    }
  }

  energyRecovery() {
    if (this.userData.energy < this.energyUpgradeLimiter()) {
      this.userData.energy = this.userData.energy + 3;
      if (this.userData.energy >= this.energyUpgradeLimiter()) {
        this.userData.energy = this.energyUpgradeLimiter();
        this.energyRenderer();
        this.saveUserData();
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
          if (this.userData.energy >= this.energyUpgradeLimiter()) {
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

class LevelManager {
  constructor(userData) {
    this.userData = userData;
  }

  levelLimitCounter(level) {
    const a = 30;
    const c = 70;
    const levelLimit = a * Math.pow(level, 2) + c;
    return levelLimit;
  }

  levelRewarder(prevLevel, currentLevel) {
    const levelDelta = currentLevel - prevLevel;
    const rewardMultiplier = 10;
    let reward;
    for (let i = prevLevel; i < currentLevel; i++) {
      reward = this.levelLimitCounter(i) * rewardMultiplier;
      this.userData.score = this.userData.score + reward;
    }
  }

  levelUp() {
    const prevLimit = this.levelLimitCounter(this.userData.level - 1);
    const currentLimit = this.levelLimitCounter(this.userData.level);
    if (this.userData.cummulativeIncome > currentLimit) {
      this.userData.level++;
      this.levelRewarder(this.userData.level - 1, this.userData.level);
      this.progressBarRenderer(prevLimit, currentLimit);
      this.levelRenderer();
    }
  }
}

class UserManager {
  constructor(userData) {
    this.userData = userData;
  }

  loadUserData() {
    if (localUserData === null) {
      Object.keys(userDataModel).forEach((key) => {
        this.userData[key] = userDataModel[key];
      });
      activeUpgrades.forEach((upgrade) => {
        this.userData.activeUpgrades.push({ id: upgrade.id, level: 0 });
      });
      passiveUpgrades.forEach((upgrade) => {
        const isUpgradePresent = this.userData.passiveUpgrades.some(obj => obj.id === upgrade.id);
        !isUpgradePresent && this.userData.passiveUpgrades.push({ id: upgrade.id, level: 0 });
      });
      achievements.forEach((achievement) => {
        this.userData.achievements.push({ id: achievement.id, level: 0 });
      });
      localStorage.setItem('TMAGameUserData', JSON.stringify(this.userData));
    } else {
      Object.keys(userDataModel).forEach((key) => {
        this.userData[key] = localUserData[key];
        this.userData[key] === undefined && (this.userData[key] = userDataModel[key]);
      });
    }
  }

  saveUserData() {
    localStorage.setItem('TMAGameUserData', JSON.stringify(this.userData));
  }
}

class UpgradeManager {
  constructor(userData) {
    this.userData = userData;
  }

  checkUpgradeAvailable() {
    const upgradeCards = document.querySelectorAll('.upgradeCard');
    upgradeCards.forEach((card) => {
      const costArea = card.querySelector('.upgradeCard__cost');
      const overlay = card.querySelector('.upgradeCard__overlay');
      if (costArea) {
        const cost = card.querySelector('.upgradeCard__cost').textContent;
        this.userData.score < cost ? overlay.classList.add('upgradeCard__overlay_inactive') : overlay.classList.remove('upgradeCard__overlay_inactive');
      }
    });
  }

  upgradeFinder(upgradesArray, name) {
    let foundUpgrade;
    if (upgradesArray == 'activeUpgrades') {
      foundUpgrade = activeUpgrades.find(upgrade => upgrade.title === name);
    } else {
      foundUpgrade = passiveUpgrades.find(upgrade => upgrade.title === name);
    }
    return { id: foundUpgrade.id, levels: foundUpgrade.levels };
  }

  addUpgrade(evt, upgradesArray) {
    const currentUpgradeCard = evt.target.closest('.upgradeCard');
    const currentUpgradeName = currentUpgradeCard.querySelector('.upgradeCard__title').textContent;
    const currentUpgrade = this.upgradeFinder(upgradesArray, currentUpgradeName);
    const userUpgrade = this.userData[upgradesArray][currentUpgrade.id - 1];
    const currentUpgradeLevel = currentUpgrade.levels.find(level => level.level === userUpgrade.level + 1);
    let nextUpgradeLevel;
    (currentUpgradeLevel) && (nextUpgradeLevel = currentUpgrade.levels.find(level => level.level === currentUpgradeLevel.level + 1));

    if (currentUpgradeLevel) {
      if (this.userData.score >= currentUpgradeLevel.cost) {
        this.userData.score = this.userData.score - currentUpgradeLevel.cost;
        this.userData.expences = this.userData.expences + currentUpgradeLevel.cost;
        scoreRenderer();
        if (currentUpgradeLevel.income !== undefined) {
          userUpgrade.level++;
          this.userData.passiveIncome = this.passiveIncomeCounter();
          passiveIncomeRenderer();
        } else if (currentUpgradeLevel.delta !== undefined) {
          userUpgrade.level++;
          this.deltaCounter();
        } else {
          userUpgrade.level++;
          this.energyLimitRenderer();
          this.energyRecoveryLooper(true, 'fast');
          if (nextUpgradeLevel) {
            currentUpgradeCard.querySelector('.upgradeCard__level').textContent = `lvl ${nextUpgradeLevel.level}`;
            currentUpgradeCard.querySelector('.upgradeCard__cost').textContent = `${this.formatNumberWithSpaces(nextUpgradeLevel.cost)}`;
            if (nextUpgradeLevel.income !== undefined) {
              currentUpgradeCard.querySelector('.upgradeCard__effect').textContent = `+${this.formatNumberWithSpaces(nextUpgradeLevel.income)}`;
            } else if (nextUpgradeLevel.delta !== undefined) {
              currentUpgradeCard.querySelector('.upgradeCard__effect').textContent = `+${this.formatNumberWithSpaces(nextUpgradeLevel.delta)}`;
            } else {
              currentUpgradeCard.querySelector('.upgradeCard__effect').textContent = `+${this.formatNumberWithSpaces(nextUpgradeLevel.energyLimit)}`;
            }
          } else {
            currentUpgradeCard.querySelector('.upgradeCard__level').textContent = `lvl Max`;
            currentUpgradeCard.querySelector('.upgradeCard__costArea').remove();
            currentUpgradeCard.classList.add('.upgradeCard_inactive');
            currentUpgradeCard.removeEventListener('click', (evt) => { this.addUpgrade(evt, upgradesArray); });
          }
          this.saveUserData();
        }
      }
    }
  }
}

// Использование классов
const userData = {
  // ...
};

const achievementManager = new AchievementManager(userData);
const incomeManager = new IncomeManager(userData);
const energyManager = new EnergyManager(userData);
const levelManager = new LevelManager(userData);
const userManager = new UserManager(userData);
const upgradeManager = new UpgradeManager(userData);

// Вызов методов
achievementManager.achievementGathering(obj, level);
incomeManager.deltaCounter();
energyManager.energyLimitRenderer();
levelManager.levelUp();
userManager.loadUserData();
upgradeManager.checkUpgradeAvailable();
