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
    if(this.btnMainScreen.checked) {
      document.querySelector('.navigation__button_active').classList.remove('navigation__button_active');
      this.btnMainScreen.parentElement.classList.add('navigation__button_active');
      document.querySelector('.screen_active').classList.remove('screen_active');
      this.mainScreen.classList.add('screen_active');
    } else if (this.btnUpgrades.checked) {
      document.querySelector('.navigation__button_active').classList.remove('navigation__button_active');
      this.btnUpgrades.parentElement.classList.add('navigation__button_active');
      document.querySelector('.screen_active').classList.remove('screen_active');
      this.upgradesScreen.classList.add('screen_active');
    } else if (this.btnTasks.checked) {
      document.querySelector('.navigation__button_active').classList.remove('navigation__button_active');
      this.btnTasks.parentElement.classList.add('navigation__button_active');
      document.querySelector('.screen_active').classList.remove('screen_active');
      this.tasksScreen.classList.add('screen_active');
    } else if (this.btnAchievements.checked) {
      document.querySelector('.navigation__button_active').classList.remove('navigation__button_active');
      this.btnAchievements.parentElement.classList.add('navigation__button_active');
      // Review if next function is needed.
      document.querySelector('.screen_active').classList.remove('screen_active');
      this.achievementsScreen.classList.add('screen_active');
    }
  }

  setEventListeners() {
    this.btnMainScreen.addEventListener('click', this.screenSwitch.bind(this));
    this.btnUpgrades.addEventListener('click', this.screenSwitch.bind(this));
    this.btnTasks.addEventListener('click', this.screenSwitch.bind(this));
    this.btnAchievements.addEventListener('click', this.screenSwitch.bind(this));
  }
}
