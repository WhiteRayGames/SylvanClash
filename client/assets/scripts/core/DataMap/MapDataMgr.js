var DataType = require("DataType");
var PlantMapMgr = require("PlantMapMgr");
var ZombieMapMgr = require("ZombieMapMgr");
var LevelMapMgr = require("LevelMapMgr");
var AchieveMapMgr = require("AchieveMapMgr");
var AirDropMapMgr = require("AirDropMapMgr");
var InviteMapMgr = require("InviteMapMgr");
var TurnTableMapMgr = require("TurnTableMapMgr");
var ShopMapMgr = require("ShopMapMgr");
var SpinLvMapMgr = require("SpinLvMapMgr");
var LvUpGemMapMgr = require("LvUpGemMapMgr");
var BuyButtonMapMgr = require("BuyButtonMapMgr");
var DroneMapMgr = require("DroneMapMgr");
var TransMapMgr = require("TransMapMgr");
var MapDataMgr = cc.Class({
    extends: cc.Component,

    properties: {
        goodsMap:null,//示例
    
        decodeAll:0,
    },

    checkInitMapSuc:function(){
        if(this.decodeAll == 100)
        {

        }
    },

    //初始化解析数据表
    initMaps:function () {
        cc.Mgr.Parse = false;
        //植物解析
        this.plantMap = new PlantMapMgr();
        this.plantMap.DecodeJson();
        //僵尸解析
        this.zombieMap = new ZombieMapMgr();
        this.zombieMap.DecodeJson();

        //关卡解析
        this.levelMap = new LevelMapMgr();
        this.levelMap.DecodeJson();

        //成就表
        this.achieveMap = new AchieveMapMgr();
        this.achieveMap.DecodeJson();

        //空投掉落表
        this.airdropMap = new AirDropMapMgr();
        this.airdropMap.DecodeJson();

        //邀请表
        this.inviteMap = new InviteMapMgr();
        this.inviteMap.DecodeJson();

        //转盘表
        this.turnMap = new TurnTableMapMgr();
        this.turnMap.DecodeJson();

        //商店数据
        this.shopMap = new ShopMapMgr();
        this.shopMap.DecodeJson();

        //spinLv
        this.spinMap = new SpinLvMapMgr();
        this.spinMap.DecodeJson();

        //升级奖励
        this.lvupgemMap = new LvUpGemMapMgr();
        this.lvupgemMap.DecodeJson();

        //按钮
        this.buttonMap = new BuyButtonMapMgr();
        this.buttonMap.DecodeJson();

        //无人机
        this.droneMap = new DroneMapMgr();
        this.droneMap.DecodeJson();

        this.transMap = new TransMapMgr();
        this.transMap.DecodeJson();
    },

    getDataByDataTypeAndKey:function(itemType, itemId){
        var data = null;
        switch(itemType)
        { 
            case DataType.InviteData:
                data = this.inviteMap.getDataByKey(itemId);
                break;
            case DataType.AchievementData:
                data = this.achieveMap.getDataByKey(itemId);
                break;
            case DataType.AirDropData:
                data = this.airdropMap.getDataByKey(itemId);
                break;
            case DataType.BuyButtonData:
                data = this.buttonMap.getDataByKey(itemId);
                break;
            case DataType.DroneData:
                data = this.droneMap.getDataByKey(itemId);
                break;
            case DataType.LevelGemData:
                data = this.lvupgemMap.getDataByKey(itemId);
                break;
            case DataType.LevelData:
                data = this.levelMap.getDataByKey(itemId);
                break;
            case DataType.PlantData:
                data = this.plantMap.getDataByKey(itemId);
                break;
            case DataType.ZombieData:
                data = this.zombieMap.getDataByKey(itemId);
                break;
            case DataType.TurnTableData:
                data = this.turnMap.getDataByKey(itemId);
                break;
            case DataType.ShopData:
                data = this.shopMap.getDataByKey(itemId);
                break;
            case DataType.SpinLevelData:
                data = this.spinMap.getDataByKey(itemId);
                break;
            case DataType.Translation:
                data = this.transMap.getDataByKey(itemId);
                break;
        }
        return data;
    },

    getDataListByDataType:function(itemType){
        var data = null;
        switch(itemType)
        { 
            case DataType.InviteData:
                data = this.inviteMap.dataList;
                break;
            case DataType.AchievementData:
                data = this.achieveMap.dataList;
                break;
            case DataType.AirDropData:
                data = this.airdropMap.dataList;
                break;
            case DataType.BuyButtonData:
                data = this.buttonMap.dataList;
                break;
            case DataType.DroneData:
                data = this.droneMap.dataList;
                break;
            case DataType.LevelGemData:
                data = this.lvupgemMap.dataList;
                break;
            case DataType.LevelData:
                data = this.levelMap.dataList;
                break;
            case DataType.PlantData:
                data = this.plantMap.dataList;
                break;
            case DataType.ZombieData:
                data = this.zombieMap.dataList;
                break;
            case DataType.TurnTableData:
                data = this.turnMap.dataList;
                break;
            case DataType.ShopData:
                data = this.shopMap.dataList;
                break;
            case DataType.SpinLevelData:
                data = this.spinMap.dataList;
                break
            case DataType.Translation:
                data = this.transMap.dataList;
                break;
        }
        return data;
    },

});
module.exports = MapDataMgr;
