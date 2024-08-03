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
        speed: 0
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.node.x = 550;
        this.count = 0;
        this.currentTimer = Date.now();
        this.startTimer = 10000 * Math.random();
    },

    update (dt) {
        if (this.count < 2)  {
            this.count++;
            return;
        }
        if (Date.now() - this.currentTimer < this.startTimer) return;
        this.count = 0;
        this.node.x -= this.speed;
        if (this.node.x <= -550)this.node.x = 550;
    },
});
