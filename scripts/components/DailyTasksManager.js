class DailyTasksManager {
  constructor(user) {
    this.user = user;
    // this.popupManager = popupManager;
    this.taskCardTemplate = document.querySelector('#taskCard').content;
    this.dailyTaskField = document.querySelector('.dailyTasksScreen__cardField');
    this.newTasksCount = document.querySelector('.tasksButton__newTasksCount');
    this.newTasksCountText = document.querySelector('.tasksButton__tasksCountText');
  }

  registryDelayCounter() {
    const now = new Date();
    const registryTime = new Date(this.user.registryTime);
    const timeDelta = now - registryTime
    const timeDeltaInSeconds = Math.floor(timeDelta / 1000);
    return timeDeltaInSeconds;
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

  async channelCardToggle() {
    const today = new Date().toLocaleDateString();
    const todayTasks = dailyTasks.find(obj => obj.date === today).tasks;
    const taskId = todayTasks.find(obj => obj.type === 'channel').id;
    const channelId = todayTasks.find(obj => obj.type === 'channel').channelId;
    const card = this.dailyTaskField.querySelector(`.taskCard_type_channel`);

    const isGathered = this.user.tasks.some(obj => obj.id === taskId);
    if(isGathered) {
      card.querySelector('.taskCard__statusIcon').src = `./images/check-complete.png`;
      card.querySelector('.taskCard__statusIcon').classList.add('complete');
      return
    }
    console.log('channelId', channelId);
    const subscribed = await this.user.checkUserSubscription(channelId, this.user.userId);
    console.log('subscribed', subscribed);
    if(subscribed) {
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
  }

  registryCardToggle() {
    const today = new Date().toLocaleDateString();
    const todayTasks = dailyTasks.find(obj => obj.date === today).tasks;
    const taskId = todayTasks.find(obj => obj.type === 'registry').id;
    const card = this.dailyTaskField.querySelector(`.taskCard_type_registry`);

    const isGathered = this.user.tasks.some(obj => obj.id === taskId);
    if(isGathered) {
      card.querySelector('.taskCard__statusIcon').src = `./images/check-complete.png`;
      card.querySelector('.taskCard__statusIcon').classList.add('complete');
      return
    }
    const registered = this.registryDelayCounter() > 3600;
    console.log('registered', registered);
    if(registered) {
      const newCard = card.cloneNode(true);
      newCard.classList.add('taskCard_active');
      newCard.querySelector('.taskCard__statusIcon').src = `./images/check-incomplete.png`;
      newCard.addEventListener('click', (evt) => {
        const title = evt.target.closest('.taskCard').querySelector('.taskCard__title').textContent;
        const reward = todayTasks.find(obj => obj.title === title).effect;
        console.log('reward', reward);
        popupManager.taskPopupOpen(reward, newCard, taskId, 'registry');
      })
      card.replaceWith(newCard);
    }
  }

  _createCard(elem) {
    const cardElement = this.taskCardTemplate.cloneNode(true);
    cardElement.querySelector('.taskCard').classList.add(`taskCard_id_${elem.id}`);
    cardElement.querySelector('.taskCard').classList.add(`taskCard_type_${elem.type}`);
    cardElement.querySelector('.taskCard__icon').src = elem.mainIcon;
    cardElement.querySelector('.taskCard__title').textContent = elem.title;
    cardElement.querySelector('.taskCard__effectIcon').src = elem.effectIcon;
    cardElement.querySelector('.taskCard__effect').textContent = `${formatNumber(elem.effect)}`;
    cardElement.querySelector('.taskCard__statusIcon').src = `./images/link-icon.png`;
    // cardElement.querySelector('.taskCard__effect').textContent = `+${formatNumber(elem.effect)}`;
    // hasChannel && cardElement.querySelector('taskCard').classList.add(`taskCard_${elem.channelId}`);
    return cardElement;
  }

  setCardEvents(elem) {
    const card = this.dailyTaskField.querySelector(`.taskCard_id_${elem.id}`)

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
        // this.subscribe(elem.channelLink);
        openLink(elem.channelLink);
      }))

      const registry = elem.type === 'registry';
      registry && (card.addEventListener('click', () => {
        // this.subscribe(elem.channelLink);
        openLink(elem.link);
        this.user.registryTime = new Date();
        this.user.saveUserDataDB();
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

  openScreen() {
    dailyTaskScreen.classList.add('dailyTasksScreen_active');
  }

  dailyEnterRewardSetter() {
    dailyEnterRewards = [];
    for (let day = 1; day <= 30; day++) {
      let reward = { day: day, amount: 100 }; // Базовая награда за день
      if (day % 5 === 0) {
          reward.amount = day * 100;
      }
      dailyEnterRewards.push(reward);
    }
  }

  saveNewEntryDate() {
    this.user.lastEntry = new Date();
  }

  // getDayOfYear(date) {
  //   const start = new Date(date.getFullYear(), 0); // Начало года
  //   const diff = date - start; // Разница в миллисекундах
  //   const oneDay = 1000 * 60 * 60 * 24; // Количество миллисекунд в одном дне
  //   return Math.floor(diff / oneDay) + 1; // Возвращаем номер дня года
  // }

  // entryStreakCounter() {
  //   const today = new Date();
  //   const todayString = today.toISOString().split('T')[0];

  //   const day = new Date('2024-12-31T07:21:55.116Z');

  //   const todayNumber = this.getDayOfYear(today);
  //   const dayNumber = this.getDayOfYear(day);
  //   console.log('todayNumber', todayNumber);
  //   console.log('dayNumber', dayNumber);

  //   if (this.user.lastEntry === '') {
  //     // console.log('First entry');
  //     this.user.entryStreak = 1;
  //     popupManager.daysPopupOpen(this.user.entryStreak);
  //     this.saveNewEntryDate(today);
  //   } else {
  //     const lastEntryDate = new Date(this.user.lastEntry);
  //     const lastEntryString = lastEntryDate.toISOString().split('T')[0];
  //     console.log('todayString', todayString);
  //     console.log('lastEntryString', lastEntryString);


  //     const oneDayInMillis = 86400000;
  //     const daysDifference = Math.floor((today - lastEntryDate) / oneDayInMillis);
  //     console.log('daysDifference', daysDifference);

  //     if (daysDifference > 1) {
  //         // console.log('Missed a day');
  //         this.user.entryStreak = 1;
  //         popupManager.daysPopupOpen(this.user.entryStreak);
  //         this.saveNewEntryDate(today);
  //     } else if (daysDifference === 1 || (daysDifference === 0 && todayString !== lastEntryString)) {
  //         console.log('New day entry');
  //         this.user.entryStreak++;
  //         popupManager.daysPopupOpen(this.user.entryStreak);
  //         this.saveNewEntryDate(today);
  //     } else {
  //         console.log('Same day entry, no change');
  //     }
  //   }
  // }

  entryStreakCounter() {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const lastEntryDate = new Date(this.user.lastEntry);
    const lastEntryString = lastEntryDate.toISOString().split('T')[0];
    const oneDayInMillis = 86400000; // 24 часа в миллисекундах
    const daysDifference = (today - lastEntryDate) / oneDayInMillis;

    console.log('today', today);
    console.log('todayString', todayString);
    console.log('lastEntryDate', lastEntryDate);
    console.log('lastEntryString', lastEntryString);
    console.log('daysDifference', daysDifference);


    if((this.user.lastEntry === '') || (today - new Date(this.user.lastEntry) > 86400000)) {
      console.log('Cond 1');
      this.user.entryStreak = 1;
      popupManager.daysPopupOpen(this.user.entryStreak);
      this.saveNewEntryDate(today);
    } else if ((today.toLocaleDateString() !== new Date(this.user.lastEntry).toLocaleDateString()) && (today - new Date(this.user.lastEntry) <= 86400000)) {
      console.log('Cond 2');
      this.user.entryStreak++;
      const reward = dailyEnterRewards.find(obj => obj.day === this.user.entryStreak);
      popupManager.daysPopupOpen(user.entryStreak);
      this.saveNewEntryDate(today);
    }
  }

  _newTasksCounter() {
    const today = new Date().toLocaleDateString();
    const tasksAmount = dailyTasks.find(obj => obj.date === today).tasks.length;
    const complete = this.user.tasks.length;
    return tasksAmount - complete;
  }

  newTasksAmountRenderer() {
    if(this._newTasksCounter() > 0) {
      this.newTasksCount.classList.add('tasksButton__newTasksCount_active');
      this.newTasksCountText.textContent = this._newTasksCounter();
    } else {
      this.newTasksCount.classList.remove('tasksButton__newTasksCount_active');
    }
  }
}
