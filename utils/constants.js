// const TMA = window.Telegram.WebApp;

// const BASE_URL = 'https://api.scherbinin.mesto.nomoredomains.club';
const BASE_URL = 'http://localhost:3200';

const passiveOfflineIncomeHoursLimit = 3;
const onlinePassiveTimeLimit = 3600 * passiveOfflineIncomeHoursLimit;

const nameField = document.querySelector('.userBar__userName');
const avatarField = document.querySelector('.userBar__userAvatar');

const page = document.querySelector('.page');
const btnMain = document.querySelector('.mainScreen__button');
// const scoreDisplay = document.querySelector('.mainScreen__deltaAnimDisplay');

const navSection = document.querySelector('.navigation');

const tasksButton = document.querySelector('.tasksButton');
const newTasksIcon = document.querySelector('.tasksButton__newTasksCount');


const dailyTaskScreen = document.querySelector('.dailyTasksScreen');
const dailyTaskCloseBtn = document.querySelector('.dailyTasksScreen__closeButton');

const friendsCardsField = document.querySelector('.friendsScreen__cardField');
const inviteFriendBtn = document.querySelector('.friendsScreen__inviteBtn');

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

const tokenButton = document.querySelector('.userBar__button');
const tokenLink = 'https://t.me/+cU6JKcOAFuphZTli';

let dailyEnterRewards = [];

// let score = 0;  // make condition of loaded data
// let delta = 1;  // make condition of loaded data
