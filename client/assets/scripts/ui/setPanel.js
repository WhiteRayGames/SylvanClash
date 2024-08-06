// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const TOGGLE_OFF = 56

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
        bgmBtn: cc.Node,
        sfxBtn: cc.Node,
        notificationBtn: cc.Node,
        notificationNode: cc.Node,

        content: cc.Node,
        blurBg: cc.Node,
        versionLabel: cc.Label,
        debugLabel: cc.Label,

        debugNode: cc.Node,
        idLabel: cc.Label,
        id: cc.Label,

        recoveryBtnLabel: cc.Label,
        spriteCoin: cc.Sprite,
        nomarlM: cc.Material,
        grayM: cc.Material,
        recoveryBtn: cc.Node,

        bgmLabel: cc.Label,
        sfxLabel: cc.Label,
        languageLabel: cc.Label,
        bgmOffLabel: cc.Label,
        bgmOnLabel: cc.Label,
        sfxOffLabel: cc.Label,
        sfxOnLabel: cc.Label,
        versionStrLabel: cc.Label,
        copyLabel: cc.Label,

        languageSelector: cc.Node,

        title: cc.Node,
        title_zh: cc.Node,
        title_ja: cc.Node,
        title_ru: cc.Node,

        debugVersion: cc.Label,

        playerId: cc.Label,
        inviterId: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.bgmON = cc.Mgr.AudioMgr.bgmVolume === 1;
        this.bgmBtn.x = this.bgmON ? -TOGGLE_OFF : TOGGLE_OFF

        this.sfxON = cc.Mgr.AudioMgr.sfxVolume === 1;
        this.sfxBtn.x = this.sfxON ? -TOGGLE_OFF : TOGGLE_OFF

        this.notificationON = true;
        this.notificationBtn.x = this.notificationON ? -TOGGLE_OFF : TOGGLE_OFF

        this.recoveryBtnLabel.string = cc.Mgr.Utils.getTranslation("btn-recovery");

        this.bgmLabel.string = cc.Mgr.Utils.getTranslation("bgm");
        this.sfxLabel.string = cc.Mgr.Utils.getTranslation("sfx");
        this.languageLabel.string = cc.Mgr.Utils.getTranslation("language");
        this.bgmOffLabel.string = cc.Mgr.Utils.getTranslation("set-off");
        this.bgmOnLabel.string = cc.Mgr.Utils.getTranslation("set-on");
        this.sfxOffLabel.string = cc.Mgr.Utils.getTranslation("set-off");
        this.sfxOnLabel.string = cc.Mgr.Utils.getTranslation("set-on");
        this.versionStrLabel.string = cc.Mgr.Utils.getTranslation("set-version");
        this.copyLabel.string = cc.Mgr.Utils.getTranslation("set-copy");

        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.languageSelector.getComponent("LanguageSelector").hideContainer();
        }, this);

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

    showUI(_callback) {
        this.blurBg.opacity = 0
        this.content.opacity = 0;
        this.content.setScale(.5)
        cc.tween(this.blurBg).to(0.05, { opacity: 255 }).call().start();
        cc.tween(this.content).to(0.15, { opacity: 255, scale: 1 }).start();

        cc.Mgr.admob.showBanner("setting");

        this.versionLabel.string = cc.Mgr.Config.version;

        this.notificationNode.active = false;
        this.debugLabel.string = "NoAds\nPayment";
        this.debugNode.active = cc.Mgr.Config.isDebug;
        this.debugVersion.node.active = cc.Mgr.Config.isDebug;
        this.debugVersion.string = cc.Mgr.Config.debug_version;

        this.idLabel.string = cc.Mgr.Config.isTelegram ? window.Telegram.WebApp.initDataUnsafe.user.id : "Local";

        this.spriteCoin.setMaterial(0, this.nomarlM);

        if (cc.Mgr.Config.isDebug) {
            this.recoveryBtn.y = -100;
        } else {
            this.recoveryBtn.y = -200;
        }

        this.recoveryBtn.active = false;

        this.playerId.string = "PlayerID: " + (cc.Mgr.Config.isTelegram ? window.Telegram.WebApp.initDataUnsafe.user.id : "Local");
        this.inviterId.string = "InviterID: " + ((window.startParam != null && window.startParam != "") ? window.startParam : "SOLO");
    },

    copyID() {
        cc.Mgr.Utils.copyID();
    },

    closeUI: function () {
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("setting");
        let self = this
        cc.tween(this.blurBg).to(0.15, { opacity: 0 }).start();
        cc.tween(this.content).to(0.15, { opacity: 0, scale: .5 }).call(() => {
            self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("setting");
    },

    toggleBGM() {
        this.bgmON = !this.bgmON
        this.bgmBtn.x = this.bgmON ? -TOGGLE_OFF : TOGGLE_OFF

        cc.Mgr.AudioMgr.setBGMVolume(this.bgmON ? 1 : 0);
    },

    toggleSFX() {
        this.sfxON = !this.sfxON
        this.sfxBtn.x = this.sfxON ? -TOGGLE_OFF : TOGGLE_OFF

        cc.Mgr.AudioMgr.setSFXVolume(this.sfxON ? 1 : 0);
    },

    toggleNotification() {
        this.notificationON = !this.notificationON
        this.notificationBtn.x = this.notificationON ? -TOGGLE_OFF : TOGGLE_OFF
    },

    addMoney() {
        cc.Mgr.game.money += BigInt(1000000000000);
        cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
    },

    addGems() {
        cc.Mgr.game.gems += 1000000;
        cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");
    },

    onClickDebug () {
        this.debugLabel.string = "NoAds\nPayment";
        cc.Mgr.admob.hideBanner("all");
    },

    onClickRecovery() {
        cc.Mgr.GameCenterCtrl.unscheduleSaveData();
        cc.Mgr.AudioMgr.stopAll();
        cc.Mgr.admob.hideBanner("all");
        cc.game.restart();
    },

    reset() {
        cc.sys.localStorage.clear();
        cc.Mgr.AudioMgr.stopAll();
        cc.Mgr.admob.hideBanner("all");
        cc.game.restart();
    }

    // update (dt) {},
});
