// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var DataType = require("DataType");
var MyEnum = require("MyEnum");
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
        blurBg: cc.Node,
        content: cc.Node,
        titleLabel: cc.Label,
        coinlabel: cc.Label,

        priceLabelList: [cc.Label],
        effectList: [cc.Node],

        priceNodeList: [cc.Node],

        moduleList: [cc.Node],

        content_en_coin: cc.Node,
        content_zh_coin: cc.Node,
        content_ja_coin: cc.Node,
        content_ru_coin: cc.Node,

        content_en_unlock: cc.Node,
        content_zh_unlock: cc.Node,
        content_ja_unlock: cc.Node,
        content_ru_unlock: cc.Node,

        content_en_removeAd: cc.Node,
        content_zh_removeAd: cc.Node,
        content_ja_removeAd: cc.Node,
        content_ru_removeAd: cc.Node,

        content_en_offline: cc.Node,
        content_zh_offline: cc.Node,
        content_ja_offline: cc.Node,
        content_ru_offline: cc.Node,

        content_en_unlockAll: cc.Node,
        content_zh_unlockAll: cc.Node,
        content_ja_unlockAll: cc.Node,
        content_ru_unlockAll: cc.Node,

        unlockAllPrice: cc.Label,

        diamondNodeCoin: cc.Node,
        diamondNodeSpecial: cc.Node,
        diamondNodeUnlockAll: cc.Node,
        diamondNodeOffline: cc.Node,
        moneyNodeCoin: cc.Node,
        moneyNodeSpecial: cc.Node,
        moneyNodeUnlockAll: cc.Node,
        moneyNodeOffline: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.limitClick = this.node.getComponent('LimitClick');

        this.content_en_coin.active = false;
        this.content_zh_coin.active = false;
        this.content_ja_coin.active = false;
        this.content_ru_coin.active = false;

        this.content_en_unlock.active = false;
        this.content_zh_unlock.active = false;
        this.content_ja_unlock.active = false;
        this.content_ru_unlock.active = false;

        this.content_en_removeAd.active = false;
        this.content_zh_removeAd.active = false;
        this.content_ja_removeAd.active = false;
        this.content_ru_removeAd.active = false;

        this.content_en_offline.active = false;
        this.content_zh_offline.active = false;
        this.content_ja_offline.active = false;
        this.content_ru_offline.active = false;

        this.content_en_unlockAll.active = false;
        this.content_zh_unlockAll.active = false;
        this.content_ja_unlockAll.active = false;
        this.content_ru_unlockAll.active = false;

        if (cc.Mgr.Config.language === "Japanese") {
            this.content_ja_coin.active = true;
            this.content_ja_unlock.active = true;
            this.content_ja_removeAd.active = true;
            this.content_ja_offline.active = true;
            this.content_ja_unlockAll.active = true;
        } else if (cc.Mgr.Config.language === "Simplified Chinese" || cc.Mgr.Config.language === "Traditional Chinese") {
            this.content_zh_coin.active = true;
            this.content_zh_unlock.active = true;
            this.content_zh_removeAd.active = true;
            this.content_zh_offline.active = true;
            this.content_zh_unlockAll.active = true;
        } else if (cc.Mgr.Config.language === "Russian") {
            this.content_ru_coin.active = true;
            this.content_ru_unlock.active = true;
            this.content_ru_removeAd.active = true;
            this.content_ru_offline.active = true;
            this.content_ru_unlockAll.active = true;
        } else {
            this.content_en_coin.active = true;
            this.content_en_unlock.active = true;
            this.content_en_removeAd.active = true;
            this.content_en_offline.active = true;
            this.content_en_unlockAll.active = true;
        }

        let iapEnable = true
        this.diamondNodeCoin.active = !iapEnable;
        this.diamondNodeSpecial.active = !iapEnable;
        this.diamondNodeUnlockAll.active = !iapEnable;
        this.diamondNodeOffline.active = !iapEnable;
        this.moneyNodeCoin.active = iapEnable;
        this.moneyNodeSpecial.active = iapEnable;
        this.moneyNodeUnlockAll.active = iapEnable;
        this.moneyNodeOffline.active = iapEnable;
    },

    getCoin () {
        if (this.limitClick.clickTime() == false) {
            return
        }
        cc.Mgr.UIMgr.openCoinBundle(this.coinNumber, true);
    },

    getSpecialGrid () {
        if (this.limitClick.clickTime() == false) {
            return
        }
        if (cc.Mgr.game.isVIP) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("already-subscribed-vip"),"", this.node);
            return;
        }
        if (cc.Mgr.game.unlockSpecialGrid) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("already-subscribed"),"", this.node);
            return;
        }

        cc.Mgr.UIMgr.openSpecialGridBundle(false);
    },

    unlockAllGrids () {
        if (this.limitClick.clickTime() == false) {
            return
        }

        if (cc.Mgr.plantMgr.hasLockGrid() == false) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("already-unlock-allGrids"),"", this.node);
            return;
        }

        cc.Mgr.UIMgr.openUnlockAllBundle();
    },

    removeAd () {
        if (this.limitClick.clickTime() == false) {
            return
        }
        if (cc.Mgr.game.isVIP) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("already-subscribed-vip"),"", this.node);
            return;
        }
        if (cc.Mgr.game.removeAd) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("already-subscribed"),"", this.node);
            return;
        }

        cc.Mgr.UIMgr.openRemoveAdBundle();
    },

    getDoubleInOffline () {
        if (this.limitClick.clickTime() == false) {
            return
        }
        if (cc.Mgr.game.isVIP) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("already-subscribed-vip"),"", this.node);
            return;
        }
        if (cc.Mgr.game.offlineDouble) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("already-subscribed"),"", this.node);
            return;
        }

        cc.Mgr.UIMgr.openOfflineBundle(false);
    },

    refreshUI () {
        this.effectList[0].active = cc.Mgr.game.coinBundleStartTimer !== 0 && (Date.now() - cc.Mgr.game.coinBundleStartTimer) < (24 * 3600 * 1000);
        this.effectList[1].active = cc.Mgr.game.specialGridStartTimer !== 0 && (Date.now() - cc.Mgr.game.specialGridStartTimer) < (24 * 3600 * 1000);
        this.effectList[2].active = cc.Mgr.game.removeAdStartTimer !== 0 && (Date.now() - cc.Mgr.game.removeAdStartTimer) < (24 * 3600 * 1000);

        let currentPriceList;
        currentPriceList = cc.Mgr.payment.priceList;

        for (let i = 0; i < this.priceLabelList.length; i++) {
            this.priceLabelList[i].string = cc.Mgr.payment.priceList[i + 7];
        }
        this.unlockAllPrice.string = currentPriceList[15];

        if (cc.Mgr.game.coinBundleStartTimer !== 0 && (Date.now() - cc.Mgr.game.coinBundleStartTimer) < (24 * 3600 * 1000)) {
            this.priceLabelList[0].string = cc.Mgr.payment.priceList[11];
        }

        if (cc.Mgr.game.specialGridStartTimer !== 0 && (Date.now() - cc.Mgr.game.specialGridStartTimer) < (24 * 3600 * 1000)) {
            this.priceLabelList[1].string = cc.Mgr.payment.priceList[12];
        }

        if (cc.Mgr.game.removeAdStartTimer !== 0 && (Date.now() - cc.Mgr.game.removeAdStartTimer) < (24 * 3600 * 1000)) {
            this.priceLabelList[2].string = cc.Mgr.payment.priceList[13];
        }
    },

    showUI () {
        this.titleLabel.string = cc.Mgr.Utils.getTranslation("starterBundles0title");
        this.blurBg.opacity = 0
        this.content.opacity = 0;
        this.content.setScale(.5)
        cc.tween(this.blurBg).to(0.05, {opacity:255}).call().start();
        cc.tween(this.content).to(0.15, {opacity:255, scale: 1}).start();

        this.coinNumber = cc.Mgr.UIMgr.getCoinNumber() * BigInt(30);
        this.coinNumber = this.coinNumber < BigInt(1000000) ? BigInt(1000000) : this.coinNumber;
        this.coinNumber = this.coinNumber * BigInt(2);
        this.coinlabel.string = cc.Mgr.Utils.getNumStr2(this.coinNumber);
        
        cc.Mgr.admob.showBanner("starterBundle");

        this.refreshUI();
    },

    onClickClose () {
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("starterBundle");
        let self = this
        cc.tween(this.blurBg).to(0.15, {opacity:0}).start();
        cc.tween(this.content).to(0.15, {opacity:0, scale: .5}).call(() => {
            self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("starterBundle");
    }

    // update (dt) {},
});
