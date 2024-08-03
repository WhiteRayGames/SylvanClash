var MyEnum = require("MyEnum");
var Event = require("Event");
var DataType = require("DataType");
var lockGird = cc.Class({
    extends: cc.Component,

    properties: {
        
        price:cc.Label,
    },

    onLoad () {
        this.limitClick = this.node.getComponent('LimitClick')
    },

    init(index,money,pos)
    {
        // var self = this;
        this.index = index;
        this.level = money;
        this.money = BigInt(money);
        // this.node.zIndex = 0;

        this.price.string = cc.Mgr.Utils.getNumStr2(this.money);
        this.node.position = pos;
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {

            this.TouchStart(event);
        }, this);
    },

    setPlantInfo(level)
    {
        this.plantLevel = level;
    },

    setShowDetailsInUI:function(scale, color , isBig = true){
        this.node.getChildByName("shadow").active = false;
        this.dragon.node.color = cc.Mgr.Utils.hexToColor(color);
        if(isBig)
            this.dragon.playAnimation("DaiJi", -1);
        this.node.scale = scale;
    },

    TouchStart(event) {
        if (this.limitClick.clickTime() == false) {
            return
        }
        if (cc.Mgr.game.needGuide) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", cc.Mgr.UIMgr.uiRoot);
            return;
        }
        if(cc.Mgr.game.money >=  this.money)
        {
            var param = {};
            param.index = this.index;

            cc.Mgr.game.money -= this.money;
            cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
            cc.director.GlobalEvent.emit(Event.unlockGird,param);

            if (cc.Mgr.game.unlockGridFirst == false && cc.Mgr.plantMgr.hasLockGrid()) {
                // cc.Mgr.UIMgr.openUnlockAllBundle();
                cc.Mgr.game.unlockGridFirst = true;
            }

            // let data = {}
            // data.elapsed = Date.now()
            // data.value = this.money;
            // data.feature = "unlock_grid";
            // cc.Mgr.analytics.logEvent("spend_coin", JSON.stringify(data));
        }
        else
        {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoCoins"), "coin", cc.Mgr.UIMgr.uiRoot);
            if (cc.Mgr.game.plantMaxLv >= cc.Mgr.game.exchangeCoinConfig.openLevel) cc.Mgr.game.needShowExchangeCoinCount++;
            if (cc.Mgr.game.needShowExchangeCoinCount >= 3 && cc.Mgr.game.plantMaxLv >= cc.Mgr.game.exchangeCoinConfig.openLevel) {
                let exchangeGemNum = cc.Mgr.UIMgr.gemNum();
                if (cc.Mgr.game.currentExchangeCount < cc.Mgr.game.exchangeCoinConfig.maxExchangeNum && cc.Mgr.game.gems >= exchangeGemNum) {
                    cc.Mgr.UIMgr.openExchangeCoinUI(true);
                } else if (cc.Mgr.game.coinBundleFlag){
                    // let coinNumber = cc.Mgr.UIMgr.getCoinNumber() * BigInt(30);
                    // coinNumber = coinNumber < BigInt(1000000) ? BigInt(1000000) : coinNumber;
                    // coinNumber = coinNumber * BigInt(2);
                    // cc.Mgr.UIMgr.openCoinBundle(coinNumber, true);
                }
                
                cc.Mgr.game.needShowExchangeCoinCount = 0;
            }
        }
    },


    plantDestroy()
    {
        this.node.destroy();
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

});
module.exports = lockGird;
