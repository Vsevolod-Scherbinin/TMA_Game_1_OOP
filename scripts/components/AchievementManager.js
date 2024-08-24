class AchievementManager {
  constructor(user) {
    this.user = user;
  }

  achievementsCardsRenderer() {
    // console.log('achievements', user.achievements[0]);

    achievements.forEach((elem) => {
      if(elem.id !== 5) {
        const userLevel = this.user.achievements.find(obj => obj.id === elem.id).level;
        const card = createAchievementsCard(elem, userLevel);
        const achievementCardsField = document.querySelector('.achievementsScreen__cardField');
        achievementCardsField.append(card);
      }
    });
  }

  achievementsContentRenderer() {
    const cards = document.querySelectorAll('.wideCard__title');

    cards.forEach((card) => {
      // console.log(card);

      const cardObj = achievements.find(obj => obj.title === card.textContent);
      if(cardObj) {
        const userAchLevel = user.achievements.find(obj => obj.id === cardObj.id).level;
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
  // Break -- Connect
  achievementsLevelCheck() {
    // energyAchievementLimiter();
    achievements.forEach((object) => {
      const isGathered = user.gatheredAchievements.some(obj => obj.id === object.id);

      // console.log(energyLimiterTotal());

      let lessArray;

      object.metric === 'energyLimit'
        ? lessArray = object.levels.filter(obj => obj.limit <= energyLimiterTotal())
        : lessArray = object.levels.filter(obj => obj.limit <= user[object.metric]);
      const lessLimits = [];
      lessArray.forEach((obj) => {
        lessLimits.push(obj.limit);
      });
      const userAch = user.achievements.find(obj => obj.id === object.id);
      const card = document.querySelector(`.wideCard_id_${object.id}`);
      const handlePopupOpen = () => {
        popupManager.popupOpen(object, userAch.level);
      }
      if(lessArray.length) {
        if(!isGathered) {
          userAch.level = 1;
          card.addEventListener('click', handlePopupOpen);
        } else {
          const gatheredLevel = user.gatheredAchievements.find(obj => obj.id === object.id).level;
          const availableLevel = lessArray.find(obj => obj.limit === Math.max(...lessLimits)).level + 1;
          userAch.level = gatheredLevel;
          if(gatheredLevel < availableLevel) {
            userAch.level = gatheredLevel + 1;
            card.addEventListener('click', handlePopupOpen);
          }
        }
      } else {
        userAch.level = 0;
      }
    });
  };

  achievementGathering(obj, level) {
    // console.log(obj);

    const newAchievement = {
      id: obj.id,
      level: level,
    };
    // console.log('newAchievement', newAchievement);

    const isObjectPresent = user.gatheredAchievements.some(obj => obj.id === newAchievement.id);
    // console.log(isObjectPresent);

    if(isObjectPresent) {
      const gatheredAchievement = user.gatheredAchievements.find(obj => obj.id === newAchievement.id);
      // console.log('gatheredAchievement', gatheredAchievement);

      if(gatheredAchievement.level < newAchievement.level) {
        user.gatheredAchievements.splice(user.gatheredAchievements.indexOf(gatheredAchievement), 1);
        user.gatheredAchievements.push(newAchievement);
      }
    } else {
      user.gatheredAchievements.push(newAchievement);
    }
  }

}
