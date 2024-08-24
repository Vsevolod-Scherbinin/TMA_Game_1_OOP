class Popup {
  constructor(selector) {
    this.selector = selector;
    this.popup = document.querySelector(this.selector);
  }

  popupClose() {
    this.popup.classList.add('this.popup_inactive');
  }

  popupOpen(obj, level) {
    console.log(this.popup);

    const objLevel = obj.levels.find(obj => obj.level === level);
    this.popup.classList.remove('.popup_inactive');
    this.popup.querySelector('.popup__title').textContent = obj.title;
    this.popup.querySelector('.popup__message').textContent = `${objLevel.description} и получите $${formatNumberWithSpaces(objLevel.effect)}`;
    this.popup.querySelector('.popup__image').src = objLevel.mainIcon;
    console.log(objLevel.effect);
    const card = document.querySelector(`.wideCard_id_${obj.id}`);
    const submit = () => {
      achievementGathering(obj, level);
      obj.metric === 'energyLimit'
        ? user.energyLimit = user.energyLimit + objLevel.effect
        : user.score = user.score + objLevel.effect;
      cardReplacer();
      achievementsLevelCheck();
      scoreRenderer();
      this.popupClose();
    }
    this.popup.querySelector('.popup__button').addEventListener('click', submit, { once: true });
  }

}
