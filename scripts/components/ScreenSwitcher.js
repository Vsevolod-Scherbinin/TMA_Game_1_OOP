class ScreenSwitcher {
  constructor() {
    this.btnMainScreen = document.querySelector('.navigation__button_type_main');
    this.btnUpgrades = document.querySelector('.navigation__button_type_upgrades');
    this.btnFriends = document.querySelector('.navigation__button_type_friends');
    this.btnAchievements = document.querySelector('.navigation__button_type_achievement');
    this.mainScreen = document.querySelector('.mainScreen');
    this.upgradesScreen = document.querySelector('.upgradesScreen');
    this.friendsScreen = document.querySelector('.friendsScreen');
    this.achievementsScreen = document.querySelector('.achievementsScreen');
  }

  screenSwitch() {
    if(this.btnMainScreen.checked) {
      page.style.backgroundColor = '';
      page.style.backgroundImage = 'url(./images/page-background.png)';
      document.querySelector('.navigation__button_active').classList.remove('navigation__button_active');
      this.btnMainScreen.parentElement.classList.add('navigation__button_active');
      document.querySelector('.screen_active').classList.remove('screen_active');
      this.mainScreen.classList.add('screen_active');
    } else if (this.btnUpgrades.checked) {
      page.style.backgroundColor = '#1A1A1A';
      page.style.backgroundImage = 'none';
      document.querySelector('.navigation__button_active').classList.remove('navigation__button_active');
      this.btnUpgrades.parentElement.classList.add('navigation__button_active');
      document.querySelector('.screen_active').classList.remove('screen_active');
      this.upgradesScreen.classList.add('screen_active');
    } else if (this.btnFriends.checked) {
      page.style.backgroundColor = '#1A1A1A';
      page.style.backgroundImage = 'url(./images/friends-background.png)';
      document.querySelector('.navigation__button_active').classList.remove('navigation__button_active');
      this.btnFriends.parentElement.classList.add('navigation__button_active');
      document.querySelector('.screen_active').classList.remove('screen_active');
      this.friendsScreen.classList.add('screen_active');
    } else if (this.btnAchievements.checked) {
      page.style.backgroundColor = '#1A1A1A';
      page.style.backgroundImage = 'none';
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
    this.btnFriends.addEventListener('click', this.screenSwitch.bind(this));
    this.btnAchievements.addEventListener('click', this.screenSwitch.bind(this));
  }
}
