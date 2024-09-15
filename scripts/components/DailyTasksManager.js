class DailyTasksManager {
  constructor(user) {
    this.user = user;
    this.wideCardTemplate = document.querySelector('#wideCard').content;
    this.dailyTaskField = document.querySelector('.dailyTasksScreen__cardField');
  }

  _createCard(elem) {
    const cardElement = wideCardTemplate.cloneNode(true);
    cardElement.querySelector('.wideCard__icon').src = elem.mainIcon;
    cardElement.querySelector('.wideCard__title').textContent = elem.title;
    cardElement.querySelector('.wideCard__description').textContent = elem.description;
    cardElement.querySelector('.wideCard__effectIcon').src = elem.effectIcon;
    cardElement.querySelector('.wideCard__effect').textContent = `+${formatNumberWithSpaces(elem.effect)}`;
    return cardElement;
  }

  cardsRenderer(date) {
    // const currentTasks = dailyTasks.find(obj => obj.date === date).tasks
    // console.log(currentTasks);

    dailyTasks.find(obj => obj.date === date).tasks.forEach((elem) => {
      const card = this._createCard(elem);
      this.dailyTaskField.append(card);
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

  newTasksCheck() {
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
