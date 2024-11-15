// Инструкция

// Все изменения достижений, задач, апгрейдов нужно делать в папке utils:
// Ежедневные задачи - файл dailyTasks.js
// Апгрейды кликов и энергии - файл activeUpgrades.js
// Апгрейды пассивного дохода - файл passiveUpgrades.js
// Достижения по приведению друзей - файл friends.js
// Достижения - файл achievements.js

// Ежедневные задачи
// Ежедневные задачи можно задать сразу в большом количестве.
// Важно, чтобы в конкретный день в файле была задача с текущей датой. Иначе на экране ничего не появится.

// Доп. настройки
// В файле constants.js выведены дополнительные настройки.
// passiveOfflineIncomeHoursLimit - количество часов оффлайн, за которые начисляется пассивный доход.
// energyDelta - скорость восстановления энергии  очков/сек.

// Прочее
// Изменения дизайна в привычной папке blocks
// Все изображения в папке images

// --------------- Classes-Start ---------------
const user = new User(userDataModel);

const incomeManager = new IncomeManager(user);
const energyManager = new EnergyManager(user);
const upgradeManager = new UpgradeManager(
  user,
  incomeManager,
  energyManager.energyLimitRenderer.bind(energyManager),
  energyManager.energyRecoveryLooper.bind(energyManager),
);

const achievementManager = new AchievementManager(user);
const friendsManager = new FriendsManager(user);
const dailyTasksManager = new DailyTasksManager(user);

