var DataType = require("DataType");
var MyEnum = require("MyEnum");
var exchangeCoinUI = cc.Class({
    extends: cc.Component,

    properties: {
      
        coinLabel:cc.Label,
        lastNunDis:cc.Label,
        getBtnNode:cc.Node,
        gemLabel:cc.Label,
        maxNode:cc.Node,
        titleLabel: cc.Label,
        desLabel: cc.Label,
        maxCountLabel: cc.Label,

        content: cc.Node,
        blurBg: cc.Node,

        bottomNode: cc.Node,
        bottomCoinsLabel: cc.Label,
        bottomDesc: cc.Label,
        bottomBtnLabel: cc.Label
    },

    onLoad()
    {
        this.titleLabel.string = cc.Mgr.Utils.getTranslation("coinExchange-title");
        this.desLabel.string = cc.Mgr.Utils.getTranslation("coinExchange-des");
        this.maxCountLabel.string = cc.Mgr.Utils.getTranslation("coinExchange-max");

        this.limitClick = this.node.getComponent('LimitClick');

        this.allowShow = true;
    },

    coinNum()
    {
        var beishu = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 20];
        var shopSortDt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.ShopData, cc.Mgr.game.plantMaxLv);
        var index = 0;
        var plantIds={};
        var index = 0;
        var i = 0;
        for(var key in shopSortDt) {
            var dt = shopSortDt[key];
            if(dt == MyEnum.ShopItemType.Money)
            {
                plantIds[i] = cc.Mgr.game.plantMaxLv - index + 1;
                i++
            }
            index++;
        }

        var buyNum = cc.Mgr.game.plantBuyRecord[plantIds[0]];
        var price1 = cc.Mgr.game.caculatePlantPrice(plantIds[0], buyNum);

        var buyNum = cc.Mgr.game.plantBuyRecord[plantIds[1]];
        var price2 = cc.Mgr.game.caculatePlantPrice(plantIds[1], buyNum);

        let plantData1 = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData,plantIds[0]);
        let plantData2 = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData,plantIds[1]);

        let currentGems = 30;
        if (plantData1.gem > 0 && plantData2.gem > 0) {
            currentGems = plantData1.gem + plantData2.gem
        }

        var price = 0;
        price = (price1 + price2) / BigInt(currentGems); 

        return price * BigInt(beishu[cc.Mgr.game.currentExchangeCount]);
    },

    showUI:function(){
       
        // cc.Mgr.game.exchangeCoinWinIsopened = true;
    
        this.refreshUI();

        cc.Mgr.admob.showBanner("exchangeCoin");

        this.blurBg.opacity = 0
        this.content.opacity = 0;
        this.content.setScale(.5)
        cc.tween(this.blurBg).to(0.05, {opacity:255}).call().start();
        cc.tween(this.content).to(0.15, {opacity:255, scale: 1}).start();

        this.showPaymentCount = 0;

        this.bottomDesc.string = cc.Mgr.Utils.getTranslation("buy-coins-desc");
        this.bottomBtnLabel.string = cc.Mgr.payment.priceList[11];

        let coinNumber = cc.Mgr.UIMgr.getCoinNumber() * BigInt(30);
        coinNumber = coinNumber < BigInt(1000000) ? BigInt(1000000) : coinNumber;
        this.getCoin = coinNumber = coinNumber * BigInt(2);
        let coinString = cc.Mgr.Utils.getNumStr2(coinNumber);
        this.bottomCoinsLabel.string = coinString;
        this.bottomDesc.string = cc.Mgr.Utils.getTranslation("buy-coins-desc", [coinString]);

        this.bottomNode.active = true;
    },

    onClickGet () {
        if (this.limitClick.clickTime() == false) {
            return
        }

        let currentProductID = this.isSale ? 11 : 7;
        currentProductID = 11;

        cc.Mgr.payment.purchaseByIndex(currentProductID, () => {
            cc.Mgr.UIMgr.openAssetGetUI("money", this.getCoin, "payment");
            this.closeUI();

        }, cc.Mgr.UIMgr.tipRoot);
    },

    refreshUI()
    {
        this.node.active = true;

        this.exchangeCoinNum = this.coinNum();
        this.exchangeGemNum = cc.Mgr.UIMgr.gemNum();
        this.coinLabel.string = "x" + cc.Mgr.Utils.getNumStr2(this.exchangeCoinNum);
        this.gemLabel.string = this.exchangeGemNum;
        var last = "{0} / {1}";
        var dis = last.format(cc.Mgr.game.exchangeCoinConfig.maxExchangeNum -
            cc.Mgr.game.currentExchangeCount,
             cc.Mgr.game.exchangeCoinConfig.maxExchangeNum);
        this.lastNunDis.string = dis;

        if(cc.Mgr.game.exchangeCoinConfig.maxExchangeNum == cc.Mgr.game.currentExchangeCount)
        {
            this.maxNode.active = true;
            this.getBtnNode.active = false;
        }
        else
        {
            this.maxNode.active = false;
            this.getBtnNode.active = true;
        }
    },


    closeUI:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("exchangeCoin");
        let self = this
        cc.tween(this.blurBg).to(0.15, {opacity:0}).start();
        cc.tween(this.content).to(0.15, {opacity:0, scale: .5}).call(() => {
            self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("exchange");
    },


    exchangeButtonOnclick()
    {
        // if (this.limitClick.clickTime() == false) {
        //     return
        // }
        if(cc.Mgr.game.currentExchangeCount >= cc.Mgr.game.exchangeCoinConfig.maxExchangeNum)
        {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("max-exchange"), "", this.node);
            return;
        }

        if(this.exchangeGemNum > cc.Mgr.game.gems)
        {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoGems"), "gem", this.node);
            if (this.allowShow === true) {
                this.allowShow = false;
                setTimeout(() => {
                    cc.Mgr.UIMgr.openPaymentUI(true);
                    this.allowShow = true;
                }, 300);
            }
            return;
        }
        
        cc.Mgr.game.gems -= this.exchangeGemNum;
        cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");
        // cc.Mgr.game.money += this.exchangeCoinNum;

        // let data = {}
        // data.elapsed = Date.now()
        // data.value = this.exchangeCoinNum;
        // data.feature = "exchange";
        // data.double = "False";
        // cc.Mgr.analytics.logEvent("earn_coin", JSON.stringify(data));

        // data = {}
        // data.elapsed = Date.now()
        // data.value = this.exchangeGemNum;
        // data.feature = "exchange";
        // cc.Mgr.analytics.logEvent("spend_gem", JSON.stringify(data));

        // cc.Mgr.game.coin_gained_total += this.exchangeCoinNum;
        // cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
        cc.Mgr.game.currentExchangeCount++;
        // cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("exchangeSuccess").format(cc.Mgr.Utils.getNumStr(this.exchangeCoinNum)), "coin", this.node);
        cc.Mgr.UIMgr.openAssetGetUI("money", this.exchangeCoinNum, "exchange");
        this.refreshUI();
    },
});
module.exports = exchangeCoinUI;
