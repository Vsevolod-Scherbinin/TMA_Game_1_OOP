class AchievementManager {
  constructor(user) {
    this.user = user;
    this.wideCardTemplate = document.querySelector('#wideCard').content;
    this.achievementCardsField = document.querySelector('.achievementsScreen__cardField');
    this.user.activeAchievements = []
  }

  _createAchievementsCard(elem, level) {
    const levelData = elem.levels.find(obj => obj.level === level);
    const achievementCardElement = this.wideCardTemplate.cloneNode(true);
    achievementCardElement.querySelector('.wideCard').classList.add(`wideCard_type_achievement`);
    achievementCardElement.querySelector('.wideCard').classList.add(`wideCard_id_${elem.id}`);
    achievementCardElement.querySelector('.wideCard__icon').src = levelData.mainIcon;
    achievementCardElement.querySelector('.wideCard__title').textContent = elem.title;
    achievementCardElement.querySelector('.wideCard__description').textContent = levelData.description;
    achievementCardElement.querySelector('.wideCard__effectIcon').src = elem.effectIcon;
    achievementCardElement.querySelector('.wideCard__effect').textContent = `+${formatNumberWithSpaces(levelData.effect)}`;
    return achievementCardElement;
  }

  achievementsCardsRenderer() {
    // console.log('achievements', user.achievements[0]);
    achievements.forEach((elem) => {
        const userLevelAvailable = this.user.achievements.find(obj => obj.id === elem.id).level;
        const userLevelGathered = this.user.gatheredAchievements.some(obj => obj.id === elem.id).level;
        const card = this._createAchievementsCard(elem, userLevelAvailable);
        this.achievementCardsField.append(card);
    });
  }

  achievementsContentRenderer() {
    const cards = document.querySelectorAll('.wideCard_type_achievement');
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

  activeOnloadCorrection() {
    achievements.forEach((object) => {
      const card = this.achievementCardsField.querySelector(`.wideCard_id_${object.id}`);
      const isGathered = this.user.gatheredAchievements.some(obj => obj.id === object.id);
      const isAvailable = this.user.achievements.find(obj => obj.id === object.id).level > 0;
      const availableLevel = this.user.achievements.find(obj => obj.id === object.id).level;
      if(isGathered) {
        const gatheredLevel = this.user.gatheredAchievements.find(obj => obj.id === object.id).level;
        if(availableLevel > gatheredLevel) {
          card.addEventListener('click', () => {
            popupManager.achievementsPopupOpen(object, availableLevel);
          });
        }
      } else {
        if(isAvailable) {
          card.addEventListener('click', () => {
            popupManager.achievementsPopupOpen(object, availableLevel);
          });
        }
      }
    })
  }

  achievementsLevelCheck() {
    // energyAchievementLimiter();
    achievements.forEach((object) => {
      // console.log(energyLimiterTotal());
      let lessLevels;
      object.metric === 'energyLimit'
        ? lessLevels = object.levels.filter(obj => obj.limit <= energyLimiterTotal())
        : lessLevels = object.levels.filter(obj => obj.limit <= this.user[object.metric]);

      const lessLimits = [];
      // console.log('lessLevels', lessLevels);

      lessLevels.forEach((obj) => {
        lessLimits.push(obj.limit);
      });
      // console.log('lessLimits', lessLimits);

      const isGathered = this.user.gatheredAchievements.some(obj => obj.id === object.id);

      const isActive = this.user.activeAchievements.some(obj => obj.id === object.id);

      // console.log('isActive', isActive);

      const userAch = this.user.achievements.find(obj => obj.id === object.id);
      const card = this.achievementCardsField.querySelector(`.wideCard_id_${object.id}`);
      // const index = this.user.activeAchievements.indexOf(this.user.activeAchievements.find(obj => obj.id === object.id));
      // console.log('index', index);
      if(lessLevels.length) {
        if(!isGathered) {
          userAch.level = 1;
          if(!isActive) {
            this.user.activeAchievements.push({id: object.id});
            card.addEventListener('click', () => {
              // console.log('Test !isGathered');
              popupManager.achievementsPopupOpen(object, userAch.level);
            });
          }
        } else {
          const gatheredLevel = this.user.gatheredAchievements.find(obj => obj.id === object.id).level;
          const availableLevel = lessLevels.find(obj => obj.limit === Math.max(...lessLimits)).level + 1;
          userAch.level = gatheredLevel;
          if(gatheredLevel < availableLevel) {
            userAch.level = gatheredLevel + 1;
            if(!isActive) {
              this.user.activeAchievements.push({id: object.id});
              card.addEventListener('click', () => {
                console.log('Test !isGathered');
                popupManager.achievementsPopupOpen(object, userAch.level);
              });
            }
          }
        }
      } else {
        userAch.level = 0;
      }
    });
  };

  achievementGathering(obj, level) {
    const newAchievement = {
      id: obj.id,
      level: level,
    };
    const isObjectPresent = this.user.gatheredAchievements.some(obj => obj.id === newAchievement.id);
    // console.log('isObjectPresent', isObjectPresent);
    if(isObjectPresent) {
      const gatheredAchievement = this.user.gatheredAchievements.find(obj => obj.id === newAchievement.id);
      // console.log('gatheredAchievement', gatheredAchievement);
      if(gatheredAchievement.level < newAchievement.level) {
        this.user.gatheredAchievements.splice(this.user.gatheredAchievements.indexOf(gatheredAchievement), 1);
        this.user.gatheredAchievements.push(newAchievement);
      }
    } else {
      this.user.gatheredAchievements.push(newAchievement);
      console.log(this.user);
    }
    this.user.saveUserDataLocal();
  }
}
