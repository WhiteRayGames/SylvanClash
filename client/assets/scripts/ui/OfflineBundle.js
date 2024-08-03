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
        btnLabel2:cc.Label,
        priceSaleLabel: cc.Label,
        priceLabel: cc.Label,
        singlePriceLabel: cc.Label,
        
        saleNode: cc.Node,
        priceNode: cc.Node,
        gemsNode: cc.Node,

        btn: cc.Node,
        btn_2: cc.Node,

        desLabel: cc.Label,
        saleSprite: cc.Node,

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
        this.btnLabel2.string = this.btnLabel.string = cc.Mgr.Utils.getTranslation("btn-get");
        this.desLabel.string = cc.Mgr.Utils.getTranslation("offlineBundle-tip");

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

    showUI:function (_sale) {
        this.singlePriceLabel.string = cc.Mgr.payment.priceList[10];

        this.saleSprite.width = this.priceLabel.node.width;

        this.blurBg.opacity = 0
        this.content.opacity = 0;
        this.content.setScale(.5)
        cc.tween(this.blurBg).to(0.05, {opacity:255}).call().start();
        cc.tween(this.content).to(0.15, {opacity:255, scale: 1}).start();

        this.gemsNode.active = this.saleNode.active = this.priceNode.active = false;
        this.btn.active = this.btn_2.active = false;

        cc.Mgr.admob.showBanner("offlineBunlde");

        this.saleNode.active = _sale;
        this.priceNode.active = !_sale;
        this.btn.active = true;
    },

    onClickClose () {
        cc.Mgr.AudioMgr.playSFX("click");

        cc.Mgr.admob.hideBanner("offlineBunlde");

        let self = this
        cc.tween(this.blurBg).to(0.15, {opacity:0}).start();
        cc.tween(this.content).to(0.15, {opacity:0, scale: .5}).call(() => {
            self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("offlineBundle");
    },

    onClickGet () {
        cc.Mgr.payment.purchaseByIndex(10, () => {
            cc.Mgr.game.offlineDouble = true;
            this.onClickClose();
        }, cc.Mgr.UIMgr.tipRoot);
    },

    onClickGetByGems () {
        if (this.limitClick.clickTime() == false) {
            return
        }

        if (cc.Mgr.game.gems < 30) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoGems"), "gem", this.node);

            setTimeout(() => {
                cc.Mgr.UIMgr.openPaymentUI(true);
                this.onClickClose();
            }, 300);
            return;
        }  

        cc.Mgr.game.gems -= 30;
        cc.Mgr.game.offlineDouble = true;
        this.onClickClose();
    }

    // update (dt) {},
});
