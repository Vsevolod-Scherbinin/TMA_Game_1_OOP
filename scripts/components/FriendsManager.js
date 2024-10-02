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
    // wideCardElement.querySelector('.wideCard__effect').textContent = `${elem.effect}`;
    wideCardElement.querySelector('.wideCard__effect').textContent = `${formatNumber(elem.effect)}`;
    return wideCardElement;
  }

  friendsRenderer() {
    friendsTasks.forEach((elem) => {
      friendsCardsField.append(this._createCards(elem));
    });
  }

  friendsAmountCheck() {
    const cards = friendsCardsField.querySelectorAll('.wideCard_type_friends');
    friendsTasks.forEach(elem => {
      console.log('this.user.friends.length', this.user.friends.length);
      console.log('elem.limit', elem.limit);

      if (this.user.friends.length >= elem.limit) {
        const card = cards[elem.id - 1];
        console.log('card', card);
        if (card) {
          const isGathered = this.user.friendsGathered.some(obj => obj.id === elem.id);
          if(isGathered) {
            card.querySelector('.wideCard__effectIcon').classList.add('hidden');
            card.querySelector('.wideCard__effect').classList.add('hidden');
            card.querySelector('.wideCard__statusIcon').src = `./images/check-complete.png`;
            card.querySelector('.wideCard__statusIcon').classList.remove('hidden');
          } else {
            card.querySelector('.wideCard__effectIcon').classList.add('hidden');
            card.querySelector('.wideCard__effect').classList.add('hidden');
            card.querySelector('.wideCard__statusIcon').src = `./images/check-incomplete.png`;
            card.querySelector('.wideCard__statusIcon').classList.remove('hidden');
            card.classList.add('wideCard_active');
            card.addEventListener('click', () => {
              const reward = friendsTasks.find(obj => obj.id === elem.id).effect;
              popupManager.friendsPopupOpen(reward, card, elem.id);
            })
          }
        }
      }
    });
  }

  friendCardToggle() {
    const today = new Date().toLocaleDateString();
    const todayTasks = dailyTasks.find(obj => obj.date === today).tasks;
    const taskId = todayTasks.find(obj => obj.type === 'friend').id;
    const card = this.dailyTaskField.querySelector(`.taskCard_type_friend`);

    const isGathered = this.user.tasks.some(obj => obj.id === taskId);
    if(isGathered) {
      card.querySelector('.taskCard__statusIcon').src = `./images/check-complete.png`;
      card.querySelector('.taskCard__statusIcon').classList.add('complete');
      return
    }

    if(this.user.hasInvitedToday()) {
      const newCard = card.cloneNode(true);
      newCard.classList.add('taskCard_active');
      newCard.querySelector('.taskCard__statusIcon').src = `./images/check-incomplete.png`;
      newCard.addEventListener('click', (evt) => {
        const title = evt.target.closest('.taskCard').querySelector('.taskCard__title').textContent;
        const reward = todayTasks.find(obj => obj.title === title).effect;
        console.log(reward);
        popupManager.taskPopupOpen(reward, newCard, taskId);
      })
      card.replaceWith(newCard);
    }
    // check hasInvitedToday()
    // const scoreDisplay = document.createElement('p');
    // scoreDisplay.textContent = `${this.user.hasInvitedToday()}`;
    // this.dailyTaskField.appendChild(scoreDisplay);
  }
}
