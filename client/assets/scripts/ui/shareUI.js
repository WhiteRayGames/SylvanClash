// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var tweenTime = 0.15;
var MissionType = require("MissionType");
var AchieveType = require("AchieveType");
var shareUI = cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        numEffect: cc.Node,
        closeNode: cc.Node,
        blurBg: cc.Node,
        content: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.limitClick = this.node.getComponent('LimitClick')
    },

    start () {
        this.getReward = false;
    },

    onClickShare () {
        if (this.limitClick.clickTime() == false) {
            return
        }

        if (cc.Mgr.Config.isTelegram == false) return;

        let userId = window.Telegram.WebApp.initDataUnsafe.user.id;
        const messageText = encodeURIComponent("💰Catizen: Unleash, Play, Earn - Where Every Game Leads to an Airdrop Adventure! \n🎁Let's play-to-earn airdrop right now!");
        const gameUrl = encodeURIComponent("https://t.me/Vision_test_02_bot/paytest?startapp=" + userId);
        const telegramUrl = `https://t.me/share/url?url=${gameUrl}&text=${messageText}`;
        window.open(telegramUrl, '_blank');

        // cc.Mgr.UIMgr.showLoading();
        //
        // let self = this;
        // cc.Mgr.Utils.getBase64Image("resources/tex/shareImage_5.png", (_data) => {
        //     cc.Mgr.UIMgr.hideLoading();
        //
        //     cc.Mgr.game.updateMissionProgressById(MissionType.InviteCount);
        //     cc.Mgr.game.updateAchieveProgressByType(AchieveType.Invite);
        //     cc.Mgr.UIMgr.InGameUI.checkMissionAchieveTip();
        //
        //     self.getReward = true;
        //
        //     let data = {}
        //     data.elapsed = cc.Mgr.Utils.getDate9(true)
        //     data.stage = cc.Mgr.game.level
        //     data.feature = "invite friends"
        //     cc.Mgr.analytics.logEvent("share_message", JSON.stringify(data));
        //
        //     self.closeUI();
        // });
    },

    showUI:function () {
        this.node.width = cc.Mgr.Config.winSize.width;
        this.node.height = cc.Mgr.Config.winSize.height;

        this.doTween();

        this.blurBg.opacity = 0
        this.content.opacity = 0;
        this.content.setScale(.5)
        cc.tween(this.blurBg).to(0.05, {opacity:255}).call().start();
        cc.tween(this.content).to(0.15, {opacity:255, scale: 1}).start();

        let coins = cc.Mgr.game.caculatePlantPrice(cc.Mgr.game.plantMaxLv);
        this.coins = coins;
        this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(this.coins));
    },

    doTween:function(){
        this.closeNode.opacity = 0;
        this.closeNode.scale = 0;
        cc.tween(this.closeNode).to(tweenTime, {opacity:255, scale:1.0}).start();
    },

    closeUI:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("offline");
        let self = this
        cc.tween(this.blurBg).to(0.15, {opacity:0}).start();
        cc.tween(this.content).to(0.15, {opacity:0, scale: .5}).call(() => {
            if (self.getReward == true) {
                cc.Mgr.game.money += BigInt(self.coins);
            
                cc.Mgr.game.coin_gained_total += BigInt(self.coins);
                cc.Mgr.UIMgr.showJibEffect();
                cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
            }
            
            self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("offlineAssets");
    }

    // update (dt) {},
});

module.exports = shareUI;