

cc.Class({
    extends: cc.Component,

    properties: {
       
        delayTime:0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    init(type,targetPos)
    {
        //quartIn 四
        //quadInOut 平方sineIn 正弦
        //easeInExpo
        //easeInBack
        //easeInCubic
        var self = this;

        if(type == 0)
        {
            this.node.scale = 0;
            cc.tween(this.node).to(0.2,{scale:1}).by(0.1,{position:cc.v2(0,20)}).to(0.2,{position:targetPos},{easing:'sineInOut'}).call(
                function()
                {
                    self.complete();
                }
            ).start();
        }
        else
        {
            this.node.opacity = 0;
            cc.tween(this.node).to(0.2,{opacity:255}).to(0.3,{scale:1.5,position:targetPos,angle:0},{easing:'sineInOut'}).call(
                function()
                {
                    self.complete();
                }
            ).start();
        }
        
    }

    // update (dt) {},
});
