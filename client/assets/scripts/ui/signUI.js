var signItem = require("signItem");
var MissionType = require("MissionType");
var AchieveType = require("AchieveType");
var signUI = cc.Class({
    extends: cc.Component,

    properties: {
        dayList: [signItem],
        adsDoubleSignBtn: cc.Button,
        inviteBtn: cc.Button,
        hasSignTip: cc.Node,
        toggle: cc.Toggle,
        dayLabelList: [cc.Label],
        checkedLabel: cc.Label,
        tip: cc.Label,

        content: cc.Node,
        blurBg: cc.Node,

        btnLabel: cc.Label,

        title: cc.Node,
        title_zh: cc.Node,
        title_ja: cc.Node,
        title_ru: cc.Node,

        gemsLabel: cc.Label,

        doubleTip: cc.Label
    },

    onLoad() {
        this.limitClick = this.node.getComponent('LimitClick')
    },

    start() {
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

    showUI: function () {
        for (let i = 0; i < 7; i++) {
            this.dayLabelList[i].string = cc.Mgr.Utils.getTranslation("signIn-day", [(i + 1)]);
        }
        this.checkedLabel.string = cc.Mgr.Utils.getTranslation("signIn-checked");
        this.tip.string = cc.Mgr.Utils.getTranslation("signIn-tip");
        this.btnLabel.string = cc.Mgr.Utils.getTranslation("btn-claim");
        this.doubleTip.string = cc.Mgr.Utils.getTranslation("invite-double-tip");

        this.node.width = cc.Mgr.Config.winSize.width;
        this.node.height = cc.Mgr.Config.winSize.height;

        this.refreshUI();

        this.blurBg.opacity = 0
        this.content.opacity = 0;
        this.content.setScale(.5)
        cc.tween(this.blurBg).to(0.05, { opacity: 255 }).call().start();
        cc.tween(this.content).to(0.15, { opacity: 255, scale: 1 }).start();

        var rewardNum = cc.Mgr.Config.signDataList[cc.Mgr.game.hasSignDayNum].rewardNum * 2;
        this.gemsLabel.string = "X" + rewardNum;

        cc.Mgr.admob.showBanner("dailyBonus");
    },

    adsDoubleSign: function () {
        if (this.limitClick.clickTime() == false) {
            return
        }
        cc.Mgr.AudioMgr.playSFX("click");
        var rewardNum = cc.Mgr.Config.signDataList[cc.Mgr.game.hasSignDayNum].rewardNum;

        this.getRewards(rewardNum);
        cc.Mgr.game.hasSignDayNum += 1;
        if (cc.Mgr.game.hasSignDayNum >= 7) cc.Mgr.game.hasSignDayNum = 0;
        cc.Mgr.game.lastSignDate = cc.Mgr.Utils.GetSysTime();
        this.refreshUI();
    },

    onClickInvite: function () {
        if (this.limitClick.clickTime() == false) {
            return
        }
        cc.Mgr.AudioMgr.playSFX("click");
        let self = this;
        cc.Mgr.UIMgr.showLoading();
        cc.Mgr.Utils.getBase64Image("resources/tex/shareImage_7.png", (_data) => {
            cc.Mgr.UIMgr.hideLoading();

            cc.Mgr.game.updateMissionProgressById(MissionType.InviteCount);
            cc.Mgr.game.updateAchieveProgressByType(AchieveType.Invite);
            cc.Mgr.UIMgr.InGameUI.checkMissionAchieveTip();

            var rewardNum = cc.Mgr.Config.signDataList[cc.Mgr.game.hasSignDayNum].rewardNum * 2;
            self.getRewards(rewardNum);
            cc.Mgr.game.hasSignDayNum += 1;
            if (cc.Mgr.game.hasSignDayNum >= 7) cc.Mgr.game.hasSignDayNum = 0;
            cc.Mgr.game.lastSignDate = cc.Mgr.Utils.GetSysTime();
            self.refreshUI();

            let data = {}
            data.elapsed = cc.Mgr.Utils.getDate9(true)
            data.stage = cc.Mgr.game.level
            data.feature = "sign in"
            cc.Mgr.analytics.logEvent("share_message", JSON.stringify(data));

            // failed
            cc.Mgr.UIMgr.showPrompt("Invitation Failed", "", self.node);
            cc.Mgr.UIMgr.hideLoading();
        });
    },

    refreshUI() {
        this.hasSignTip.active = false;
        this.adsDoubleSignBtn.node.active = true;
        this.inviteBtn.node.active = false;
        this.doubleTip.node.active = false;
        if (cc.Mgr.Utils.getDays(cc.Mgr.Utils.GetSysTime()) - cc.Mgr.Utils.getDays(cc.Mgr.game.lastSignDate) < 1) {
            this.adsDoubleSignBtn.node.active = false;
            this.doubleTip.node.active = false;
            this.inviteBtn.node.active = false;
            this.hasSignTip.active = true;
        } else if (cc.Mgr.Utils.getDays(cc.Mgr.Utils.GetSysTime()) - cc.Mgr.Utils.getDays(cc.Mgr.game.lastSignDate) > 2) {
            cc.Mgr.game.hasSignDayNum = 0;
        }

        // if (cc.Mgr.Utils.getDays(cc.Mgr.Utils.GetSysTime()) - cc.Mgr.Utils.getDays(cc.Mgr.game.lastInviteDate) < 1) {
        //     this.inviteBtn.node.active = false;
        // }

        // if (this.adsDoubleSignBtn.node.active == false && this.inviteBtn.node.active == false) {
        //     this.hasSignTip.active = true;
        // }

        // tempory code
        // if(cc.Mgr.Utils.GetSysTime() - cc.Mgr.game.lastSignDate < 20) {
        //     this.adsDoubleSignBtn.node.active = false;
        //     this.hasSignTip.active = true;
        // } else if (cc.Mgr.Utils.GetSysTime() - cc.Mgr.game.lastSignDate > 40){
        //     cc.Mgr.game.hasSignDayNum = 0;
        // }

        for (var i = 0; i < this.dayList.length; i++) {
            this.dayList[i].setData(i + 1);
        }
    },

    getRewards: function (num) {
        cc.Mgr.UIMgr.openAssetGetUI("gem", num, "sign");
    },

    closeUI: function () {
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("dailyBonus");
        let self = this
        cc.tween(this.blurBg).to(0.15, { opacity: 0 }).start();
        cc.tween(this.content).to(0.15, { opacity: 0, scale: .5 }).call(() => {
            cc.Mgr.UIMgr.InGameUI.checkSignState();
            self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("sign");
    },
});
module.exports = signUI;
