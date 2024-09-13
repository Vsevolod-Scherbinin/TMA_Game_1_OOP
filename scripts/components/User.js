const mainApi = new MainApi(BASE_URL, {'Content-Type': 'application/json'});

const saveSlotName = 'TMAGameUserData1';

class User {
  // constructor(userData) {
  //   this._userData = userData;
  // }
  constructor({
    userId,
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
    referenceBonus,
    referrals
  }) {
    this.userId = userId;
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
    this.referenceBonus = referenceBonus;
    this.referrals = referrals;
  }

  loadUserData() {
    // console.log(Object.keys(this));

    const localUserData = localStorage.getItem(saveSlotName);
    // console.log(localUserData);

    if (localUserData === null) {
      console.log('New User');
      Object.keys(userDataModel).forEach((key) => {
        // console.log(key);
        // console.log(userDataModel[key]);
        // console.log(this[key]);

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
      localStorage.setItem(saveSlotName, JSON.stringify(this));
    } else {
      console.log('Old User');
      Object.keys(userDataModel).forEach((key) => {
        // console.log(key);
        // console.log(this[key]);

        this[key] = JSON.parse(localUserData)[key];
        this[key] === undefined && (this[key] = userDataModel[key]);
      });

    }
  }

  saveUserDataLocal() {
    localStorage.setItem(saveSlotName, JSON.stringify(this));
  }

  saveUserDataDB() {
    console.log('this', this);

    mainApi.saveUser(this)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
    });
  }
}
