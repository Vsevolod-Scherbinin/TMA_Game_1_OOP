const achievements = [
  {
    id: 1,
    title: 'Самостоятельный',
    effectIcon: './images/coin.png',
    type: 'interactive',
    metric: 'taps',
    levels: [
      {
        level: 0,
        mainIcon: './images/achievement-icon-tap-blank.png',
        description: 'Совершите 1000 тапов',
        limit: 5,
        effect: 10000,
      },
      {
        level: 1,
        mainIcon: './images/achievement-icon-tap-bronze.png',
        description: 'Совершите 5000 тапов',
        limit: 7,
        effect: 100000,
      },
      {
        level: 2,
        mainIcon: './images/achievement-icon-tap-silver.png',
        description: 'Совершите 10000 тапов',
        limit: 9,
        effect: 500000,
      },
      {
        level: 3,
        mainIcon: './images/achievement-icon-tap-gold.png',
        description: 'Top Level',
        effect: 500000,
      },
    ],
  },
  {
    id: 2,
    title: 'Автоматизатор',
    effectIcon: './images/passive-income-icon.png',
    type: 'passive',
    metric: 'passiveIncome',
    levels: [
      {
        level: 0,
        mainIcon: './images/achievement-icon-passive-blank.png',
        description: 'Прокачайте пассивный доход до $1000/час',
        limit: 1000,
        effect: 1000,
      },
      {
        level: 1,
        mainIcon: './images/achievement-icon-passive-bronze.png',
        description: 'Прокачайте  пассивный доход до $10000/час',
        limit: 10000,
        effect: 10000,
      },
      {
        level: 2,
        mainIcon: './images/achievement-icon-passive-silver.png',
        description: 'Прокачайте  пассивный доход до $100000/час',
        limit: 120000,
        effect: 100000,
      },
      {
        level: 3,
        mainIcon: './images/achievement-icon-passive-gold.png',
        description: 'Top Level',
        effect: 100000,
      },
    ],
  },
  {
    id: 3,
    title: 'Капиталист',
    type: 'passive',
    metric: 'score',
    effectIcon: './images/coin.png',
    levels: [
      {
        level: 0,
        mainIcon: './images/achievement-icon-score-blank.png',
        description: 'Достигните состояния в $10000 на счёте',
        limit: 10000,
        effect: 10000,
      },
      {
        level: 1,
        mainIcon: './images/achievement-icon-score-bronze.png',
        description: 'Достигните состояния в $100000 на счёте',
        limit: 100000,
        effect: 100000,
      },
      {
        level: 2,
        mainIcon: './images/achievement-icon-score-silver.png',
        description: 'Достигните состояния в $1000000 на счёте',
        limit: 1000000,
        effect: 250000,
      },
      {
        level: 3,
        mainIcon: './images/achievement-icon-score-gold.png',
        description: 'Top Level',
        effect: 500000,
      },
    ],
  },
  {
    id: 4,
    title: 'Упорный игрок',
    effectIcon: './images/coin.png',
    type: 'passive',
    metric: 'timeOnline',
    levels: [
      {
        level: 0,
        mainIcon: './images/achievement-icon-time-blank.png',
        description: 'Проведите в игре 1 час',
        limit: 3600,
        effect: 10000,
      },
      {
        level: 1,
        mainIcon: './images/achievement-icon-time-bronze.png',
        description: 'Проведите в игре 5 часов',
        limit: 3600 * 5,
        effect: 100000,
      },
      {
        level: 2,
        mainIcon: './images/achievement-icon-time-silver.png',
        description: 'Проведите в игре 10 часов',
        limit: 3600 * 10,
        effect: 250000,
      },
      {
        level: 3,
        mainIcon: './images/achievement-icon-time-gold.png',
        description: 'Top Level',
        effect: 500000,
      },
    ],
  },
  // {
  //   id: 5,
  //   title: 'Энергетик',
  //   effectIcon: './images/energy-icon.png',
  //   type: 'active',
  //   metric: 'energyLimit',
  //   levels: [
  //     {
  //       level: 0,
  //       mainIcon: './images/achievement-icon-energy-blank.png',
  //       description: 'Доведите лимит энергии до 1000',
  //       limit: 1000,
  //       effect: 250,
  //     },
  //     {
  //       level: 1,
  //       mainIcon: './images/achievement-icon-energy-bronze.png',
  //       description: 'Доведите лимит энергии до 5000',
  //       limit: 5000,
  //       effect: 2000,
  //     },
  //     {
  //       level: 2,
  //       mainIcon: './images/achievement-icon-energy-silver.png',
  //       description: 'Доведите лимит энергии до 10000',
  //       limit: 10000,
  //       effect: 5000,
  //     },
  //     {
  //       level: 3,
  //       mainIcon: './images/achievement-icon-energy-gold.png',
  //       description: 'Top Level',
  //       effect: 5000,
  //     },
  //   ],
  // },
  // {
  //   id: 5,
  //   title: 'Дружелюбный',
  //   type: 'interactive',
  //   metric: 'friends',
  //   effectIcon: './images/coin.png',
  //   levels: [
  //     {
  //       level: 0,
  //       mainIcon: './images/achievement-icon-friends-blank.png',
  //       description: 'Пригласите в игру 1 друга',
  //       limit: 1,
  //       effect: 10000,
  //     },
  //     {
  //       level: 1,
  //       mainIcon: './images/achievement-icon-friends-bronze.png',
  //       description: 'Пригласите в игру 5 друзей',
  //       limit: 5,
  //       effect: 100000,
  //     },
  //     {
  //       level: 2,
  //       mainIcon: './images/achievement-icon-friends-silver.png',
  //       description: 'Пригласите в игру 10 друзей',
  //       limit: 10,
  //       effect: 250000,
  //     },
  //     {
  //       level: 3,
  //       mainIcon: './images/achievement-icon-friends-gold.png',
  //       description: 'Top Level',
  //       effect: 250000,
  //     },
  //   ],
  // },
  {
    id: 6,
    title: 'Опытный',
    type: 'passive',
    metric: 'level',
    effectIcon: './images/coin.png',
    levels: [
      {
        level: 0,
        mainIcon: './images/achievement-icon-level-blank.png',
        description: 'Достигните 25 уровня',
        limit: 25,
        effect: 10000,
      },
      {
        level: 1,
        mainIcon: './images/achievement-icon-level-bronze.png',
        description: 'Достигните 100 уровня',
        limit: 100,
        effect: 100000,
      },
      {
        level: 2,
        mainIcon: './images/achievement-icon-level-silver.png',
        description: 'Достигните 200 уровня',
        limit: 200,
        effect: 250000,
      },
      {
        level: 3,
        mainIcon: './images/achievement-icon-level-gold.png',
        description: 'Top Level',
        effect: 500000,
      },
    ],
  },
];