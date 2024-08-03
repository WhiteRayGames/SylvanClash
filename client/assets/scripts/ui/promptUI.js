var promptUI = cc.Class({
    extends: cc.Component,

    properties: {
        desLbl:cc.Label,
        coinNode: cc.Node,
        gemNode: cc.Node
    },

    showDes:function (des, _type) {
        this.desLbl.string = des;
        this.coinNode.active = false;
        this.gemNode.active = false;
        if (_type == "coin") {
            this.coinNode.active = true;
        } else if (_type == "gem") {
            this.gemNode.active = true;
        }
    },
});
module.exports = promptUI;