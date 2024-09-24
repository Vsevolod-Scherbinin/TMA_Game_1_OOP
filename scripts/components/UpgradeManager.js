class UpgradeManager {
  constructor(
    user,
    incomeManager,
    // scoreRenderer,
    // deltaCounter,
    energyLimitRenderer,
    energyRecoveryLooper,
    // passiveIncomeCounter,
    // passiveIncomeRenderer,
  ) {
    // Check for Incapsulation
    this.user = user;
    this.incomeManager = incomeManager;
    // this.scoreRenderer = scoreRenderer;
    // this.deltaCounter = deltaCounter;
    this.energyLimitRenderer = energyLimitRenderer;
    this.energyRecoveryLooper = energyRecoveryLooper;
    // this.passiveIncomeCounter = passiveIncomeCounter;
    // this.passiveIncomeRenderer = passiveIncomeRenderer;
    this.activeUpgradesField = document.querySelector('.upgradesScreen__upgradesField_type_active');
    this.passiveUpgradesField = document.querySelector('.upgradesScreen__upgradesField_type_passive');
  }

  _createUpgradeCard(elem, upgradesArray) {
    const upgradeCardElement = upgradeCardTemplate.cloneNode(true);
    upgradeCardElement.querySelector('.upgradeCard__title').textContent = elem.title;
    upgradeCardElement.querySelector('.upgradeCard__icon').src = elem.mainIcon;
    upgradeCardElement.querySelector('.upgradeCard__effectIcon').src = elem.effectIcon;
    const userUpgradesArray = user[upgradesArray].find(upgrade => upgrade.id === elem.id);

    const currentUpgrade = elem.levels.find(level => level.level === userUpgradesArray.level+1);
    const previousUpgrade = elem.levels.find(level => level.level === userUpgradesArray.level);

    if(currentUpgrade) {
      upgradeCardElement.querySelector('.upgradeCard').addEventListener('click', (evt) => {
        upgradeManager.addUpgrade(evt, upgradesArray);
      });

      upgradeCardElement.querySelector('.upgradeCard__level').textContent = `lvl ${currentUpgrade.level}`;
      upgradeCardElement.querySelector('.upgradeCard__cost').textContent = `${formatNumber(currentUpgrade.cost)}`;

      currentUpgrade.income !== undefined
        ? upgradeCardElement.querySelector('.upgradeCard__effect').textContent = `${formatNumber(currentUpgrade.income)}/час`
        : currentUpgrade.delta !== undefined
          ? upgradeCardElement.querySelector('.upgradeCard__effect').textContent = `${formatNumber(currentUpgrade.delta)}/тап`
          : upgradeCardElement.querySelector('.upgradeCard__effect').textContent = `${formatNumber(currentUpgrade.energyLimit)}`;
    } else {
      upgradeCardElement.querySelector('.upgradeCard__level').textContent = `Max`;
      upgradeCardElement.querySelector('.upgradeCard__costArea').remove();

      previousUpgrade.income !== undefined
        ? upgradeCardElement.querySelector('.upgradeCard__effect').textContent = `${formatNumber(previousUpgrade.income)}/час`
        : previousUpgrade.delta !== undefined
          ? upgradeCardElement.querySelector('.upgradeCard__effect').textContent = `${formatNumber(previousUpgrade.delta)}/тап`
          : upgradeCardElement.querySelector('.upgradeCard__effect').textContent = `${formatNumber(previousUpgrade.energyLimit)}`;
    }


    return upgradeCardElement;
  };

  allUpgradesRenderer() {
    console.log('Upgrades');

    activeUpgrades.forEach((elem) => {
      this.activeUpgradesField.append(this._createUpgradeCard(elem, 'activeUpgrades'));
    });
    passiveUpgrades.forEach((elem) => {
      this.passiveUpgradesField.append(this._createUpgradeCard(elem, 'passiveUpgrades'));
    });
  }

  checkUpgradeAvailable() {
    const upgradeCards = document.querySelectorAll('.upgradeCard');
    upgradeCards.forEach((card) => {
      const costArea = card.querySelector('.upgradeCard__costArea');
      if(costArea) {
        const cost = convertStringToNumber(costArea.querySelector('.upgradeCard__cost').textContent);
        if(this.user.score < cost) {
          costArea.classList.add('upgradeCard__costArea_inactive');
        } else {
          costArea.classList.remove('upgradeCard__costArea_inactive');
        }
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

    const currentUpgrade = this._upgradeFinder(upgradesArray, currentUpgradeName);
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

        this.incomeManager.scoreCounter();
        this.incomeManager.scoreRenderer();
        if(currentUpgradeLevel.income !== undefined) {
          // console.log('Income');
          userUpgrade.level++;
          this.user.passiveIncome = this.incomeManager.passiveIncomeCounter();
          this.incomeManager.passiveIncomeRenderer();
        } else if (currentUpgradeLevel.delta !== undefined) {
          // console.log('Delta');
          userUpgrade.level++;
          this.incomeManager.deltaCounter();
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
          currentUpgradeCard.querySelector('.upgradeCard__cost').textContent = `${formatNumber(nextUpgradeLevel.cost)}`;
          if(nextUpgradeLevel.income !== undefined) {
            currentUpgradeCard.querySelector('.upgradeCard__effect').textContent = `${formatNumber(nextUpgradeLevel.income)}/час`;
          } else if(nextUpgradeLevel.delta !== undefined) {
            currentUpgradeCard.querySelector('.upgradeCard__effect').textContent = `${formatNumber(nextUpgradeLevel.delta)}/тап`;
          } else {
            currentUpgradeCard.querySelector('.upgradeCard__effect').textContent = `${formatNumber(nextUpgradeLevel.energyLimit)}`;
          }
        } else {
          currentUpgradeCard.querySelector('.upgradeCard__level').textContent = `Max`;
          currentUpgradeCard.querySelector('.upgradeCard__costArea').remove();

          // style
          currentUpgradeCard.classList.add('.upgradeCard_inactive');
          currentUpgradeCard.removeEventListener('click', (evt) => {
            // addUpgrade(evt, upgradesArray);
            upgradeManager.addUpgrade(evt, upgradesArray);
          });
        }
        // console.log('save');
        // console.log(this.user);
        this.user.saveUserDataLocal();
      } else {
        // console.log('Недостаточно средств');
      }
    }
  }
}
