class PopupManager {
  constructor(
    user,
    scoreRenderer,
    achievementManager,
    // achievementGathering,
    // achievementsLevelCheck,
  ) {
    this.user = user;
    this.scoreRenderer = scoreRenderer;
    this.achievementManager = achievementManager;
    // this.achievementGathering = achievementGathering;
    // this.achievementsLevelCheck = achievementsLevelCheck;
    this.popup = document.querySelector('.popup');
  }

  _cardReplacer(card) {
    const newCard = card.cloneNode(true);
    newCard.classList.remove('wideCard_active');
    newCard.querySelector('.wideCard__icon').src = `./images/done.png`;
    card.replaceWith(newCard);
  }

  popupClose() {
    this.popup.classList.add('popup_inactive');
  }

  cardReplacer() {
    const cards = document.querySelectorAll('.wideCard_type_achievement');
    cards.forEach((card) => {
      card.replaceWith(card.cloneNode(true));
    });
  }

  achievementsPopupOpen(obj, level) {
    console.log(this.popup);
    console.log('obj', obj);

    const objLevel = obj.levels.find(obj => obj.level === level);
    const iconLevel = obj.levels.find(obj => obj.level === (level +1));
    console.log('objLevel', objLevel);

    this.popup.classList.remove('popup_inactive');
    this.popup.querySelector('.popup__title').textContent = obj.title;
    this.popup.querySelector('.popup__message').textContent = `${objLevel.description} и получите $${formatNumberWithSpaces(objLevel.effect)}`;
    this.popup.querySelector('.popup__image').src = iconLevel.mainIcon;
    // console.log(objLevel.effect);
    const card = document.querySelector(`.wideCard_id_${obj.id}`);
    const submit = () => {
      this.achievementManager.achievementGathering(obj, level+1);
      // if (obj.metric === 'energyLimit') {
      //   user.energyLimit = this.user.energyLimit + objLevel.effect
      // } else {
        user.score = this.user.score + objLevel.effect;
        this.user.cummulativeIncome = this.user.cummulativeIncome + objLevel.effect;
      // }

      const index = this.user.activeAchievements.indexOf(this.user.activeAchievements.find(object => object.id === obj.id));
      this.user.activeAchievements.splice(index, 1);
      // this.user.activeAchievements = this.user.activeAchievements.filter(object => obj.id !== )
      this.user.saveUserDataLocal();
      this.cardReplacer();
      this.achievementManager.activeOnloadCorrection();
      this.achievementManager.achievementsLevelCheck();
      this.scoreRenderer();
      this.popupClose();
    }
    this.popup.querySelector('.popup__button').addEventListener('click', submit, { once: true });
  }

  offlineIncomePopupOpen(offlinePassiveIncome) {
    this.popup.classList.remove('popup_inactive');
    this.popup.querySelector('.popup__title').textContent = 'Ваш заработок!';
    this.popup.querySelector('.popup__message').textContent = `Поздравляем! Вы заработали $${formatNumberWithSpaces(offlinePassiveIncome)}`;
    this.popup.querySelector('.popup__image').src = './images/offline-passive-income-icon.png';
    const submit = () => {
      console.log('Submit');

      this.user.score = this.user.score + offlinePassiveIncome;
      this.user.cummulativeIncome = this.user.cummulativeIncome + offlinePassiveIncome;
      this.user.saveUserDataLocal();
      // incomeManager.scoreRenderer();
      this.popupClose();
    }
    this.popup.querySelector('.popup__button').addEventListener('click', submit, { once: true });
  }

  referencePopupOpen(reward, dbData) {
    this.popup.classList.remove('popup_inactive');
    this.popup.querySelector('.popup__title').textContent = 'Поздравляем!';
    this.popup.querySelector('.popup__message').textContent = `Вы получили $${formatNumberWithSpaces(reward)} от друга`;
    this.popup.querySelector('.popup__image').src = './images/offline-passive-income-icon.png';
    const submit = () => {
      console.log('Submit');
      //this.user.referenceBonus = 0;
      this.user.score = this.user.score + reward;
      this.user.cummulativeIncome = this.user.cummulativeIncome + reward;
      this.user.referenceBonus = 0;
      this.user.saveUserDataLocal();
      // incomeManager.scoreRenderer();
      this.popupClose();
    }
    this.popup.querySelector('.popup__button').addEventListener('click', submit, { once: true });
  }

  taskPopupOpen(reward, card, taskId) {
    this.popup.classList.remove('popup_inactive');
    this.popup.querySelector('.popup__title').textContent = 'Поздравляем!';
    this.popup.querySelector('.popup__message').textContent = `Вы выполнили задание`;
    this.popup.querySelector('.popup__image').src = './images/done.png';
    const submit = () => {
      console.log('Submit');
      console.log('score', this.user.score);
      console.log('reward', reward);

      this.user.score = this.user.score + reward;
      console.log(this.user.score);
      this.user.cummulativeIncome = this.user.cummulativeIncome + reward;
      this.user.tasks.push({id: taskId});
      this.user.saveUserDataLocal();
      incomeManager.scoreRenderer();

      this._cardReplacer(card);

      this.popupClose();
    }
    this.popup.querySelector('.popup__button').addEventListener('click', submit, { once: true });
  }

  friendsPopupOpen(reward, card) {
    this.popup.classList.remove('popup_inactive');
    this.popup.querySelector('.popup__title').textContent = 'Поздравляем!';
    this.popup.querySelector('.popup__message').textContent = `Вы выполнили задание`;
    this.popup.querySelector('.popup__image').src = './images/done.png';
    const submit = () => {
      console.log('Submit');
      console.log('score', this.user.score);
      console.log('reward', reward);

      this.user.score = this.user.score + reward;
      console.log(this.user.score);
      this.user.cummulativeIncome = this.user.cummulativeIncome + reward;
      this.user.saveUserDataLocal();
      incomeManager.scoreRenderer();

      this._cardReplacer(card)

      this.popupClose();
    }
    this.popup.querySelector('.popup__button').addEventListener('click', submit, { once: true });
  }

  daysPopupOpen(reward, days) {
    let word = '';
    days === 1
      ? word = 'день' : days > 4
      ? word = 'дней' : word = 'дня';
    this.popup.classList.remove('popup_inactive');
    this.popup.querySelector('.popup__title').textContent = 'Поздравляем!';
    this.popup.querySelector('.popup__message').textContent = `Получите $${reward} за ${days} ${word} в игре подряд!`;
    this.popup.querySelector('.popup__image').src = './images/offline-passive-income-icon.png';
    const submit = () => {
      console.log('Submit');
      console.log('score', this.user.score);
      console.log('reward', reward);

      this.user.score = this.user.score + reward;
      console.log(this.user.score);
      this.user.cummulativeIncome = this.user.cummulativeIncome + reward;
      this.user.saveUserDataLocal();
      incomeManager.scoreRenderer();

      this.popupClose();
    }
    this.popup.querySelector('.popup__button').addEventListener('click', submit, { once: true });
  }
}
