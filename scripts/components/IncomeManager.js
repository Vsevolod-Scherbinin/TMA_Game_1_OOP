class IncomeManager {
  constructor(user) {
    this.user = user;
    this.scoreField = document.querySelector('.scoreArea__score');
    this.deltaIncomeScoreField = document.querySelector('.income_type_active').querySelector('.income__score');
    this.passiveIncomeScoreField = document.querySelector('.income_type_passive').querySelector('.income__score');
    this.epsilon = 0;
  }

  deltaCounter() {
    const currentDeltaLevel = deltaUpgrade.levels.find(upgrade => upgrade.level === this.user.activeUpgrades.find(upgrade => upgrade.id === 1).level);
    this.user.delta = currentDeltaLevel.delta;
    this.deltaIncomeScoreField.textContent = `${formatNumber(user.delta)}`;
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
    this.passiveIncomeScoreField.textContent = `${formatNumber(this.user.passiveIncome)}`;
  }

  passiveOnlineIncomeCounter() {
    if(timer < onlinePassiveTimeLimit) {
      const passiveIncome = this.passiveIncomeCounter();
      this.epsilon = this.epsilon + passiveIncome / 3600;
      if(this.epsilon > 1) {
        this.user.score = Math.round(this.user.score + this.epsilon);
        this.user.cummulativeIncome = Math.round(this.user.cummulativeIncome + this.epsilon);

        this.epsilon = 0;
      }
      // this.user.score = this.user.score + Math.round(passiveIncome / 3600);
      // this.user.cummulativeIncome = this.user.cummulativeIncome + Math.round(passiveIncome / 3600);

      timer++;
    }
  }

  async passiveOfflineIncomeCounter() {
    const limit = 3600 * passiveOfflineIncomeHoursLimit;
    // const seconds = await offlineTimeCounter();
    const seconds = this.user.offlineTimeCounter();
    // console.log('seconds', seconds);

    const passiveIncome = this.passiveIncomeCounter();

    if(seconds < limit) {
      return Math.round(passiveIncome / 3600 * seconds);
    } else {
      return Math.round(passiveIncome / 3600 * limit);
    }
  }

  cummulativeIncomeCounter() {
    this.user.cummulativeIncome = this.user.cummulativeIncome + this.user.delta;
    // this.saveUserDataLocal();
  }

  scoreCounter() {
    this.user.score = this.user.score + this.user.delta;
  }

  scoreRenderer() {
    this.scoreField.textContent = formatScoreNumber(user.score);
  }

}
