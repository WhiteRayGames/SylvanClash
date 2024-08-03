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
        nameLabel: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    getLanguageLabel (_name) {
        switch (_name) {
            case "English":
                this.nameLabel.string = cc.Mgr.Utils.getTranslation("language-en");
            break;
            case "Simplified Chinese":
                this.nameLabel.string = cc.Mgr.Utils.getTranslation("language-cn");
            break;
            case "Traditional Chinese":
                this.nameLabel.string = cc.Mgr.Utils.getTranslation("language-tc");
            break;
            case "Japanese":
                this.nameLabel.string = cc.Mgr.Utils.getTranslation("language-jp");
            break;
            case "Russian":
                this.nameLabel.string = cc.Mgr.Utils.getTranslation("language-ru");
            break;
        }
    },

    setContent (_name, _parent) {
        this.getLanguageLabel(_name);
        this.selectName = _name;
        this.parentCtrl = _parent;
    },

    onClick () {
        this.parentCtrl.updateLanguage(this.selectName);
    }

    // update (dt) {},
});
