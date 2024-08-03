// rType : coin  gem  buff  plant drone
var rewardBox = cc.Class({
    extends: cc.Component,

    properties: {
        rType:"coin",
        num:1,
        id:1,
        weight:1,
    },

    setData:function(rType, num = 1, id = 1, weight = 1){
        this.rType = rType;
        this.num = num;
        this.id = id;
        this.weight = weight;
    },
});
module.exports = rewardBox;
