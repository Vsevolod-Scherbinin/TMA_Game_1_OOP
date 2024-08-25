class LevelManager {
  constructor(user) {
    this.user = user;
    this.levelField = document.querySelector('.userBar__levelScore');
    this.progressBar = document.querySelector('.userBar__progressBarInner');
    this.a = 30;
    this.c = 70;
  }

  levelRenderer() {
    this.levelField.textContent = `${formatNumberWithSpaces(this.user.level)}`;
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
