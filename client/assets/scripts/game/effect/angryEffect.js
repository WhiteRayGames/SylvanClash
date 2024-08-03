
var angryEffect = cc.Class({
    extends: cc.Component,

    properties: {
        angryNode:cc.Node,
    },

    changeAngryState:function(beAngry){
        if(beAngry)
            this.angryNode.active = true;
        else
            this.angryNode.active = false;
    },
});
module.exports = angryEffect;
