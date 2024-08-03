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

        title: cc.Label,
        btnLabel: cc.Label,
        btnLabel2: cc.Label,

        alreadyBtn: cc.Node,
        alreadyLabel: cc.Label,

        uavNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.title.string = cc.Mgr.Utils.getTranslation("enjoyNature-title");
        this.des.string = cc.Mgr.Utils.getTranslation("enjoyNature-tip");
        this.btnLabel2.string = cc.Mgr.Utils.getTranslation("enjoyNature-rate-now");
        this.btnLabel.string = cc.Mgr.Utils.getTranslation("enjoyNature-next-time");
        this.alreadyLabel.string = cc.Mgr.Utils.getTranslation("enjoyNature-rated");

        this.limitClick = this.node.getComponent('LimitClick')
    },

    rateNow () {
        if (this.limitClick.clickTime() == false) {
            return
        }
        cc.Mgr.Utils.openRating();
        if (cc.Mgr.game.rateState === 1) {
            cc.Mgr.game.rateState = 2;
        } else {
            cc.Mgr.game.rateState = 1;
            if (cc.Mgr.game.hasShowRate === true) {
                cc.Mgr.game.rateState = 2;
            }
        }

        let data = {}
        data.elapsed = cc.Mgr.Utils.getDate9(true)
        cc.Mgr.analytics.logEvent("askForRating_love", JSON.stringify(data));

        this.closeUI(true);
    },

    showUI () {
        this.blurBg.opacity = 0
        this.content.opacity = 0;
        this.content.setScale(.5)
        cc.tween(this.blurBg).to(0.05, {opacity:255}).call().start();
        cc.tween(this.content).to(0.15, {opacity:255, scale: 1}).start();

        this.alreadyBtn.active = cc.Mgr.game.rateState === 1;

        // cc.Mgr.admob.showBanner("updateAvailable");

        this.left2Right();
    },

    left2Right () {
        this.uavNode.x = -200;
        this.uavNode.scaleX = 1;
        cc.tween(this.uavNode)
            .to(10, { position: cc.v2(200, 100)}, { easing: 'sineOut'}).call(()=>{
                this.right2Left();
            }).start();
    },

    right2Left () {
        this.uavNode.x = 200;
        this.uavNode.scaleX = -1;
        cc.tween(this.uavNode)
            .to(10, { position: cc.v2(-200, 100)}, { easing: 'sineOut'}).call(()=>{
                this.left2Right();
            }).start();
    },

    alreadyRate () {
        if (this.limitClick.clickTime() == false) {
            return
        }
        if (cc.Mgr.game.rateState === 1) {
            cc.Mgr.game.rateState = 2;
        } else {
            cc.Mgr.game.rateState = 1;
            if (cc.Mgr.game.hasShowRate === true) {
                cc.Mgr.game.rateState = 2;
            }
        }

        let data = {}
        data.elapsed = cc.Mgr.Utils.getDate9(true)
        cc.Mgr.analytics.logEvent("askForRating_no", JSON.stringify(data));

        this.closeUI(true);
    },

    closeUI (_blockEvent) {
        if (_blockEvent !== true) {
            let data = {}
            data.elapsed = cc.Mgr.Utils.getDate9(true)
            cc.Mgr.analytics.logEvent("askForRating_no", JSON.stringify(data));
        }
        cc.Mgr.AudioMgr.playSFX("click");
        // cc.Mgr.admob.hideBanner("updateAvailable");
        let self = this
        cc.tween(this.blurBg).to(0.15, {opacity:0}).start();
        cc.tween(this.content).to(0.15, {opacity:0, scale: .5}).call(() => {
            self.node.active = false;
        }).start();
        cc.Mgr.game.hasShowRate = true;
        cc.Mgr.UIMgr.reduceShowUICount("enjoyNature");
    }

    // update (dt) {},
});
