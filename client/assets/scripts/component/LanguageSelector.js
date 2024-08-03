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
        container: cc.Node,
        currentNameLabel: cc.Label,
        languageItem: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // let enItem = cc.instantiate(this.languageItem);
        // enItem.parent = this.container;
        // enItem.getComponent("LanguageItem").setContent("English", this);

        this.getLanguageLabel();

        this.languageList = ["English", "Russian"];

        for (let i = 0; i < this.languageList.length; i++) {
            if (this.languageList[i] === cc.Mgr.Config.language) continue;

            let otherItem = cc.instantiate(this.languageItem);
            otherItem.parent = this.container;
            otherItem.getComponent("LanguageItem").setContent(this.languageList[i], this);
        }

        this.container.active = false;
    },

    getLanguageLabel () {
        switch (cc.Mgr.Config.language) {
            case "English":
                this.currentNameLabel.string = cc.Mgr.Utils.getTranslation("language-en");
            break;
            case "Simplified Chinese":
                this.currentNameLabel.string = cc.Mgr.Utils.getTranslation("language-cn");
            break;
            case "Traditional Chinese":
                this.currentNameLabel.string = cc.Mgr.Utils.getTranslation("language-tc");
            break;
            case "Japanese":
                this.currentNameLabel.string = cc.Mgr.Utils.getTranslation("language-jp");
            break;
            case "Russian":
                this.currentNameLabel.string = cc.Mgr.Utils.getTranslation("language-ru");
            break;
        }
    },

    onClick () {
        this.container.active = true;
    },

    hideContainer () {
        this.container.active = false;
    },

    updateLanguage (_name) {
        this.currentNameLabel.string = _name;
        cc.Mgr.game.setLanguageManually = _name;
        cc.Mgr.UserDataMgr.SaveUserData();
        this.hideContainer();
        setTimeout(() => {
            cc.Mgr.AudioMgr.stopAll();
            cc.Mgr.admob.hideBanner("all");
            cc.game.restart();
        }, 300);
    }

    // update (dt) {},
});
