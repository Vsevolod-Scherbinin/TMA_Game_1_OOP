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

const popupManager = new PopupManager(
  user,
  incomeManager.scoreCounter.bind(incomeManager),
  achievementManager.achievementGathering.bind(achievementManager),
  achievementManager.achievementsLevelCheck.bind(achievementManager),
);

const levelManager = new LevelManager(user);

const screenSwitcher = new ScreenSwitcher();
screenSwitcher.setEventListeners();

let timer = 0;

// --------------- WideCards-End ---------------
function createTaskCards(elem) {
  const taskCardElement = wideCardTemplate.cloneNode(true);
  taskCardElement.querySelector('.wideCard__title').textContent = elem.title;
  return taskCardElement;
}

function createWideCards(elem) {
  const wideCardElement = wideCardTemplate.cloneNode(true);
  wideCardElement.querySelector('.wideCard__icon').src = elem.mainIcon;
  wideCardElement.querySelector('.wideCard__title').textContent = elem.title;
  wideCardElement.querySelector('.wideCard__description').textContent = elem.description;
  wideCardElement.querySelector('.wideCard__effectIcon').src = elem.effectIcon;
  wideCardElement.querySelector('.wideCard__effect').textContent = `+${formatNumberWithSpaces(elem.effect)}`;
  return wideCardElement;
}

const tasksButton = document.querySelector('.tasksButton');
const channelId = '-1002493343663';
function subscribe() {
  window.open(`https://t.me/+cU6JKcOAFuphZTli`, '_blank');
}
tasksButton.addEventListener('click', subscribe);

// --------------- WideCards-End ---------------

// --------------- CardsRenderer-Start ---------------
function tasksRenderer() {
  tasks.forEach((elem) => {
    taskCardsField.append(createWideCards(elem));
    // taskCardsField.append(createTaskCards(elem));
  });
}

// --------------- CardsRenderer-End ---------------
// const scoreDisplay = document.createElement('div');
// scoreDisplay.classList.add('mainScreen__deltaAnimDisplay');
// page.appendChild(scoreDisplay);
// scoreDisplay.textContent = `+1`;
// scoreDisplay.style.left = `100px`;
// scoreDisplay.style.top = `500px`;

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
  }
} catch {}

// async function loadUserDataMDB(userId) {
//   console.log('DataLoading');

//   const response = await fetch(`${BASE_URL}/users/${userId}`);
//   // const response = await fetch(`https://api.scherbinin.mesto.nomoredomains.club/users/${userId}`);
//   const data = await response.json();
//   console.log('Данные пользователя загружены:', data);
//   return data;
// }

// if(tg.initDataUnsafe.user !== undefined) {
  console.log('user.id', tg.initDataUnsafe.user);
  user.loadUserDataMDB('180799659');
  // user.loadUserDataMDB(tg.initDataUnsafe.user.id);
// }

console.log(tg.initDataUnsafe.user !== undefined);

function mainClick(evt) {
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
    // achievementsCheckTaps();
    achievementManager.achievementsContentRenderer();
    user.saveUserDataLocal();
    user.saveUserDataDB();
  }
  energyManager.setEnergyRecoveryTimeout(true);
}

btnMain.addEventListener('click', mainClick);

// --------------- MainClick-End ---------------

try {
  tg.expand();
} catch {}

function inviteFriends() {
  const inviteLink = `https://t.me/FirstTGTest_bot?start=referral_id=${tg.initDataUnsafe.user.id}`;
  const message = `Привет! Я нашел этот классный канал/бота и хочу, чтобы ты тоже его посмотрел! ${inviteLink}`;
  tg.sendData(message);
  const shareLink = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(message)}`;
  window.open(shareLink, '_blank');
}

inviteFriendBtn.addEventListener('click', inviteFriends);

async function checkUserSubscription(channelId, userId) {
  try {
    const response = await fetch('http://localhost:3200/checkSubscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, channelId }),
    });

    const data = await response.json();
    if (data.subscribed) {
      console.log('Пользователь подписан на канал!');
    } else {
      console.log('Пользователь не подписан на канал!');
    }
  } catch (error) {
    console.error('Ошибка при проверке подписки:', error);
  }
}

// --------------- Window-Start ---------------
window.onload = async () => {
  // localStorage.clear();
  // Subscribtion Test
  checkUserSubscription(-1002493343663, 180799659);
  checkUserSubscription(-1002493343663, 653832788);

  localStorage.setItem('DataFromDB', JSON.stringify(await user.loadUserDataMDB('180799659')));
  const dbData = JSON.parse(localStorage.getItem('DataFromDB'));

  dbData.referenceBonus > 0 && popupManager.referencePopupOpen(dbData.referenceBonus, dbData);
  // dbData.referenceBonus > 0 && popupManager.referencePopupOpen(dbData.referenceBonus);

  user.loadUserData();
  // ServiceFunctions-Start
    // user.score = 50000;
    // user.gatheredAchievements = [];
    // user.activeUpgrades[0].level = 0;
    // user.energy = 500;
    // user.passiveUpgrades[0].level = 0;
    // user.saveUserDataLocal();
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
  tasksRenderer();
  user.saveUserDataLocal();
  achievementManager.achievementsCardsRenderer();
  achievementManager.achievementsLevelCheck();
  achievementManager.achievementsContentRenderer();

  // Make separate function as energy
  let passiveIncomeTimer = setInterval(() => {
    // Move unlimited functions to userOnlineTimer
    incomeManager.passiveOnlineIncomeCounter();
    levelManager.levelProgressCounter();
    incomeManager.scoreRenderer();
    upgradeManager.checkUpgradeAvailable();
    achievementManager.achievementsLevelCheck();
    achievementManager.achievementsContentRenderer();

    user.saveUserDataLocal();

    if(timer == onlinePassiveTimeLimit) {
      clearInterval(passiveIncomeTimer);
    }
  },  1000);

  // let userOnlineTimer = setInterval(() => {
  //   user.timeOnline++;
  //   user.saveUserDataLocal();
  // },  1000);

  energyManager.energyRecoveryLooper(true, 'normal');

};

window.addEventListener('beforeunload', (evt) => {
  evt.preventDefault();
  localStorage.setItem('closureTime', new Date());
});
// --------------- Window-End ---------------
