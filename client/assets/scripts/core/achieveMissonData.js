
var achieveMissonData = cc.Class({
    name: "achieveMissonData",

    properties: {
    	id:0,
        checkType:0, //0表示是 任务   1 表示是成就
        misType:0, //任务的类型  0 登录次数  1 合成植物  2 成功抵御僵尸 3 累计广告次数 4 游戏时长 5 邀请好友
        achType:0, //成就类型  0 获得花的棵树 1 邀请好友
        level:1,
        checkLv:1, //成就的内部等级
        checkNum:5,
        progress:0,
    },
});
module.exports = achieveMissonData;
