var EffectType = require("EffectType");
var attackEffect = cc.Class({
    extends: cc.Component,

    properties: {
        dragon: dragonBones.ArmatureDisplay,
    },

    start(){
        this.dragon.on(dragonBones.EventObject.COMPLETE,this.onAnimComplete, this);
    },

    onAnimComplete:function(){
        this.node.active = false;
        //if(this.node.activeInHierarchy)
        //    cc.Mgr.EffectMgr.ObBackToPool(this.node, EffectType.Vertigo);
    },

    playAnimation:function() {
        this.dragon.playAnimation("newAnimation", 1);
    },
});
module.exports = attackEffect;
