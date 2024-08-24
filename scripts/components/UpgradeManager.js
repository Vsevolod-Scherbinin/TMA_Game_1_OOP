class UpgradeManager {
  constructor(
    user,
    scoreRenderer,
    deltaCounter,
    energyLimitRenderer,
    energyRecoveryLooper,
    passiveIncomeCounter,
    passiveIncomeRenderer,
  ) {
    // Check for Incapsulation
    this.user = user;
    this.scoreRenderer = scoreRenderer;
    this.deltaCounter = deltaCounter;
    this.energyLimitRenderer = energyLimitRenderer;
    this.energyRecoveryLooper = energyRecoveryLooper;
    this.passiveIncomeCounter = passiveIncomeCounter;
    this.passiveIncomeRenderer = passiveIncomeRenderer;
  }

  checkUpgradeAvailable() {
    const upgradeCards = document.querySelectorAll('.upgradeCard');
    upgradeCards.forEach((card) => {
      const costArea = card.querySelector('.upgradeCard__cost');
      const overlay = card.querySelector('.upgradeCard__overlay');
      if (costArea) {
        const cost = card.querySelector('.upgradeCard__cost').textContent;
        this.user.score < cost ? overlay.classList.add('upgradeCard__overlay_inactive') : overlay.classList.remove('upgradeCard__overlay_inactive');
      }
    });
  }

  _upgradeFinder(upgradesArray, name) {
    let foundUpgrade;
    // Review condition (Yandex)
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

    const currentUpgrade = upgradeFinder(upgradesArray, currentUpgradeName);
    // console.log('currentUpgrade', currentUpgrade);

    const userUpgrade = this.user[upgradesArray][currentUpgrade.id-1];
    const currentUpgradeLevel = currentUpgrade.levels.find(level => level.level === userUpgrade.level+1);

    let nextUpgradeLevel;
    (currentUpgradeLevel) && (nextUpgradeLevel = currentUpgrade.levels.find(level => level.level === currentUpgradeLevel.level+1));
    // console.log('currentUpgradeLevel', currentUpgradeLevel);

    // Make function purchase() {}
    if(currentUpgradeLevel) {
      if(this.user.score >= currentUpgradeLevel.cost) {
        this.user.score = this.user.score - currentUpgradeLevel.cost;
        this.user.expences = this.user.expences + currentUpgradeLevel.cost;
        this.scoreRenderer();
        if(currentUpgradeLevel.income !== undefined) {
          // console.log('Income');
          userUpgrade.level++;
          this.user.passiveIncome = this.passiveIncomeCounter();
          this.passiveIncomeRenderer();
        } else if (currentUpgradeLevel.delta !== undefined) {
          // console.log('Delta');
          userUpgrade.level++;
          this.deltaCounter();
        } else {
          // console.log('Energy');
          userUpgrade.level++;
          this.energyLimitRenderer();
          this.energyRecoveryLooper(true, 'fast');
        }

        // console.log('nextUpgradeLevel', nextUpgradeLevel);

        if(nextUpgradeLevel) {
          // userUpgrade.level++;
          currentUpgradeCard.querySelector('.upgradeCard__level').textContent = `lvl ${nextUpgradeLevel.level}`;
          currentUpgradeCard.querySelector('.upgradeCard__cost').textContent = `${formatNumberWithSpaces(nextUpgradeLevel.cost)}`;
          if(nextUpgradeLevel.income !== undefined) {
            currentUpgradeCard.querySelector('.upgradeCard__effect').textContent = `${formatNumberWithSpaces(nextUpgradeLevel.income)}`;
          } else if(nextUpgradeLevel.delta !== undefined) {
            currentUpgradeCard.querySelector('.upgradeCard__effect').textContent = `${formatNumberWithSpaces(nextUpgradeLevel.delta)}`;
          } else {
            currentUpgradeCard.querySelector('.upgradeCard__effect').textContent = `${formatNumberWithSpaces(nextUpgradeLevel.energyLimit)}`;
          }
        } else {
          currentUpgradeCard.querySelector('.upgradeCard__level').textContent = `lvl Max`;
          currentUpgradeCard.querySelector('.upgradeCard__costArea').remove();

          // style
          currentUpgradeCard.classList.add('.upgradeCard_inactive');
          currentUpgradeCard.removeEventListener('click', (evt) => {
            // addUpgrade(evt, upgradesArray);
            upgradeManager.addUpgrade(evt, upgradesArray);
          });
        }
        console.log('save');
        console.log(this.user);
        this.user.saveUserData();
      } else {
        // console.log('Недостаточно средств');
      }
    }
  }
}
