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

        isStroke: true,

        offsetY: 0

        // filterLanguageList: {
        //     default: [],
        //     type: cc.String
        // }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}, "English", "Japanese", "Simplified Chinese", "Traditional Chinese", "Russian"

    start () {
        this.label = this.node.getComponent(cc.Label);
        this.originalY = this.node.y;
        // let currentLanguage = cc.Mgr.Config.language;
        // if (this.filterLanguageList.length <= 0) {

        // } else {
        //     let idx = this.filterLanguageList.indexOf(this.currentLanguage);
        //     if (idx < 0) currentLanguage = "English";
        // }
        
        switch (cc.Mgr.Config.language) {
            case "English":
                if (this.isStroke) {
                    this.label.font = cc.Mgr.fontManager.font_en;
                } else {
                    this.label.font = cc.Mgr.fontManager.font_en_noStroke;
                }
                this.node.y = this.originalY;
            break
            case "Russian":
                if (this.isStroke) {
                    this.label.font = cc.Mgr.fontManager.font_ru;
                } else {
                    this.label.font = cc.Mgr.fontManager.font_ru_noStroke;
                }
                this.node.y = this.originalY + 8 + this.offsetY;
            break;
        }
    },

    // update (dt) {},
});
