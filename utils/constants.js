// const TMA = window.Telegram.WebApp;

// const BASE_URL = 'https://api.scherbinin.diploma.nomoredomains.club';
const BASE_URL = 'http://localhost:3200';

const passiveOfflineIncomeHoursLimit = 3;
const onlinePassiveTimeLimit = 3600 * passiveOfflineIncomeHoursLimit;

const nameField = document.querySelector('.userBar__userName');

const page = document.querySelector('.page');
const btnMain = document.querySelector('.mainScreen__button');
// const scoreDisplay = document.querySelector('.mainScreen__deltaAnimDisplay');

const navSection = document.querySelector('.navigation');

// const activeUpgradesField = document.querySelector('.upgradesScreen__upgradesField_type_active');
// const passiveUpgradesField = document.querySelector('.upgradesScreen__upgradesField_type_passive');

const taskCardsField = document.querySelector('.tasksScreen__cardField');
const inviteFriendBtn = document.querySelector('.tasksScreen__inviteBtn');

const achievementCardsField = document.querySelector('.achievementsScreen__cardField');

const upgradeCardTemplate = document.querySelector('#upgradeCard').content;
const wideCardTemplate = document.querySelector('#wideCard').content;

const popupTitle = document.querySelector('.popup__title');
const popupMessage = document.querySelector('.popup__message');
const popupImage = document.querySelector('.popup__image');

const currentUpgrades = [];

const deltaUpgrade = activeUpgrades.find(upgrade => upgrade.id === 1);
const energyUpgrade = activeUpgrades.find(upgrade => upgrade.id === 2);

const passiveAchievements = achievements.filter(obj => obj.type === 'passive');

// let score = 0;  // make condition of loaded data
// let delta = 1;  // make condition of loaded data
