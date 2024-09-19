// Before Online Update
// Delete Click DBSave
// Improve Achievements Limits
// Check Bot Commentaries
// Daily Tasks Commentaries:
    // const subscribed = await this.user.checkUserSubscription(channelId, this.user.userId);
    // console.log('subscribed', subscribed);
    // if(subscribed) {
    //   const newCard = card.cloneNode(true)
    //   newCard.classList.add('wideCard_complete');
    //   newCard.querySelector('.wideCard__icon').src = `./images/done.png`;
    //   newCard.addEventListener('click', (evt) => {
    //     const title = evt.target.closest('.wideCard').querySelector('.wideCard__title').textContent;
    //     const reward = todayTasks.find(obj => obj.title === title).effect;
    //     console.log(reward);
    //     popupManager.taskPopupOpen(reward, newCard, taskId);
    //   })
    //   card.replaceWith(newCard);
    // }

// --------------- Classes-Start ---------------
const user = new User(userDataModel);
// user.loadUserData();

const incomeManager = new IncomeManager(user);
const energyManager = new EnergyManager(user);
const upgradeManager = new UpgradeManager(
  user,
  incomeManager.scoreCounter.bind(incomeManager),
  incomeManager.deltaCounter.bind(incomeManager),
  energyManager.energyLimitRenderer.bind(energyManager),
  energyManager.energyRecoveryLooper.bind(energyManager),
  incomeManager.passiveIncomeCounter.bind(incomeManager),
  incomeManager.passiveIncomeRenderer.bind(incomeManager),
);

const achievementManager = new AchievementManager(user);
const friendsManager = new FriendsManager(user);
const dailyTasksManager = new DailyTasksManager(user);

const popupManager = new PopupManager(
  user,
  incomeManager.scoreCounter.bind(incomeManager),
  achievementManager,
  achievementManager.achievementGathering.bind(achievementManager),
  achievementManager.achievementsLevelCheck.bind(achievementManager),
);

const levelManager = new LevelManager(user);

const screenSwitcher = new ScreenSwitcher();
screenSwitcher.setEventListeners();

// --------------- Classes-End ---------------

let timer = 0;

function createTaskCards(elem) {
  const taskCardElement = wideCardTemplate.cloneNode(true);
  taskCardElement.querySelector('.wideCard__title').textContent = elem.title;
  return taskCardElement;
}

const channelId = '-1002493343663';

function click(e) {
  const scoreDisplay = document.createElement('p');
  scoreDisplay.classList.add('mainScreen__deltaAnimDisplay');
  scoreDisplay.textContent = `+${user.delta}`;
  scoreDisplay.style.opacity = '1';
  page.appendChild(scoreDisplay);

  scoreDisplay.style.left = `${e.clientX}px`;
  scoreDisplay.style.top = `${e.clientY}px`;

  setTimeout(() => {
    scoreDisplay.style.opacity = '0';
    scoreDisplay.remove();
  }, 2000);

  btnMain.classList.add('mainScreen__button_active');
  setTimeout(() => {
    btnMain.classList.remove('mainScreen__button_active');
  }, 100);
}

// --------------- MainClick-Start ---------------

const tg = window.Telegram.WebApp;
console.log('tg', tg);
// tg.enableClosingConfirmation();

try {
  if(tg.initDataUnsafe.user.first_name.length>0) {
    console.log('tgData', tg.initDataUnsafe);
    nameField.textContent = tg.initDataUnsafe.user.first_name;
    // const userPhoto = tg.initDataUnsafe.user.photo_url;
    // avatarField.src = userPhoto;
  }
} catch {}
// } catch (error){console.log(error)}

console.log(tg.initDataUnsafe.user !== undefined);


tasksButton.addEventListener('click', () => {
  dailyTasksManager.openScreen();
  dailyTasksManager.newTasksToggle();
});

function closeScreen() {
  dailyTaskScreen.classList.remove('dailyTasksScreen_active');
}
dailyTaskCloseBtn.addEventListener('click', closeScreen);

async function mainClick(evt) {
  if(user.energy >= user.delta) {
    if(tg.initDataUnsafe.user) {
      tg.HapticFeedback.impactOccurred('soft');
      tg.HapticFeedback.notificationOccurred('success');
    }
    click(evt);
    user.taps++;
    user.activeIncome = user.activeIncome + user.delta;
    energyManager.setEnergyRecoveryTimeout(false);
    energyManager.energyRecoveryLooper(false);
    incomeManager.scoreCounter();
    incomeManager.scoreRenderer();
    levelManager.levelProgressCounter();
    energyManager.energyCounter();
    energyManager.energyRenderer();
    incomeManager.cummulativeIncomeCounter();
    upgradeManager.checkUpgradeAvailable();
    achievementManager.achievementsLevelCheck();
    user.saveUserDataLocal();
    // user.saveUserDataDB();
  }
  energyManager.setEnergyRecoveryTimeout(true);
}

