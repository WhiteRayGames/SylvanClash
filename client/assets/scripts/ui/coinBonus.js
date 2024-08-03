var DataType = require("DataType");
var coinBonus = cc.Class({
    extends: cc.Component,

    properties: {
        numLbl:cc.Label,
        proBar:cc.ProgressBar,
        coinNum:0,
        durTime:0,

        clickTimes:1,
    },

    start(){
        this.clickTimes = 1;
        this.init(true);
        this.limitClick = this.node.getComponent('LimitClick')
    },

    init:function(useOldData = false){
        if(useOldData)
            this.coinNum = cc.Mgr.game.onlineCoinNum;
        else
            this.coinNum = BigInt(0);
        this.numLbl.string = cc.Mgr.Utils.getNumStr2(this.coinNum);
        this.durTime = 0;
        this.proBar.progress = 0;
        this.schedule(this.caculateNum, 0.1);
    },

    caculateNum:function(){
        this.durTime += 1;
        if(this.durTime < 100)
        {
            var money = cc.Mgr.Utils.getNumStr2(this.coinNum);
            this.numLbl.string = money;
            this.proBar.progress = this.durTime / 100;
        }
        else
        {
            let currentLevel = cc.Mgr.game.level > 60 ? 60 : cc.Mgr.game.level;
            var key = currentLevel +"_1";
            var lvdt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.LevelData, key);
            var monsterData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.ZombieData, lvdt.zombieID1);
            let monsterMoney = cc.Mgr.game.level > 60 ? monsterData.money * BigInt(Math.round(Math.pow(2.15, cc.Mgr.game.level % 60))) : monsterData.money;
            var num = monsterMoney / cc.Mgr.Config.onlineCoinRatio;
            var ratio = BigInt(1);

            if(this.clickTimes%3 == 0) ratio = BigInt(6) / BigInt(5);
            if(this.durTime % 100 == 0 && this.durTime != 0) this.coinNum += (num * ratio * BigInt(4) / BigInt(5));
            
            this.durTime = 0;
            cc.Mgr.game.onlineCoinNum = this.coinNum;
            var money = cc.Mgr.Utils.getNumStr2(this.coinNum);
            this.numLbl.string = money;
            this.proBar.progress = 0;
            //this.unschedule(this.caculateNum);
        }
    },

    getCoin:function(){
        if (this.limitClick.clickTime() == false) {
            return
        }
        if(this.coinNum <= 0 || cc.Mgr.game.needGuide)
            return;

        this.unschedule(this.caculateNum);
        this.clickTimes += 1;
        cc.Mgr.game.money += this.coinNum;

        // let data = {}
        // data.elapsed = Date.now()
        // data.value = this.coinNum;
        // data.feature = "collect";
        // data.double = "False";
        // cc.Mgr.analytics.logEvent("earn_coin", JSON.stringify(data));

        cc.Mgr.game.coin_gained_total += this.coinNum;
        cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
        cc.Mgr.UIMgr.showJibEffect();
        this.init(false);
    },
});
module.exports = coinBonus;
