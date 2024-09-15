const activeUpgrades = [
  {
    id: 1,
    title: "Улучшенный бросок",
    mainIcon: './images/delta-upgrade-icon.png',
    effectIcon: './images/coin.png',
    levels: [
      { level: 0, delta: 1 },
      { level: 1, cost: 10, delta: 2 },
      { level: 2, cost: 25, delta: 4 },
      { level: 3, cost: 50, delta: 6 },
      { level: 4, cost: 100, delta: 8 },
      { level: 5, cost: 150, delta: 10 },
      { level: 6, cost: 250, delta: 12 },
      { level: 7, cost: 400, delta: 15 },
      { level: 8, cost: 600, delta: 18 },
      { level: 9, cost: 900, delta: 22 },
      { level: 10, cost: 1200, delta: 30 },
    ],
  },
  {
    id: 2,
    title: "Энергия",
    mainIcon: './images/energy-upgrade-icon.png',
    effectIcon: './images/energy-icon.png',
    levels: [
      { level: 0, energyLimit: 500 },
      { level: 1, cost: 500, energyLimit: 750 },
      { level: 2, cost: 1000, energyLimit: 1000 },
      { level: 3, cost: 1500, energyLimit: 1250 },
      { level: 4, cost: 2500, energyLimit: 1500 },
      { level: 5, cost: 4000, energyLimit: 1750 },
      { level: 6, cost: 6000, energyLimit: 2000 },
      { level: 7, cost: 8000, energyLimit: 2500 },
      { level: 8, cost: 10000, energyLimit: 3000 },
      { level: 9, cost: 12000, energyLimit: 4000 },
      { level: 10, cost: 15000, energyLimit: 5000 },
    ],
  },
];
