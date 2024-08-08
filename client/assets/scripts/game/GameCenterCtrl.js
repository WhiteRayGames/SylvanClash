var Event = require("Event");
var DataType = require("DataType");
var MyEnum = require("MyEnum");
var MissionType = require("MissionType");
var bigDecimal = require('js-big-decimal');

cc.Class({
    extends: cc.Component,

    properties: {

        _type: -1,
        rubbishLabel: cc.Label,
        loadScreen: cc.Node,

        gameBg: cc.Node,
        // gameFront: cc.Node,
        unitsContainer: cc.Node,
        rubbishNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {

    // },

    zoomIn() {
        cc.Mgr.game.zoomIn = cc.Mgr.game.isZoomIn = true;
        cc.tween(this.gameBg).to(0.2, { scale: 1.2 }).start();
        cc.tween(this.gameBg).to(0.2, { position: cc.v2(50, 0) }).start();
        // cc.tween(this.gameFront).to(0.2,{scale:1.2}).start();
        cc.tween(this.unitsContainer).to(0.2, { scale: 1.2 }).start();
        cc.tween(this.unitsContainer).to(0.2, { position: cc.v2(50, 0) }).start();
        // cc.tween(this.gameFront).to(0.2, {position: cc.v2(248, 176)}).start();

        cc.tween(this.rubbishNode).to(0.2, { scale: 0.83 }).start();
        let currentX = -30;
        cc.tween(this.rubbishNode).to(0.2, { position: cc.v2(currentX, -310) }).start();
    },

    zoomOut() {
        cc.Mgr.game.zoomIn = cc.Mgr.game.isZoomIn = false;
        cc.tween(this.gameBg).to(0.2, { scale: 1 }).start();
        cc.tween(this.gameBg).to(0.2, { position: cc.v2(0, 0) }).start();
        // cc.tween(this.gameFront).to(0.2,{scale:1}).start();
        cc.tween(this.unitsContainer).to(0.2, { scale: 1 }).start();
        cc.tween(this.unitsContainer).to(0.2, { position: cc.v2(0, 0) }).start();
        // cc.tween(this.gameFront).to(0.2, {position: cc.v2(169, 154)}).start();

        cc.tween(this.rubbishNode).to(0.2, { scale: 1 }).start();
        let currentX = 10;
        cc.tween(this.rubbishNode).to(0.2, { position: cc.v2(currentX, -370) }).start();
    },

    setLanguage() {
        cc.Mgr.Config.language = cc.Mgr.game.setLanguageManually === "" ? "English" : cc.Mgr.game.setLanguageManually;
    },

    start() {
        //具体作用，参照Event注释
        cc.Mgr.GameCenterCtrl = this;
        cc.director.GlobalEvent.on(Event.defense, this.defense, this);
        cc.director.GlobalEvent.on(Event.AllGuideComplete, this.AllGuideComplete, this);
        cc.Mgr.game.enterGameTimeStamp = cc.Mgr.Utils.GetSysTime();
        let self = this;

        this.pauseFight = false;

        cc.Mgr.game.enterBackgroundTimer = 0;
        cc.game.on(cc.game.EVENT_HIDE, function () {
            if (cc.Mgr.admob.isPlayingAd) return;
            cc.Mgr.game.enterBackgroundTimer = Date.now();

            cc.Mgr.game.pauseGame();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            if (cc.Mgr.admob.adClicked && cc.Mgr.admob.hasShowPopup_banner === false) {
                // cc.Mgr.admob.openRemoveAdBundle();
                // cc.Mgr.UIMgr.openRemoveAdBundle();

                cc.Mgr.admob.hasShowPopup_banner = true;
            }

            cc.Mgr.admob.adClicked = false;

            cc.Mgr.game.enterGameTimeStamp = cc.Mgr.Utils.GetSysTime();
            if (cc.Mgr.admob.isPlayingAd) return;

            cc.Mgr.game.resumeGame();
            if (cc.Mgr.game.enterBackgroundTimer > 0 && Date.now() - cc.Mgr.game.enterBackgroundTimer >= 600000) {
                cc.Mgr.game.enterBackgroundTimer = 0;
                cc.Mgr.AudioMgr.stopAll();
                cc.Mgr.admob.hideBanner("all");
                cc.game.restart();
            }
        });

        self.isInit = false;

        if (cc.Mgr.game.sendFirstInstall) {
            let data = {}
            data.elapsed = cc.Mgr.Utils.getDate9(true)
            data.date = cc.Mgr.Utils.getDate9()
            data.version = cc.Mgr.Config.version
            data.InternalVersion = cc.Mgr.Config.version
            cc.Mgr.analytics.logEvent("first_install", JSON.stringify(data));
        }

        // check vip
        if (cc.Mgr.game.vipExpire > 0) {
            this.scheduleOnce(function () {
                cc.Mgr.game.isVIP = cc.Mgr.game.vipExpire > Date.now();

                if (cc.Mgr.game.isVIP === true && cc.Mgr.game.vipStartTimer > 0 && Date.now() - cc.Mgr.game.vipStartTimer > 7 * 24 * 3600 * 1000) {

                    let data = {}
                    data.elapsed = cc.Mgr.Utils.getDate9(true)
                    data.state = "convert"
                    cc.Mgr.analytics.logEvent("vip_subscription", JSON.stringify(data));
                    cc.Mgr.game.openSpecialGridCount = 0;

                } else if (cc.Mgr.game.isVIP === false) {
                    let data = {}
                    data.elapsed = cc.Mgr.Utils.getDate9(true)
                    data.state = "unsubscribed"
                    cc.Mgr.analytics.logEvent("vip_subscription", JSON.stringify(data));
                    cc.Mgr.game.vipExpire = 0;
                }
            }, 300);
        }
        cc.Mgr.game.vip = cc.Mgr.game.isVIP ? "active" : "inactive";

        this.checkTimer = 0;

        this.rubbishNode.active = false;

        // init user
        if (cc.Mgr.Config.isTelegram) {
            const requestBody = JSON.stringify({
                telegram_id: window.Telegram.WebApp.initDataUnsafe.user.id,
                username: window.Telegram.WebApp.initDataUnsafe.user.username,
                avatar_url: "",
                invited_by_code: (window.startParam != null && window.startParam != "") ? window.startParam : ""
            });
            let url = cc.Mgr.Config.isDebug ? "https://tg-api-service-test.lunamou.com/user/init" : "https://tg-api-service.lunamou.com/user/init";
            cc.Mgr.http.httpPost(url, requestBody, (error, response) => {
                if (error == true) {

                    return;
                }

                let data = JSON.parse(response);
                cc.Mgr.telegram = {};
                cc.Mgr.telegram.userInfo = data;
            });

            // let userPhoto = "";
            // let photoUrl = cc.Mgr.Config.isDebug ? "https://tg-api-service-test.lunamou.com/user/profile_photo/" + window.Telegram.WebApp.initDataUnsafe.user.id : "https://tg-api-service.lunamou.com/user/profile_photo/" + window.Telegram.WebApp.initDataUnsafe.user.id;
            // cc.Mgr.http.httpGets(photoUrl, (error, response) => {
            //    if (error == true) {
            //        userPhoto = "";
            //        return;
            //    }
            //
            //     userPhoto = JSON.parse(response).photo_url;
            // });

            cc.Mgr.Utils.getShareDataList();
            cc.Mgr.Utils.getInvitedByData();
        }
    },

    defense: function (data) {
        cc.Mgr.plantMgr.hideTipAttackNode();
        //下一波过来的间隔
        var interval = cc.Mgr.Config.normalWaveWaitTime;
        var coin = 0;
        var isBigLv = false;
        var bossComing = false;
        //是否清理僵尸池子
        this.clearZombiePool = false;
        var key = cc.Mgr.game.level > 60 ? (cc.Mgr.game.level % 60) + "_" + cc.Mgr.game.curBoshu : cc.Mgr.game.level + "_" + cc.Mgr.game.curBoshu;
        var levelData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.LevelData, key);
        if (data.state) {
            cc.Mgr.game.updateMissionProgressById(MissionType.DefenseSuc);

            if (cc.Mgr.game.curBoshu == levelData.waveCount) {
                interval = cc.Mgr.Config.lastWaveWaitTime + 2; //大关卡完成  时间间隔加长
                isBigLv = true;
                var dt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.ZombieData, levelData.zombieID1);
                coin = dt.money * BigInt(Math.round((0.8 + Math.random() * 0.4) * 100)) / BigInt(100);

                cc.Mgr.game.level++;
                cc.Mgr.game.curBoshu = 1;

                // tempory code
                // if(cc.Mgr.game.level > cc.Mgr.Config.lastGameLevel)
                // {
                //     cc.Mgr.game.level = cc.Mgr.Config.lastGameLevel;
                //     if (cc.Mgr.game.isCleared == undefined)cc.Mgr.game.isCleared = true;
                // }
            }
            else {
                cc.Mgr.game.curBoshu++;
                if (cc.Mgr.game.curBoshu == levelData.waveCount)
                    bossComing = true;
            }
        }
        else {
            if (cc.Mgr.game.curBoshu == levelData.waveCount) {
                var dt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.ZombieData, levelData.zombieID1);
                coin = dt.money * BigInt(Math.round((1 - bigDecimal.divide(data.zhp.toString(), dt.hp.toString(), 2)) * 100)) / BigInt(100);
                isBigLv = true;
            }
            cc.Mgr.game.curBoshu = 1;
        }

        if (isBigLv && data.state) {
            this.clearZombiePool = true;
        }

        if (isBigLv) {
            cc.Mgr.admob.showInterstitial("newStage", 'next', () => {
                cc.Mgr.UIMgr.showBigResult(data.state, coin);
            }, false);
        } else {
            cc.Mgr.UIMgr.showSmallResult(data.state);
            if (data.state === true && cc.Mgr.game.curBoshu === 4 && levelData.waveCount >= 5) {
                // setTimeout (() => {
                //     cc.Mgr.admob.showInterstitial("win", 'next', null, false);
                // }, 2200)
            } else if (data.state === false) {
                // setTimeout (() => {
                //     cc.Mgr.admob.showInterstitial("defeat", 'next', null, false);
                // }, 2200)
            }
        }

        if (bossComing) {
            this.scheduleOnce(function () {
                cc.Mgr.UIMgr.showBossComing(levelData.zombieID1);
                cc.Mgr.UIMgr.InGameUI.showBuffTip();
            }, 2.0);
        }

        this.createCallback = function () {

            this.createZoombie();
        };

        if (!isBigLv) {
            this.scheduleOnce(this.createCallback, interval);
        }

    },

    unschedduleCreateCallBack: function (isNewCreate = true) {
        this.unschedule(this.createCallback);

        if (isNewCreate == false)
            return;

        this.scheduleOnce(function () {

            if (this.clearZombiePool) {
                cc.Mgr.ZombieMgr.clearZombiesPool();
            }
            this.createZoombie();
        }, 1);
    },

    AllGuideComplete(data) {
        this.createZoombie();
        if (cc.Mgr.plantMgr.checkHasAnySpaceGird(true))
            cc.Mgr.UIMgr.InGameUI.showTipBuyTimesNode(true);
    },

    rebornToLvLastWave: function () {
        var key = cc.Mgr.game.level > 60 ? (cc.Mgr.game.level % 60) + "_" + cc.Mgr.game.curBoshu : cc.Mgr.game.level + "_" + cc.Mgr.game.curBoshu;
        var levelData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.LevelData, key);
        cc.Mgr.game.curBoshu = levelData.waveCount;
        cc.Mgr.UIMgr.InGameUI.RefreshLvData();
        this.scheduleOnce(function () {
            if (this.clearZombiePool) {
                cc.Mgr.ZombieMgr.clearZombiesPool();
            }
            this.createZoombie();
        }, 1);
    },

    checkIphoneX() {
        return false;
    },

    init() {
        if (this.isInit) return;

        this.setLanguage();

        cc.Mgr.game.winSize = cc.view.getVisibleSize();

        this.isIphoneX = this.checkIphoneX();

        cc.Mgr.admob.isInit = true;

        var self = this;

        cc.Mgr.MapDataMgr.initMaps(); //初始化解析数据表

        let isFrist = cc.Mgr.game.analytics_isFirst;

        let data = {}
        data.elapsed = cc.Mgr.Utils.getDate9(true);
        data.first = "" + isFrist;
        cc.Mgr.analytics.logEvent("start_loading", JSON.stringify(data));

        this.curProgress = 0

        this.targetProgress = 0.6

        this.isInit = true;

        cc.Mgr.flowerPotMgr.init(function () {
            self.targetProgress = 0.7

            cc.Mgr.plantMgr.init(function () {
                self.targetProgress = 0.8

                cc.Mgr.ZombieMgr.InitZombiesMgr();
                self.showGameUI();
                cc.Mgr.plantMgr.loadPlantsPrefab();
            });
        });

        //每次重新登录检查下任务刷新问题
        if (cc.Mgr.Utils.getDays(cc.Mgr.Utils.GetSysTime()) - cc.Mgr.Utils.getDays(cc.Mgr.UserDataMgr.lastPlayTime) >= 1) {
            cc.Mgr.game.clearMissionDataToNextDay();

            cc.Mgr.game.currentExchangeCount = 0;

            cc.Mgr.game.vipDailyBonus = true;

            cc.Mgr.game.first_daily = true;

            cc.Mgr.game.paymentAdCount = 5;

            cc.Mgr.game.coinBundleFlag = true;

            cc.Mgr.game.paymentAdCountList = [1, 1, 1, 2, 2, 2, 3, 3, 3];
        }

        // refresh every 2 hours
        if ((cc.Mgr.Utils.GetSysTime() - cc.Mgr.UserDataMgr.lastPlayTime) >= (2 * 3600)) {
            cc.Mgr.game.spinADResetTime = 0;
            cc.Mgr.game.spinUseGemTime = 0;

            if (cc.Mgr.game.level <= 10) {
                cc.Mgr.game.uavAdsCount = 5;
            } else if (cc.Mgr.game.level <= 20) {
                cc.Mgr.game.uavAdsCount = 5;
            } else if (cc.Mgr.game.level <= 30) {
                cc.Mgr.game.uavAdsCount = 5;
            } else if (cc.Mgr.game.level <= 40) {
                cc.Mgr.game.uavAdsCount = 5;
            } else if (cc.Mgr.game.level <= 50) {
                cc.Mgr.game.uavAdsCount = 5;
            } else {
                cc.Mgr.game.uavAdsCount = 5;
            }
        }

        var score = cc.Mgr.game.level * 100 + cc.Mgr.game.curBoshu;
        cc.Mgr.game.lastMaxWave = score;
        cc.Mgr.game.updateMissionProgressById(MissionType.Login);

        this.rubbishLabel.string = cc.Mgr.Utils.getTranslation("main-rubbishTip");
    },

    checkUpdate: function () {
        this.startGame();
        return;

        if (cc.Mgr.game.vipdiscount === true) {
            if (cc.Mgr.game.vipSaleTimer === 0 && cc.Mgr.game.hasLockGrid === false && cc.Mgr.game.plantsPK[12].type === MyEnum.GridState.vipLock) {
                cc.Mgr.game.vipEnterGameCount++;
                if (cc.Mgr.game.vipEnterGameCount >= 2) {
                    cc.Mgr.game.vipEnterGameCount = 0;
                    cc.Mgr.game.vipSaleTimer = Date.now() + 72 * 3600 * 1000;
                }
            }
        }
        if (cc.Mgr.game.vipSaleTimer > Date.now() && cc.Mgr.game.isVIP === false) {
            cc.Mgr.UIMgr.openVipUI("enterGame");
        } else {
            this.startGame();
        }
    },

    compareVersion(_a, _b) {
        let versionAList = _a.split(".");
        let versionBList = _b.split(".");
        let numA = parseInt(versionAList[0]) * 100 + parseInt(versionAList[1]) * 10 + parseInt(versionAList[2]) * 1;
        let numB = parseInt(versionBList[0]) * 100 + parseInt(versionBList[1]) * 10 + parseInt(versionBList[2]) * 1;

        return numA < numB;
    },

    caculateOfflineAsset: function () {
        var allminute = Math.floor((cc.Mgr.Utils.GetSysTime() - cc.Mgr.game.lastOfflineTime) / 60);
        if (allminute < 1)
            return;

        var hours = Math.floor(allminute / 60);
        var leftmin = Math.floor(allminute % 60)

        var intervalMode = (cc.Mgr.Utils.GetSysTime() - cc.Mgr.game.lastOfflineTime) % 60;
        if (intervalMode >= 30) {
            allminute += 0.5;
            leftmin += 0.5;
        }

        var money = 0;
        var allPerMinMoney = 0;
        var ratio = 0;
        if (hours < 1)
            ratio = 0.83;
        else if (hours < 2)
            ratio = 0.49;
        else if (hours < 3)
            ratio = 0.34;
        else if (hours < 4)
            ratio = 0.25;
        else if (hours < 5)
            ratio = 0.16;
        else if (hours < 6)
            ratio = 0.08;
        else if (hours < 7)
            ratio = 0.05;
        else if (hours < 8)
            ratio = 0.03;
        else {
            leftmin = allminute - 480;
            ratio = 0.0167;
        }
        var offlineMoney = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, cc.Mgr.game.plantMaxLv).offline;
        for (var i = 0; i < cc.Mgr.game.plantsPK.length; i++) {
            if (cc.Mgr.game.plantsPK[i].type == MyEnum.GridState.plant) {
                var dt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, cc.Mgr.game.plantsPK[i].level);
                var per = Math.floor(offlineMoney * Math.pow(2.1, dt.level - 1));
                money += per;

                var onePer = per * ratio;
                onePer >= 1 ? onePer : 1;
                allPerMinMoney += onePer * leftmin;
            }
        }
        console.log("offlineMoney = " + offlineMoney + "  hours = " + hours + "  money = " + money);
        var outMoney = 0;
        if (hours <= 1)
            outMoney = Math.floor(money * allminute * 0.83);
        else if (hours < 2)
            outMoney = Math.floor(money * 60 * 0.83 + allPerMinMoney);
        else if (hours < 3)
            outMoney = Math.floor(money * 60 * (0.83 + 0.49) + allPerMinMoney);
        else if (hours < 4)
            outMoney = Math.floor(money * 60 * (0.83 + 0.49 + 0.34) + allPerMinMoney);
        else if (hours < 5)
            outMoney = Math.floor(money * 60 * (0.83 + 0.49 + 0.34 + 0.25) + allPerMinMoney);
        else if (hours < 6)
            outMoney = Math.floor(money * 60 * (0.83 + 0.49 + 0.34 + 0.25 + 0.16) + allPerMinMoney);
        else if (hours < 7)
            outMoney = Math.floor(money * 60 * (0.83 + 0.49 + 0.34 + 0.25 + 0.16 + 0.08) + allPerMinMoney);
        else if (hours < 8)
            outMoney = Math.floor(money * 60 * (0.83 + 0.49 + 0.34 + 0.25 + 0.16 + 0.08 + 0.05) + allPerMinMoney);
        else {
            outMoney = Math.floor(money * 60 * (0.83 + 0.49 + 0.34 + 0.25 + 0.16 + 0.08 + 0.05 + 0.03) + allPerMinMoney);
            console.log("offlineMoney = " + offlineMoney + "  hours = " + hours + "  money = " + money + " outMoney = " + outMoney);
        }

        outMoney = Math.round(outMoney * 0.8);
        if (outMoney > 0) cc.Mgr.UIMgr.openOfflineAssetsUI(BigInt(outMoney));

        // let data = {}
        // data.elapsed = cc.Mgr.Utils.getDate9(true)
        // cc.Mgr.analytics.logEvent("initialize", JSON.stringify(data));
    },

    getChannel() {
        return "Telegram"
    },

    showGameUI() {
        var self = this;

        cc.Mgr.UIMgr.openGameInUI(function () {
            // let data = {}
            // data.elapsed = Date.now()
            // cc.Mgr.analytics.logEvent("enter_game", JSON.stringify(data));

            cc.Mgr.UIMgr.InGameUI.checkSignState();

            self.targetProgress = 1

            if (cc.Mgr.game.isZoomIn) self.zoomIn();
        });
        let entryPoint = "solo";
        let fromFeature = "";

        let isFrist = cc.Mgr.game.analytics_isFirst;

        let data = {};
        data.elapsed = cc.Mgr.Utils.getDate9(true);
        data.first = "" + isFrist;
        // data.first_daily = cc.Mgr.game.first_daily;
        data.gamePlatform = cc.Mgr.Config.platform;
        // data.channel = this.getChannel();
        data.entryPoint = entryPoint;
        data.feature = fromFeature || "none";
        cc.Mgr.analytics.logEvent("enter_game", JSON.stringify(data));
        cc.Mgr.game.first_daily = false;
    },

    startGame() {
        this.SaveUserDataSchedule();

        cc.Mgr.AudioMgr.playBGM("bgm");

        this.createPlant();

        if (!cc.Mgr.game.needGuide) {
            setTimeout(() => {
                this.caculateOfflineAsset();
            }, 5000);
        }
    },

    unscheduleSaveData() {
        this.unschedule(this.SaveUserData);
    },

    SaveUserDataSchedule: function () {
        this.schedule(this.SaveUserData, 10, cc.macro.REPEAT_FOREVER, 5);
    },

    SaveUserData: function () {
        cc.Mgr.UserDataMgr.SaveUserData();
    },

    createPlant() {
        cc.Mgr.plantMgr.initPlants();

        if (cc.Mgr.game.needGuide) {
            cc.Mgr.UIMgr.openGuide();
        }
        else {
            this.createZoombie();

        }
    },

    createZoombie() {
        // let data = {}
        // data.elapsed = Date.now()
        // data.wave_stage = cc.Mgr.game.level
        // data.wave_no = cc.Mgr.game.curBoshu
        // cc.Mgr.analytics.logEvent("wave", JSON.stringify(data));

        cc.Mgr.ZombieMgr.getOneWaveZombies(cc.Mgr.game.level, cc.Mgr.game.curBoshu);
    },

    update(dt) {
        if (!this.isInit) return;
        // 5pm - 11pm
        if (Date.now() - this.checkTimer >= 5000) {
            let currentDate = new Date();
            let h = currentDate.getHours();
            cc.Mgr.game.isFreeDoubleDaily = h <= 23 && h >= 17;
            this.checkTimer = Date.now();
        }

        if (this.loadScreen == null || this.loadScreen.getComponent("FirstUI").startUpdate === false) return;
        this.curProgress += 0.02;
        if (this.curProgress >= this.targetProgress) this.curProgress = this.targetProgress;
        this.loadScreen.getComponent("FirstUI").updateProgress(this.curProgress)

        if (this.curProgress >= 1) {
            this.checkUpdate()
            this.loadScreen = null;
        }
    },
});
