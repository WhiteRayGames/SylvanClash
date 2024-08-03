var MyEnum = require("MyEnum");
var Config = require("Config");
var Event = require("Event");
var MissionType = require("MissionType");
var DataType = require("DataType");
var AchieveType = require("AchieveType");
//var missionCheckList = [[1],[20],[10],[3,6],[300,600,1200]];
var game = cc.Class({

    ctor: function () {
       
        this.init();
    },

    // extends: cc.Component,

    properties: {
        //关卡
        level:1,
        //当前波数
        curBoshu:1,
        //当前等级最大波数
        curLevelMaxBoshu:0,
        //金币
        money:0,
        //钻石
        gems:0,
        //目前最大植物等级
        plantMaxLv:1,
        //植物狂暴剩余时间
        rageTimer: 0,
        autoTimer: 0,
        fireTimer: 0,
        iceTimer: 0,
        critTimer: 0,

        //植物攻击范围
        plantAttackRange:400,
        //子弹速度
        bulletSpeed:500,
        //僵尸行走速度系数
        zombieSpeedCoefficient:55,
        //僵尸之间间隔距离
        zombieDistance:200,

        //转盘AD已经使用次数
        spinADResetTime:0,
        spinADTimeCount:0,

        spinUseGemTime:0,

        //金币图片位置
        coinPos:cc.Vec2,
        gemPos:cc.Vec2,

        //当前进度
        curProgress:0,
        //是否需要新手引导
        needGuide:false,
        //当前引导的补数
        curGuideStep:0,
        //植物合成引导时间
        plantMergeGuideTime:20,
        //植物合成引导自动消失时间
        plantMergeGuideHideTime:20,
        //空投时间
        airDropTime:16,

        //上次视频获得植物时间
        lastAdsGetPlantTime:0,
        //进入游戏时候的时间戳
        enterGameTimeStamp:0,
        //视频改为分享的开关 false 关闭 true打开
        shareSwitch:false,

        shareMaxNum:10,

        doubleCoinLeftTime:0,

        doubleBtnIntervalTime:0,//双倍金币按钮 允许显示的间隔时间

        doubleCoinState:false,

        keepInGameTime:0,//在游戏中

        tipBuyTimes:0,//提示购买次数

        canBuyPlantId:1,//主界面能直接购买的植物 id

        onlineCoinNum:0,//在綫金幣數量保存

        pickOutMaxLvPlant:-1,//被挑選出 進行攻擊提示的植物 索引位置

        lastSignDate:0,//上次签到的日期

        hasSignDayNum:0,//已经签到天数

        lastInviteDate: 0, // 上次邀请的日期

        clearCg:true,

        noFillCount: 0
    },

    statics:
    {
        instance:null,
        getInstance()
        {
            if(game.instance == null)
            {
                game.instance = new game();
            }
            return  game.instance;
        },
    },

    init()
    {
        this.plantBuyRecord = {};
        this.plantsPK = new Array();
        this.achievementProgress = new Array();
        this.dailyMissions = new Array();
        this.plantsOwn = new Array();

        this.exchangeCoinConfig = {};
        this.exchangeCoinConfig.openLevel = 4;
        this.exchangeCoinConfig.buyBuyButtonWight = 30;
        this.exchangeCoinConfig.wrongClickWight = 50;
        this.exchangeCoinConfig.maxExchangeNum = 20;
        this.exchangeCoinConfig.bannerUpNum = 3;

        this.freeFlag = {};
        this.freeFlag.TurnTable = true;

        this.currentExchangeCount = 0;

        this.needShowExchangeCoinCount = 0;

        this.needShowIAPCount = 0;

        this.winSize = cc.view.getVisibleSize();
    },

    resetKeepInGameTime:function () {
        this.keepInGameTime = cc.Mgr.game.dailyMissions[4].progress;
    },

    resetplantBuyRecord()
    {
        for(var i = 0 ;i < cc.Mgr.Config.allPlantCount; i++)
        {
            this.plantBuyRecord[i+1] = 0;
        }
    },

    pauseGame () {
        cc.game.pause();
        cc.Mgr.AudioMgr.pauseAll();
    },

    resumeGame () {
        cc.game.resume();
        cc.Mgr.AudioMgr.resumeAll();
        cc.Mgr.game.enterGameTimeStamp = cc.Mgr.Utils.GetSysTime();

        // resumeSchedule
        if (cc.Mgr.UIMgr.bigResultNode != null && cc.Mgr.UIMgr.bigResultNode.active === true) {
            cc.Mgr.UIMgr.bigResultNode.getComponent("bigResult").reSchedule();
        }
    },

    updatePlantBuyRecord:function(lv){
        if(this.plantBuyRecord && this.plantBuyRecord[lv])
        {
            this.plantBuyRecord[lv] += 1;
        }
        else
        {
            this.plantBuyRecord[lv] = 0;
        }
    },

    //获取空格子个数，用于离线花盆掉落，读取PlantsPK数据
    getSpaceGirdNum()
    {
        var num = 0;
        
        for(var i=0;i<this.plantsPK.length ;i++)
        {
            var pk = this.plantsPK[i];
            if(pk.type == MyEnum.GridState.none)
            {
                num++;
            }
        }
        return num;
    },

    getPlantsPK()
    {
        let plantsPK = [];
        for(var i = 0; i < cc.Mgr.plantMgr.grids.length; i++)
        {
            var plant = cc.Mgr.plantMgr.grids[i];
            var pk = {};
            pk.type = plant.type;
            if(pk.type == MyEnum.GridState.plant || pk.type == MyEnum.GridState.lock || pk.type == MyEnum.GridState.flowerPot)
            {
                pk.level = plant.content.level;
                pk.index = plant.content.index;
            }
            
            plantsPK.push(pk);
        }
        cc.Mgr.game.plantsPK = plantsPK;
        return plantsPK.length == 0 ? undefined : plantsPK;
    },

    //给TGA准备的植物布局
    getTGAPlantLayer()
    {
        var plants = this.plantsPK;
        var layerInfo = "";
        for(var i=0 ;i< plants.length;i++)
        {
            var plant = plants[i];
            if(plant.type == MyEnum.GridState.plant || plant.type == MyEnum.GridState.flowerPot)
            {
                layerInfo += plant.level;
            }
            else if(plant.type == MyEnum.GridState.lock){

                layerInfo += "-1";
            }
            else
            {
                //空格子
                layerInfo += "0";
            }

            if(i <plants.length -1)
            {
                layerInfo += "_";
            }
        }
        return layerInfo;
    },

    getTGAPlantLayerByIndex(index)
    {
        var plant;
        if(cc.Mgr.plantMgr.grids == null || cc.Mgr.plantMgr.grids.length <= 0) 
        {
            plant = this.plantsPK[index];
            if(plant.type == MyEnum.GridState.plant || plant.type == MyEnum.GridState.flowerPot)
            {
                return  plant.level;
            }
            else if(plant.type == MyEnum.GridState.lock){

                return -1;
            }
            else
            {
                //空格子
                return 0;
            }
        }
        else
        {
            plant = cc.Mgr.plantMgr.grids[index];
            if(plant.type == MyEnum.GridState.plant || plant.type == MyEnum.GridState.flowerPot)
            {
                return  plant.content.level;
            }
            else if(plant.type == MyEnum.GridState.lock){

                return -1;
            }
            else
            {
                //空格子
                return 0;
            }
        }
    },

    getMissionProgressById:function(id){
        for (var i = 0; i < this.dailyMissions.length; i++) {
            var dt = this.dailyMissions[i];
            if(id == dt.id)
                return dt;
        }
        return this.dailyMissions[0];
    },

    updateMissionProgressById:function(id){
        for (var i = 0; i < this.dailyMissions.length; i++) {
            if(id == this.dailyMissions[i].id)
            {
                if((id < MissionType.AdsShow || id == MissionType.InviteCount) && this.dailyMissions[i].progress < this.dailyMissions[i].checkNum)
                {
                    this.dailyMissions[i].progress += 1;
                }
                else if(id == MissionType.AdsShow || id == MissionType.InGameTime)
                {
                    if(this.dailyMissions[i].checklv)
                    {
                        if(this.dailyMissions[i].checklv < (cc.Mgr.Config.missionCheckList[id].length-1))
                            this.dailyMissions[i].progress += 1;
                        else
                        {
                            if(this.dailyMissions[i].progress < cc.Mgr.Config.missionCheckList[id][this.dailyMissions[i].checklv])
                                this.dailyMissions[i].progress += 1;
                        }
                    }
                    else
                    {
                        this.dailyMissions[i].checklv = 0;
                        this.dailyMissions[i].progress += 1;
                    }
                }
                cc.director.GlobalEvent.emit(Event.checkMissionAndAchieve,{});
                return;
            }
        }
    },

    updateMissionProgressByType:function(id, progress){
        for (var i = 0; i < this.dailyMissions.length; i++) {
            if(id == this.dailyMissions[i].id)
            {
                this.dailyMissions[i].progress = progress;
                return;
            }
        }
    },

    claimMissionRewardById:function(id){
        for (var i = 0; i < this.dailyMissions.length; i++) {
            if(id == this.dailyMissions[i].id)
            {
                if(id < MissionType.AdsShow || id == MissionType.InviteCount)
                {
                    this.dailyMissions[i].claimed = 1;
                    this.dailyMissions[i].progress = 0;
                }
                else if(id == MissionType.AdsShow || id == MissionType.InGameTime)
                {
                    if(this.dailyMissions[i].checklv)
                    {
                        this.dailyMissions[i].checklv += 1;
                        if(this.dailyMissions[i].checklv > (cc.Mgr.Config.missionCheckList[id].length-1))
                        {
                            this.dailyMissions[i].claimed = 1;
                            this.dailyMissions[i].progress = 0;
                        }                            
                    }
                    else
                    {
                        this.dailyMissions[i].checklv = 1;
                    }
                }
                return;
            }
        }
    },

    clearMissionDataToNextDay:function(){
        for (var i = 0; i < Config.missionDataList.length; i++) {
            if (this.dailyMissions[i]) {
                this.dailyMissions[i].progress = 0;
                this.dailyMissions[i].checklv = 0;
                this.dailyMissions[i].claimed = 0;
            }
        }
    },

    getAchieveDataById:function(id){
        for (var i = 0; i < this.achievementProgress.length; i++) {
            var dt = this.achievementProgress[i];
            if(id == dt.id)
                return dt;
        }
        return this.achievementProgress[0];
    },

    updateAchieveProgressByType:function(_type){
        for (var i = 0; i < this.achievementProgress.length; i++) {
            if(_type == this.achievementProgress[i].achType)
            {
                this.achievementProgress[i].progress += 1;
                return;
            }
        }
    },

    claimAchieveRewardById:function(id){
        for (var i = 0; i < this.achievementProgress.length; i++) {
            if(id == this.achievementProgress[i].id)
            {
                this.achievementProgress[i].checklv += 1;
                this.achievementProgress[i].progress = 0;
                if(this.achievementProgress[i].checklv > 4)
                    this.achievementProgress[i].finished = 1;
                else
                    this.achievementProgress[i].finished = 0;
                return;
            }
        }
    },

    updatePlantOwnsByLv:function(lv){
        for (var i = 0; i < this.plantsOwn.length; i++) {
            if(lv == this.plantsOwn[i].lv)
            {
                this.plantsOwn[i].ownNum += 1;
                cc.director.GlobalEvent.emit(Event.checkMissionAndAchieve,{});
                return;
            }
        }
    },

    getPlantOwnsDataByLv:function(lv){
        for (var i = 0; i < this.plantsOwn.length; i++) {
            if(lv == this.plantsOwn[i].lv)
            {
                return this.plantsOwn[i].ownNum;
            }
        }
    },

    getDronePot()
    {
        this.dronePot = cc.Mgr.flowerPotMgr.droneFlowerFot.plantInfos;
        return this.dronePot;
    },
    getTurntablePot()
    {
        this.turntablePot = cc.Mgr.flowerPotMgr.turnTableFlowerFot.plantInfos;
        return this.turntablePot;
    },
    getShopBuyPot()
    {
        this.shopBuyPot = cc.Mgr.flowerPotMgr.shopFlowerFot.plantInfos;
        return this.shopBuyPot;
    },

    //挑选任务数据 是否有完成情况
    checkOutMissionIsFinished:function(){
        for (var i = 0; i < this.dailyMissions.length; i++) {
            var dt = this.dailyMissions[i];
            if(dt.misType < MissionType.AdsShow)
            {
                if(dt.progress >= dt.checkNum && dt.claimed != 1)
                {
                    return true;
                }
            }
            else if(dt.misType == MissionType.AdsShow)
            {
                if(dt.checklv == 0 && dt.progress >= cc.Mgr.Config.missionCheckList[dt.id][0] && dt.claimed != 1)
                {
                    return true;
                }
                else if(dt.checklv == 1 && dt.progress >= cc.Mgr.Config.missionCheckList[dt.id][1] && dt.claimed != 1)
                {
                    return true;
                }
            }
            else if(dt.misType == MissionType.InGameTime)
            {
                if(dt.checklv == 0 && dt.progress >= cc.Mgr.Config.missionCheckList[dt.id][0] && dt.claimed != 1)
                {
                    return true;
                }
                else if(dt.checklv == 1 && dt.progress >= cc.Mgr.Config.missionCheckList[dt.id][1] && dt.claimed != 1)
                {
                    return true;
                }
                else if(dt.checklv == 2 && dt.progress >= cc.Mgr.Config.missionCheckList[dt.id][2] && dt.claimed != 1)
                {
                    return true;
                }
            } else if(dt.misType == MissionType.InviteCount){
                if(dt.checklv == 0 && dt.progress >= cc.Mgr.Config.missionCheckList[dt.id][0] && dt.claimed != 1)
                {
                    return true;
                }
                else if(dt.checklv == 1 && dt.progress >= cc.Mgr.Config.missionCheckList[dt.id][1] && dt.claimed != 1)
                {
                    return true;
                }
            }
        }
        return false;
    },

    //挑选成就 是否完成
    checkOutAchieveDataIsFinished:function(){
        var checkLvNumList = [5, 20, 50, 100];
        var outList = [];
        for (var i = 0; i < this.achievementProgress.length; i++) {
            var dt = this.achievementProgress[i];
            if(this.checkLvToGainGems(dt.id, dt.checklv) != 0 && dt.finished == 0)
            {
                if(outList.length < 5) outList.push(dt);
                if (dt.achType == AchieveType.Invite) outList.push(dt);
            }
        }

        for (var i = 0; i < outList.length; i++) {
            var da = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.AchievementData, outList[i].id);
            var checkNum = checkLvNumList[outList[i].checklv];
            if (outList[i].achType == AchieveType.Invite) {
                if (outList[i].progress >= checkNum) return true;
            } else {
                var plantOwnsNum = this.getPlantOwnsDataByLv(da.Level);
                if(plantOwnsNum >= checkNum)
                    return true; 
            }
                    
        }
        return false;
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

    caculatePlantPrice:function(plantId, buyNum){
        buyNum = buyNum ? buyNum : 0;
        var price = 0;
        var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData,plantId);
        if(plantId >= 1 && plantId <= 20)
        {
            price = plantData.price * BigInt(Math.round(Math.pow(1 + 0.1, buyNum) * 100)) / BigInt(100);
        }
        else
        {
            price = plantData.price * BigInt(Math.round(Math.pow(1 + 0.2, buyNum) * 100)) / BigInt(100);
        }
        return price;
    },
});
module.exports = game;
