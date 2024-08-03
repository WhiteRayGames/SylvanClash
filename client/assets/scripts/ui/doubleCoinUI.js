
var doubleCoinUI = cc.Class({
    extends: cc.Component,

    properties: {
        
        adsIconNode:cc.Node,
        freeLabelNode:cc.Label,
        desLabel: cc.Label,
        timeTipLabel: cc.Label,

        content: cc.Node,
        blurBg: cc.Node,

        spriteCoin: cc.Sprite,
        nomarlM: cc.Material,
        grayM: cc.Material,

        title: cc.Node,
        title_zh: cc.Node,
        title_ja: cc.Node,
        title_ru: cc.Node
    },

    onLoad () {
        this.limitClick = this.node.getComponent('LimitClick')
    },

    start () {
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

    showUI:function () {
        this.desLabel.string = cc.Mgr.Utils.getTranslation("trebleCoin-des-1");
        this.timeTipLabel.string = cc.Mgr.Utils.getTranslation("doubleCoin-des-2");

        this.freeLabelNode.node.x = 20;
        this.freeLabelNode.string = cc.Mgr.Utils.getTranslation("btn-get");

        this.blurBg.opacity = 0
        this.content.opacity = 0;
        this.content.setScale(.5)
        cc.tween(this.blurBg).to(0.05, {opacity:255}).call().start();
        cc.tween(this.content).to(0.15, {opacity:255, scale: 1}).start();

        cc.Mgr.admob.showBanner("getDoubleReward");
        this.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        if (this.checkAvailabelAds) {
            this.spriteCoin.setMaterial(0, this.nomarlM);
        } else {
            this.spriteCoin.setMaterial(0, this.grayM);
        }
    },

    closeUI:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("getDoubleReward");
        let self = this
        cc.tween(this.blurBg).to(0.15, {opacity:0}).start();
        cc.tween(this.content).to(0.15, {opacity:0, scale: .5}).call(() => {
            self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("doubleCoin");
    },

    adsDouble:function(){
        if (this.limitClick.clickTime() == false) {
            return
        }
        if (this.checkAvailabelAds === false) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", this.node);
            // let data = {};
            // data.elapsed = cc.Mgr.Utils.getDate9(true);
            // data.adsType = "rewarded";
            // data.feature = "double_coin";
            // cc.Mgr.analytics.logEvent("ad_present_failed", JSON.stringify(data));
            return;
        }
        let self = this;
        cc.Mgr.admob.showRewardedVideoAd((function(_state) {
            if (_state) {
                cc.Mgr.UIMgr.InGameUI.startDoubleCoinState();
            } else {
                // let data = {};
                // data.elapsed = cc.Mgr.Utils.getDate9(true);
                // data.adsType = "rewarded";
                // data.feature = "double_coin";
                // cc.Mgr.analytics.logEvent("ad_present_failed", JSON.stringify(data));
            }
        }), this.node, "doubleCoin", this);

        self.closeUI();
    },

    updateAdsBtnState () {
        this.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        if (this.checkAvailabelAds) {
            this.spriteCoin.setMaterial(0, this.nomarlM);
        } else {
            this.spriteCoin.setMaterial(0, this.grayM);
        }

        cc.Mgr.UIMgr.InGameUI.showDoubleCoinBtn(false);
    },
});
module.exports = doubleCoinUI;
