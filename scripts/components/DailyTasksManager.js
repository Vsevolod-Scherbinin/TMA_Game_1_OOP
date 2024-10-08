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

  getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay) + 1;
  }

  daysInTheYear(year) {
    if((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
      return 366;
    } else {return 365}
  }

  entryStreakCounter() {
    const today = new Date();
    const todayNumber = this.getDayOfYear(today);
    const todayYear = today.getFullYear();
    const lastEntryDate = new Date(this.user.lastEntry);
    const lastEntryNumber = this.getDayOfYear(lastEntryDate);
    const lastEntryYear = lastEntryDate.getFullYear();
    const lastEntryYearDays = this.daysInTheYear(lastEntryYear);

    let daysDifference;

    if (todayYear === lastEntryYear) {
      daysDifference = todayNumber - lastEntryNumber;
    } else {
      daysDifference = (lastEntryYearDays - lastEntryNumber) + todayNumber;
    }

    if (this.user.lastEntry === '' || daysDifference > 1) {
      this.user.entryStreak = 1;
      this.user.tasks.splice(0, user.tasks.length);
      popupManager.daysPopupOpen(this.user.entryStreak);
      this.saveNewEntryDate(today);
    } else if (daysDifference === 1) {
      this.user.entryStreak++;
      this.user.tasks.splice(0, user.tasks.length);
      popupManager.daysPopupOpen(this.user.entryStreak);
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
