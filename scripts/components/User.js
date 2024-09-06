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
    this.saveSlotName = 'TMAGameUserData1';
  }

  loadUserData() {
    // console.log(Object.keys(this));

    const localUserData = localStorage.getItem(this.saveSlotName);
    // console.log(localUserData);

    if (localUserData === null) {
      console.log('New User');
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
      localStorage.setItem(this.saveSlotName, JSON.stringify(this));
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

  saveUserData() {
    localStorage.setItem(this.saveSlotName, JSON.stringify(this));
  }

  async saveTGLib(botToken) {

    try {
        const response = await fetch(`https://api.tglib.com/save`, { // URL для сохранения данных
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${botToken}` // Используйте токен для аутентификации
            },
            body: JSON.stringify(this),
        });

        if (!response.ok) {
            throw new Error('Ошибка при сохранении данных в TGLib');
        }

        const result = await response.json();
        console.log('Данные успешно сохранены:', result);
    } catch (error) {
        console.error('Ошибка:', error);
    }
  }
}
