
var SButton = cc.Class({
    extends: cc.Button,

    properties: {
        
    }, 

    start () {
        /*cc.Node.EventType.TOUCH_START // 按下时事件
        cc.Node.EventType.TOUCH_Move // 按住移动后事件
        cc.Node.EventType.TOUCH_END // 按下后松开后事件
        cc.Node.EventType.TOUCH_CANCEL // 按下取消事件*/

        this.node.on(cc.Node.EventType.TOUCH_START, function(){
            this.node.runAction(cc.scaleTo(0.1, 1.2));
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_END, function(){
            this.node.runAction(cc.scaleTo(0.1, 1));
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function(){
            this.node.runAction(cc.scaleTo(0.1, 1));
        }, this);
    },
});
module.exports = SButton;
