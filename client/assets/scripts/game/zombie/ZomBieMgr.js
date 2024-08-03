var DataType = require("DataType");
var Event = require("Event");
var MyEnum = require("MyEnum");
var ZombieMgr = cc.Class({
    extends: cc.Component,

    properties: {
        waveZombieCount:0,//该一波次整体包含的僵尸个数
        backToPoolCount:0,

        shadow:cc.Prefab,

        //是否有僵尸逃离了
        _zombieIsEscape:false,
    },
    statics:
    {
        instance:null
    },

    onLoad()
    {

    },

    start(){
        cc.Mgr.ZombieMgr = this;
        this.zombiesParent = this.node;
        this.isPause = false;
    },

    pause () {
        if (this.currentZombieList == null) return;
        for (let i = 0; i < this.currentZombieList.length; i++) {
            this.currentZombieList[i].getComponent("zombie").pause();
        }

        this.isPause = true;

        this.timer = Date.now();

        if (this.runningStart) {
            this.runningDuration += Date.now() - this.runningStart;
            this.runningStart = Date.now();
        }

        if (this.timeoutId) clearTimeout(this.timeoutId)
        // this.unschedule (this.node);
    },

    resume () {
        if (this.currentZombieList == null) return;
        let index = 0;
        for (let i = 0; i < this.currentZombieList.length; i++) {
            if (this.currentZombieList[i].getComponent("zombie").posIndex == 0) {
                this.currentZombieList[i].getComponent("zombie").moveToNextPos();
                index++;
            } else {
                this.currentZombieList[i].getComponent("zombie").moveToNextPos();
            }
        }

        if (this.runningDuration >= this.dt2) {
            this.dt = 0;
        } else {
            this.dt = this.dt2 - this.runningDuration;
        }

        this.generateZombies1();

        this.isPause = false;
    },

    InitZombiesMgr:function(){
        this.zombieObjs = {};
    },

    unscheduleCreateZombieForCG:function(){
        this.unschedule(this.createZombieTimes);
    },

    getOneWaveZombies:function(lv, wave){        
        var key = lv > 60 ? (lv % 60) + "_" + wave : lv + "_" + wave;
        this.lvdt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.LevelData, key);
        this.zombie1Counts = this.lvdt.zombieCount1;
        this.zombie2Counts = this.lvdt.zombieCount2;
        

        if (cc.Mgr.game.level > 60) {
            let maxKey = 60 + "_" + wave;
            this.maxLevelData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.LevelData, maxKey);
        }

        if (cc.Mgr.game.level <= 5) {
            if (this.attackTipTimeout) clearTimeout(this.attackTipTimeout);
            this.attackTipTimeout = setTimeout(() => {
                cc.Mgr.plantMgr.showLaterTipAttack();
            }, 3);
        }

        this.backToPoolCount = 0;
        //已经创建了，僵尸的个数
        this.createZombieCount = 0;

        this.waveZombieCount = this.lvdt.zombieCount1 + this.lvdt.zombieCount2;
       
        this.dt = 0; 
        this.dt2 = 2000;
        
        var canPlayZombieSound = true;

        this.zombieZIndex = 100;
        this.moveZIndex = 100;

        this.moveZIndex_2 = -100;

        this.zombieList = [];

        if(canPlayZombieSound)
        {
            //每波僵尸，只出现一次音效
            canPlayZombieSound = false;
            cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.zombie_man);
        }

        this.currentZombieList = [];
        this.generateZombies1();
        

        this._zombieIsEscape = false;
    },

    generateZombies2: function () {
        if (this.zombie2Counts <= 0) return;
        this.timeoutId = setTimeout(function(){
            if (this.isPause == false && this.zombie2Counts > 0) {
                this.createZombies(this.lvdt.zombieID2, "zombieID2");
                this.zombie2Counts--;
                this.dt = this.dt2;

                this.runningStart = Date.now();
                this.runningDuration = 0;

                if (this.zombie2Counts > 0) {
                    this.generateZombies2();
                }
            }
        }.bind(this), this.dt);
    },

    generateZombies1: function () {
        if (this.zombie1Counts <= 0) {
            this.generateZombies2();
            return;
        }
        this.timeoutId = setTimeout(function(){
            if (this.isPause == false && this.zombie1Counts > 0) {
                this.createZombies(this.lvdt.zombieID1,"zombieID1");
                console.log("create zombie - " + this.dt);
                this.zombie1Counts--;
                this.dt = this.dt2;

                this.runningStart = Date.now();
                this.runningDuration = 0;

                if (this.zombie1Counts > 0) {
                    this.generateZombies1();
                } else {
                    this.generateZombies2();
                }
            }
        }.bind(this), this.dt);
    },

    createZombies:function(id, _zombieIndez){
        var self = this;

        this.createZombieCount++;
        
        var data = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.ZombieData, id.toString());
        let currentData = {};
        if (cc.Mgr.game.level > 60) {
            let monsterData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.ZombieData, this.maxLevelData[_zombieIndez]);
            currentData.id = data.id;
            currentData.hp = monsterData.hp * BigInt(Math.round(Math.pow(2.15, cc.Mgr.game.level % 60)));
            currentData.spd = data.spd;
            currentData.money = monsterData.money * BigInt(Math.round(Math.pow(2.15, cc.Mgr.game.level % 60)));
            currentData.prefab = data.prefab;
            currentData.gender = data.gender;
        } else {
            currentData = data;
        }
        
        this.zombieObjs[id.toString()] = this.zombieObjs[id.toString()] || [];
        var zomObj = null;
        if(this.zombieObjs[id.toString()].length > 3)
        {
            zomObj = this.zombieObjs[id.toString()].shift();
            this.currentZombieList.push(zomObj);
            zomObj.parent = this.node;
            zomObj.zIndex = this.zombieZIndex;
            zomObj.active = true;
            var zombieScript = zomObj.getComponent("zombie");
            zombieScript.isSetZIndex = false;
            if(currentData.id > cc.Mgr.Config.zBossLine ||  self.createZombieCount == self.waveZombieCount)
                zombieScript.init(data,1.1);
            else
                zombieScript.init(currentData);
            zombieScript.moveToNextPos();
            this.zombieZIndex--;
        }
        else
        {
            cc.loader.loadRes("prefab/zombiesnew/" + currentData.prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                zomObj = cc.instantiate(prefab);
                self.currentZombieList.push(zomObj);

                zomObj.parent = self.node;
                zomObj.zIndex = self.zombieZIndex;
                zomObj.active = true;
                var zombieScript = zomObj.getComponent("zombie");
                if(currentData.id > cc.Mgr.Config.zBossLine ||  self.createZombieCount == self.waveZombieCount){
                    zombieScript.init(currentData,1.1, cc.instantiate(self.shadow));
                } else{
                    zombieScript.init(currentData,0.9, cc.instantiate(self.shadow));
                }

                zombieScript.moveToNextPos();

                self.zombieZIndex--;
            });
        }
    },

    //僵尸逃离了
    zombieEscape()
    {
        this._zombieIsEscape = true;
    },


    clearZombiesPool()
    {
        this.zombieList = [];
        for(var key in this.zombieObjs)
        {
            for (let i = 0; i < this.zombieObjs[key].length; i++) {
                this.zombieObjs[key][i].destroy();
            }
            this.zombieObjs[key] = [];
        }
    },

    backToPool:function(obj, id, hp = 0){
        var lhp = hp || 0;
  
        obj.active = false;
        obj.parent = null;
        this.zombieObjs[id.toString()].push(obj);
        let index = this.currentZombieList.indexOf(obj);
        this.currentZombieList.splice(index, 1);
       
        this.backToPoolCount += 1;

        if(this.backToPoolCount == this.waveZombieCount)
        {
            this.scheduleOnce(function(){
                cc.director.GlobalEvent.emit(Event.defense,{"state":!this._zombieIsEscape, zhp:lhp});
                this.backToPoolCount = 0;
            }, 0.6);
        }
    },
});
module.exports = ZombieMgr;
