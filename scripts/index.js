// ToDo
// Classes
  // Popup & Achievements
  // LevelManager

// Fonts
// New Icons

// Later
// Friends!!
// Updating Model Safe!!!
// DataBase??

// Clean constants

// localStorage.clear();

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

const popupManager = new PopupManager (
  user,
  incomeManager.scoreCounter.bind(incomeManager),
  achievementManager.achievementGathering.bind(achievementManager),
  achievementManager.achievementsLevelCheck.bind(achievementManager),
);

const screenSwitcher = new ScreenSwitcher();
screenSwitcher.setEventListeners();

let timer = 0;

function offlineTimeCounter() {
  const closureDate = localStorage.getItem('closureTime');
  if(closureDate) {
    const now = new Date();
    const closureTime = new Date(closureDate);
    const timeDelta = now - closureTime
    const timeDeltaInSeconds = Math.floor(timeDelta / 1000);
    return timeDeltaInSeconds;
  }
}

// --------------- Level-Start ---------------
function levelRenderer() {
  levelField.textContent = `${formatNumberWithSpaces(user.level)}`;
}

function progressBarRenderer(prevLimit, currentLimit) {
  if(user.cummulativeIncome > 0) {
    if(user.level === 1) {
      prevLimit = 0;
    }
    const progress = (user.cummulativeIncome - prevLimit) / (currentLimit - prevLimit) * 100;
    progressBar.style.width = `${progress}%`;
  } else {
    progressBar.style.width = `0%`;
  }

}

const a = 30;
const c = 70;
function levelLimitCounter(level) {
  const levelLimit = a * Math.pow(level, 2) + c;
  return levelLimit;
}

// To Income Manager or LevelManager
// function levelRewarder(prevLevel, currentLevel) {
//   const levelDelta = currentLevel - prevLevel;
//   const rewardMultiplier = 10;
//   let reward;
//   for(i=prevLevel; i<currentLevel; i++) {
//     // console.log(i);

//     reward = reward + (i+1)*rewardMultiplier;
//   }
//   // console.log('reward', reward);
// }

function levelProgressCounter() {
  // const prevLevel = user.level;
  // console.log('prevLevel', prevLevel);
  user.level = Math.floor(Math.sqrt((user.cummulativeIncome - c) / a)) + 1 || 1;
  // levelRewarder(prevLevel, user.level);
  const prevLimit = levelLimitCounter(user.level-1);
  const currentLimit = levelLimitCounter(user.level);

  // (user.cummulativeIncome >= currentLimit) && user.level++;
  progressBarRenderer(prevLimit, currentLimit);
  levelRenderer();
}
// --------------- Level-End ---------------

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

function createAchievementsCard(elem, level) {
  const levelData = elem.levels.find(obj => obj.level === level);
  const achievementCardElement = wideCardTemplate.cloneNode(true);
  achievementCardElement.querySelector('.wideCard').classList.add(`wideCard_type_achievement`);
  achievementCardElement.querySelector('.wideCard').classList.add(`wideCard_id_${elem.id}`);
  achievementCardElement.querySelector('.wideCard__icon').src = levelData.mainIcon;
  achievementCardElement.querySelector('.wideCard__title').textContent = elem.title;
  achievementCardElement.querySelector('.wideCard__description').textContent = levelData.description;
  achievementCardElement.querySelector('.wideCard__effectIcon').src = elem.effectIcon;
  achievementCardElement.querySelector('.wideCard__effect').textContent = `+${formatNumberWithSpaces(levelData.effect)}`;
  return achievementCardElement;
}
// --------------- WideCards-End ---------------

// --------------- CardsRenderer-Start ---------------
function allUpgradesRenderer() {
  console.log('Upgrades');

  activeUpgrades.forEach((elem) => {
    activeUpgradesField.append(createUpgradeCard(elem, 'activeUpgrades'));
  });
  passiveUpgrades.forEach((elem) => {
    passiveUpgradesField.append(createUpgradeCard(elem, 'passiveUpgrades'));
  });
}
// console.log(tasks);

function tasksRenderer() {
  tasks.forEach((elem) => {
    taskCardsField.append(createWideCards(elem));
    // taskCardsField.append(createTaskCards(elem));
  });
}

function inviteFriends() {
  const url = 'https://t.me/FirstTGTest_bot';
  const text = 'Привет! Я нашел этот классный канал/бота и хочу, чтобы ты тоже его посмотрел!';

  // Используем Telegram Web Apps API для открытия ссылки
  window.Telegram.WebApp.sendData(JSON.stringify({url: url, text: text}));
  // console.log('Invitation');
}
// --------------- CardsRenderer-End ---------------

inviteFriendBtn.addEventListener('click', inviteFriends);

// --------------- MainClick-Start ---------------

function mainClick() {
  if(user.energy > user.delta) {
    user.taps++;
    user.activeIncome = user.activeIncome + user.delta;
    energyManager.setEnergyRecoveryTimeout(false);
    energyManager.energyRecoveryLooper(false)
    incomeManager.scoreCounter();
    incomeManager.scoreRenderer();
    levelProgressCounter();
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
// --------------- MainClick-End ---------------


// --------------- Window-Start ---------------

window.onload = () => {
  user.loadUserData();
  // ServiceFunctions-Start
    // totalExpencesCounter();
    // user.score = 100000;
    user.score = 50000;
    // user.gatheredAchievements = [];
    // user.activeUpgrades[0].level = 0;
    // user.energy = 500;
    // user.passiveUpgrades[0].level = 0;
    user.saveUserData();
  // ServiceFunctions-End
  const offlinePassiveIncome = incomeManager.passiveOfflineIncomeCounter(offlineTimeCounter());
  offlinePassiveIncome > 0 && popupManager.offlineIncomePopupOpen(offlinePassiveIncome);
  screenSwitcher.screenSwitch();
  upgradeManager.checkUpgradeAvailable();
  levelRenderer();
  levelProgressCounter();
  incomeManager.deltaCounter();
  user.saveUserData();
  incomeManager.scoreRenderer();
  energyManager.energyRenderer();
  incomeManager.passiveIncomeCounter();
  incomeManager.passiveIncomeRenderer();
  incomeManager.passiveOnlineIncomeCounter();
  // energyRenderer();
  energyManager.energyUpgradeLimiter();
  energyManager.energyLimitRenderer();
  // energyLimitRenderer();
  allUpgradesRenderer();
  tasksRenderer();
  user.saveUserData();
  achievementManager.achievementsCardsRenderer();
  // attributeSetter();
  achievementManager.achievementsLevelCheck();
  achievementManager.achievementsContentRenderer();

  // Make separate function as energy
  let passiveIncomeTimer = setInterval(() => {
    // Move unlimited functions to userOnlineTimer
    incomeManager.passiveOnlineIncomeCounter();
    levelProgressCounter();
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
    if(window.Telegram.WebApp.initDataUnsafe.length>0) {
      nameField.textContent = window.Telegram.WebApp.initDataUnsafe.user.first_name;
    }
};

window.addEventListener('beforeunload', (evt) => {
  evt.preventDefault();
  localStorage.setItem('closureTime', new Date());
});
// --------------- Window-End ---------------

// nameField.textContent = TMA.initDataUnsafe.user.first_name;
// console.log(TMA);
