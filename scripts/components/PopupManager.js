class PopupManager {
  constructor(
    user,
    scoreRenderer,
    achievementManager,
    dailyTasksManager,
  ) {
    this.user = user;
    this.scoreRenderer = scoreRenderer;
    this.achievementManager = achievementManager;
    this.dailyTasksManager = dailyTasksManager;
    this.popupTemplate = document.querySelector('#popup').content;
    this.popup = document.querySelector('.popup');
  }

  _taskCardReplacer(card) {
    const newCard = card.cloneNode(true);
    newCard.classList.remove('taskCard_active');
    // newCard.querySelector('.taskCard__icon').src = `./images/done.png`;
    card.replaceWith(newCard);
  }

  _wideCardReplacer(card) {
    const newCard = card.cloneNode(true);
    newCard.classList.remove('wideCard_active');
    // newCard.querySelector('.wideCard__icon').src = `./images/done.png`;
    card.replaceWith(newCard);
  }

  popupClose() {
    // this.popup.classList.add('popup_inactive');
    document.querySelector('.popup').remove();
  }

  cardReplacer() {
    const cards = document.querySelectorAll('.wideCard_type_achievement');
    cards.forEach((card) => {
      card.replaceWith(card.cloneNode(true));
    });
  }

  achievementsPopupOpen(obj, level) {
    const objLevel = obj.levels.find(obj => obj.level === level);
    const iconLevel = obj.levels.find(obj => obj.level === (level +1));

    const newPopup = this.popupTemplate.cloneNode(true);
    newPopup.querySelector('.popup').classList.add('popup_type_achievememts');
    newPopup.querySelector('.popup__title').textContent = obj.title;
    newPopup.querySelector('.popup__message').textContent = `${objLevel.description} и получите $${formatNumber(objLevel.effect)}`;
    newPopup.querySelector('.popup__image').src = iconLevel.mainIcon;
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
      document.querySelector('.popup_type_achievememts').remove();
    }
    newPopup.querySelector('.popup__button').addEventListener('click', submit, { once: true });
    page.append(newPopup);
  }

  offlineIncomePopupOpen(offlinePassiveIncome) {
    const newPopup = this.popupTemplate.cloneNode(true);
    newPopup.querySelector('.popup').classList.add('popup_type_passiveIncome');
    newPopup.querySelector('.popup__title').textContent = 'Ваш заработок!';
    newPopup.querySelector('.popup__message').textContent = `Поздравляем! Вы заработали $${formatNumber(offlinePassiveIncome)}`;
    newPopup.querySelector('.popup__image').src = './images/offline-passive-income-icon.png';
    const submit = () => {
      this.user.score = this.user.score + offlinePassiveIncome;
      this.user.cummulativeIncome = this.user.cummulativeIncome + offlinePassiveIncome;
      this.user.saveUserDataLocal();
      // incomeManager.scoreRenderer();
      document.querySelector('.popup_type_passiveIncome').remove();
    }
    newPopup.querySelector('.popup__button').addEventListener('click', submit, { once: true });
    page.append(newPopup);
  }

  referencePopupOpen(reward) {
    const newPopup = this.popupTemplate.cloneNode(true);
    newPopup.querySelector('.popup').classList.add('popup_type_reference');
    newPopup.querySelector('.popup__title').textContent = 'Поздравляем!';
    newPopup.querySelector('.popup__message').textContent = `Вы получили $${formatNumber(reward)} от друга`;
    newPopup.querySelector('.popup__image').src = './images/offline-passive-income-icon.png';
    const submit = () => {
      this.user.score = this.user.score + reward;
      this.user.cummulativeIncome = this.user.cummulativeIncome + reward;
      this.user.referenceBonus = 0;
      this.user.saveUserDataLocal();
      incomeManager.scoreRenderer();
      document.querySelector('.popup_type_reference').remove();
    }
    newPopup.querySelector('.popup__button').addEventListener('click', submit, { once: true });
    page.append(newPopup);
  }

  taskPopupOpen(reward, card, taskId) {
    const cardImage = card.querySelector('.taskCard__icon').src;
    const newPopup = this.popupTemplate.cloneNode(true);
    newPopup.querySelector('.popup').classList.add('popup_type_task');
    newPopup.querySelector('.popup__title').textContent = 'Поздравляем!';
    newPopup.querySelector('.popup__message').textContent = `Вы выполнили задание`;
    newPopup.querySelector('.popup__image').src = cardImage;
    // this.popup.querySelector('.popup__image').src = './images/check-incomplete.png';
    const submit = () => {
      this.user.score = this.user.score + reward;
      console.log(this.user.score);
      this.user.cummulativeIncome = this.user.cummulativeIncome + reward;
      this.user.tasks.push({id: taskId});
      this.user.saveUserDataLocal();
      incomeManager.scoreRenderer();
      this._taskCardReplacer(card);
      dailyTasksManager.newTasksAmountRenderer();
      document.querySelector('.popup_type_task').remove();
    }
    this.popup.querySelector('.popup__button').addEventListener('click', submit, { once: true });
    page.append(newPopup);
  }

  friendsPopupOpen(reward, card) {
    const newPopup = this.popupTemplate.cloneNode(true);
    newPopup.querySelector('.popup').classList.add('popup_type_friend');
    newPopup.querySelector('.popup__title').textContent = 'Поздравляем!';
    newPopup.querySelector('.popup__message').textContent = `Вы выполнили задание`;
    newPopup.querySelector('.popup__image').src = './images/done.png';
    const submit = () => {
      this.user.score = this.user.score + reward;
      console.log(this.user.score);
      this.user.cummulativeIncome = this.user.cummulativeIncome + reward;
      this.user.saveUserDataLocal();
      incomeManager.scoreRenderer();
      this._wideCardReplacer(card);
      document.querySelector('.popup_type_friend').remove();
    }
    newPopup.querySelector('.popup__button').addEventListener('click', submit, { once: true });
    page.append(newPopup);
  }

  daysPopupOpen(days) {
    const reward = dailyEnterRewards.find(obj => obj.day === days).amount;
    let word = '';
    days === 1
      ? word = 'день' : days > 4
      ? word = 'дней' : word = 'дня';
    const newPopup = this.popupTemplate.cloneNode(true);
    newPopup.querySelector('.popup').classList.add('popup_type_days');
    newPopup.querySelector('.popup__title').textContent = 'Поздравляем!';
    newPopup.querySelector('.popup__message').textContent = `Получите $${reward} за ${days} ${word} в игре подряд! Каждый 5-й день - x10`;
    newPopup.querySelector('.popup__image').src = './images/gift-icon.png';
    const submit = () => {
      this.user.score = this.user.score + reward;
      this.user.cummulativeIncome = this.user.cummulativeIncome + reward;
      this.user.saveUserDataLocal();
      incomeManager.scoreRenderer();
      document.querySelector('.popup_type_days').remove();
    }
    newPopup.querySelector('.popup__button').addEventListener('click', submit, { once: true });
    page.append(newPopup);
  }
}
