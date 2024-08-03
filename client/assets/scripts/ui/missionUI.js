var missionItem = require("missionItem");
var achieveItem = require("achieveItem");
var uiConfig = require("uiConfig");
var MissionType = require("MissionType");
var DataType = require("DataType");
var AchieveType = require("AchieveType");
var scaleConfig = 1.3;
var tweenTime = 0.15;

var missionUI = cc.Class({
    extends: cc.Component,

    properties: {
        closeNode: cc.Node,

        newMItemParent: cc.Node,
        newAItemParent: cc.Node,

        misList: [missionItem],
        achList: [achieveItem],

        missContent: cc.Node,
        achieveContent: cc.Node,

        missionToggle: cc.Toggle,
        achievementToggle: cc.Toggle,

        noMisTip: cc.Label,
        redAchieveTip: cc.Node,

        // tabNode: cc.Node,

        missionLable_1: cc.Label,
        missionLabel_2: cc.Label,
        achievementLabel_1: cc.Label,
        achievementlabel_2: cc.Label,

        content: cc.Node,
        blurBg: cc.Node,

        title: cc.Node,
        title_zh: cc.Node,
        title_ja: cc.Node,
        title_ru: cc.Node
    },

    doTween: function () {
        this.closeNode.opacity = 0;
        this.closeNode.scale = 0;
        cc.tween(this.closeNode).to(tweenTime, { opacity: 255, scale: 1.0 }).start();
    },

    start() {
        cc.Mgr.UIMgr.missionUI = this;
        this.missionLabel_2.string = this.missionLable_1.string = cc.Mgr.Utils.getTranslation("mission-toggle-button");
        this.achievementlabel_2.string = this.achievementLabel_1.string = cc.Mgr.Utils.getTranslation("achievement-toggle-button");
        this.noMisTip.string = cc.Mgr.Utils.getTranslation("noMission-tip");

        this.title.active = false;
        this.title_zh.active = false;
        this.title_ja.active = false;
        this.title_ru.active = false;
        if (cc.Mgr.Config.language === "Japanese") {
            this.title_ja.active = true;
        } else if (cc.Mgr.Config.language === "Simplified Chinese" || cc.Mgr.Config.language === "Traditional Chinese") {
            this.title_zh.active = true;
        } else if (cc.Mgr.Config.language === "Russian") {
            this.title_ru.active = true;
        } else {
            this.title.active = true;
        }
    },

    //挑选出五个内容 成就 
    pickOutAchieveDataList: function () {
        var outList = [];
        for (var i = 0; i < cc.Mgr.game.achievementProgress.length; i++) {
            var dt = cc.Mgr.game.achievementProgress[i];
            if (!dt.finished && this.checkLvToGainGems(dt.id, dt.checklv) != 0) {
                if (outList.length < 5) outList.push(dt);
                // share
                if (dt.achType == AchieveType.Invite) outList.push(dt);
            }
        }
        return outList;
    },

    pickOutMissionDataList: function () {
        var outList = [];
        for (var i = 0; i < cc.Mgr.game.dailyMissions.length; i++) {
            var dt = cc.Mgr.game.dailyMissions[i];
            var param = {};
            param.needShow = true;
            param.data = dt;
            if (dt.claimed == 1 && (dt.misType < MissionType.AdsShow || dt.misType == MissionType.InviteCount)) {
                param.needShow = false;
            }
            else if (dt.misType == MissionType.AdsShow) {
                if (dt.claimed == 1)
                    param.needShow = false;
                /*else if(dt.checklv == 1 && dt.progress >= cc.Mgr.Config.missionCheckList[dt.id][0])
                    param.needShow = false;*/
                // continue;
            }
            else if (dt.misType == MissionType.InGameTime) {
                if (dt.claimed == 1)
                    param.needShow = false;
                /*else if(dt.checklv == 1 && dt.progress >= cc.Mgr.Config.missionCheckList[dt.id][0])
                    param.needShow = false;
                else if(dt.checklv == 2 && dt.progress >= cc.Mgr.Config.missionCheckList[dt.id][1])
                    param.needShow = false;*/
            } else if (dt.misType == MissionType.InviteCount) {// share
                param.needShow = false;
                continue;
            }
            outList.push(param);
        }

        return outList;
    },

    checkLvToGainGems: function (id, checklv) {
        var dt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.AchievementData, id);
        if (checklv == 0)
            return dt.Gain_5;
        else if (checklv == 1)
            return dt.Gain_20;
        else if (checklv == 2)
            return dt.Gain_50;
        else if (checklv == 3)
            return dt.Gain_100;
        else if (checklv == 4)
            return dt.Gain_200;
    },

    showUI: function (_refresh) {
        this.node.width = cc.Mgr.Config.winSize.width;
        this.node.height = cc.Mgr.Config.winSize.height;
        this.redAchieveTip.active = false;

        this.missionToggle.isChecked = true;

        var misshowList = this.pickOutMissionDataList();
        this.loadMissionItemsNew(misshowList);
        this.loadAchieveItemsNew();

        if (_refresh === true) return;

        this.doTween();

        this.blurBg.opacity = 0
        this.content.opacity = 0;
        this.content.setScale(.5)
        cc.tween(this.blurBg).to(0.05, { opacity: 255 }).call().start();
        cc.tween(this.content).to(0.15, { opacity: 255, scale: 1 }).start();

        cc.Mgr.admob.showBanner("mission");
    },

    showMissionContent: function () {
        // this.missionToggle.isChecked = false;
        // this.achievementToggle.isChecked = true;
        this.achieveContent.active = false;
        this.missContent.active = true;
        // this.tabNode.x = 47
    },

    showAchieveContent: function () {
        this.redAchieveTip.active = false;
        // this.missionToggle.active = true;
        // this.achievementToggle.isChecked = false;
        this.missContent.active = false;
        this.achieveContent.active = true;
        // this.tabNode.x = 23
    },

    loadMissionItemsNew: function (misshowList) {
        var self = this;
        this.noMisTip.node.active = false;
        var showOut = false;
        for (var i = 0; i < misshowList.length; i++) {
            if (misshowList[i].needShow) {
                showOut = true;
                break;
            }
        }

        let maxLen = Math.min(6, misshowList.length);

        if (showOut) {
            this.newMItemParent.active = true;
            if (this.misList.length == 0) {
                var itimes = 0;
                this.initMissionItems = function () {
                    if (itimes >= maxLen) {
                        this.unschedule(this.initMissionItems);
                        if (cc.Mgr.game.checkOutMissionIsFinished()) {
                            this.showMissionContent();
                            if (cc.Mgr.game.checkOutAchieveDataIsFinished())
                                this.redAchieveTip.active = true;
                        }

                        return;
                    }
                    var item = cc.instantiate(cc.Mgr.UIItemMgr.getMissionItemPre());
                    item.parent = this.newMItemParent;
                    var scp = item.getComponent("missionItem");
                    if (misshowList[itimes].data.claimed == 1)
                        item.active = false;
                    else
                        item.active = true;
                    var data = misshowList[itimes].data;
                    if (item.active == true)
                        scp.setData(data);
                    this.misList.push(scp);
                    itimes += 1;
                }
                this.schedule(this.initMissionItems, 0.005, 5, 0.01);
            }
            else {
                for (var i = 0; i < this.misList.length; i++) {
                    this.misList[i].node.active = false;
                }

                for (var i = 0; i < misshowList.length; i++) {
                    if (misshowList[i].needShow) {
                        this.misList[i].node.active = true;
                        var dt = misshowList[i].data;
                        this.misList[i].setData(dt);
                    }
                }
                if (cc.Mgr.game.checkOutMissionIsFinished()) {
                    this.showMissionContent();
                    if (cc.Mgr.game.checkOutAchieveDataIsFinished())
                        this.redAchieveTip.active = true;

                }
                else if (cc.Mgr.game.checkOutAchieveDataIsFinished()) {
                    this.redAchieveTip.active = false;
                    this.achievementToggle.isChecked = true;
                }
            }
        }
        else {
            this.newMItemParent.active = false;
            this.noMisTip.node.active = true;
            this.redAchieveTip.active = false;
            this.achievementToggle.isChecked = true;
        }
    },

    loadAchieveItemsNew: function () {
        var self = this;
        var acshowList = this.pickOutAchieveDataList();
        if (acshowList.length == 0) {
            this.newAItemParent.active = false;
        }
        else {
            this.newAItemParent.active = true;
            if (this.achList.length == 0) {
                var itimes = 0;
                this.initAchieveItems = function () {
                    if (itimes >= acshowList.length) {
                        this.unschedule(this.initAchieveItems);
                        return;
                    }
                    var item = cc.instantiate(cc.Mgr.UIItemMgr.getAchieveItemPre());
                    item.parent = this.newAItemParent;
                    var scp = item.getComponent("achieveItem");
                    item.active = true;
                    var dt = acshowList[itimes];
                    scp.setData(dt);
                    this.achList.push(scp);
                    itimes += 1;
                }
                this.schedule(this.initAchieveItems, 0.005, this.acshowList, 0.01);
            }
            else {
                for (var i = 0; i < this.achList.length; i++) {
                    this.achList[i].node.active = false;
                }
                for (var i = 0; i < acshowList.length; i++) {
                    var data = acshowList[i];
                    this.achList[i].node.active = true;
                    this.achList[i].setData(data);
                }
            }
        }
    },

    closeUI: function () {
        cc.Mgr.AudioMgr.playSFX("click");
        let self = this
        cc.Mgr.admob.hideBanner("mission");
        cc.tween(this.blurBg).to(0.15, { opacity: 0 }).start();
        cc.tween(this.content).to(0.15, { opacity: 0, scale: .5 }).call(() => {
            cc.Mgr.UIMgr.InGameUI.checkMissionAchieveTip();
            self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("mission");
    },

});
module.exports = missionUI;
