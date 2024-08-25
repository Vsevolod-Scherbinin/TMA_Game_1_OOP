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
    const passiveIncomeScoreField = document.querySelector('.passiveIncome__score');
    passiveIncomeScoreField.textContent = `${formatNumberWithSpaces(user.passiveIncome)}`;
  }

  passiveOnlineIncomeCounter() {
    if(timer < onlinePassiveTimeLimit) {
      const passiveIncome = this.passiveIncomeCounter();
      this.user.score = this.user.score + Math.round(passiveIncome / 3600);
      this.user.cummulativeIncome = this.user.cummulativeIncome + Math.round(passiveIncome / 3600);

      timer++;
    }
  }

  _offlineTimeCounter() {
    const closureDate = localStorage.getItem('closureTime');
    if(closureDate) {
      const now = new Date();
      const closureTime = new Date(closureDate);
      const timeDelta = now - closureTime
      const timeDeltaInSeconds = Math.floor(timeDelta / 1000);
      return timeDeltaInSeconds;
    }
  }


  passiveOfflineIncomeCounter() {
    const limit = 3600 * passiveOfflineIncomeHoursLimit;
    const seconds = this._offlineTimeCounter();
    const passiveIncome = this.passiveIncomeCounter();
    if(seconds < limit) {
      return Math.round(passiveIncome / 3600) * seconds;
    } else {
      return Math.round(passiveIncome / 3600) * limit;
    }
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
