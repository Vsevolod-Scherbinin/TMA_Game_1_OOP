const user = new User(userDataModel);
user.loadUserData();

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

// --------------- Upgrades-Start ---------------
function upgradeFinder(upgradesArray, name) {
  let foundUpgrade;
  if(upgradesArray == 'activeUpgrades') {
    foundUpgrade = activeUpgrades.find(upgrade => upgrade.title === name);
  } else {
    foundUpgrade = passiveUpgrades.find(upgrade => upgrade.title === name);
  };
  const currentUpgrade = {
    id: foundUpgrade.id,
    levels: foundUpgrade.levels,
  }
  // console.log(currentUpgrade);

  return currentUpgrade;
}

function createUpgradeCard(elem, upgradesArray) {
  const upgradeCardElement = upgradeCardTemplate.cloneNode(true);
  upgradeCardElement.querySelector('.upgradeCard__title').textContent = elem.title;
  upgradeCardElement.querySelector('.upgradeCard__icon').src = elem.mainIcon;
  upgradeCardElement.querySelector('.upgradeCard__effectIcon').src = elem.effectIcon;
  const userUpgradesArray = user[upgradesArray].find(upgrade => upgrade.id === elem.id);

  const currentUpgrade = elem.levels.find(level => level.level === userUpgradesArray.level+1);
  const previousUpgrade = elem.levels.find(level => level.level === userUpgradesArray.level);

  if(currentUpgrade) {
    upgradeCardElement.querySelector('.upgradeCard').addEventListener('click', (evt) => {
      upgradeManager.addUpgrade(evt, upgradesArray);
    });

    upgradeCardElement.querySelector('.upgradeCard__level').textContent = `lvl ${currentUpgrade.level}`;
    upgradeCardElement.querySelector('.upgradeCard__cost').textContent = `${formatNumberWithSpaces(currentUpgrade.cost)}`;

    currentUpgrade.income !== undefined
      ? upgradeCardElement.querySelector('.upgradeCard__effect').textContent = `${formatNumberWithSpaces(currentUpgrade.income)}/час`
      : currentUpgrade.delta !== undefined
        ? upgradeCardElement.querySelector('.upgradeCard__effect').textContent = `${formatNumberWithSpaces(currentUpgrade.delta)}/клик`
        : upgradeCardElement.querySelector('.upgradeCard__effect').textContent = `${formatNumberWithSpaces(currentUpgrade.energyLimit)}`;
  } else {
    upgradeCardElement.querySelector('.upgradeCard__level').textContent = `lvl Max`;
    upgradeCardElement.querySelector('.upgradeCard__costArea').remove();

    previousUpgrade.income !== undefined
      ? upgradeCardElement.querySelector('.upgradeCard__effect').textContent = `${formatNumberWithSpaces(previousUpgrade.income)}`
      : previousUpgrade.delta !== undefined
        ? upgradeCardElement.querySelector('.upgradeCard__effect').textContent = `${formatNumberWithSpaces(previousUpgrade.delta)}`
        : upgradeCardElement.querySelector('.upgradeCard__effect').textContent = `${formatNumberWithSpaces(previousUpgrade.energyLimit)}`;
  }


  return upgradeCardElement;
};
// --------------- Upgrades-End ---------------

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
  const scoreDisplay = document.createElement('div');
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
// btnMain.addEventListener('click', click);
// btnMain.addEventListener('touchend', click);

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

async function loadUserDataMDB(userId) {
  console.log('DataLoading');

  const response = await fetch(`https://api.scherbinin.mesto.nomoredomains.club/getUserData/${userId}`);
  // const response = await fetch(`http://51.250.34.225:3200/getUserData/${userId}`);
  const data = await response.json();
  console.log('Данные пользователя загружены:', data);
  return data;
}

// if(tg.initDataUnsafe.user !== undefined) {
  // console.log('user.id', tg.initDataUnsafe.user.id);
  loadUserDataMDB('180799659');
  // loadUserDataMDB(tg.initDataUnsafe.user.id);
// }

console.log(tg.initDataUnsafe.user !== undefined);


