
var tipMoveAttack = cc.Class({
    extends: cc.Component,

    properties: {
        desLabel: cc.Label
    },

    closeNode:function(){
    	cc.Mgr.plantMgr.hideTipAttackNode();
    },

    showtipMoveAttack:function(){
        this.desLabel.string = cc.Mgr.Utils.getTranslation("guide-move-plant");
    	this.unschedule(this.closeNode);
        this.scheduleOnce(this.closeNode, 5);
    },

    closeTip:function(){
    	this.unschedule(this.closeNode);
    	this.node.active = false;
    },
});
module.exports = tipMoveAttack;
