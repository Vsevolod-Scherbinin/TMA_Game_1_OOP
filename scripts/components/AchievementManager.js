class AchievementManager {
  constructor(user) {
    this.user = user;
    this.wideCardTemplate = document.querySelector('#wideCard').content;
    this.achievementCardsField = document.querySelector('.achievementsScreen__cardField');
    // this.user.activeAchievements = [];
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
    // achievementCardElement.querySelector('.wideCard__effect').textContent = `+${levelData.effect}`;
    achievementCardElement.querySelector('.wideCard__effect').textContent = `+${formatNumber(levelData.effect)}`;
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

  _achievementsContentRenderer(card, cardData, textLevel, iconLevel) {
    const cardLevel = cardData.levels.find(obj => obj.level === textLevel);
    const iconLvl = cardData.levels.find(obj => obj.level === iconLevel);
    card.querySelector('.wideCard__icon').src = iconLvl.mainIcon;
    card.querySelector('.wideCard__description').textContent = cardLevel.description;
    // card.querySelector('.wideCard__effect').textContent = cardLevel.effect;
    card.querySelector('.wideCard__effect').textContent = formatNumber(cardLevel.effect);
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
          card.classList.add('wideCard_active');
          card.addEventListener('click', () => {
            popupManager.achievementsPopupOpen(object, availableLevel-1);
          }, { once: true });
        }
      } else {
        if(isAvailable) {
          card.classList.add('wideCard_active');
          card.addEventListener('click', () => {
            popupManager.achievementsPopupOpen(object, availableLevel-1);
          }, { once: true });
        }
      }
    })
  }

  achievementsLevelCheck() {
    // Active Ach-s Correction
    // this.user.activeAchievements.forEach((ach) => {
    //   const available = this.user.achievements.find(obj => obj.id === ach.id);
    //   ach.level = available.level;
    // });
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

      let activeLevel = 0;
      const isActive = this.user.activeAchievements.some(obj => obj.id === object.id);
      isActive && (activeLevel = this.user.activeAchievements.find(obj => obj.id === object.id).level);

      const userAch = this.user.achievements.find(obj => obj.id === object.id);
      const card = this.achievementCardsField.querySelector(`.wideCard_id_${object.id}`);
      if(lessLevels.length) {
        if(!isGathered) {
          userAch.level = 1;
          card.classList.add('wideCard_active');
          if(!isActive) {
            // console.log('Av !G !Act', object.id);

            this.user.activeAchievements.push({id: object.id, level: userAch.level});
            // card.classList.add('wideCard_active');
            card.addEventListener('click', () => {
              // console.log('Test !isGathered');
              popupManager.achievementsPopupOpen(object, userAch.level-1);
            });
            this._achievementsContentRenderer(card, object, userAch.level-1, userAch.level);
          } else {
            // console.log('Av !G Act', object.id);
            card.addEventListener('click', () => {
              popupManager.achievementsPopupOpen(object, activeLevel-1);
            });
            this._achievementsContentRenderer(card, object, activeLevel-1, activeLevel);
          }
        } else {
          const gatheredLevel = this.user.gatheredAchievements.find(obj => obj.id === object.id).level;
          const availableLevel = lessLevels.find(obj => obj.limit === Math.max(...lessLimits)).level + 1;
          userAch.level = gatheredLevel;
          if(gatheredLevel < availableLevel) {
            userAch.level = gatheredLevel + 1;
            this._achievementsContentRenderer(card, object, gatheredLevel, userAch.level);
            card.classList.add('wideCard_active');
          if(!isActive) {
            // console.log('Av !G !Act', object.id);

            this.user.activeAchievements.push({id: object.id, level: userAch.level});
            // card.classList.add('wideCard_active');
            card.addEventListener('click', () => {
              // console.log('Test !isGathered');
              popupManager.achievementsPopupOpen(object, userAch.level-1);
            }, { once: true });
            this._achievementsContentRenderer(card, object, userAch.level-1, userAch.level);
          } else {
            card.addEventListener('click', () => {
              popupManager.achievementsPopupOpen(object, activeLevel-1);
            }, { once: true });
            this._achievementsContentRenderer(card, object, activeLevel-1, activeLevel);
          }
          } else {
            // console.log('Av<G', object.id);
            if(isActive) {
              card.classList.add('wideCard_active');
              card.addEventListener('click', () => {
                popupManager.achievementsPopupOpen(object, activeLevel-1);
              }, { once: true });
              this._achievementsContentRenderer(card, object, activeLevel, activeLevel);
            } else {
              card.classList.remove('wideCard_active');
              this._achievementsContentRenderer(card, object, gatheredLevel, userAch.level);
            }
          }
        }
      } else {
        if(isActive) {
          // console.log('!Av Act', object.id);
          this._achievementsContentRenderer(card, object, activeLevel, activeLevel);
        } else {
          // console.log('!Av !Act', object.id);
          userAch.level = 0;
          this._achievementsContentRenderer(card, object, userAch.level, userAch.level);
        }
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
