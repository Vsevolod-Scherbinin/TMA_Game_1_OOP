// const TMA = window.Telegram.WebApp;
const passiveOfflineIncomeHoursLimit = 3;
const onlinePassiveTimeLimit = 3600 * passiveOfflineIncomeHoursLimit;

const nameField = document.querySelector('.userBar__userName');
const levelField = document.querySelector('.userBar__levelScore');
const progressBar = document.querySelector('.userBar__progressBarInner');

const btnMain = document.querySelector('.mainScreen__button');
const scoreField = document.querySelector('.scoreArea__score');

const navSection = document.querySelector('.navigation');
const btnMainScreen = document.querySelector('.navigation__button_type_main');
const btnUpgrades = document.querySelector('.navigation__button_type_upgrades');
const btnTasks = document.querySelector('.navigation__button_type_tasks');
const btnAchievements = document.querySelector('.navigation__button_type_achievement');

const mainScreen = document.querySelector('.mainScreen');
const passiveIncomeScoreField = document.querySelector('.passiveIncome__score');
// const energyScoreField = document.querySelector('.energyArea__score');
// const energyLimitField = document.querySelector('.energyArea__limit');

const upgradesScreen = document.querySelector('.upgradesScreen');
const passiveUpgradesField = document.querySelector('.upgradesScreen__upgradesField_type_passive');
const activeUpgradesField = document.querySelector('.upgradesScreen__upgradesField_type_active');

const tasksScreen = document.querySelector('.tasksScreen');
const taskCardsField = document.querySelector('.tasksScreen__cardField');
const inviteFriendBtn = document.querySelector('.tasksScreen__inviteBtn');

const achievementsScreen = document.querySelector('.achievementsScreen');
const achievementCardsField = document.querySelector('.achievementsScreen__cardField');

const upgradeCardTemplate = document.querySelector('#upgradeCard').content;
const wideCardTemplate = document.querySelector('#wideCard').content;

const popup = document.querySelector('.popup');
const popupTitle = document.querySelector('.popup__title');
const popupMessage = document.querySelector('.popup__message');
const popupImage = document.querySelector('.popup__image');
// const taskCardTemplate = document.querySelector('#wideCard').content;
// const achievementCardTemplate = document.querySelector('#wideCard').content;

const currentUpgrades = [];

const deltaUpgrade = activeUpgrades.find(upgrade => upgrade.id === 1);
const energyUpgrade = activeUpgrades.find(upgrade => upgrade.id === 2);

const passiveAchievements = achievements.filter(obj => obj.type === 'passive');

// let score = 0;  // make condition of loaded data
// let delta = 1;  // make condition of loaded data