const popupManager = new PopupManager(
  user,
  incomeManager.scoreCounter.bind(incomeManager),
  achievementManager,
  dailyTasksManager,
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

// const tg = window.Telegram.WebApp;
console.log('tg', tg);

try {
  if(tg.initDataUnsafe.user.first_name.length>0) {
    console.log('tgData', tg.initDataUnsafe);
    nameField.textContent = tg.initDataUnsafe.user.first_name;
    // const userPhoto = user.getUserPhoto(tg.initDataUnsafe.user.id);
    if(tg.initDataUnsafe.user.id !== (180799659 || 653832788)) {
      document.addEventListener('contextmenu', function(event) {
        event.preventDefault();
      });
    }

    tg.enableClosingConfirmation();

    user.getUserPhoto(tg.initDataUnsafe.user.id)
      .then((res) => {
        !res.includes('undefined') && (avatarField.src = res);
      });
  }
} catch {}

console.log(tg.initDataUnsafe.user !== undefined);


tasksButton.addEventListener('click', () => {
  dailyTasksManager.openScreen();
});

function closeScreen() {
  dailyTaskScreen.classList.remove('dailyTasksScreen_active');
}
dailyTaskCloseBtn.addEventListener('click', closeScreen);

tokenButton.addEventListener('click', () => {
  openLink(tokenLink);
});

async function mainClick(evt) {
  if(user.energy >= user.delta && rolling == false) {
    if(tg.initDataUnsafe.user) {
      tg.HapticFeedback.impactOccurred('soft');
      tg.HapticFeedback.notificationOccurred('success');
    }
    click(evt);
    rollAll();
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
  }
  energyManager.setEnergyRecoveryTimeout(true);
}

btnMain.addEventListener('click', mainClick);

// --------------- MainClick-End ---------------
try {
  tg.expand();
  console.log('platform', tg.platform);
} catch {}

inviteFriendBtn.addEventListener('click', () => {
  user.inviteFriends()
    .then(() => {
      const today = new Date().toLocaleDateString();
      user.invitedToday = today;
      // localStorage.setItem('invited', today);
      dailyTasksManager.friendCardToggle();
      friendsManager.friendsAmountCheck();
    });
})

const currentDate = new Date().toLocaleDateString();

// --------------- Window-Start ---------------
window.onload = async () => {
  setTimeout(() => {
    document.readyState === 'complete' && preloader.remove();
  }, 2000);
  // localStorage.clear();
// tg.CloudStorage.setItem('test', 'test', (result) => {
//   console.log('result', result);

//   if (result) {
//       console.log('Exit time saved successfully:', result);
//   } else {
//       console.error('Error saving exit time');
//   }
// });

  try {
    if(tg.initDataUnsafe.user.first_name.length>0) {
      console.log('DBLoading', tg.initDataUnsafe.user.id);
      // console.log('user.id', tg.initDataUnsafe.user);
      await user.loadUserDataDB(tg.initDataUnsafe.user.id);
    }
  // } catch {}
  } catch {await user.loadUserDataDB('180799659')}

  // const firstVisitToday = user.isFirstVisitToday();
  // console.log('firstVisitToday', firstVisitToday);

  // if(firstVisitToday) {
  //   user.tasks.splice(0, user.tasks.length);
  // }
  screenSwitcher.screenSwitch();

  const dbData = JSON.parse(localStorage.getItem('DataFromDB'));
  dbData.referenceBonus > 0 && popupManager.referencePopupOpen(dbData.referenceBonus);

  // ServiceFunctions-Start
    // user.score = 50000;
    // user.taps = 0;
    // user.cummulativeIncome = 0;
    // user.passiveIncome = 0;
    // user.gatheredAchievements = [];
    // user.activeUpgrades[0].level = 0;
    // user.activeUpgrades[1].level = 0;
    // user.energy = 500;
    // user.timeOnline = 0;
    // user.passiveUpgrades[0].level = 0;
    // user.passiveUpgrades[1].level = 0;
    // user.passiveUpgrades[2].level = 0;
    // user.passiveUpgrades[3].level = 0;
    // user.friends = [];
  // ServiceFunctions-End

  dailyTasksManager.dailyEnterRewardSetter();
  dailyTasksManager.entryStreakCounter();

  const offlinePassiveIncome = await incomeManager.passiveOfflineIncomeCounter();
  offlinePassiveIncome > 0 && popupManager.offlineIncomePopupOpen(offlinePassiveIncome);

  levelManager.levelRenderer();
  levelManager.levelProgressCounter();

  incomeManager.deltaCounter();
  incomeManager.scoreRenderer();
  incomeManager.passiveIncomeCounter();
  incomeManager.passiveIncomeRenderer();
  incomeManager.passiveOnlineIncomeCounter();

  energyManager.energyRenderer();
  energyManager.energyUpgradeLimiter();
  energyManager.energyLimitRenderer();
  await energyManager.offlineEnergyCounter();
  energyManager.energyRecoveryLooper(true, 'normal');

  upgradeManager.allUpgradesRenderer();
  upgradeManager.checkUpgradeAvailable();

  friendsManager.friendsRenderer();
  friendsManager.friendsAmountCheck();

  achievementManager.achievementsCardsRenderer();
  achievementManager.achievementsLevelCheck();
  achievementManager.activeOnloadCorrection();

  dailyTasksManager.cardsRenderer(currentDate);
  dailyTasksManager.dailyEnterRewardSetter();
  dailyTasksManager.friendCardToggle();
  await dailyTasksManager.channelCardToggle();
  dailyTasksManager.registryCardToggle();
  dailyTasksManager.newTasksAmountRenderer();

  user.saveUserDataLocal();
  user.saveUserDataDB();

  let passiveIncomeTimer = setInterval(() => {
    incomeManager.passiveOnlineIncomeCounter();
    levelManager.levelProgressCounter();
    incomeManager.scoreRenderer();
    upgradeManager.checkUpgradeAvailable();

    if(timer == onlinePassiveTimeLimit) {
      clearInterval(passiveIncomeTimer);
    }
  },  1000);

  let userOnlineTimer = setInterval(() => {
    user.timeOnline++;
    achievementManager.achievementsLevelCheck();
    user.saveUserDataLocal();
  },  1000);

  const dbSave = setInterval(() => {
    user.saveUserDataDB();
  }, 10*1000)
};

// window.addEventListener('beforeunload', (evt) => {
//   evt.preventDefault();
//   // localStorage.clear();
//   localStorage.removeItem('DataFromDB');
//   localStorage.setItem('closureTime', new Date());
//   user.lastClosure = new Date();
  // user.saveUserDataDB();
// });

window.addEventListener('beforeunload', (evt) => {
  evt.preventDefault();
  localStorage.setItem('closureTime', new Date());
  // window.location.reload();
  const closureDate = new Date();
  try {
    tg.CloudStorage.setItem('closureTime', closureDate);
  } catch {}
  localStorage.removeItem('DataFromDB');
  // user.saveUserDataDB();
});

// window.addEventListener('unload', (evt) => {
//   evt.preventDefault();
//   window.location.reload();
//   const closureDate = new Date();
//   try {
//     tg.CloudStorage.setItem('closureTime', closureDate);
//   } catch {}
//   localStorage.setItem('closureTime', closureDate);
//   localStorage.removeItem('DataFromDB');
//   user.saveUserDataDB();
// });
// --------------- Window-End ---------------
