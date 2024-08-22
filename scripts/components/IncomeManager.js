class IncomeManager {
  constructor(user) {
    this.user = user;
  }

  deltaCounter() {
    const currentDeltaLevel = deltaUpgrade.levels.find(upgrade => upgrade.level === this.user.activeUpgrades.find(upgrade => upgrade.id === 1).level);
    this.user.delta = currentDeltaLevel.delta;
  }

  passiveIncomeCounter() {
    let passiveIncome = 0;
    this.user.passiveUpgrades.forEach((item) => {
      const upgradeFromConstant = passiveUpgrades.find(upgrade => upgrade.id === item.id);
      const upgradeFromConstantLevel = upgradeFromConstant.levels.find(upgrade => upgrade.level === item.level);
      passiveIncome = passiveIncome + upgradeFromConstantLevel.income;
    });
    return passiveIncome;
  }

  passiveIncomeRenderer() {
    console.log('PI Render');

    const passiveIncomeScoreField = document.querySelector('.passiveIncome__score');
    passiveIncomeScoreField.textContent = `+${formatNumberWithSpaces(user.passiveIncome)}`;
  }

  cummulativeIncomeCounter() {
    this.user.cummulativeIncome = this.user.cummulativeIncome + this.user.delta;
    // this.saveUserData();
  }

  scoreCounter() {
    this.user.score = this.user.score + this.user.delta;
  }

  scoreRenderer() {
    const scoreField = document.querySelector('.scoreArea__score');
    scoreField.textContent = formatNumberWithSpaces(user.score);
  }
}
