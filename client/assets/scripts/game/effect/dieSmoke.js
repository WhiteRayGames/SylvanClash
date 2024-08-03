var EffectType = require("EffectType");
var dieSmoke = cc.Class({
    extends: cc.Component,

    properties: {
        dragon: dragonBones.ArmatureDisplay,
    },

    start(){
        this.dragon.on(dragonBones.EventObject.COMPLETE,this.onAnimComplete, this);
    },

    onAnimComplete:function(){
        if(this.callback != null)
            this.callback();
        cc.Mgr.EffectMgr.ObBackToPool(this.node, EffectType.DieSmoke);
    },

    playAnimation:function(cb) {
        this.callback = null;
        this.callback = cb;
        this.dragon.playAnimation("Sprite", 1);
    },
});
module.exports = dieSmoke;
