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
        content: cc.Node,
        blurBg: cc.Node,
        btnLabel: cc.Label,
        priceSaleLabel: cc.Label,
        priceLabel: cc.Label,
        singlePriceLabel: cc.Label,
        
        saleNode: cc.Node,
        priceNode: cc.Node,

        desLabel: cc.Label,
        saleSprite: cc.Node,
        saleSprite2: cc.Node,

        timeNode: cc.Node,
        timeLabel: cc.Label,
        timeTip: cc.Label,

        title: cc.Node,
        title_zh: cc.Node,
        title_ja: cc.Node,
        title_ru: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.limitClick = this.node.getComponent('LimitClick')
    },

    start () {
        this.btnLabel.string = cc.Mgr.Utils.getTranslation("btn-get");
        this.timeTip.string = cc.Mgr.Utils.getTranslation("bundle-time-tip");

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
        this.priceLabel.string = cc.Mgr.payment.priceList[9];
        this.priceSaleLabel.string = cc.Mgr.payment.priceList[13];
        this.singlePriceLabel.string = cc.Mgr.payment.priceList[9];

        this.saleSprite.width = this.saleSprite2.width = this.priceLabel.string.length * 16;

        this.blurBg.opacity = 0
        this.content.opacity = 0;
        this.content.setScale(.5)
        cc.tween(this.blurBg).to(0.05, {opacity:255}).call().start();
        cc.tween(this.content).to(0.15, {opacity:255, scale: 1}).start();

        this.refreshUI();

        cc.Mgr.admob.showBanner("removeAdBunlde");

        this.startTimeCount();
    },

    refreshUI () {
        this.isSale = cc.Mgr.game.removeAdStartTimer !== 0 && (Date.now() - cc.Mgr.game.removeAdStartTimer) < (24 * 3600 * 1000);

        this.saleNode.active = this.isSale;
        this.priceNode.active = !this.isSale;
        this.timeNode.active = this.isSale;

        if (this.isSale) {
            this.desLabel.string = cc.Mgr.Utils.getTranslation("removeAdBundle-tip2");
        } else {
            this.desLabel.string = cc.Mgr.Utils.getTranslation("removeAdBundle-tip");
        }
    },

    startTimeCount:function(){
        this.unschedule(this.countTime);
        if(this.isSale === false) {
            return;
        }

        this.seconds = Math.floor((cc.Mgr.game.removeAdStartTimer + (24 * 3600 * 1000) - Date.now()) / 1000);
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

    onClickClose () {
        cc.Mgr.AudioMgr.playSFX("click");

        cc.Mgr.admob.hideBanner("removeAdBunlde");

        let self = this
        cc.tween(this.blurBg).to(0.15, {opacity:0}).start();
        cc.tween(this.content).to(0.15, {opacity:0, scale: .5}).call(() => {
            self.node.active = false;
            if (cc.Mgr.UIMgr.starterBundleNode && cc.Mgr.UIMgr.starterBundleNode.active) {
                cc.Mgr.UIMgr.starterBundleNode.getComponent("StarterBundle").refreshUI();
            }
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("removeAdBundle");
    },

    onClickGet () {
        if (this.limitClick.clickTime() == false) {
            return
        }

        let currentProductID = this.isSale ? 13 : 9;

        cc.Mgr.payment.purchaseByIndex(currentProductID, () => {
            cc.Mgr.game.removeAd = true;
            cc.Mgr.admob.hideBanner("all");
            this.onClickClose();
            cc.Mgr.game.removeAdStartTimer = 0;
            this.refreshUI();
        }, cc.Mgr.UIMgr.tipRoot);
    }

    // update (dt) {},
});
