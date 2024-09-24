const dailyTasks = [
  {
    date: '24.09.2024',
    tasks: [
      {
        id: 1,
        type: 'friend',
        // mainIcon: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        mainIcon: './images/achievement-icon-friends-gold.png',
        title: "Пригласите в игру 1 друга",
        effectIcon: "./images/coin.png",
        effect: 10000,
      },
      {
        id: 2,
        type: 'channel',
        mainIcon: './images/task-icon-channel.png',
        channelId: -1002493343663,
        channelLink: 'https://t.me/+cU6JKcOAFuphZTli',
        title: "Подпишитесь на канал",
        effectIcon: "./images/coin.png",
        effect: 20000,
      },
      {
        id: 3,
        type: 'register',
        mainIcon: './images/task-icon-channel.png',
        link: 'https://ya.ru',
        title: "Зарегистрируйтесь на сайте",
        effectIcon: "./images/coin.png",
        effect: 30000,
      },
    ]
  },
]
