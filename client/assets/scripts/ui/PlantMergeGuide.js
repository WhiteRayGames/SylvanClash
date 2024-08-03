

cc.Class({
    extends: cc.Component,

    properties: {
       
        circle:cc.Sprite,
        finger:cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    startMove(startPos,endPos)
    {
        this.move(startPos,endPos)
    },

    stopMove()
    {
        if(this.fingerTween != null) this.fingerTween.stop();
        if(this.circleTween != null) this.circleTween.stop();

    },

    move(startPos,endPos)
    {
        var self = this;
        this.finger.node.position = startPos;
        this.finger.node.opacity = 255;

        this.circle.node.position = startPos;
        this.circle.node.opacity = 255;
        this.circle.node.scale = 1;

        this.fingerTween =  cc.tween(this.finger.node).to(1,{position:endPos}).to(0.3,{opacity:0}).
        call(function()
        {
           self.move(startPos,endPos);

        });
        this.fingerTween.start();

        this.circleTween = cc.tween(this.circle.node).to(0.5,{scale:2,opacity:0});
        this.circleTween.start();
    },
    

    start () {

        // this.init(this.startPos,this.endPos);
    },

    // update (dt) {},
});
