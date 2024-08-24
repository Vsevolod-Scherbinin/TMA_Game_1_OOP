class PopupManager {
  constructor(
    user,
    scoreRenderer,
    achievementGathering,
    achievementsLevelCheck,
  ) {
    this.user = user;
    this.scoreRenderer = scoreRenderer;
    this.achievementGathering = achievementGathering;
    this.achievementsLevelCheck = achievementsLevelCheck;
    this.popup = document.querySelector('.popup');
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

  popupOpen(obj, level) {
    console.log(this.popup);
    console.log('obj', obj);

    const objLevel = obj.levels.find(obj => obj.level === level);
    this.popup.classList.remove('popup_inactive');
    this.popup.querySelector('.popup__title').textContent = obj.title;
    this.popup.querySelector('.popup__message').textContent = `${objLevel.description} и получите $${formatNumberWithSpaces(objLevel.effect)}`;
    this.popup.querySelector('.popup__image').src = objLevel.mainIcon;
    console.log(objLevel.effect);
    const card = document.querySelector(`.wideCard_id_${obj.id}`);
    const submit = () => {
      this.achievementGathering(obj, level);
      if (obj.metric === 'energyLimit') {
        user.energyLimit = user.energyLimit + objLevel.effect
      } else {
        user.score = user.score + objLevel.effect;
        this.user.cummulativeIncome = user.cummulativeIncome + objLevel.effect;

      }
      this.cardReplacer();
      this.achievementsLevelCheck();
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

      this.user.score = user.score + offlinePassiveIncome;
      this.user.cummulativeIncome = user.cummulativeIncome + offlinePassiveIncome;
      this.user.saveUserData();
      // incomeManager.scoreRenderer();
      this.popupClose();
    }
    this.popup.querySelector('.popup__button').addEventListener('click', submit, { once: true });
  }

}
