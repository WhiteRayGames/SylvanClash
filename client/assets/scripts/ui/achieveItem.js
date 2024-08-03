var DataType = require("DataType");
var checkLvNumList = [5, 20, 50, 100];
var AchieveType = require("AchieveType");
var achieveItem = cc.Class({
    extends: cc.Component,

    properties: {
        rewardIcon:cc.Sprite,
        claimBtn:cc.Node,
        proBar:cc.ProgressBar,
        desLbl:cc.Label,
        numLbl:cc.Label,

        sliderLbl:cc.Label,
        rewardNum:5,
        rewardType:"gem",
        acId:0,
        receiveBtnLabel: cc.Label
    },

    onLoad () {
        this.limitClick = this.node.getComponent('LimitClick')
    },

    setData:function(data){
        this.acData = data;
        this.acId = data.id;

        this.receiveBtnLabel.string = cc.Mgr.Utils.getTranslation("btn-claim");

        var checkNum = checkLvNumList[data.checklv];

        this.rewardType = "gem";

        var dt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.AchievementData, data.id);
        var stringContent = data.achType == AchieveType.Invite ? cc.Mgr.Utils.getTranslation("achieveItem-description-2",[checkNum]) : cc.Mgr.Utils.getTranslation("achieveItem-description",[checkNum, dt.Level]);
        this.desLbl.string = stringContent;

        if (data.achType == AchieveType.Invite) {
            var progressData = cc.Mgr.game.getAchieveDataById(data.id);
            if(progressData.progress > checkNum) progressData.progress = checkNum;
            this.proBar.progress = progressData.progress / checkNum;
            if (progressData.progress < checkNum) {
                this.claimBtn.active = false;
            } else {
                this.claimBtn.active = true;
            }
            this.sliderLbl.string = progressData.progress + "/" + checkNum;
        } else {
            var plantOwnsNum = cc.Mgr.game.getPlantOwnsDataByLv(dt.Level);
            if(plantOwnsNum > checkNum)
                plantOwnsNum = checkNum;
            this.proBar.progress = plantOwnsNum / checkNum;
            if(plantOwnsNum < checkNum)
            {
                this.claimBtn.active = false;
            }
            else
            {
                this.claimBtn.active = true;
            }
            this.sliderLbl.string = plantOwnsNum + "/" + checkNum;
        }
        
        this.rewardNum = this.checkLvToGainGems(data.id, data.checklv);
        this.numLbl.string = "x" + this.rewardNum;
    },

    checkLvToGainGems:function(id, checklv){
        var dt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.AchievementData, id);
        if(checklv == 0)
            return dt.Gain_5;
        else if(checklv == 1)
            return dt.Gain_20;
        else if(checklv == 2)
            return dt.Gain_50;
        else if(checklv == 3)
            return dt.Gain_100;
        else if(checklv == 4)
            return dt.Gain_200;
    },

    claim:function(){
        if (this.limitClick.clickTime() == false) {
            return
        }
        cc.Mgr.AudioMgr.playSFX("click");

        // if (cc.Mgr.game.plantMaxLv >= 25) {
        //     cc.Mgr.admob.showInterstitial("achieve", () => {
        //         cc.Mgr.UIMgr.openAssetGetUI(this.rewardType, this.rewardNum, "achieve");
        //     });
        // } else {
        //     cc.Mgr.UIMgr.openAssetGetUI(this.rewardType, this.rewardNum, "achieve");
        // }
        cc.Mgr.UIMgr.openAssetGetUI(this.rewardType, this.rewardNum, "achieve");
        
        let data = {}
        data.elapsed = cc.Mgr.Utils.getDate9(true)
        data.rewardCount = this.rewardNum
        data.rewardID = this.acId;
        cc.Mgr.analytics.logEvent("achieveItem_gain", JSON.stringify(data));
        this.getRewardAndUpdateAchieve();
        cc.Mgr.UIMgr.missionUI.showUI(true);
        if(this.acData.checklv == 4)
            this.node.active = false;

    },

    getRewardAndUpdateAchieve:function(){
        cc.Mgr.game.claimAchieveRewardById(this.acId);
    },
});
module.exports = achieveItem;
