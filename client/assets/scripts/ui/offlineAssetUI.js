var tweenTime = 0.15;
var offlineAssetUI = cc.Class({
    extends: cc.Component,

    properties: {
        numLbl:cc.Label,
        closeNode:cc.Node,
        checkBox: cc.Toggle,

        descLabel: cc.Label,
        checkboxLabel: cc.Label,
        btnLabel: cc.Label,
        vipTip: cc.Label,
        doubleTip: cc.Label,

        content: cc.Node,
        blurBg: cc.Node,

        checkboxNode: cc.Node,
        vipNode: cc.Node,
        doubleNode: cc.Node,

        numEffect: cc.Node,

        getBtn: cc.Node,
        adsBtn: cc.Node,
        adsLabel: cc.Label,

        title: cc.Node,
        title_zh: cc.Node,
        title_ja: cc.Node,
        title_ru: cc.Node,

        noThanks: cc.Node,
        noThanksLabel: cc.Label,

        buyLabel: cc.Label,
        buyDescLabel: cc.Label,
        tripleNode: cc.Node
    },

    onLoad () {
        this.limitClick = this.node.getComponent('LimitClick');

        this.showCount = 0;
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

    updateReward () {
        // vip tempory code
        let num = ((this.checkBox.isChecked === true && this.checkboxNode.active) || cc.Mgr.game.isVIP) ? this.num * BigInt(3) : this.num;
        // let num = this.checkBox.isChecked === true ? this.num * 2 : this.num;
        this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(num))
        cc.Mgr.game.isManualSetting = cc.Mgr.game.isManualSetting_payingUser = this.checkBox.isChecked;

        // let data = {}
        // data.elapsed = Date.now()
        // data.action = (this.checkBox.isChecked === true && this.checkboxNode.active) ? "check" : "uncheck"
        // data.feature = "offline"
        // cc.Mgr.analytics.logEvent("checkbox", JSON.stringify(data));

        this.getBtn.active = false;
        this.adsBtn.active = false;
        if (this.checkboxNode.active && this.checkBox.isChecked) {
            this.adsBtn.active = true;
        } else {
            this.getBtn.active = true;
        }
    },

    doTween:function(){
        this.closeNode.opacity = 0;
        this.closeNode.scale = 0;
        cc.tween(this.closeNode).to(tweenTime, {opacity:255, scale:1.0}).start();
    },

    showUI:function (data) {
        this.descLabel.string = cc.Mgr.Utils.getTranslation("offline-des");
        this.checkboxLabel.string = cc.Mgr.Utils.getTranslation("getReward-checkbox-treble");
        this.btnLabel.string = cc.Mgr.Utils.getTranslation("btn-claim");
        this.vipTip.string = cc.Mgr.Utils.getTranslation("vip-treble-tip");
        this.doubleTip.string = cc.Mgr.Utils.getTranslation("offline-treble-tip");
        this.adsLabel.string = cc.Mgr.Utils.getTranslation("btn-treble");
        this.noThanksLabel.string = cc.Mgr.Utils.getTranslation("btn-no-thanks");

        this.buyLabel.string = cc.Mgr.payment.priceList[10];
        this.buyDescLabel.string = cc.Mgr.Utils.getTranslation("buy-offline-desc");

        if (cc.Mgr.Config.language === "Russian") {
            this.checkboxLabel.fontSize = 18;
        }

        this.tripleNode.active = !cc.Mgr.game.offlineDouble;
        this.content.y = cc.Mgr.game.offlineDouble ? 0 : 50;

        this.node.width = cc.Mgr.Config.winSize.width;
        this.node.height = cc.Mgr.Config.winSize.height;

        this.num = data;
        // this.numLbl.string = "+"+cc.Mgr.Utils.getNumStr(this.num);

        this.doTween();

        this.blurBg.opacity = 0
        this.content.opacity = 0;
        this.content.setScale(.5)
        cc.tween(this.blurBg).to(0.05, {opacity:255}).call().start();
        cc.tween(this.content).to(0.15, {opacity:255, scale: 1}).start();
        cc.Mgr.admob.showBanner("offline");

        this.noThanks.opacity = 0;
        this.noThanks.active = false;

        if (this.showBtnCounter) {
            clearTimeout(this.showBtnCounter);
        }

        let checkState
        if (cc.Mgr.game.isPayingUser) {
            checkState = cc.Mgr.game.isManualSetting_payingUser == undefined ? cc.Mgr.game.checkDoubleReward : cc.Mgr.game.isManualSetting_payingUser;
            if (this.checkBox.isChecked != checkState)this.checkBox.isChecked = checkState;
        } else {
            checkState = cc.Mgr.game.isManualSetting == undefined ? cc.Mgr.game.checkDoubleReward : cc.Mgr.game.isManualSetting;
            if (this.checkBox.isChecked != checkState)this.checkBox.isChecked = checkState;
        }

        let currentRewardedAvailable = cc.Mgr.admob.checkAvailableRewardedAd();

        // vip tempory code
        if ((this.checkBox.isChecked && currentRewardedAvailable) || cc.Mgr.game.isVIP || cc.Mgr.game.offlineDouble) {
            let currentNum = this.num * BigInt(3)
            this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(currentNum), true)
        } else {
            this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(this.num), true)
        }

        this.checkboxNode.opacity = 255;

        this.checkboxNode.active = !cc.Mgr.game.isVIP;
        if (currentRewardedAvailable === false)this.checkboxNode.active = false;
        this.vipNode.active = cc.Mgr.game.isVIP;
        this.doubleNode.active = cc.Mgr.game.isVIP ? false : cc.Mgr.game.offlineDouble;
        if (this.doubleNode.active) this.checkboxNode.active = false;

        this.getBtn.active = false;
        this.adsBtn.active = false;
        if (this.checkboxNode.active && this.checkBox.isChecked) {
            this.adsBtn.active = true;
        } else {
            this.getBtn.active = true;
        }

        this.adsBtn.y = -350;

        this.isDouble = false;

        // if (this.checkBox.isChecked || cc.Mgr.game.offlineDouble) {
        //     let currentNum = this.num * 2
        //     this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(currentNum), true)
        // } else {
        //     this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(this.num), true)
        // }

        // this.checkboxNode.active = true;
        // this.vipNode.active = false;
        // this.doubleNode.active = cc.Mgr.game.offlineDouble;
    },

    onClickGet () {
        cc.Mgr.payment.purchaseByIndex(10, () => {
            cc.Mgr.game.offlineDouble = true;
            this.closeUI();
        }, cc.Mgr.UIMgr.tipRoot);
    },

    onClickReceiveAds () {
        if (this.limitClick.clickTime() == false) {
            return
        }

        let self = this
        cc.Mgr.admob.showRewardedVideoAd((function(_state) {
            if (_state) {
                self.num = BigInt(3) * self.num;
                self.isDouble = true;
            } else {
                // let data = {};
                // data.elapsed = cc.Mgr.Utils.getDate9(true);
                // data.adsType = "rewarded";
                // data.feature = "offline";
                // cc.Mgr.analytics.logEvent("ad_present_failed", JSON.stringify(data));
            }
            self.closeUI();
        }), this.node, "offline", this);
    },

    onClickReceive:function(){
        if (this.limitClick.clickTime() == false) {
            return
        }
        let self = this
        // vip tempory code
        if (cc.Mgr.game.isVIP) {
            self.num = BigInt(3) * self.num;
            self.isDouble = true;
            self.closeUI();
        } else {
            this.closeUI();
        }
        // if (this.checkBox.isChecked === true) {
        //     cc.Mgr.admob.showRewardedVideoAd((function() {
        //         self.num = 2 * self.num;
        //         self.closeUI();
        //     }), this.node, "offline");
        // } else {
        //     this.closeUI();
        // }
    },

    updateAdsBtnState () {
        let currentRewardedAvailable = cc.Mgr.admob.checkAvailableRewardedAd();

        // vip tempory code
        if ((this.checkBox.isChecked && currentRewardedAvailable) || cc.Mgr.game.isVIP || cc.Mgr.game.offlineDouble) {
            let currentNum = this.num * BigInt(3);
            this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(currentNum), true)
        } else {
            this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(this.num), true)
        }

        this.checkboxNode.active = !cc.Mgr.game.isVIP;
        if (currentRewardedAvailable === false)this.checkboxNode.active = false;
        this.vipNode.active = cc.Mgr.game.isVIP;
        this.doubleNode.active = cc.Mgr.game.isVIP ? false : cc.Mgr.game.offlineDouble;

        this.getBtn.active = false;
        this.adsBtn.active = false;
        if (this.checkboxNode.active && this.checkBox.isChecked) {
            this.adsBtn.active = true;
        } else {
            this.getBtn.active = true;
        }
    },

    adsDouble:function(){
        cc.Mgr.AudioMgr.playSFX("click");
    },

    closeUI:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("offline");
        let self = this
        cc.tween(this.blurBg).to(0.15, {opacity:0}).start();
        cc.tween(this.content).to(0.15, {opacity:0, scale: .5}).call(() => {
            cc.Mgr.game.money += self.num;

            // let data = {}
            // data.elapsed = Date.now()
            // data.value = self.num;
            // data.feature = "offline";
            // // vip tempory code
            // data.double = (self.checkBox.isChecked || cc.Mgr.game.isVIP) ? "True" : "False";
            // // data.double = self.checkBox.isChecked ? "True" : "False";
            // cc.Mgr.analytics.logEvent("earn_coin", JSON.stringify(data));
            
            cc.Mgr.game.coin_gained_total += self.num;
            cc.Mgr.UIMgr.showJibEffect();
            cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
            self.node.active = false;

            if (cc.Mgr.game.level > 1 && this.showCount >= 3) {
                // let coinNumber = cc.Mgr.UIMgr.getCoinNumber() * BigInt(30);
                // coinNumber = coinNumber < BigInt(1000000) ? BigInt(1000000) : coinNumber;
                // coinNumber = coinNumber * BigInt(2);
                // cc.Mgr.UIMgr.openCoinBundle(coinNumber, true, true);
                this.showCount = 0;
            } else {
                this.showCount++;
            }

            cc.Mgr.game.lastOfflineTime = cc.Mgr.Utils.GetSysTime();
            if (self.isDouble !== true) {
                // setTimeout (() => {
                //     cc.Mgr.admob.showInterstitial('offline', 'browse', null, true);
                // }, 1500);
            }
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("offlineAssets");
    },
});
module.exports = offlineAssetUI;
