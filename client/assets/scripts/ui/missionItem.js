var DataType = require("DataType");
var MissionType = require("MissionType");
var missionTrans = ["mission-login-game", "mission-merge20-flowers", "mission-win10-times", "mission-watch3-videos","mission-ingame-time", "mission-invite-count"];
var oldMissionRewardList = [[0],[0],[0],[5,5],[2,5,5], [5]];
var missionItem = cc.Class({
    extends: cc.Component,

    properties: {
        missionSp:cc.Sprite,
        missionIconList: [cc.SpriteFrame],
        rewardIcon: cc.Sprite,
        rewardIconList: [cc.SpriteFrame],
        claimBtn:cc.Node,
        proBar:cc.ProgressBar,
        desLbl:cc.Label,
        numLbl:cc.Label,

        sliderLbl:cc.Label,

        effect:cc.Node,

        rewardType:"money",
        rewardNum:5,
        misId:0,
        receiveBtnLabel: cc.Label
    },

    onLoad () {
        this.limitClick = this.node.getComponent('LimitClick')
    },

    pickOutDataLv:function(shopSortDt){
        for (var i = 0; i < 9; i++) {
            switch(i)
            { 
                case 0:
                    if(shopSortDt.MAX == "M")
                        return 0;
                    break;
                case 1:
                    if(shopSortDt.MAX_1 == "M")
                        return 1;
                    break;
                case 2:
                    if(shopSortDt.MAX_2 == "M")
                        return 2;
                    break;
                case 3:
                    if(shopSortDt.MAX_3 == "M")
                        return 3;
                    break;
                case 4:
                    if(shopSortDt.MAX_4 == "M")
                        return 4;
                    break;
                case 5:
                    if(shopSortDt.MAX_5 == "M")
                        return 5;
                    break;
                case 6:
                    if(shopSortDt.MAX_6 == "M")
                        return 6;
                    break;
                case 7:
                    if(shopSortDt.MAX_7 == "M")
                        return 7;
                    break;
                case 8:
                    if(shopSortDt.MAX_8 == "M")
                        return 8;
                    break;
            }
        }
        return 0;
    },

    caculateMoneyPrice:function(lv, plantData){
        var buyNum = cc.Mgr.game.plantBuyRecord[lv];
        buyNum = buyNum ? buyNum : 0;
        this.price = plantData.price;
        var price =  plantData.price * BigInt(Math.round(Math.pow(1 + 0.2, buyNum) / 2 * 100)) / BigInt(100);
        if(lv == 1)
            price =  plantData.price * BigInt(Math.round(Math.pow(1 + 0.1, buyNum) / 2 * 100)) / BigInt(100);
        this.price = price;
        return price;
    },

    setData:function(data){
        this.receiveBtnLabel.string = cc.Mgr.Utils.getTranslation("btn-claim");

        this.missionSp.spriteFrame = this.missionIconList[data.misType]
        this.misId = data.id;
        this.checklv = data.checklv;

        if(data.rewardType == "coin")
        {
            this.rewardType = "money";
            var lvDis = (cc.Mgr.game.plantMaxLv - 3) > 0 ? (cc.Mgr.game.plantMaxLv - 3) : 1;
            var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, lvDis);
            this.rewardNum = this.caculateMoneyPrice(lvDis, plantData) * BigInt(8) / BigInt(10);
            this.numLbl.string = "x"+cc.Mgr.Utils.getNumStr2(this.rewardNum);
            this.rewardIcon.spriteFrame = this.rewardIconList[0]
        }
        else if(data.rewardType == "gem")
        {
            this.rewardType = "gem";
            if(data.checklv)
                this.rewardNum = cc.Mgr.Config.missionRewardList[this.misId][data.checklv];
            else
                this.rewardNum = cc.Mgr.Config.missionRewardList[this.misId][0];

            if(data.checklv)
                this.rewardNum = oldMissionRewardList[this.misId][data.checklv];
            else
                this.rewardNum = oldMissionRewardList[this.misId][0];

            this.numLbl.string = "x"+ this.rewardNum;
            this.rewardIcon.spriteFrame = this.rewardIconList[1]
        }

        this.unscheduleAllCallbacks();

        var checkNum = data.checkNum;
        if(data.misType == MissionType.AdsShow || data.misType == MissionType.InGameTime || data.misType == MissionType.InviteCount)
        {
            if(data.checklv)
                checkNum = cc.Mgr.Config.missionCheckList[this.misId][data.checklv];
            else
                checkNum = cc.Mgr.Config.missionCheckList[this.misId][0];

            this.desLbl.string = cc.Mgr.Utils.getTranslation(missionTrans[data.misType], [checkNum]);
            if(data.misType == MissionType.InGameTime)
            {
                this.schedule(function(){
                    if(cc.Mgr.game.dailyMissions[data.misType].progress < checkNum)
                    {
                        this.sliderLbl.string = cc.Mgr.game.dailyMissions[data.misType].progress +"/"+ checkNum;
                        this.proBar.progress = cc.Mgr.game.dailyMissions[data.misType].progress / checkNum;
                        this.effect.active = false;
                        this.claimBtn.active = false;
                    }
                    else
                    {
                        this.sliderLbl.string = checkNum +"/"+ checkNum;
                        this.proBar.progress = 1;
                        this.effect.active = true;
                        this.claimBtn.active = true;
                    }
                }, 1);
            }
            else
            {
                this.desLbl.string = cc.Mgr.Utils.getTranslation(missionTrans[data.misType],[checkNum]);
            }
        }
        else
        {
            checkNum = data.checkNum;
            this.desLbl.string = cc.Mgr.Utils.getTranslation(missionTrans[data.misType]);
        }
        this.sliderLbl.string = data.progress +"/"+ checkNum;

        this.proBar.progress = data.progress / checkNum;

        if(data.progress < checkNum)
        {
            this.effect.active = false;
            this.claimBtn.active = false;
        }
        else
        {
            this.effect.active = true;
            this.claimBtn.active = true;
        }
    },

    scheduleInGameTimeMission:function(checkNum, data){
        this.desLbl.string = cc.Mgr.Utils.getTranslation(missionTrans[data.misType]);

        if(cc.Mgr.game.dailyMissions[data.misType].progress < checkNum)
        {
            this.sliderLbl.string = cc.Mgr.game.dailyMissions[data.misType].progress +"/"+ checkNum;
            this.proBar.progress = cc.Mgr.game.dailyMissions[data.misType].progress / checkNum;
            this.effect.active = false;
            this.claimBtn.active = false;
        }
        else
        {
            this.sliderLbl.string = checkNum +"/"+ checkNum;
            this.proBar.progress = 1;
            this.effect.active = true;
            this.claimBtn.active = true;
        }
    },

    claim:function(){
        if (this.limitClick.clickTime() == false) {
            return
        }
        cc.Mgr.AudioMgr.playSFX("click");
        this.getRewardAndUpdateMission();
        
        // if (cc.Mgr.game.plantMaxLv >= 25) {
        //     cc.Mgr.admob.showInterstitial("mission", () => {
        //         cc.Mgr.UIMgr.openAssetGetUI(this.rewardType, this.rewardNum, "mission");
        //     });
        // } else {
        //     cc.Mgr.UIMgr.openAssetGetUI(this.rewardType, this.rewardNum, "mission");
        // }
        cc.Mgr.UIMgr.openAssetGetUI(this.rewardType, this.rewardNum, "mission");

        if (this.rewardType === "gem") {
            let data = {}
            data.elapsed = cc.Mgr.Utils.getDate9(true)
            data.getGems = this.rewardNum
            cc.Mgr.analytics.logEvent("mission_get_gems", JSON.stringify(data));
        }

        cc.Mgr.UIMgr.missionUI.showUI(true);
    },

    getRewardAndUpdateMission:function(){
        cc.Mgr.game.claimMissionRewardById(this.misId);
    },
});
module.exports = missionItem;
