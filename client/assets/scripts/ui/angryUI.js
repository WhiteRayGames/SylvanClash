var tweenTime = 0.25;
var angryUI = cc.Class({
    extends: cc.Component,

    properties: {
        angryLeftTimeLbl:cc.Label,

        progressbarMask: cc.Node,

        dragonNode:cc.Node,
        gemLabel:cc.Label,

        adsIconNode:cc.Node,
        freeLabelNode:cc.Label,

        tip_1: cc.Label,
        tip_2: cc.Label,
        title: cc.Label,

        content: cc.Node,
        blurBg: cc.Node,
        okLabel: cc.Label,
        spriteCoin: cc.Sprite,
        nomarlM: cc.Material,
        grayM: cc.Material
    },

    doTween:function(){
        this.dragonNode.opacity = 0;
        this.dragonNode.scale = 0;
        this.dragonNode.active = true;
        cc.tween(this.dragonNode).to(tweenTime, {opacity:255, scale:1.0}).call(()=>{
        }).start();
        
    },

    start(){
        cc.Mgr.UIMgr.angryUI = this;
        this.title.string = cc.Mgr.Utils.getTranslation("rage-title");
        this.tip_1.string = cc.Mgr.Utils.getTranslation("rage-speedup-tip-1");
        this.tip_2.string = cc.Mgr.Utils.getTranslation("rage-speedup-tip-2");
        this.okLabel.string = cc.Mgr.Utils.getTranslation("btn-ok")
        this.limitClick = this.node.getComponent('LimitClick')
    },

    showUI:function(){
        this.costGem = 3;
        
        this.node.width = cc.Mgr.Config.winSize.width;
        this.node.height = cc.Mgr.Config.winSize.height;
        this.refreshUI();

        if(cc.Mgr.game.beAngryleftTime > 0)
        {
            this.angryLeftTimeLbl.string = cc.Mgr.Utils.FormatNumToTime(cc.Mgr.game.beAngryleftTime);
            this.schedule(this.cancelAngryCb, 1);
        }
        else
        {
            this.angryLeftTimeLbl.string = "00:00";
        }

        this.doTween();

        this.gemLabel.string = this.costGem;

        
        this.adsIconNode.active = true;
        this.freeLabelNode.node.x = 26.7;
        this.freeLabelNode.string = cc.Mgr.Utils.getTranslation("btn-get");

        this.blurBg.opacity = 0
        this.content.opacity = 0;
        this.content.setScale(.5)
        cc.tween(this.blurBg).to(0.05, {opacity:255}).call().start();
        cc.tween(this.content).to(0.15, {opacity:255, scale: 1}).start();

        cc.Mgr.admob.showBanner("angry");

        this.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        if (this.checkAvailabelAds) {
            this.spriteCoin.setMaterial(0, this.nomarlM);
        } else {
            this.spriteCoin.setMaterial(0, this.grayM);
        }
    },

    cancelAngryCb:function(){
        cc.Mgr.plantMgr.changePlantAngryState(true);
        cc.Mgr.game.beAngryleftTime -= 1;
        this.progressbarMask.width = cc.Mgr.game.beAngryleftTime / 150 * 456;
        if(cc.Mgr.game.beAngryleftTime <= 0)
        {
            cc.Mgr.plantMgr.changePlantAngryState(false);
            this.unschedule(this.cancelAngryCb);
            this.angryLeftTimeLbl.string = "00:00";
        }
        else
            this.angryLeftTimeLbl.string = cc.Mgr.Utils.FormatNumToTime(cc.Mgr.game.beAngryleftTime);
    },

    adsGetMoreTime:function(){
        if (this.limitClick.clickTime() == false) {
            return
        }
        if (this.checkAvailabelAds === false) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", this.node);
            // let data = {};
            // data.elapsed = cc.Mgr.Utils.getDate9(true);
            // data.adsType = "rewarded";
            // data.feature = "rage";
            // cc.Mgr.analytics.logEvent("ad_present_failed", JSON.stringify(data));
            return;
        }
        var self = this;
        cc.Mgr.admob.showRewardedVideoAd((function(_state) {
            if (_state === true) {
                self.addMoreAngryTime();

                self.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
                if (self.checkAvailabelAds) {
                    self.spriteCoin.setMaterial(0, self.nomarlM);
                } else {
                    self.spriteCoin.setMaterial(0, self.grayM);
                }
            }
        }), this.node, "rage", this);
    },

    updateAdsBtnState () {
        this.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        if (this.checkAvailabelAds) {
            this.spriteCoin.setMaterial(0, this.nomarlM);
        } else {
            this.spriteCoin.setMaterial(0, this.grayM);
        }
    },

    refreshUI:function(){
        this.progressbarMask.width = cc.Mgr.game.beAngryleftTime / 150 * 456;
        this.angryLeftTimeLbl.string = cc.Mgr.Utils.FormatNumToTime(cc.Mgr.game.beAngryleftTime);
    },

    addMoreAngryTime:function(){
        this.unschedule(this.cancelAngryCb);
        cc.Mgr.game.beAngryleftTime += 30;
        if(cc.Mgr.game.beAngryleftTime > 150)
            cc.Mgr.game.beAngryleftTime = 150;
        this.refreshUI();
        this.schedule(this.cancelAngryCb, 1);
    },

    gemsGetMoreTime:function(){
        // if (this.limitClick.clickTime() == false) {
        //     return
        // }
        if(cc.Mgr.game.beAngryleftTime >= 150)
        {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("max-angry-time-150"), "", this.node);
            return;
        }

        if(cc.Mgr.game.gems >= this.costGem)
        {
            cc.Mgr.game.gems -= this.costGem;
            cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");
            let data = {}
            data.elapsed = cc.Mgr.Utils.getDate9(true)
            data.costGems = this.costGem
            cc.Mgr.analytics.logEvent("angry_get_more_time", JSON.stringify(data));

            // data = {}
            // data.elapsed = Date.now()
            // data.value = this.costGem;
            // data.feature = "rage";
            // cc.Mgr.analytics.logEvent("spend_gem", JSON.stringify(data));

            this.addMoreAngryTime();
        }
        else {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoGems"), "gem", this.node);
            cc.Mgr.game.needShowIAPCount++;
            if (cc.Mgr.game.needShowIAPCount >= 1) {
                cc.Mgr.UIMgr.openPaymentUI(true);
                cc.Mgr.game.needShowIAPCount = 0;
            }
        }   
    },

    closeUI:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("angry");
        let self = this
        cc.tween(this.blurBg).to(0.15, {opacity:0}).start();
        cc.tween(this.content).to(0.15, {opacity:0, scale: .5}).call(() => {
            self.unschedule(self.cancelAngryCb);
            self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount();
    },
});
module.exports = angryUI;
