const mainApi = new MainApi(BASE_URL, {'Content-Type': 'application/json'});

const saveSlotName = 'DataFromDB';

class User {
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
    friends,
    channels,
    // lastClosure,
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
    this.friends = friends;
    this.channels = channels;
    // this.lastClosure = lastClosure;
  }

  saveUserDataLocal() {
    localStorage.setItem(saveSlotName, JSON.stringify(this));
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

  saveUserDataDB() {
    console.log('Autosave', this);

    mainApi.saveUser(this)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
    });
  }

  async loadUserDataDB() {
    console.log('DataLoading', this.user.userId);

    // const response = await fetch(`${BASE_URL}/users/${this.user.userId}`);
    const response = await fetch(`https://api.scherbinin.mesto.nomoredomains.club/users/${this.user.userId}`);
    const data = await response.json();
    console.log('Данные пользователя загружены:', data);
    // return data;
    Object.keys(data).forEach((key) => {
      // console.log(key);
      // console.log(userDataModel[key]);
      // console.log(this[key]);

      this[key] = data[key];
    });
    if (this.activeUpgrades.length === 0) {
      activeUpgrades.forEach((upgrade) => {
        this.activeUpgrades.push({ id: upgrade.id, level: 0 });
      });
    }
    passiveUpgrades.forEach((upgrade) => {
      const isUpgradePresent = this.passiveUpgrades.some(obj => obj.id === upgrade.id);
      !isUpgradePresent && this.passiveUpgrades.push({ id: upgrade.id, level: 0 });
    });
    achievements.forEach((achievement) => {
      const isAchievementPresent = this.achievements.some(obj => obj.id === achievement.id);
      !isAchievementPresent && this.achievements.push({ id: achievement.id, level: 0 });
    });
    // localStorage.setItem(saveSlotName, JSON.stringify(this));
    // localStorage.setItem('DataFromDB', JSON.stringify(data));
    console.log('UserDBLoaded', this);

    localStorage.setItem('DataFromDB', JSON.stringify(this));
  }

  isFirstVisitToday() {
    const lastVisitDate = localStorage.getItem('lastVisitDate');
    const today = new Date().toLocaleDateString();

    if (!lastVisitDate || lastVisitDate !== today) {
      localStorage.setItem('lastVisitDate', today);
      return true; // Первое посещение за день
    }

    return false; // Не первое посещение за день
  }

  hasInvitedToday() {
    const invited = localStorage.getItem('invited');
    const today = new Date().toLocaleDateString();

    if (!invited || invited !== today) {
      // localStorage.setItem('invited', today);
      return false;
    }
    return true;
  }

  inviteFriends() {
    return new Promise((resolve) => {
      try {
        const inviteLink = `https://t.me/FirstTGTest_bot?start=referral_id=${tg.initDataUnsafe.user.id}`;
        const message = `Привет! Я нашел классную игру и хочу, чтобы ты тоже её попробовал!`;
        tg.sendData(message);
        const shareLink = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(message)}`;

        // window.open(shareLink, '_blank');
        setTimeout(() => {
          window.open(shareLink, '_blank');
      }, 0);
        resolve();
      } catch {console.log('Функция работает только в TG')}
    })
  }

  async checkUserSubscription(channelId, userId) {
    try {
      const response = await fetch(`${BASE_URL}/checkSubscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, channelId }),
      });

      const data = await response.json();
      if (data.subscribed) {
        console.log('Пользователь подписан на канал!');
      } else {
        console.log('Пользователь не подписан на канал!');
      }
      return data.subscribed;
    } catch (error) {
      console.error('Ошибка при проверке подписки:', error);
    }
  }
}
