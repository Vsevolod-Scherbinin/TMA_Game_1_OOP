class ScreenSwitcher {
  constructor() {
    this.btnMainScreen = document.querySelector('.navigation__button_type_main');
    this.btnUpgrades = document.querySelector('.navigation__button_type_upgrades');
    this.btnTasks = document.querySelector('.navigation__button_type_tasks');
    this.btnAchievements = document.querySelector('.navigation__button_type_achievement');
    this.mainScreen = document.querySelector('.mainScreen');
    this.upgradesScreen = document.querySelector('.upgradesScreen');
    this.tasksScreen = document.querySelector('.tasksScreen');
    this.achievementsScreen = document.querySelector('.achievementsScreen');
  }

  screenSwitch() {
    console.log(this.btnMainScreen);
    console.log(this.btnUpgrades);
    console.log(this.btnTasks);
    console.log(this.btnAchievements);

    if(this.btnMainScreen.checked) {
      document.querySelector('.screen_active').classList.remove('screen_active');
      document.querySelector('.navigation__btnName_active').classList.remove('navigation__btnName_active');
      this.btnMainScreen.parentElement.querySelector('.navigation__buttonIcon').src = './images/mainscreen-button-icon-active.png';
      this.btnUpgrades.parentElement.querySelector('.navigation__buttonIcon').src = './images/upgrade-button-icon-inactive.png';
      this.btnTasks.parentElement.querySelector('.navigation__buttonIcon').src = './images/friends-button-icon-inactive.png';
      this.btnAchievements.parentElement.querySelector('.navigation__buttonIcon').src = './images/achievements-button-icon-inactive.png';
      this.btnMainScreen.parentElement.querySelector('.navigation__btnName').classList.add('navigation__btnName_active');
      this.mainScreen.classList.add('screen_active');
    } else if (this.btnUpgrades.checked) {
      document.querySelector('.screen_active').classList.remove('screen_active');
      document.querySelector('.navigation__btnName_active').classList.remove('navigation__btnName_active');
      this.btnMainScreen.parentElement.querySelector('.navigation__buttonIcon').src = './images/mainscreen-button-icon-inactive.png';
      this.btnUpgrades.parentElement.querySelector('.navigation__buttonIcon').src = './images/upgrade-button-icon-active.png';
      this.btnTasks.parentElement.querySelector('.navigation__buttonIcon').src = './images/friends-button-icon-inactive.png';
      this.btnAchievements.parentElement.querySelector('.navigation__buttonIcon').src = './images/achievements-button-icon-inactive.png';
      this.btnUpgrades.parentElement.querySelector('.navigation__btnName').classList.add('navigation__btnName_active');
      this.upgradesScreen.classList.add('screen_active');
    } else if (this.btnTasks.checked) {
      document.querySelector('.screen_active').classList.remove('screen_active');
      document.querySelector('.navigation__btnName_active').classList.remove('navigation__btnName_active');
      this.btnMainScreen.parentElement.querySelector('.navigation__buttonIcon').src = './images/mainscreen-button-icon-inactive.png';
      this.btnUpgrades.parentElement.querySelector('.navigation__buttonIcon').src = './images/upgrade-button-icon-inactive.png';
      this.btnTasks.parentElement.querySelector('.navigation__buttonIcon').src = './images/friends-button-icon-active.png';
      this.btnAchievements.parentElement.querySelector('.navigation__buttonIcon').src = './images/achievements-button-icon-inactive.png';
      this.btnTasks.parentElement.querySelector('.navigation__btnName').classList.add('navigation__btnName_active');
      this.tasksScreen.classList.add('screen_active');
    } else if (this.btnAchievements.checked) {
      // Review if next function is needed.
      document.querySelector('.screen_active').classList.remove('screen_active');
      document.querySelector('.navigation__btnName_active').classList.remove('navigation__btnName_active');
      this.btnMainScreen.parentElement.querySelector('.navigation__buttonIcon').src = './images/mainscreen-button-icon-inactive.png';
      this.btnUpgrades.parentElement.querySelector('.navigation__buttonIcon').src = './images/upgrade-button-icon-inactive.png';
      this.btnTasks.parentElement.querySelector('.navigation__buttonIcon').src = './images/friends-button-icon-inactive.png';
      this.btnAchievements.parentElement.querySelector('.navigation__buttonIcon').src = './images/achievements-button-icon-active.png';
      this.btnAchievements.parentElement.querySelector('.navigation__btnName').classList.add('navigation__btnName_active');
      this.achievementsScreen.classList.add('screen_active');
    }
  }

  setEventListeners() {
    this.btnMainScreen.addEventListener('click', this.screenSwitch);
    this.btnUpgrades.addEventListener('click', this.screenSwitch);
    this.btnTasks.addEventListener('click', this.screenSwitch);
    this.btnAchievements.addEventListener('click', this.screenSwitch);
  }

}
