class LevelManager {
  constructor(user) {
    this.user = user;
    this.levelField = document.querySelector('.userBar__levelScore');
    this.progressBar = document.querySelector('.userBar__progressBarInner');
    this.btnMain = document.querySelector('.mainScreen__button');
    this.a = 30;
    this.c = 70;
  }

  _mainButtonChanger() {
    this.user.level >= 1 && (this.btnMain.style.backgroundImage = `url('./images/main-button.png')`);
    this.user.level >= 10 && (this.btnMain.style.backgroundImage = `url('./images/main-button-${10}lvl.png')`);
    this.user.level >= 20 && (this.btnMain.style.backgroundImage = `url('./images/main-button-${20}lvl.png')`);
    this.user.level >= 30 && (this.btnMain.style.backgroundImage = `url('./images/main-button-${30}lvl.png')`);
    this.user.level >= 40 && (this.btnMain.style.backgroundImage = `url('./images/main-button-${40}lvl.png')`);
    this.user.level >= 50 && (this.btnMain.style.backgroundImage = `url('./images/main-button-${50}lvl.png')`);
    this.user.level >= 60 && (this.btnMain.style.backgroundImage = `url('./images/main-button-${60}lvl.png')`);
    this.user.level >= 70 && (this.btnMain.style.backgroundImage = `url('./images/main-button-${70}lvl.png')`);
    this.user.level >= 80 && (this.btnMain.style.backgroundImage = `url('./images/main-button-${80}lvl.png')`);
    this.user.level >= 90 && (this.btnMain.style.backgroundImage = `url('./images/main-button-${90}lvl.png')`);
    this.user.level >= 100 && (this.btnMain.style.backgroundImage = `url('./images/main-button-${100}lvl.png')`);
    this.user.level >= 110 && (this.btnMain.style.backgroundImage = `url('./images/main-button-${110}lvl.png')`);
    this.user.level >= 120 && (this.btnMain.style.backgroundImage = `url('./images/main-button-${120}lvl.png')`);
    this.user.level >= 130 && (this.btnMain.style.backgroundImage = `url('./images/main-button-${130}lvl.png')`);
  }

  levelRenderer() {
    this.levelField.textContent = `${formatNumberWithSpaces(this.user.level)}`;
    this._mainButtonChanger();
  }

  progressBarRenderer(prevLimit, currentLimit) {
    if(this.user.cummulativeIncome > 0) {
      if(this.user.level === 1) {
        prevLimit = 0;
      }
      const progress = (this.user.cummulativeIncome - prevLimit) / (currentLimit - prevLimit) * 100;

      this.progressBar.style.width = `${progress}%`;
    } else {
      this.progressBar.style.width = `0%`;
    }
  }

  levelLimitCounter(level) {
    const levelLimit = this.a * Math.pow(level, 2) + this.c;
    return levelLimit;
  }

  levelProgressCounter() {
    // const prevLevel = this.user.level;
    // console.log('prevLevel', prevLevel);
    this.user.level = Math.floor(Math.sqrt((this.user.cummulativeIncome - this.c) / this.a)) + 1 || 1;
    // levelRewarder(prevLevel, this.user.level);
    const prevLimit = this.levelLimitCounter(this.user.level-1);
    const currentLimit = this.levelLimitCounter(this.user.level);

    // (this.user.cummulativeIncome >= currentLimit) && this.user.level++;
    this.progressBarRenderer(prevLimit, currentLimit);
    this.levelRenderer();
  }

  // levelRewarder(prevLevel, currentLevel) {
    //   this.levelDelta = currentLevel - prevLevel;
    //   this.rewardMultiplier = 10;
    //   let reward;
    //   for(i=prevLevel; i<currentLevel; i++) {
    //     // console.log(i);

    //     reward = reward + (i+1)*rewardMultiplier;
    //   }
    //   // console.log('reward', reward);
    // }

}
