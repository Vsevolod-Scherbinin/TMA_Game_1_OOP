class FriendsManager {
  constructor(user) {
    this.user = user;
    this.wideCardTemplate = document.querySelector('#wideCard').content;
    this.achievementCardsField = document.querySelector('.achievementsScreen__cardField');
  }

  _createCards(elem) {
    const wideCardElement = wideCardTemplate.cloneNode(true);
    wideCardElement.querySelector('.wideCard').classList.add(`wideCard_type_friends`);
    wideCardElement.querySelector('.wideCard').classList.add(`wideCard_id_${elem.id}`);
    wideCardElement.querySelector('.wideCard').id = elem.id;
    wideCardElement.querySelector('.wideCard__icon').src = elem.mainIcon;
    wideCardElement.querySelector('.wideCard__title').textContent = elem.title;
    wideCardElement.querySelector('.wideCard__description').textContent = elem.description;
    wideCardElement.querySelector('.wideCard__effectIcon').src = elem.effectIcon;
    wideCardElement.querySelector('.wideCard__effect').textContent = `+${formatNumberWithSpaces(elem.effect)}`;
    return wideCardElement;
  }

  friendsRenderer() {
    friendsTasks.forEach((elem) => {
      friendsCardsField.append(this._createCards(elem));
    });
  }

  friendsAmountCheck() {
    const cards = friendsCardsField.querySelectorAll('.wideCard');
    // Проходим по каждому условию
    friendsTasks.forEach(elem => {
      // Проверяем, соответствует ли количество друзей условию
      if (this.user.friends.length >= elem.limit) {
        // Находим карточку по id условия
        const card = cards[elem.id - 1]; // id начинается с 1, поэтому -1
        if (card) {
          // Добавляем красную границу
          card.classList.add('wideCard_complete');
          card.querySelector('.wideCard__icon').src = `./images/done.png`;
          card.addEventListener('click', () => {
            const reward = friendsTasks.find(obj => obj.id === elem.id).effect;
            popupManager.taskPopupOpen(reward, card);
          })
        }
      }
    });
  }
}
