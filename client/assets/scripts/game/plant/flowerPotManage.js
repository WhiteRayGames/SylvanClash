var MyEnum = require("MyEnum");
var DataType = require("DataType");
var flowerPotManage = cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    statics:
    {
        instance:null
    },

    // LIFE-CYCLE CALLBACKS:

    init(callback)
    {
        var self = this;
        self.loadedPrefabNum = 0;
        self.loadedPrefabNum++;
        cc.loader.loadRes("prefab/flowerPot/HuaPen_v1", function (err, prefab) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            self.loadedPrefabNum--;
            if(self.loadedPrefabNum == 0)
            {
                callback();
                
            }
            self.airDropFlowerFot_Prefab = prefab;
        });


        self.loadedPrefabNum++;
        cc.loader.loadRes("prefab/flowerPot/HuaPen_v2", function (err, prefab) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            self.loadedPrefabNum--;
            if(self.loadedPrefabNum == 0)
            {
                callback();
                
            }
            self.droneFlowerFot_Prefab = prefab;
        });

        self.loadedPrefabNum++;
        cc.loader.loadRes("prefab/flowerPot/HuaPen_v3", function (err, prefab) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            self.loadedPrefabNum--;
            if(self.loadedPrefabNum == 0)
            {
                callback();
                
            }
            self.turnTableAndBuyFlowerFot_Prefab = prefab;
        });

        //无人机掉落
        this.droneFlowerFot = {};
        this.droneFlowerFot.num = cc.Mgr.game.dronePot.length;
        this.droneFlowerFot.type = MyEnum.FlowerPotType.Drone;
        this.droneFlowerFot.plantInfos = cc.Mgr.game.dronePot;


        //转盘
        this.turnTableFlowerFot = {};
        this.turnTableFlowerFot.type = MyEnum.FlowerPotType.Turntable;
        this.turnTableFlowerFot.num = cc.Mgr.game.turntablePot.length;
        this.turnTableFlowerFot.plantInfos = cc.Mgr.game.turntablePot;

         //商店所得
         this.shopFlowerFot = {};
         this.shopFlowerFot.type = MyEnum.FlowerPotType.Shop;
         this.shopFlowerFot.num = cc.Mgr.game.shopBuyPot.length;
         this.shopFlowerFot.plantInfos = cc.Mgr.game.shopBuyPot;

         var timeInterVal = cc.Mgr.Utils.GetSysTime() - cc.Mgr.UserDataMgr.lastPlayTime;
        
        var spaceGirdNun = cc.Mgr.game.getSpaceGirdNum() - this.droneFlowerFot.num -this.turnTableFlowerFot.num-this.shopFlowerFot.num;
        var canAirDropNun = Math.floor(timeInterVal / cc.Mgr.game.airDropTime);
        var airDropNun = 0;

        if(spaceGirdNun <= 0)
        {
            airDropNun = 0;
        }
        else if(spaceGirdNun >= canAirDropNun)
        {
            airDropNun = canAirDropNun;
        }
        else
        {
            airDropNun = spaceGirdNun;
        }

        //自然掉落
        this.airDropFlowerFot = {};
        this.airDropFlowerFot.num = airDropNun;
        this.airDropFlowerFot.type = MyEnum.FlowerPotType.Drop;
        //植物信息，掉落时候不确定植物，点卡才确认，所以会为空。但是不排除策划更改需求，所以字段保留
        this.airDropFlowerFot.plantInfo = [];

    },

    //没有掉落花盆的个数
    noneDropFlowerFotNun()
    {
        var num = this.turnTableFlowerFot.num + this.shopFlowerFot.num + this.droneFlowerFot.num + this.airDropFlowerFot.num;
        return num;
    },
    //是否有花盆
    haveFlowerFot()
    {
        var num = this.turnTableFlowerFot.num + this.shopFlowerFot.num + this.droneFlowerFot.num + this.airDropFlowerFot.num;
        return num>0?true:false;
    },

    //增加空投自然掉落的花盆 maxNum 最大的空格数
    addDropFlowerFot(maxNum)
    {
        if((this.airDropFlowerFot.num == 0 && maxNum == 0) || (this.airDropFlowerFot.num < maxNum))
        {
            this.airDropFlowerFot.num++;
        }
    },

    //加入到无人机队列中去
    addDroneFlowerFot(level, num){
        for(var i=0;i<num;i++)
        {
            this.droneFlowerFot.plantInfos[this.droneFlowerFot.num] = level;
            this.droneFlowerFot.num++;
        }
    },

    //增加转盘购买植物，level植物等级，num个数
    addTurnTableFlowerFot(level,num=1, callback = null)
    {
        for(var i=0;i<num;i++)
        {
            this.turnTableFlowerFot.plantInfos[this.turnTableFlowerFot.num] = level;
            this.turnTableFlowerFot.num++;
        }
    },

    //商城购买植物，level植物等级，num个数
    addShopFlowerFot(level,num=1, callback = null)
    {
        for(var i=0;i<num;i++)
        {
            this.shopFlowerFot.plantInfos[this.shopFlowerFot.num] = level;
            this.shopFlowerFot.num++;
        }
    },

    getFlowerFot()
    { 
        var flowerFot = null;
        if(this.turnTableFlowerFot.num > 0)
        {
            this.turnTableFlowerFot.num--;
            flowerFot = cc.instantiate(this.turnTableAndBuyFlowerFot_Prefab);
            var flowerFotItem = flowerFot.getComponent("flowerPot");
            var level =  this.turnTableFlowerFot.plantInfos[this.turnTableFlowerFot.num];
            flowerFotItem.setPlantInfo(level);
            this.turnTableFlowerFot.plantInfos.length--;
            return flowerFot;
        }
        else if(this.shopFlowerFot.num > 0)
        {
            this.shopFlowerFot.num--;
            flowerFot = cc.instantiate(this.turnTableAndBuyFlowerFot_Prefab);
            var flowerFotItem = flowerFot.getComponent("flowerPot");
            var level =  this.shopFlowerFot.plantInfos[this.shopFlowerFot.num];
            flowerFotItem.setPlantInfo(level);
            this.shopFlowerFot.plantInfos.length--;
            return flowerFot;
        }
        else if(this.droneFlowerFot.num > 0)
        {
            this.droneFlowerFot.num--;
            flowerFot = cc.instantiate(this.droneFlowerFot_Prefab);
            var flowerFotItem = flowerFot.getComponent("flowerPot");
            var level =  this.droneFlowerFot.plantInfos[this.droneFlowerFot.num];
            flowerFotItem.setPlantInfo(level);
            this.droneFlowerFot.plantInfos.length--;
            return flowerFot;
        }
        else if(this.airDropFlowerFot.num > 0)
        {
            this.airDropFlowerFot.num--;
            flowerFot = cc.instantiate(this.airDropFlowerFot_Prefab);

            var airdropData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.AirDropData,cc.Mgr.game.plantMaxLv);
            var level = 0;
            if(airdropData.Plant2 == 0)
            {
                level = airdropData.Plant1;
            }
            else
            {
                var random = Math.floor(Math.random()*100);
                if(random%2 == 0)
                {
                    level = airdropData.Plant1;
                }
                else
                {
                    level = airdropData.Plant2;
                }
            }

            var flowerFotItem = flowerFot.getComponent("flowerPot");
            flowerFotItem.setPlantInfo(level);
            return flowerFot;
        }
        return null;
    },

    onLoad () {

        flowerPotManage.instance = this;
    },

    start () {

    },

    // update (dt) {},
});
module.exports = flowerPotManage;

