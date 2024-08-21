class User {
  // constructor(userData) {
  //   this._userData = userData;
  // }
  constructor({
    score,
    delta,
    energy,
    cummulativeIncome,
    expences,
    taps,
    activeIncome,
    passiveIncome,
    level,
    timeOnline, //seconds
    activeUpgrades,
    passiveUpgrades,
    tasks,
    achievements,
    gatheredAchievements,
  }) {
    this.score = score;
    this.delta = delta;
    this.energy = energy;
    this.cummulativeIncome = cummulativeIncome;
    this.expences = expences;
    this.taps = taps;
    this.activeIncome = activeIncome;
    this.passiveIncome = passiveIncome;
    this.level = level;
    this.timeOnline = timeOnline; //seconds
    this.activeUpgrades = activeUpgrades;
    this.passiveUpgrades = passiveUpgrades;
    this.tasks = tasks;
    this.achievements = achievements;
    this.gatheredAchievements = gatheredAchievements;
  }

  loadUserData() {
    console.log(Object.keys(this));

    const localUserData = JSON.parse(localStorage.getItem('TMAGameUserData1'));

    if (localUserData === null) {
      Object.keys(userDataModel).forEach((key) => {
        console.log(key);
        console.log(userDataModel[key]);
        console.log(this[key]);

        this[key] = userDataModel[key];
      });
      activeUpgrades.forEach((upgrade) => {
        this.activeUpgrades.push({ id: upgrade.id, level: 0 });
      });
      passiveUpgrades.forEach((upgrade) => {
        const isUpgradePresent = this.passiveUpgrades.some(obj => obj.id === upgrade.id);
        !isUpgradePresent && this.passiveUpgrades.push({ id: upgrade.id, level: 0 });
      });
      achievements.forEach((achievement) => {
        this.achievements.push({ id: achievement.id, level: 0 });
      });
      localStorage.setItem('TMAGameUserData', JSON.stringify(this));
    } else {
      Object.keys(userDataModel).forEach((key) => {
        console.log(key);
        console.log(this[key]);


        this[key] = localUserData[key];
        this[key] === undefined && (this[key] = userDataModel[key]);
      });
    }
  }

  saveUserData() {
    localStorage.setItem('TMAGameUserData1', JSON.stringify(this));
  }
}
