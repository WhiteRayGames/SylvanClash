//存放一些公用的参数
var Config = cc.Class({
  extends: cc.Component,

  statics: {
    isDebug: false,

    isTelegram: true,

    platform: "Telegram", // Telegram Local

    version: "1.0.2",

    debug_version: "_1",

    zOffsetY: 142,

    zBossLine: 100,

    allPlantCount: 75,

    angryCost: 50,

    lastWaveKey: '60_5',// 最后一波僵尸

    lastGameLevel: 60,//游戏的最后一关

    language: 'English', // tempory code Japanese English

    lastWaveWaitTime: 8,//大關卡等待下一波時間

    normalWaveWaitTime: 3,//一般關卡等待下一波時間

    CheckPotGrownInterval: 0.3,

    missionDataList: [{
      id: 0,
      checkType: 0,
      misType: 0,
      checkNum: 1,
      checklv: 0,
      progress: 0,
      claimed: 0,
      rewardType: 'coin'
    },
      {id: 1, checkType: 0, misType: 1, checkNum: 20, checklv: 0, progress: 0, claimed: 0, rewardType: 'coin'},
      {id: 2, checkType: 0, misType: 2, checkNum: 10, checklv: 0, progress: 0, claimed: 0, rewardType: 'coin'},
      {id: 3, checkType: 0, misType: 3, checkNum: 3, checklv: 0, progress: 0, claimed: 0, rewardType: 'gem'},
      {id: 4, checkType: 0, misType: 4, checkNum: 10, checklv: 0, progress: 0, claimed: 0, rewardType: 'gem'},
      {id: 5, checkType: 0, misType: 5, checkNum: 1, checklv: 0, progress: 0, claimed: 0, rewardType: 'gem'}],

    missionCheckList: [[1], [20], [10], [3, 6], [300, 600, 1200], [1]], // [[1], [20], [10], [3, 6], [300, 600, 1200]]
    missionRewardList: [[0], [0], [0], [50, 50], [20, 50, 50], [50]], // [[0], [0], [0], [50, 50], [20, 50, 50]]

    achieveDataList: [{id: 1, checkType: 1, achType: 0, level: 4, checklv: 0, progress: 0, finished: 0},
      {id: 2, checkType: 1, achType: 0, level: 7, checklv: 0, progress: 0, finished: 0},
      {id: 3, checkType: 1, achType: 0, level: 11, checklv: 0, progress: 0, finished: 0},
      {id: 4, checkType: 1, achType: 0, level: 15, checklv: 0, progress: 0, finished: 0},
      {id: 5, checkType: 1, achType: 0, level: 19, checklv: 0, progress: 0, finished: 0},
      {id: 6, checkType: 1, achType: 0, level: 23, checklv: 0, progress: 0, finished: 0},
      {id: 7, checkType: 1, achType: 0, level: 27, checklv: 0, progress: 0, finished: 0},
      {id: 8, checkType: 1, achType: 0, level: 31, checklv: 0, progress: 0, finished: 0},
      {id: 9, checkType: 1, achType: 0, level: 35, checklv: 0, progress: 0, finished: 0},
      {id: 10, checkType: 1, achType: 0, level: 39, checklv: 0, progress: 0, finished: 0},
      {id: 11, checkType: 1, achType: 0, level: 43, checklv: 0, progress: 0, finished: 0},
      {id: 12, checkType: 1, achType: 0, level: 47, checklv: 0, progress: 0, finished: 0},
      {id: 13, checkType: 1, achType: 0, level: 51, checklv: 0, progress: 0, finished: 0},
      {id: 14, checkType: 1, achType: 0, level: 55, checklv: 0, progress: 0, finished: 0},
      {id: 15, checkType: 1, achType: 0, level: 59, checklv: 0, progress: 0, finished: 0},
      {id: 16, checkType: 1, achType: 0, level: 63, checklv: 0, progress: 0, finished: 0},
      {id: 17, checkType: 1, achType: 0, level: 67, checklv: 0, progress: 0, finished: 0},
      {id: 18, checkType: 1, achType: 1, level: 1, checklv: 0, progress: 0, finished: 0}],

    signDataList: [{id: 1, rewardType: 1, rewardNum: 5},
      {id: 2, rewardType: 1, rewardNum: 5},
      {id: 3, rewardType: 1, rewardNum: 5},
      {id: 4, rewardType: 1, rewardNum: 10},
      {id: 5, rewardType: 1, rewardNum: 10},
      {id: 6, rewardType: 1, rewardNum: 10},
      {id: 7, rewardType: 1, rewardNum: 30}],

    signDataListSub: [{id: 1, rewardType: 1, rewardNum: 5},
      {id: 2, rewardType: 1, rewardNum: 5},
      {id: 3, rewardType: 1, rewardNum: 5},
      {id: 4, rewardType: 1, rewardNum: 10},
      {id: 5, rewardType: 1, rewardNum: 10},
      {id: 6, rewardType: 1, rewardNum: 10},
      {id: 7, rewardType: 1, rewardNum: 30}],

    cgZombieData: {
      totalHp: 200,
      spd: 1.5,
      spdRatio: 3,
    },

    init: function () {
      this.winSize = cc.view.getVisibleSize()
      this.initMoney = BigInt(2000);

      this.onlineCoinRatio = BigInt(2);
    },
  },
})