function mainClick() {
  if(user.energy > user.delta) {
    if(tg.initDataUnsafe.user) {
      tg.HapticFeedback.impactOccurred('soft');
      tg.HapticFeedback.notificationOccurred('success');
    }
    click(evt);
    user.taps++;
    user.activeIncome = user.activeIncome + user.delta;
    energyManager.setEnergyRecoveryTimeout(false);
    energyManager.energyRecoveryLooper(false)
    incomeManager.scoreCounter();
    incomeManager.scoreRenderer();
    levelManager.levelProgressCounter();
    energyManager.energyCounter();
    energyManager.energyRenderer();
    incomeManager.cummulativeIncomeCounter();
    upgradeManager.checkUpgradeAvailable();
    // achievementsCheckTaps();
    achievementManager.achievementsContentRenderer();
    // console.log('taps', user.taps);
    // user.saveUserData();
    user.saveUserData();
  }
  energyManager.setEnergyRecoveryTimeout(true);
}

btnMain.addEventListener('click', mainClick);

// btnMain.addEventListener('touchstart', () => {
//   btnMain.classList.add('mainScreen__button_active');
// });

// btnMain.addEventListener('touchend', () => {
//   btnMain.classList.remove('mainScreen__button_active');
// });
// --------------- MainClick-End ---------------


// Full Screen
try {
  tg.expand();
} catch {}

function inviteFriends() {
  const inviteLink = `https://t.me/FirstTGTest_bot?start=invite_friends&referral_id=${tg.initDataUnsafe.user.id}`;
  const message = `Привет! Я нашел этот классный канал/бота и хочу, чтобы ты тоже его посмотрел! ${inviteLink}`;
  tg.sendData(message);
  const shareLink = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(message)}`;
  window.open(shareLink, '_blank');
}

inviteFriendBtn.addEventListener('click', inviteFriends);


// --------------- Window-Start ---------------
window.onload = () => {
// localStorage.clear();
  user.loadUserData();
  // ServiceFunctions-Start
    user.score = 50000;
    // user.gatheredAchievements = [];
    // user.activeUpgrades[0].level = 0;
    // user.energy = 500;
    // user.passiveUpgrades[0].level = 0;
    user.saveUserData();
  // ServiceFunctions-End
  const offlinePassiveIncome = incomeManager.passiveOfflineIncomeCounter();
  offlinePassiveIncome > 0 && popupManager.offlineIncomePopupOpen(offlinePassiveIncome);
  screenSwitcher.screenSwitch();
  upgradeManager.checkUpgradeAvailable();
  levelManager.levelRenderer();
  levelManager.levelProgressCounter();
  incomeManager.deltaCounter();
  user.saveUserData();
  incomeManager.scoreRenderer();
  energyManager.energyRenderer();
  incomeManager.passiveIncomeCounter();
  incomeManager.passiveIncomeRenderer();
  incomeManager.passiveOnlineIncomeCounter();
  energyManager.energyUpgradeLimiter();
  energyManager.energyLimitRenderer();
  upgradeManager.allUpgradesRenderer();
  tasksRenderer();
  user.saveUserData();
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

    user.saveUserData();

    if(timer == onlinePassiveTimeLimit) {
      clearInterval(passiveIncomeTimer);
    }
  },  1000);

  let userOnlineTimer = setInterval(() => {
    user.timeOnline++;
    user.saveUserData();
  },  1000);

  energyManager.energyRecoveryLooper(true, 'normal');

    // if(tg.initDataUnsafe.length>0) {
    //   console.log('tgData', tg.initDataUnsafe);
    //   nameField.textContent = tg.initDataUnsafe.user.first_name;
    // }
};

window.addEventListener('beforeunload', (evt) => {
  evt.preventDefault();
  localStorage.setItem('closureTime', new Date());
});
// --------------- Window-End ---------------

// // Функция для обработки параметров при запуске бота
// function handleStartParams() {
//     const params = tg.initDataUnsafe;

//     // Проверяем, есть ли параметры
//     if (params && params.query) {
//         const queryParams = new URLSearchParams(params.query);
//         const referralId = queryParams.get('referral_id');

//         if (referralId) {
//             // Отправляем приветственное сообщение с информацией о приглашении
//             alert(`Вы пришли по приглашению пользователя с ID: ${referralId}`);
//         }
//     }
// }

// // Обработчик нажатия на кнопку
// document.querySelector('.tasksScreen__inviteBtn').onclick = function() {
//     const inviteLink = `https://t.me/${tg.initDataUnsafe.user.username}?start=invite_friends&referral_id=${tg.initDataUnsafe.user.id}`;
//     const message = `Пригласите своих друзей по ссылке: ${inviteLink}`;

//     // Отправляем сообщение в чат с помощью Telegram Web App API
//     tg.sendMessage(message);
// };

// // Вызываем функцию для обработки параметров
// handleStartParams();

// nameField.textContent = TMA.initDataUnsafe.user.first_name;
// console.log(TMA);
