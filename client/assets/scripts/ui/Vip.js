// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
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
        titleLabel: cc.Label,
        btnLabel: cc.Label,

        content: cc.Node,
        blurBg: cc.Node,

        getBtn: cc.Button,
        vipIcon: cc.Node,

        priceLabel: cc.Label,
        priceLabel2: cc.Label,
        tipLabel: cc.Label,

        scrollView: cc.Node,

        policyAndService: cc.Node,

        policyLabel: cc.Label,
        andLabel: cc.Label,
        serviceLabel: cc.Label,
        scrollViewNode: cc.Node,
        recoveryBtnLabel: cc.Label,
        recoveryBtn: cc.Node,

        content_en: cc.Node,
        content_ja: cc.Node,
        content_zh: cc.Node,
        content_ru: cc.Node,

        normaleNode: cc.Node,
        saleNode: cc.Node,
        timeNode: cc.Node,
        timeLabel: cc.Label,
        timeTip: cc.Label,

        weekLabel: cc.Label,
        weekLabel2: cc.Label,

        originalPriceLabel: cc.Label,
        salePriceLabel: cc.Label,

        originalPriceNode: cc.Node,
        lineNode: cc.Node,

        saleLabel: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.titleLabel.string = cc.Mgr.Utils.getTranslation("vip-title");
        this.btnLabel.string = cc.Mgr.Utils.getTranslation("btn-get");
        this.policyLabel.string = cc.Mgr.Utils.getTranslation("policy-label");
        this.andLabel.string = cc.Mgr.Utils.getTranslation("and");
        this.serviceLabel.string = cc.Mgr.Utils.getTranslation("service-label");
        this.recoveryBtnLabel.string = cc.Mgr.Utils.getTranslation("btn-recovery");
        this.timeTip.string = cc.Mgr.Utils.getTranslation("bundle-time-tip");
        this.weekLabel.string = cc.Mgr.Utils.getTranslation("vip-week");
        this.weekLabel2.string = cc.Mgr.Utils.getTranslation("vip-week");

        this.limitClick = this.node.getComponent('LimitClick');

        this.openSpecialCountList = [3, 5, 8, 10, 20, 30];

        this.content_en.active = false;
        this.content_ja.active = false;
        this.content_zh.active = false;
        this.content_ru.active = false;
        if (cc.Mgr.Config.language === "Japanese") {
            this.content_ja.active = true;
        } else if (cc.Mgr.Config.language === "Simplified Chinese" || cc.Mgr.Config.language === "Traditional Chinese") { 
            this.content_zh.active = true;
        } else if (cc.Mgr.Config.language === "Russian") {
            this.content_ru.active = true;
        } else {
            this.content_en.active = true;
        }
    },

    showUI (_from) {
        this.from = _from;
        this.scrollViewNode.opacity = 0;
        this.blurBg.opacity = 0
        this.content.opacity = 0;
        this.content.setScale(.5)
        cc.tween(this.blurBg).to(0.05, {opacity:255}).call().start();
        cc.tween(this.content).to(0.15, {opacity:255, scale: 1}).call(() => {
            cc.tween(this.scrollViewNode).to(0.15, {opacity:255}).call().start();
        }).start();

        if (cc.Mgr.game.vipdiscount === true) {
            if (cc.Mgr.game.vipCloseCount >= 1 && cc.Mgr.game.vipSaleTimer === 0) {
                cc.Mgr.game.vipCloseCount = 0;
                cc.Mgr.game.vipSaleTimer = Date.now() + 72 * 3600 * 1000;
            }
        }
        
        this.refreshUI();
        
        this.vipIcon.active = cc.Mgr.game.isVIP;
        // this.priceLabel.node.active = this.getBtn.node.active = !cc.Mgr.game.isVIP;

        cc.Mgr.plantMgr.hideVipTip();

        this.recoveryBtn.active = false;

        this.startTimeCount();
    },

    startTimeCount:function(){
        this.unschedule(this.countTime);
        if(this.isSale === false) {
            return;
        }

        this.seconds = Math.floor((cc.Mgr.game.vipSaleTimer - Date.now()) / 1000);
        if(this.seconds > 0)
        {
            this.timeNode.active = true;
            var timeStr = cc.Mgr.Utils.FormatNumToTime(this.seconds);
            this.timeLabel.string = timeStr;
            this.schedule(this.countTime, 1);
        }
    },

    countTime:function(){
        this.seconds -= 1;
        if(this.seconds < 0)
        {
            this.unschedule(this.countTime);
            this.refreshUI();
            return;
        }
        var timeStr = cc.Mgr.Utils.FormatNumToTime(this.seconds);
        this.timeLabel.string = timeStr;
    },

    refreshUI: function () {
        this.isSale = cc.Mgr.game.vipSaleTimer > Date.now();

        // cc.Mgr.admob.showBanner();

        // this.getBtn.interactable = !cc.Mgr.game.isVIP;
        let currentPrice, salePrice, currentPriceValue, salePriceValue;
        currentPrice = "$7.99";
        salePrice = "$3.99";
        currentPriceValue = 7.99;
        salePriceValue = 3.99;

        this.saleLabel.string = (Math.ceil(salePriceValue / currentPriceValue * 100)) + "%OFF";

        this.originalPriceLabel.string = currentPrice;
        if (cc.Mgr.game.isVIP) {
            this.normaleNode.active = false;
            this.saleNode.active = false;
        } else {
            this.normaleNode.active = !this.isSale;
            this.saleNode.active = this.isSale;
        }

        this.salePriceLabel.string = salePrice;
        this.lineNode.width = this.originalPriceNode.width;
        this.priceLabel.string = cc.Mgr.Utils.getTranslation("vip-price").format(currentPrice);
        this.priceLabel2.string = cc.Mgr.Utils.getTranslation("vip-price").format(salePrice);
        if (this.isSale) {
            this.tipLabel.string = cc.Mgr.Utils.getTranslation("vip-des").format(salePrice, cc.Mgr.Config.platform, cc.Mgr.Config.platform);
        } else {
            this.tipLabel.string = cc.Mgr.Utils.getTranslation("vip-des").format(currentPrice, cc.Mgr.Config.platform, cc.Mgr.Config.platform);
        } 
    },

    onClickRecovery () {
        cc.Mgr.GameCenterCtrl.unscheduleSaveData();

        cc.Mgr.AudioMgr.stopAll();
        cc.Mgr.admob.hideBanner("all");
        cc.game.restart();
    },

    onClickClose () {
        cc.Mgr.AudioMgr.playSFX("click");
        // cc.Mgr.admob.hideBanner();
        let self = this
        this.scrollViewNode.opacity = 0;
        cc.tween(this.blurBg).to(0.15, {opacity:0}).start();
        cc.tween(this.content).to(0.15, {opacity:0, scale: .5}).call(() => {
            self.node.active = false;
            
            if (this.showUnlock && this.from !== "enterGame") {
                cc.Mgr.plantMgr.activateSpecialGrid();
                this.showUnlock = false;
            } else if(this.from === "fort" && cc.Mgr.game.isVIP === false && cc.Mgr.game.unlockSpecialGrid === false){
                cc.Mgr.game.openSpecialGridCount++;
                let index = this.openSpecialCountList.indexOf(cc.Mgr.game.openSpecialGridCount);
                if (index >= 0) {
                    cc.Mgr.UIMgr.openSpecialGridBundle(true);
                }
            }
            if (cc.Mgr.game.vipSaleTimer === 0 && cc.Mgr.game.vipdiscount === true) {
                cc.Mgr.game.vipCloseCount++;
            }
            if (this.from === "enterGame") {
                cc.Mgr.GameCenterCtrl.startGame();
            }
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("vip");
    },

    onClickVIP () {
        if (this.limitClick.clickTime() == false) {
            return
        }
        cc.Mgr.payment.updateVIPState(Date.now() + 10 * 60 * 1000);
        let currentProductId = this.isSale ? 14 : 6;
        cc.Mgr.payment.purchaseByIndex(currentProductId, () => {
            cc.Mgr.game.isVIP = true;
            cc.Mgr.admob.hideBanner("all");
            cc.Mgr.game.vip = "active";
            this.updateVip();

            cc.Mgr.game.vipStartTimer = Date.now();

            let data = {}
            data.elapsed = cc.Mgr.Utils.getDate9(true)
            data.state = "subscribed"
            cc.Mgr.analytics.logEvent("vip_subscription", JSON.stringify(data));
        }, this.node
        );
    },

    updateVip () {
        this.vipIcon.active = cc.Mgr.game.isVIP;
        this.priceLabel.node.active = this.getBtn.node.active = !cc.Mgr.game.isVIP;
        this.showUnlock = cc.Mgr.game.isVIP;
        if (cc.Mgr.game.isVIP) {
            this.normaleNode.active = this.saleNode.active = false;
        }
    },

    gotoPolicy () {
        cc.sys.openURL("https://digitalwill.co.jp/privacy-policy/");
    },

    gotoService () {
        cc.sys.openURL("https://digitalwill.co.jp/terms-of-service/");
    }

    // update (dt) {},
});
