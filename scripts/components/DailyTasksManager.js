class DailyTasksManager {
  constructor(user) {
    this.user = user;
    this.wideCardTemplate = document.querySelector('#wideCard').content;
    this.dailyTaskField = document.querySelector('.dailyTasksScreen__cardField');
  }

  subscribe(link) {
    window.open(`${link}`, '_blank');
  }

  friendCardToggle() {
    const today = new Date().toLocaleDateString();
    const todayTasks = dailyTasks.find(obj => obj.date === today).tasks;
    const taskId = todayTasks.find(obj => obj.type === 'friend').id;
    const card = this.dailyTaskField.querySelector(`.wideCard_type_friend`);

    const isGathered = this.user.tasks.some(obj => obj.id === taskId);
    if(isGathered) {
      card.querySelector('.wideCard__icon').src = `./images/done.png`;
      return
    }

    if(this.user.hasInvitedToday()) {
      const newCard = card.cloneNode(true)
      newCard.classList.add('wideCard_active');
      newCard.querySelector('.wideCard__icon').src = `./images/done.png`;
      newCard.addEventListener('click', (evt) => {
        const title = evt.target.closest('.wideCard').querySelector('.wideCard__title').textContent;
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

  async channelCardToggle() {
    const today = new Date().toLocaleDateString();
    const todayTasks = dailyTasks.find(obj => obj.date === today).tasks;
    const taskId = todayTasks.find(obj => obj.type === 'channel').id;
    const channelId = todayTasks.find(obj => obj.type === 'channel').channelId;
    const card = this.dailyTaskField.querySelector(`.wideCard_type_channel`);

    const isGathered = this.user.tasks.some(obj => obj.id === taskId);
    if(isGathered) {
      card.querySelector('.wideCard__icon').src = `./images/done.png`;
      return
    }
    console.log('channelId', channelId);
    const subscribed = await this.user.checkUserSubscription(channelId, this.user.userId);
    console.log('subscribed', subscribed);
    if(subscribed) {
      const newCard = card.cloneNode(true)
      newCard.classList.add('wideCard_active');
      newCard.querySelector('.wideCard__icon').src = `./images/done.png`;
      newCard.addEventListener('click', (evt) => {
        const title = evt.target.closest('.wideCard').querySelector('.wideCard__title').textContent;
        const reward = todayTasks.find(obj => obj.title === title).effect;
        console.log(reward);
        popupManager.taskPopupOpen(reward, newCard, taskId);
      })
      card.replaceWith(newCard);
    }
  }

  _createCard(elem) {
    const cardElement = wideCardTemplate.cloneNode(true);
    cardElement.querySelector('.wideCard').classList.add(`wideCard_id_${elem.id}`);
    cardElement.querySelector('.wideCard').classList.add(`wideCard_type_${elem.type}`);
    cardElement.querySelector('.wideCard__title').textContent = elem.title;
    cardElement.querySelector('.wideCard__description').textContent = elem.description;
    cardElement.querySelector('.wideCard__effectIcon').src = elem.effectIcon;
    cardElement.querySelector('.wideCard__effect').textContent = `+${formatNumberWithSpaces(elem.effect)}`;
    // hasChannel && cardElement.querySelector('wideCard').classList.add(`wideCard_${elem.channelId}`);
    return cardElement;
  }

  setCardEvents(elem) {
    const card = this.dailyTaskField.querySelector(`.wideCard_id_${elem.id}`)

    const isGathered = this.user.tasks.some(obj => obj.id === elem.id);
    const friend = elem.type === 'friend';
    if(!isGathered) {
      friend && (card.addEventListener('click', () => {
        this.user.inviteFriends()
          .then(() => {
            const today = new Date().toLocaleDateString();
            localStorage.setItem('invited', today);
            this.friendCardToggle();
          });
      }))
      const channel = elem.type === 'channel';
      channel && (card.addEventListener('click', () => {
        this.subscribe(elem.channelLink);
      }))
    }
  }

  cardsRenderer(date) {
    dailyTasks.find(obj => obj.date === date).tasks.forEach((elem) => {
      const card = this._createCard(elem);
      this.dailyTaskField.append(card);
      this.setCardEvents(elem);
    });
  }

  contentRenderer() {
    const cards = document.querySelectorAll('.wideCard__title');
    cards.forEach((card) => {
      // console.log(card);
      const cardObj = achievements.find(obj => obj.title === card.textContent);
      if(cardObj) {
        const userAchLevel = this.user.achievements.find(obj => obj.id === cardObj.id).level;
        // console.log(userAchLevel);
        const cardLevel = cardObj.levels.find(obj => obj.level === userAchLevel);
        card.closest('.wideCard').querySelector('.wideCard__icon').src = cardLevel.mainIcon;
        card.closest('.wideCard').querySelector('.wideCard__description').textContent = cardLevel.description;
        card.closest('.wideCard').querySelector('.wideCard__effect').textContent = formatNumberWithSpaces(cardLevel.effect);
      }
    });

    user.achievements.forEach((userAch) => {
        const found = achievements.find(obj => obj.id === userAch);
    });
  }

  openScreen() {
    dailyTaskScreen.classList.add('dailyTasksScreen_active');
  }

  newTasksToggle() {
    this.user.isFirstVisitToday()
      ? newTasksIcon.classList.add('tasksButton__newTasksIcon_active')
      : newTasksIcon.classList.remove('tasksButton__newTasksIcon_active');
  }



  // gathering(obj, level) {
  //   const newAchievement = {
  //     id: obj.id,
  //     level: level,
  //   };
  //   const isObjectPresent = this.user.gatheredAchievements.some(obj => obj.id === newAchievement.id);
  //   // console.log('isObjectPresent', isObjectPresent);
  //   if(isObjectPresent) {
  //     const gatheredAchievement = this.user.gatheredAchievements.find(obj => obj.id === newAchievement.id);
  //     // console.log('gatheredAchievement', gatheredAchievement);
  //     if(gatheredAchievement.level < newAchievement.level) {
  //       this.user.gatheredAchievements.splice(this.user.gatheredAchievements.indexOf(gatheredAchievement), 1);
  //       this.user.gatheredAchievements.push(newAchievement);
  //     }
  //   } else {
  //     this.user.gatheredAchievements.push(newAchievement);
  //     console.log(this.user);
  //   }
  //   this.user.saveUserDataLocal();
  // }
}
