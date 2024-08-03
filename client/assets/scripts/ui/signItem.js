/*
 * @Author: bansomin
 * @Date: 2024-07-30 11:02:57
 * @LastEditors: bansomin
 * @LastEditTime: 2024-08-02 09:03:08
 * @Description: 
 */

var signItem = cc.Class({
    extends: cc.Component,

    properties: {
        rewardLbl: cc.Label,
        maskNode: cc.Node,
        checkedNode: cc.Node,
        selectedNode: cc.Node
    },

    setData: function (index) {

        this.rewardLbl.string = "x" + cc.Mgr.Config.signDataListSub[index - 1].rewardNum;
        this.maskNode.active =
            this.checkedNode.active = false;
        this.selectedNode.active = false;
        if (cc.Mgr.game.hasSignDayNum >= index) {
            this.maskNode.active =
                this.checkedNode.active = true;
        } else {
            // cc.Mgr.Utils.getDays(cc.Mgr.Utils.GetSysTime())-cc.Mgr.Utils.getDays(cc.Mgr.game.lastSignDate) >= 1 cc.Mgr.Utils.GetSysTime() - cc.Mgr.game.lastSignDate >= 20
            if ((cc.Mgr.game.hasSignDayNum + 1) === index && cc.Mgr.Utils.getDays(cc.Mgr.Utils.GetSysTime()) - cc.Mgr.Utils.getDays(cc.Mgr.game.lastSignDate) >= 1) {
                //TOOD-暂时隐藏，有骨骼动画后再处理
                // this.selectedNode.active = true;
            }
        }
    },
});
module.exports = signItem;
