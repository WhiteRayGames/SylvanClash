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
        des: cc.Label,
        content: cc.Node,
        blurBg: cc.Node,

        btnLabel: cc.Label,
        btnLabel2: cc.Label,

        title: cc.Node,
        title_zh: cc.Node,
        title_ja: cc.Node,
        title_ru: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.des.string = cc.Mgr.Utils.getTranslation("updateAvailable-tip").format(cc.Mgr.Config.platform);
        this.btnLabel2.string = cc.Mgr.Utils.getTranslation("updateAvailable-update-now");
        this.btnLabel.string = cc.Mgr.Utils.getTranslation("updateAvailable-next-time");

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

    showUI () {
        this.blurBg.opacity = 0
        this.content.opacity = 0;
        this.content.setScale(.5)
        cc.tween(this.blurBg).to(0.05, {opacity:255}).call().start();
        cc.tween(this.content).to(0.15, {opacity:255, scale: 1}).start();

        // cc.Mgr.admob.showBanner("updateAvailable");
    },

    closeUI () {
        cc.Mgr.AudioMgr.playSFX("click");
        // cc.Mgr.admob.hideBanner("updateAvailable");
        let self = this
        cc.tween(this.blurBg).to(0.15, {opacity:0}).start();
        cc.tween(this.content).to(0.15, {opacity:0, scale: .5}).call(() => {
            self.node.active = false;

            if (cc.Mgr.game.vipSaleTimer > Date.now() && cc.Mgr.game.isVIP === false) {
                cc.Mgr.UIMgr.openVipUI("enterGame");
            } else {
                cc.Mgr.GameCenterCtrl.startGame();
            }
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("updateAvailable");
    }

    // update (dt) {},
});
