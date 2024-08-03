
var coinFly = cc.Class({
    extends: cc.Component,

    properties: {
        numLbl:cc.Label,
    },

    setData:function(data) {
        this.numLbl.string = "+" + data;
    },
});
module.exports = coinFly;
