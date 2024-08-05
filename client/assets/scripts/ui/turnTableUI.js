var MySprite = require("MySprite");
var DataType = require("DataType");
var TurnTableGetType = require("TurnTableGetType");
var AtlasType = require("AtlasType");
var rewardBox = require("rewardBox");
var turnTableUI = cc.Class({
    extends: cc.Component,

    properties: {
        disc: cc.Node,

        spList: [cc.Sprite],
        mySpList: [MySprite],

        freeBtn: cc.Button,
        gemBtn: cc.Button,
        closeBtn: cc.Node,
        inviteBtn: cc.Button,

        lblList: [cc.Label],
        lblList_ru: [cc.Label],
        lblListNode: cc.Node,
        lblListNode_ru: cc.Node,

        gemLbl: cc.Label,
        freetimeLbl: cc.Label,

        timeNode: cc.Node,
        freetimeTipLbl: cc.Label,
        timeDesLbl: cc.Label,

        rotating: false,

        lastPlantMaxLv: 0,
        gemLabel: cc.Label,

        adsIconNode: cc.Node,
        freeLabelNode: cc.Label,

        spriteFrameList: [cc.SpriteFrame],

        startLabel: cc.Label,

        content: cc.Node,
        blurBg: cc.Node,

        // dbListNode: cc.Node,
        // titleLabel: cc.Label,
        okLabel: cc.Label,
        okBtn: cc.Node,

        // spriteCoin: cc.Sprite,
        // nomarlM: cc.Material,
        // grayM: cc.Material
    },

    onLoad() {
        this.buffMap = ["rage", "auto", "flame", "freeze", "crit"];

        this.max_count = 6;
        this.ads_count = 5;
    },

    start() {
        cc.Mgr.UIMgr.turnTableUI = this;

        this.freetimeTipLbl.string = cc.Mgr.Utils.getTranslation("roulette-timeTip");
        this.startLabel.string = cc.Mgr.Utils.getTranslation("roulette-start");
        this.freeLabelNode.string = cc.Mgr.Utils.getTranslation("btn-free");
        // this.titleLabel.string = cc.Mgr.Utils.getTranslation("roulette-title");
        this.okLabel.string = cc.Mgr.Utils.getTranslation("btn-ok");

        this.limitClick = this.node.getComponent('LimitClick');

        this.allowShow = true;
    },

    showBtns: function () {
        this.refreshBtns();
        this.closeBtn.active = true;
    },

    hideBtns: function () {
        this.freeBtn.node.active = false;
        this.gemBtn.node.active = false;
        this.closeBtn.active = false;
        this.okBtn.active = false;
        this.inviteBtn.node.active = false;
    },

    showUI: function () {
        if (cc.Mgr.game.level <= 10) {
            this.costGem = 5;
        } else if (cc.Mgr.game.level <= 20) {
            this.costGem = 5;
        } else if (cc.Mgr.game.level <= 30) {
            this.costGem = 10;
        } else if (cc.Mgr.game.level <= 40) {
            this.costGem = 15;
        } else if (cc.Mgr.game.level <= 50) {
            this.costGem = 30;
        } else {
            this.costGem = 60;
        }

        this.showBtns();
        this.disc.angle = 0;
        this.startTimeCount();
        this.node.width = cc.Mgr.Config.winSize.width;
        this.node.height = cc.Mgr.Config.winSize.height;
        if (cc.Mgr.game.plantMaxLv > this.lastPlantMaxLv)
            this.refreshPanel();

        this.gemLabel.string = this.costGem;

        if (cc.Mgr.game.freeFlag.TurnTable || cc.Mgr.game.spinADResetTime === 0) {
            cc.Mgr.game.freeFlag.TurnTable = true;
            this.adsIconNode.active = false;
            this.freeLabelNode.node.active = true;
            this.freetimeLbl.node.active = false;
        }
        else {
            this.adsIconNode.active = true;
            this.freeLabelNode.node.active = false;
            this.freetimeLbl.node.active = true;
        }
        this.blurBg.opacity = 0
        this.content.opacity = 0;
        this.content.setScale(.5)
        cc.tween(this.blurBg).to(0.05, { opacity: 255 }).call().start();
        cc.tween(this.content).to(0.15, { opacity: 255, scale: 1 }).start();

        cc.Mgr.admob.showBanner("turnTable");

        this.updateAdsBtnState();

        this.lblListNode.active = cc.Mgr.Config.language != "Russian";
        this.lblListNode_ru.active = false;
    },

    playOverAnimation: function () {
        this.rotating = false;
        this.showBtns();
    },

    playTurnAnimation: function () {
        // this.dbListNode.active = false;
        this.count = 0;
        this.callback = function () {
            if (this.count == 30) {
                this.playOverAnimation();
                this.unschedule(this.callback);
            }
            this.count++;
        }
        this.schedule(this.callback, 0.1);
        this.hideBtns();
    },

    refreshPanel: function () {
        // this.dbListNode.active = true;
        this.lastPlantMaxLv = cc.Mgr.game.plantMaxLv;
        this.currentBuffList = [];

        let checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        if (this.max_count - cc.Mgr.game.spinADResetTime > 0 && checkAvailabelAds == true) {
            this.timeNode.active = false;
            // this.inviteBtn.node.position = this.freeBtn.node.position = cc.v2(0, -415);
            // this.gemBtn.node.position = cc.v2(0, -415);
            this.freetimeLbl.string = cc.Mgr.Utils.getTranslation("btn-get") + " (" + (this.max_count - cc.Mgr.game.spinADResetTime) + "/" + this.ads_count + ")";
            this.gemLbl.string = this.costGem;
        }
        else {
            this.inviteBtn.node.active = this.freeBtn.node.active = false;
            // this.gemBtn.node.position = cc.v2(0, -415);
            this.gemLbl.string = this.costGem;
        }

        var list = cc.Mgr.MapDataMgr.getDataListByDataType(DataType.TurnTableData);
        var chooseList = [];//最终选择出来的

        this.disc.rotate = 0;

        this.rewardList = [];

        var coinList = [];
        var plantList = [];
        var gemList = [];
        var buffList = [];
        var droneList = [];

        for (var key = 1; key < list.length; key++) {
            var key = key.toString();
            var dt = list[key];
            switch (dt.type) {
                case TurnTableGetType.coin:
                    coinList.push(dt);
                    break;
                case TurnTableGetType.gem:
                    gemList.push(dt);
                    break;
                case TurnTableGetType.plant:
                    plantList.push(dt);
                    break;
                case TurnTableGetType.buff:
                    buffList.push(dt);
                    break;
                case TurnTableGetType.drone:
                    droneList.push(dt);
                    break;
            }
        }

        //固定挑选六个
        var coinCount = 0, gemCount = 0, plantCount = 0, buffCount = 0, droneCount = 0;
        var i = 0;
        for (i = 0; i < 6; i++) {
            var seed = Math.random();
            if (seed < 1 / 5 && coinCount < 2 && coinList.length > 0) {
                coinCount += 1;
                var dt = cc.Mgr.Utils.getArrayItemsAndChangeArr(coinList, 1);
                chooseList.push(dt[0]);
            }
            else if (seed < 2 / 5 && gemCount < 2 && gemList.length > 0) {
                gemCount += 1;
                var dt = cc.Mgr.Utils.getArrayItemsAndChangeArr(gemList, 1);
                chooseList.push(dt[0]);
            }
            else if (seed < 3 / 5 && plantCount < 2 && plantList.length > 0) {
                plantCount += 1;
                var dt = cc.Mgr.Utils.getArrayItemsAndChangeArr(plantList, 1);
                chooseList.push(dt[0]);
            }
            else if (seed < 4 / 5 && buffCount < 2 && buffList.length > 0) {
                buffCount += 1;
                var dt = cc.Mgr.Utils.getArrayItemsAndChangeArr(buffList, 1);
                chooseList.push(dt[0]);
            }
            else if (droneCount < 2 && droneList.length > 0) {
                droneCount += 1;
                var dt = cc.Mgr.Utils.getArrayItemsAndChangeArr(droneList, 1);
                chooseList.push(dt[0]);
            }
            else {
                if (chooseList.length == 6)
                    break;

                if (chooseList.length < 6 && i > 0)
                    i--;
            }
        }
        var curMaxLv = cc.Mgr.game.plantMaxLv;
        for (var index = 0; index < chooseList.length; index++) {
            this.setBlockInfo(index, chooseList[index], curMaxLv);
        }
    },

    setBlockInfo: function (index, dt, curMaxLv) {
        this.spList[index].node.setScale(1);
        switch (dt.type) {
            case TurnTableGetType.coin:
                this.spList[index].node.active = true;
                this.mySpList[index].node.active = false;
                this.spList[index].spriteFrame = this.spriteFrameList[0];
                this.spList[index].scale = 1;
                var spinLv = this.pickOutSpinData(dt.rarity, cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.SpinLevelData, curMaxLv));
                var num = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, spinLv).price;
                num = num * BigInt(8) / BigInt(10);
                this.lblList[index].string = "x" + cc.Mgr.Utils.getNumStr2(num);
                // this.lblList_ru[index].string = "x"+cc.Mgr.Utils.getNumStr2(num);
                var rewardData = new rewardBox();
                rewardData.setData(dt.type, num, 1, dt.weight);
                this.rewardList[index] = rewardData;
                break;
            case TurnTableGetType.gem:
                this.spList[index].node.active = true;
                this.mySpList[index].node.active = false;
                this.spList[index].spriteFrame = this.spriteFrameList[1];
                this.spList[index].scale = 1;
                this.lblList[index].string = "x" + dt.rewards;
                // this.lblList_ru[index].string = "x"+dt.rewards;
                var rewardData = new rewardBox();
                rewardData.setData(dt.type, dt.rewards, 1, dt.weight);
                this.rewardList[index] = rewardData;
                break;
            case TurnTableGetType.plant:
                this.spList[index].node.active = false;
                this.mySpList[index].node.active = true;
                var spinLv = this.pickOutSpinData(dt.rarity, cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.SpinLevelData, curMaxLv));
                var spName = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, spinLv).head;
                this.mySpList[index].setSprite(AtlasType.PlantHead, spName);
                this.lblList[index].string = "Lv." + spinLv;
                // this.lblList_ru[index].string = "Ур."+spinLv;
                var rewardData = new rewardBox();
                rewardData.setData(dt.type, 1, spinLv, dt.weight);
                this.rewardList[index] = rewardData;
                break;
            case TurnTableGetType.buff:
                let randomIndex = Math.floor(Math.random() * 5);
                this.currentBuffList[index] = this.buffMap[randomIndex];
                this.spList[index].node.active = true;
                this.spList[index].node.setScale(0.6);
                this.mySpList[index].node.active = false;
                this.spList[index].spriteFrame = this.spriteFrameList[randomIndex + 2];
                // this.spList[index].scale = 0.9;
                this.lblList[index].string = dt.rewards + "s";
                // this.lblList_ru[index].string = dt.rewards + "s";
                var rewardData = new rewardBox();
                rewardData.setData(dt.type, dt.rewards, 1, dt.weight);
                this.rewardList[index] = rewardData;
                break;
            case TurnTableGetType.drone:
                this.spList[index].node.active = false;
                this.mySpList[index].node.active = true;
                var spinLv = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.DroneData, curMaxLv).Drone;
                this.mySpList[index].setSprite(AtlasType.PlantHead, "egg_2");
                this.mySpList[index].scale = 0.6;
                this.lblList[index].string = "x6";
                // this.lblList_ru[index].string = "x6";
                var rewardData = new rewardBox();
                rewardData.setData(dt.type, 6, spinLv, dt.weight);
                this.rewardList[index] = rewardData;
                break;
        }
    },

    pickOutSpinData: function (spinType, dt) {
        let lv;
        switch (spinType) {
            case "S":
                return cc.Mgr.game.plantMaxLv - 1
                break;
            case "A":
                lv = cc.Mgr.game.plantMaxLv - 2 < 1 ? 1 : cc.Mgr.game.plantMaxLv - 2
                return lv
                break;
            case "B":
                lv = cc.Mgr.game.plantMaxLv - 3 < 1 ? 1 : cc.Mgr.game.plantMaxLv - 3
                return lv
                break;
            case "C":
                lv = cc.Mgr.game.plantMaxLv - 4 < 1 ? 1 : cc.Mgr.game.plantMaxLv - 4
                return lv
                break;
        }
    },

    startTimeCount: function () {
        if (this.max_count - cc.Mgr.game.spinADResetTime > 0)
            return;

        //北京时间相差8个小时
        // tempory code 10
        cc.Mgr.game.spinADTimeCount = cc.Mgr.game.spinADTimeCount === 0 ? cc.Mgr.Utils.GetSysTime() + 2 * 3600 : cc.Mgr.game.spinADTimeCount;

        this.seconds = cc.Mgr.game.spinADTimeCount - cc.Mgr.Utils.GetSysTime();

        this.unschedule(this.countTime);
        if (this.seconds > 0) {
            this.schedule(this.countTime, 1);
        }
    },

    countTime: function () {
        this.seconds -= 1;
        if (this.seconds < 0) {
            this.unschedule(this.countTime);
            cc.Mgr.game.spinADResetTime = 0;
            this.timeNode.active = false
            cc.Mgr.game.freeFlag.TurnTable = true;
            cc.Mgr.game.spinADTimeCount = 0;
            this.refreshBtns();
            return;
        }
        var timeStr = cc.Mgr.Utils.FormatNumToTime(this.seconds);
        this.timeNode.active = true
        this.timeDesLbl.string = timeStr;
    },

    refreshBtns: function () {

        if (cc.Mgr.game.freeFlag.TurnTable) {
            this.adsIconNode.active = false;
            this.freeLabelNode.node.active = true;
            this.freetimeLbl.node.active = false;
        }
        else {
            this.adsIconNode.active = true;
            this.freeLabelNode.node.active = false;
            this.freetimeLbl.node.active = true;
        }

        if (this.max_count - cc.Mgr.game.spinADResetTime > 0) {
            this.freeBtn.node.active = true;
            this.timeNode.active = false;
            // this.inviteBtn.node.position = this.freeBtn.node.position = cc.v2(0, -415);
            // this.gemBtn.node.position = cc.v2(0, -415);
            this.freetimeLbl.string = cc.Mgr.Utils.getTranslation("btn-get") + " (" + (this.max_count - cc.Mgr.game.spinADResetTime) + "/" + this.ads_count + ")";
            this.gemLbl.string = this.costGem;
            this.updateBtns();
        }
        else {
            this.inviteBtn.node.active = this.freeBtn.node.active = false;
            // this.gemBtn.node.position = cc.v2(0, -415);
            this.gemLbl.string = this.costGem;
        }
        this.gemBtn.node.active = true;
        // this.okBtn.active = true;

        this.updateAdsBtnState();
    },

    updateBtns(_noFill) {
        if (_noFill == true) cc.Mgr.game.noFillCount++;

        if (cc.Mgr.game.noFillCount >= 3) {
            this.freeBtn.node.active = cc.Mgr.game.freeFlag.TurnTable || cc.Mgr.game.spinADResetTime === 0;
            this.inviteBtn.node.active = !this.freeBtn.node.active;
            if (this.inviteBtn.node.active) {
                this.inviteBtn.node.active = false;
            }
        } else {
            this.inviteBtn.node.active = false;
        }
    },

    onClickTurnTableByInvite() {
        if (this.limitClick.clickTime() == false) {
            return
        }
        cc.Mgr.AudioMgr.playSFX("click");
        if (this.rotating) return;

        if (cc.Mgr.game.spinADResetTime >= this.max_count)
            return;

        var self = this;
        cc.Mgr.UIMgr.showLoading();
        cc.Mgr.Utils.getBase64Image("resources/tex/shareImage_2.png", (_data) => {
            cc.Mgr.UIMgr.hideLoading();

            cc.Mgr.game.updateMissionProgressById(MissionType.InviteCount);
            cc.Mgr.game.updateAchieveProgressByType(AchieveType.Invite);
            cc.Mgr.UIMgr.InGameUI.checkMissionAchieveTip();

            cc.Mgr.game.spinADResetTime++;
            if (this.max_count - cc.Mgr.game.spinADResetTime <= 0) self.startTimeCount();
            self.refreshBtns();
            self.startRotate();
            self.playTurnAnimation();

            let data = {}
            data.elapsed = cc.Mgr.Utils.getDate9(true)
            data.stage = cc.Mgr.game.level
            data.feature = "roulette"
            cc.Mgr.analytics.logEvent("share_message", JSON.stringify(data));

            // failed
            cc.Mgr.UIMgr.showPrompt("Invitation Failed", "", self.node);
            cc.Mgr.UIMgr.hideLoading();
        });
    },

    adsTurnTable: function () {
        if (this.limitClick.clickTime() == false) {
            return
        }
        cc.Mgr.AudioMgr.playSFX("click");
        if (this.rotating) return;

        if (cc.Mgr.game.spinADResetTime >= this.max_count)
            return;

        var self = this;

        if (cc.Mgr.game.freeFlag.TurnTable) {
            cc.Mgr.game.freeFlag.TurnTable = false;
            this.adsIconNode.active = true;
            this.freeLabelNode.node.active = false;
            this.freetimeLbl.node.active = true;

            cc.Mgr.game.spinADResetTime++;
            if (this.max_count - cc.Mgr.game.spinADResetTime <= 0) self.startTimeCount();
            self.refreshBtns();
            self.startRotate();
            self.playTurnAnimation();
        }
        else {
            if (this.checkAvailabelAds === false) {
                cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", this.node);
                // let data = {};
                // data.elapsed = cc.Mgr.Utils.getDate9(true);
                // data.adsType = "rewarded";
                // data.feature = "roulette";
                // cc.Mgr.analytics.logEvent("ad_present_failed", JSON.stringify(data));
                return;
            }
            cc.Mgr.admob.showRewardedVideoAd((function (_state, _noFill) {
                if (_state) {
                    cc.Mgr.game.spinADResetTime++;
                    if (this.max_count - cc.Mgr.game.spinADResetTime <= 0) self.startTimeCount();
                    self.refreshBtns();
                    self.startRotate();
                    self.playTurnAnimation();

                    this.updateBtns(_noFill);
                } else {
                    // let data = {};
                    // data.elapsed = cc.Mgr.Utils.getDate9(true);
                    // data.adsType = "rewarded";
                    // data.feature = "roulette";
                    // cc.Mgr.analytics.logEvent("ad_present_failed", JSON.stringify(data));
                }
            }.bind(this)), this.node, "roulette", this);
        }
    },

    updateAdsBtnState() {
        // this.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        // this.freeBtn.node.active = cc.Mgr.game.freeFlag.TurnTable || this.checkAvailabelAds;
        // if (this.checkAvailabelAds || cc.Mgr.game.freeFlag.TurnTable) {
        //     this.spriteCoin.setMaterial(0, this.nomarlM);
        // } else {
        //     this.spriteCoin.setMaterial(0, this.grayM);
        // }
    },

    gemTurnTable: function () {
        if (this.limitClick.clickTime() == false) {
            return
        }
        cc.Mgr.AudioMgr.playSFX("click");
        if (this.rotating) return;

        if (cc.Mgr.game.gems < this.costGem) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoGems"), "gem", this.node);
            // cc.Mgr.game.needShowIAPCount++;
            // if (cc.Mgr.game.needShowIAPCount >= 1) {
            //     cc.Mgr.UIMgr.openPaymentUI(true);
            //     cc.Mgr.game.needShowIAPCount = 0;
            // }
            if (this.allowShow === true) {
                this.allowShow = false;
                setTimeout(() => {
                    cc.Mgr.UIMgr.openPaymentUI(true);
                    this.allowShow = true;
                }, 300);
            }
            return;
        }
        cc.Mgr.game.gems -= this.costGem;
        cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");

        // let data = {}
        // data.elapsed = cc.Mgr.Utils.getDate9(true)
        // data.value = this.costGem;
        // data.feature = "roulette";
        // cc.Mgr.analytics.logEvent("spend_gem", JSON.stringify(data));

        cc.Mgr.game.spinUseGemTime++;
        if (cc.Mgr.game.spinUseGemTime > this.ads_count)
            cc.Mgr.game.spinUseGemTime = this.ads_count;
        this.startRotate();
        this.playTurnAnimation();
    },

    playSFXRotation: function () {
        cc.Mgr.AudioMgr.playSFX("spin");
    },

    // 转盘旋转
    startRotate(callback) {
        this.rotating = true;

        var angle = 0;
        var allWeight = 0;
        for (var i = 0; i < this.rewardList.length; i++) {
            allWeight += this.rewardList[i].weight;
        }

        var num = parseInt(allWeight * Math.random()) + 1;
        if (num <= this.rewardList[0].weight) {
            angle = 1;
        } else if (num <= this.rewardList[1].weight + this.rewardList[0].weight) {
            angle = 2;
        } else if (num <= this.rewardList[2].weight + this.rewardList[1].weight + this.rewardList[0].weight) {
            angle = 3;
        } else if (num <= this.rewardList[3].weight + this.rewardList[2].weight + this.rewardList[1].weight + this.rewardList[0].weight) {
            angle = 4;
        } else if (num <= this.rewardList[4].weight + this.rewardList[3].weight + this.rewardList[2].weight + this.rewardList[1].weight + this.rewardList[0].weight) {
            angle = 5;
        } else {
            angle = 0;
        }

        //两个方案一种  加速 + 匀速 + 减速
        //cc.tween(this.disc).by(1.5,{rotation:360},{easing: 'sineIn'}).by(1.5,{rotation:360*2}).by(3.83, {rotation:360*3+angle*60},{easing:'sineOut'}).call(() => { this.rotating = false; this.disc.rotate = 0;}).start();
        // 加速 + 减速

        var action = cc.rotateTo(2.5, 360 * 6 + angle * 60);
        action.easing(cc.easeInOut(3.0));
        this.disc.runAction(cc.sequence(action, cc.callFunc(() => {
            if (typeof callback === 'function')
                callback();

            this.getRewards(angle);

            setTimeout(() => {
                this.refreshPanel();
                this.disc.rotate = angle * 60;
            }, 500)
        })));
    },

    getRewards: function (angle) {
        this.hideBtns();
        var rewardData = this.rewardList[angle];
        switch (rewardData.rType) {
            case TurnTableGetType.coin:
                cc.Mgr.UIMgr.openAssetGetUI("money", rewardData.num, "turnTable");
                break;
            case TurnTableGetType.gem:
                cc.Mgr.UIMgr.openAssetGetUI("gem", rewardData.num, "turnTable");

                break;
            case TurnTableGetType.plant:
                cc.Mgr.UIMgr.openAssetGetUI("plant", rewardData.id, "turnTable");
                break;
            case TurnTableGetType.buff:
                cc.Mgr.UIMgr.openAssetGetUI(this.currentBuffList[angle], rewardData.num, "turnTable");
                break;
            case TurnTableGetType.drone:
                cc.Mgr.UIMgr.openAssetGetUI("drone", rewardData.id, "turnTable");
                break;
        }
    },

    closeUI: function () {
        cc.Mgr.AudioMgr.playSFX("click");
        if (this.rotating) return;
        cc.Mgr.admob.hideBanner("turnTable");
        let self = this
        cc.tween(this.blurBg).to(0.15, { opacity: 0 }).start();
        cc.tween(this.content).to(0.15, { opacity: 0, scale: .5 }).call(() => {
            self.unschedule(self.countTime);
            self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("turnTable");
    },
});
module.exports = turnTableUI;