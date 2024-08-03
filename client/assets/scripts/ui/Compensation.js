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

        desLabel: cc.Label,
        desLabel2: cc.Label,
        desLabel3: cc.Label,
        btnLabel: cc.Label,

        numLabel: cc.Label,

        gemIcon_1: cc.Node,
        coinIcon_1: cc.Node,

        gemIcon_2: cc.Node,
        coinIcon_2: cc.Node,

        restoreTipLabel: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.itemNameMap = {};
        this.itemNameMap.addCoin = "restore-coin";
        this.itemNameMap.addGem = "restore-gem";
        this.itemNameMap.isVIP = "restore-vip";
        this.itemNameMap.vipExpire = "restore-vipExpire";
        this.itemNameMap.removeAd = "restore-removeAd";
        this.itemNameMap.unlockSpecialGrid = "restore-unlockSpecialGrid";
        this.itemNameMap.offlineDouble = "restore-offlineDouble";
    },

    start () {
        this.limitClick = this.node.getComponent('LimitClick');
        this.btnLabel.string = cc.Mgr.Utils.getTranslation("btn-claim");
        this.desLabel3.string = cc.Mgr.Utils.getTranslation("restore-tip");
        this.restoreTipLabel.string = cc.Mgr.Utils.getTranslation("restore-tip-2");
    },

    showUI:function (_data) {
        this.desLabel.node.active = false;
        this.numLabel.node.active = false;
        this.restoreTipLabel.node.active = false;
        this.data = _data;
        this.num = 0;
        if (_data != null) {
            if (_data.content.type == "gem") {
                this.gemIcon_1.active = true;
                this.gemIcon_2.active = true;
                this.coinIcon_1.active = false;
                this.coinIcon_2.active = false;
            } else {
                this.gemIcon_1.active = false;
                this.gemIcon_2.active = false;
                this.coinIcon_1.active = true;
                this.coinIcon_2.active = true;
            }
            this.type = _data.content.type;
            this.num = parseInt(_data.content.amount);
            this.numLabel.string = "x" + cc.Mgr.Utils.getNumStr(_data.content.amount);
            this.id = _data.id;
            if (_data.content.description != "") {
                this.desLabel.string = _data.content.description;
            } else {
                this.desLabel.string = cc.Mgr.Utils.getTranslation("compensation-des");
            }
            this.desLabel.node.active = true;
            this.numLabel.node.active = true;
        } else {
            this.gemIcon_1.active = false;
            this.gemIcon_2.active = false;
            this.coinIcon_1.active = false;
            this.coinIcon_2.active = false;
            this.restoreTipLabel.node.active = true;
        }

        this.blurBg.opacity = 0
        this.content.opacity = 0;
        this.content.setScale(.5)
        cc.tween(this.blurBg).to(0.05, {opacity:255}).call().start();
        cc.tween(this.content).to(0.15, {opacity:255, scale: 1}).start();

        this.desLabel3.node.active = false;
        this.desLabel2.string = "";
        if (cc.Mgr.Utils.preUpdateData != null) {
            this.result = {};
            for (let id in cc.Mgr.Utils.preUpdateData) {
                let data = cc.Mgr.Utils.preUpdateData[id];
                for (let key in data) {
                    if (key === "id") continue;
                    if (this.result[key] && (key === "addCoin" || key === "addGem")) {
                        this.result[key] += data[key];
                    } else {
                        this.result[key] = data[key];
                    }
                }
            }
            for (let key in this.result) {
                if (this.desLabel2.string === "") {
                    this.desLabel2.string += this.getContent(key, this.result[key]);
                } else {
                    this.desLabel2.string += ("\n" + this.getContent(key, this.result[key]));
                }
            }
            this.desLabel3.node.active = true;
        }
    },

    getContent (_key, _value) {
        if (_key === "addCoin" || _key === "addGem") {
            return cc.Mgr.Utils.getTranslation(this.itemNameMap[_key]) + "  " + "x" + cc.Mgr.Utils.getNumStr(_value);
        }
        if (_value === true) {
            return cc.Mgr.Utils.getTranslation(this.itemNameMap[_key]);
        }
        if (_value !== false) {
            _value = Date.now() + _value * 24 * 3600 * 1000
            return cc.Mgr.Utils.getTranslation(this.itemNameMap[_key]) + "  " + new Date(_value).toUTCString();
        }
    },

    claim () {
        if (this.limitClick.clickTime() == false) {
            return
        }
        cc.Mgr.AudioMgr.playSFX("click");
        cc.tween(this.blurBg).to(0.15, {opacity:0}).start();
        cc.tween(this.content).to(0.15, {opacity:0, scale: .5}).call(() => {
            let num = 0;
            if (cc.Mgr.Utils.preUpdateData != null && cc.Mgr.Utils.preUpdateData.addGem > 0) {
                num += cc.Mgr.Utils.preUpdateData.addGem;
            }
            
            if (this.data != null) {
                if (this.type == "gem") {
                    // cc.Mgr.game.gems += this.num;
                    // cc.Mgr.game.gem_gained_total += this.num;
                    // cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");
                    // cc.Mgr.UIMgr.showGemsEffect();
                    num += this.num;
                    cc.Mgr.UIMgr.openAssetGetUI("gem", num, "compensation");
                } else {
                    cc.Mgr.game.money += this.num;
                    cc.Mgr.game.coin_gained_total += this.num;
                    cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
                    cc.Mgr.UIMgr.showJibEffect();
                }
                cc.Mgr.game.compensation[this.id] = true;
            } else if (num > 0){
                cc.Mgr.UIMgr.openAssetGetUI("gem", num, "compensation");
            }
            setTimeout(() => {
                cc.Mgr.GameCenterCtrl.caculateOfflineAsset();
            }, 2000);
            this.node.active = false;
            let eventData = null
            if (eventData != null) {
                eventData.addGem = num;
                eventData.elapsed = cc.Mgr.Utils.getDate9(true);

                cc.Mgr.analytics.logEvent("compensation_claim", JSON.stringify(eventData));
            }
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("compensation");
    }

    // update (dt) {},
});