btnMain.addEventListener('click', mainClick);

// --------------- MainClick-End ---------------

try {
  tg.expand();
  console.log('platform', tg.platform);
} catch {}
// } catch (error){console.log(error)}

inviteFriendBtn.addEventListener('click', () => {
  user.inviteFriends()
    .then(() => {
      const today = new Date().toLocaleDateString();
      localStorage.setItem('invited', today);
      dailyTasksManager.friendCardToggle();
      achievementManager.friendsAmountCheck();
    });
})

const currentDate = new Date().toLocaleDateString();

// --------------- Window-Start ---------------
window.onload = async () => {
  // localStorage.removeItem('invited');
  // localStorage.clear();
  // Subscribtion Test
  // user.checkUserSubscription(-1002493343663, user.userId);
  // user.checkUserSubscription(-1002493343663, 180799659);
  // user.checkUserSubscription(-1002493343663, 653832788);

  // user.loadUserData();
  try {
    if(tg.initDataUnsafe.user.first_name.length>0) {
      console.log('DBLoading', tg.initDataUnsafe.user.id);
      // console.log('user.id', tg.initDataUnsafe.user);
      await user.loadUserDataDB(tg.initDataUnsafe.user.id);
    }
  // } catch {}
} catch {await user.loadUserDataDB('180799659')}

  const dbData = JSON.parse(localStorage.getItem('DataFromDB'));
  dbData.referenceBonus > 0 && popupManager.referencePopupOpen(dbData.referenceBonus);
  // ServiceFunctions-Start
    // user.score = 50000;
    // user.taps = 0;
    // user.cummulativeIncome = 0;
    // user.passiveIncome = 0;
    // user.gatheredAchievements = [];
    // user.activeUpgrades[0].level = 0;
    // user.energy = 500;
    // user.passiveUpgrades[0].level = 0;
    // user.passiveUpgrades[1].level = 0;
  // ServiceFunctions-End
  const offlinePassiveIncome = incomeManager.passiveOfflineIncomeCounter();
  offlinePassiveIncome > 0 && popupManager.offlineIncomePopupOpen(offlinePassiveIncome);
  screenSwitcher.screenSwitch();
  upgradeManager.checkUpgradeAvailable();
  levelManager.levelRenderer();
  levelManager.levelProgressCounter();
  incomeManager.deltaCounter();
  // user.saveUserDataLocal();
  incomeManager.scoreRenderer();
  energyManager.energyRenderer();
  incomeManager.passiveIncomeCounter();
  incomeManager.passiveIncomeRenderer();
  incomeManager.passiveOnlineIncomeCounter();
  energyManager.energyUpgradeLimiter();
  energyManager.energyLimitRenderer();
  upgradeManager.allUpgradesRenderer();

  friendsManager.friendsRenderer();
  friendsManager.friendsAmountCheck();

  user.saveUserDataLocal();
  achievementManager.achievementsCardsRenderer();
  achievementManager.achievementsLevelCheck();
  achievementManager.activeOnloadCorrection();
  dailyTasksManager.cardsRenderer(currentDate);
  dailyTasksManager.contentRenderer();
  dailyTasksManager.newTasksToggle();
  dailyTasksManager.friendCardToggle();
  await dailyTasksManager.channelCardToggle();

  // Make separate function as energy
  let passiveIncomeTimer = setInterval(() => {
    // Move unlimited functions to userOnlineTimer
    incomeManager.passiveOnlineIncomeCounter();
    levelManager.levelProgressCounter();
    incomeManager.scoreRenderer();
    upgradeManager.checkUpgradeAvailable();
    achievementManager.achievementsLevelCheck();

    // user.saveUserDataLocal();

    if(timer == onlinePassiveTimeLimit) {
      clearInterval(passiveIncomeTimer);
    }
  },  1000);

  // let userOnlineTimer = setInterval(() => {
  //   user.timeOnline++;
  //   user.saveUserDataLocal();
  // },  1000);

  energyManager.energyRecoveryLooper(true, 'normal');

  const dbSave = setInterval(() => {
    // user.saveUserDataDB();
  }, 15*1000)
};

window.addEventListener('beforeunload', (evt) => {
  evt.preventDefault();
  // user.saveUserDataDB();
  localStorage.removeItem('DataFromDB');
  localStorage.setItem('closureTime', new Date());
});
// --------------- Window-End ---------------
