var EffectType = require("EffectType");
var EffectMgr = cc.Class({
    extends: cc.Component,

    properties: {
        obCoinPre:cc.Prefab,
        obCrickPre:cc.Prefab,
        obVertigoPre:cc.Prefab,
        obDieSmokePre:cc.Prefab,

        mergePre:cc.Prefab,
        flowerOpenPre:cc.Prefab,

        tipMoveAttackPre:cc.Prefab,
    },
 
    InitPool:function () {
        var self = this;
        this.coinFlyPool = new cc.NodePool();
        cc.loader.loadRes("prefab/effect/coinFly", function (errmsg, prefab) {
            if (errmsg) {
                cc.error(errmsg.message || errmsg);
                return;
            }
            self.obCoinPre = prefab;
            let initCount = 8; //初始化个数
            for (let i = 0; i < initCount; i++) {
                let Obj = cc.instantiate(prefab);
                self.coinFlyPool.put(Obj);
            }
        });

        this.crickPool = new cc.NodePool();
        cc.loader.loadRes("prefab/effect/crick", function (errmsg, prefab) {
            if (errmsg) {
                cc.error(errmsg.message || errmsg);
                return;
            }
            self.obCrickPre = prefab;
            let initCount = 12; //初始化个数
            for (let i = 0; i < initCount; i++) {
                let Obj = cc.instantiate(prefab);
                self.crickPool.put(Obj);
            }
        });
        /*
        this.vertigoPool = new cc.NodePool();
        cc.loader.loadRes("prefab/effect/vertigo", function (errmsg, prefab) {
            if (errmsg) {
                cc.error(errmsg.message || errmsg);
                return;
            }
            self.obVertigoPre = prefab;
            let initCount = 12; //初始化个数
            for (let i = 0; i < initCount; i++) {
                let Obj = cc.instantiate(prefab);
                self.vertigoPool.put(Obj);
            }
        });
        */

        this.dieSmokePool = new cc.NodePool();
        cc.loader.loadRes("prefab/effect/dieSmoke", function (errmsg, prefab) {
            if (errmsg) {
                cc.error(errmsg.message || errmsg);
                return;
            }
            self.obDieSmokePre = prefab;
            let initCount = 8; //初始化个数
            for (let i = 0; i < initCount; i++) {
                let Obj = cc.instantiate(prefab);
                self.dieSmokePool.put(Obj);
            }
        });

        this.mergeEffectPool = new cc.NodePool();
        cc.loader.loadRes("prefab/effect/merge", function (errmsg, prefab) {
            if (errmsg) {
                cc.error(errmsg.message || errmsg);
                return;
            }
            self.mergePre = prefab;
            let initCount = 3; //初始化个数
            for (let i = 0; i < initCount; i++) {
                let Obj = cc.instantiate(prefab);
                self.mergeEffectPool.put(Obj);
            }
        });

        this.flowerOpenPool = new cc.NodePool();
        cc.loader.loadRes("prefab/effect/FlowerOpen", function (errmsg, prefab) {
            if (errmsg) {
                cc.error(errmsg.message || errmsg);
                return;
            }
            self.flowerOpenPre = prefab;
            let initCount = 3; //初始化个数
            for (let i = 0; i < initCount; i++) {
                let Obj = cc.instantiate(prefab);
                self.flowerOpenPool.put(Obj);
            }
        });

        this.tipMoveAttackPool = new cc.NodePool();
        cc.loader.loadRes("prefab/effect/tipMoveAttack", function (errmsg, prefab) {
            if (errmsg) {
                cc.error(errmsg.message || errmsg);
                return;
            }
            self.tipMoveAttackPre = prefab;
            let initCount = 1; //初始化个数
            for (let i = 0; i < initCount; i++) {
                let Obj = cc.instantiate(prefab);
                self.tipMoveAttackPool.put(Obj);
            }
        });
    },

    clearList:function(){
        this.coinFlyPool.clear();
        this.crickPool.clear();
        this.dieSmokePool.clear();
        //this.vertigoPool.clear();

        this.mergeEffectPool.clear();
        this.flowerOpenPool.clear();

        this.tipMoveAttackPool.clear();
    },

    getObFromPool:function(objType){
        let obj = null;
        if(objType == EffectType.CoinFly)
        {
            if (this.coinFlyPool.size() > 0)
            {
                obj = this.coinFlyPool.get();
                obj.active = true;
            } 
            else //不够再实例化新的
            { 
                obj = cc.instantiate(this.obCoinPre);
            }
        }
        else if(objType == EffectType.Crick)
        {
            if (this.crickPool.size() > 0)
            {
                obj = this.crickPool.get();
                obj.active = true;
            } 
            else //不够再实例化新的
            { 
                obj = cc.instantiate(this.obCrickPre);
            }
        }
        else if(objType == EffectType.DieSmoke)
        {
            if (this.dieSmokePool.size() > 0)
            {
                obj = this.dieSmokePool.get();
                obj.active = true;
            } 
            else //不够再实例化新的
            { 
                obj = cc.instantiate(this.obDieSmokePre);
            }
        }
        else if(objType == EffectType.Merge)
        {
            if (this.mergeEffectPool.size() > 0)
            {
                obj = this.mergeEffectPool.get();
                obj.active = true;
            } 
            else //不够再实例化新的
            { 
                obj = cc.instantiate(this.mergePre);
            }
        }
        /*
        else if(objType == EffectType.Vertigo)
        {
            if (this.vertigoPool.size() > 0)
            {
                obj = this.vertigoPool.get();
                obj.active = true;
            } 
            else //不够再实例化新的
            { 
                obj = cc.instantiate(this.obVertigoPre);
            }
        }
        */
        else if(objType == EffectType.flowerPotOpen)
        {
           if (this.flowerOpenPool.size() > 0)
           {
               obj = this.flowerOpenPool.get();
               obj.active = true;
           } 
           else //不够再实例化新的
           { 
               obj = cc.instantiate(this.flowerOpenPre);
           }
        }
        else if(objType == EffectType.TipMoveAttack)
        {
           if (this.tipMoveAttackPool.size() > 0)
           {
               obj = this.tipMoveAttackPool.get();
               obj.active = true;
           } 
           else //不够再实例化新的
           { 
               obj = cc.instantiate(this.tipMoveAttackPre);
           }
        }
        return obj;
    },

    ObBackToPool:function(obj, objType){
        //obj.active = false;
        if(objType == EffectType.CoinFly)
            this.coinFlyPool.put(obj);
        else if(objType == EffectType.Crick)
            this.crickPool.put(obj);
       else if(objType == EffectType.Vertigo)
            cc.log("");
            //this.vertigoPool.put(obj);
        else if(objType == EffectType.DieSmoke)
            this.dieSmokePool.put(obj);
        else if(objType == EffectType.Merge)
            this.mergeEffectPool.put(obj);
        else if(objType == EffectType.flowerPotOpen)
            this.flowerOpenPool.put(obj);
        else if(objType == EffectType.TipMoveAttack)
            this.tipMoveAttackPool.put(obj);
    },
});
module.exports = EffectMgr;
