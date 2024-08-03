var MySprite = require("MySprite");
var DataType = require("DataType");
var Event = require("Event");
var AtlasType = require("AtlasType");
var MyEnum = require("MyEnum");
var IntervalTime = 60;
var shopItem = cc.Class({
    extends: cc.Component,

    properties: {
        lvLbl:cc.Label,
        desLbl:cc.Label,
        btnDes:cc.Node,

        iconBgSp:cc.Sprite,
        iconSp:MySprite,

        btn_coin:cc.Node,
        btn_gem:cc.Node,
        btn_ad:cc.Node,

        powerLbl:cc.Label,
        cdLbl:cc.Label,

        unlockNode:cc.Node,
        unlockLbl:cc.Label,

        btnType:"U",

        moneyLabel: cc.Label,
        gemLabel: cc.Label,
        freeLabel: cc.Label,

        spriteCoin2: cc.Sprite,
        spriteCoin: cc.Sprite,
        nomarlM: cc.Material,
        grayM: cc.Material,
        iconBgSpList: [cc.SpriteFrame]
    },

    start(){
        this.freeLabel.string = cc.Mgr.Utils.getTranslation("btn-get");
        this.limitClick = this.node.getComponent('LimitClick');
        this.allowShow = true;

        this.showCount = 0;
    },

    setParent: function (parent) {
        this.Parent = parent
    },

    countTime:function(){
        if(cc.Mgr.Utils.GetSysTime() - cc.Mgr.game.lastAdsGetPlantTime >= IntervalTime)
        {
            this.setContent({lv: this.plantData.level});
            this.unschedule(this.countTime);
        }
    },

    setContent:function(_data){
        let lv = _data.lv;
        let curMaxLv = cc.Mgr.game.plantMaxLv;
        this.lvLbl.string = lv === (cc.Mgr.Config.allPlantCount + 1) ? "??" : lv;
        if (lv !== (cc.Mgr.Config.allPlantCount + 1)) {
            var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, lv.toString());
            this.plantData = null;
            this.plantData = plantData;
            this.powerLbl.string = cc.Mgr.Utils.getNumStr2(plantData.power);
            this.cdLbl.string = plantData.cd;
        } else {
            this.plantData = {level: cc.Mgr.Config.allPlantCount + 1};
        }

        if (lv !== (cc.Mgr.Config.allPlantCount + 1)) {
            this.iconSp.setSprite(AtlasType.PlantHead, plantData.head);
        } else {
            this.iconSp.setSprite(AtlasType.PlantHead, "egg_1");
        }
        
        this.iconBgSp.spriteFrame = this.iconBgSpList[lv % 3];

        if(lv > curMaxLv)
        {
            this.iconSp.node.color = cc.Mgr.Utils.hexToColor("#000000");
            this.powerLbl.string = "?";
            this.cdLbl.string = "?";
        }
        else
        {
            this.iconSp.node.color = cc.Mgr.Utils.hexToColor("#ffffff");
        }

        if (lv !== (cc.Mgr.Config.allPlantCount + 1)) {
            var skilldata = plantData.skill.split('|');
            var ratio = skilldata[1] + "%";
            var skillType = parseInt(skilldata[0]);
            var des = cc.Mgr.Utils.getTranslation("skill_des") + ": ";
    
            switch(skillType){
                case MyEnum.BulletSkillType.Slow:
                    des = des + cc.Mgr.Utils.getTranslation("skillDescs-slowdown",[ratio]);
                break;
                case MyEnum.BulletSkillType.DouKill:
                    des = des +  cc.Mgr.Utils.getTranslation("skillDescs-crit",[ratio]);
                break;
                case MyEnum.BulletSkillType.Vertigo:
                    des = des +  cc.Mgr.Utils.getTranslation("skillDescs-freeze",[ratio]);
                break;
            };
            this.desLbl.string = des;
        } else {
            this.desLbl.string = cc.Mgr.Utils.getTranslation("shopItem-coming-soon");
        }

        var shopSortDt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.ShopData, curMaxLv);
        var cond = "";
        switch(curMaxLv-lv)
        { 
            case 0:
                cond = shopSortDt.MAX;
                break;
            case 1:
                cond = shopSortDt.MAX_1;
                break;
            case 2:
                cond = shopSortDt.MAX_2;
                break;
            case 3:
                cond = shopSortDt.MAX_3;
                break;
            case 4:
                cond = shopSortDt.MAX_4;
                break;
            case 5:
                cond = shopSortDt.MAX_5;
                break;
            case 6:
                cond = shopSortDt.MAX_6;
                break;
            case 7:
                cond = shopSortDt.MAX_7;
                break;
            case 8:
                cond = shopSortDt.MAX_8;
                break;
            default:
                cond = shopSortDt.MAX_8;
                break;
        }
        if(lv > curMaxLv)
            cond = MyEnum.ShopItemType.Lock;

        this.btnType = cond;

        this.setButton(cond, plantData, lv);
        this.updateAdsBtnState();
    },

    caculateMoneyPrice:function(lv, plantData){
        var buyNum = cc.Mgr.game.plantBuyRecord[lv];
        buyNum = buyNum ? buyNum : 0;
        this.price = plantData.price;
        var price =  plantData.price * BigInt(Math.floor(Math.pow(1 + 0.2, buyNum)));
        if(lv >= 1 && lv <= 20)
            price =  plantData.price * BigInt(Math.floor(Math.pow(1 + 0.1, buyNum)));
        this.price = price;
        return price;
    },

    setButton:function(cond, plantData, lv){
        this.btn_coin.active = false;
        this.btn_gem.active = false;
        this.btn_ad.active = false;
        this.unlockNode.active = false;
        this.btnDes.active = true;
        this.unlockLbl.node.active = false;
        switch(cond)
        { 
            case MyEnum.ShopItemType.Lock:
                this.unlockNode.active = true;
                this.unlockLbl.node.active = true;
                if(lv+2<cc.Mgr.Config.allPlantCount)
                {
                    this.unlockLbl.string = (lv+2).toString();
                }
                else
                {
                    if (lv !== cc.Mgr.Config.allPlantCount) {
                        this.unlockLbl.string = cc.Mgr.Config.allPlantCount;
                    } else {
                        this.unlockLbl.string = "??"
                    }
                }

                this.btnDes.active = false;
                break;
            case MyEnum.ShopItemType.Gem:
                this.btn_gem.active = true;
                this.gemLabel.string = plantData.gem;
                break;
            case MyEnum.ShopItemType.Ads:
                if(cc.Mgr.Utils.GetSysTime() - cc.Mgr.game.lastAdsGetPlantTime < IntervalTime && cc.Mgr.UIMgr.paymentUINode.getComponent("PaymentUI").checkAvailabelAds == false)
                {
                    this.btn_coin.active = true;
                    this.btnType = MyEnum.ShopItemType.Money;
                    var money = this.caculateMoneyPrice(lv, plantData);
                    if (cc.Mgr.game.money < money) {
                        this.spriteCoin.setMaterial(0, this.grayM);
                    } else {
                        this.spriteCoin.setMaterial(0, this.nomarlM);
                    }
                    this.moneyLabel.string = cc.Mgr.Utils.getNumStr2(money);
                }
                else
                {
                    this.btnType = MyEnum.ShopItemType.Ads;
                    this.btn_ad.active = true;
                    if (cc.Mgr.UIMgr.paymentUINode.getComponent("PaymentUI").checkAvailabelAds) {
                        this.spriteCoin2.setMaterial(0, this.nomarlM);
                    } else {
                        this.spriteCoin2.setMaterial(0, this.grayM);
                    }
                }
                break;
            case MyEnum.ShopItemType.Money:
                this.btnType = MyEnum.ShopItemType.Money;
                var money = this.caculateMoneyPrice(lv, plantData);
                if (cc.Mgr.game.money < money) {
                    this.spriteCoin.setMaterial(0, this.grayM);
                } else {
                    this.spriteCoin.setMaterial(0, this.nomarlM);
                }
                this.moneyLabel.string = cc.Mgr.Utils.getNumStr2(money);
                this.btn_coin.active = true;
                break;
        }
    },

    btnClick:function(){
        // if (this.limitClick.clickTime() == false) {
        //     return
        // }
        cc.Mgr.AudioMgr.playSFX("click");
        // this.btnType = MyEnum.ShopItemType.Ads; // tempory code
        switch(this.btnType)
        { 
            case MyEnum.ShopItemType.Lock:
                cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("be-lock"),"", cc.Mgr.UIMgr.paymentUINode);
                break;
            case MyEnum.ShopItemType.Gem:
                this.buyPlantByGem();
                break;
            case MyEnum.ShopItemType.Ads:
                this.getPlantByAds();
                break;
            case MyEnum.ShopItemType.Money:
                this.buyPlantByMoney();
                break;
        }

        cc.Mgr.UIMgr.paymentUINode.getComponent("PaymentUI").updateItems();
    },

    buyPlantByGem:function(){
        if(!this.checkCanGrownPlantOrPot())
        {
            return
        }

        if(cc.Mgr.game.gems >= this.plantData.gem)
        {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("buy-success"),"", cc.Mgr.UIMgr.paymentUINode);
            cc.Mgr.flowerPotMgr.addShopFlowerFot(this.plantData.level, 1);
            cc.Mgr.game.gems -= this.plantData.gem;
            cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");

            this.setContent({lv: this.plantData.level});

            cc.director.GlobalEvent.emit(Event.BuyPlantInShop, {});

            let data = {}
            data.elapsed = cc.Mgr.Utils.getDate9(true)
            data.costGems = this.plantData.gem
            data.plantID = this.plantData.level
            cc.Mgr.analytics.logEvent("buy_plant_by_gems", JSON.stringify(data));

            // data = {}
            // data.elapsed = Date.now()
            // data.value = this.plantData.gem;
            // data.feature = "buy_plant_by_gems";
            // cc.Mgr.analytics.logEvent("spend_gem", JSON.stringify(data));
        }
        else
        {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoGems"), "gem", cc.Mgr.UIMgr.paymentUINode);
            // cc.Mgr.game.needShowIAPCount++;
            // if (cc.Mgr.game.needShowIAPCount >= 1) {
            //     cc.Mgr.UIMgr.openPaymentUI(true);
            //     cc.Mgr.game.needShowIAPCount = 0;
            // }
            if (this.allowShow === true) {
                this.allowShow = false;
                setTimeout(() => {
                    cc.Mgr.UIMgr.openPaymentUI(true);
                    this.allowShow = true;
                }, 300);
            }
        }
    },

    buyPlantByMoney:function(){
        if (cc.Mgr.game.money < this.price) {
            this.spriteCoin.setMaterial(0, this.grayM);
        } else {
            this.spriteCoin.setMaterial(0, this.nomarlM);
        }
        if(!this.checkCanGrownPlantOrPot())
        {
            return
        }

        if(cc.Mgr.game.money >= this.price)
        {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("buy-success"),"", cc.Mgr.UIMgr.paymentUINode);
            cc.Mgr.game.plantBuyRecord[this.plantData.level]++;
            cc.Mgr.flowerPotMgr.addShopFlowerFot(this.plantData.level, 1);
            cc.Mgr.game.money -= this.price;
            cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
            this.setContent({lv: this.plantData.level});

            // let data = {}
            // data.elapsed = Date.now()
            // data.value = this.price;
            // data.feature = "buy_plant_shop";
            // cc.Mgr.analytics.logEvent("spend_coin", JSON.stringify(data));
            
            cc.director.GlobalEvent.emit(Event.BuyPlantInShop, {});
        }
        else
        {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoCoins"), "coin", cc.Mgr.UIMgr.paymentUINode);
            if (cc.Mgr.game.plantMaxLv >= cc.Mgr.game.exchangeCoinConfig.openLevel) cc.Mgr.game.needShowExchangeCoinCount++;
            if (cc.Mgr.game.needShowExchangeCoinCount >= 3 && cc.Mgr.game.plantMaxLv >= cc.Mgr.game.exchangeCoinConfig.openLevel) {
                let exchangeGemNum = cc.Mgr.UIMgr.gemNum();
                if (cc.Mgr.game.currentExchangeCount < cc.Mgr.game.exchangeCoinConfig.maxExchangeNum && cc.Mgr.game.gems >= exchangeGemNum) {
                    cc.Mgr.UIMgr.openExchangeCoinUI(true);
                } else {
                    if (cc.Mgr.game.level > 1 && this.showCount >= 3) {
                        // let coinNumber = cc.Mgr.UIMgr.getCoinNumber() * BigInt(30);
                        // coinNumber = coinNumber < BigInt(1000000) ? BigInt(1000000) : coinNumber;
                        // coinNumber = coinNumber * BigInt(2);
                        // cc.Mgr.UIMgr.openCoinBundle(coinNumber, true, true);
                        this.showCount = 0;
                    } else {
                        this.showCount++;
                    }
                }
                
                cc.Mgr.game.needShowExchangeCoinCount = 0;
            }
        }
    },

    onLookPlant () {
        if (this.limitClick.clickTime() == false) {
            return
        }
        if (this.plantData.level > cc.Mgr.game.plantMaxLv) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("be-lock"),"", cc.Mgr.UIMgr.paymentUINode);
            return;
        }
        cc.Mgr.UIMgr.openPlantGetUI("look", this.plantData.level);
    },

    getPlantByAds:function(){
        if (this.limitClick.clickTime() == false) {
            return
        }
        if (cc.Mgr.UIMgr.paymentUINode.getComponent("PaymentUI").checkAvailabelAds === false) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", cc.Mgr.UIMgr.paymentUINode);
            // let data = {};
            // data.elapsed = cc.Mgr.Utils.getDate9(true);
            // data.adsType = "rewarded";
            // data.feature = "buy_plant";
            // cc.Mgr.analytics.logEvent("ad_present_failed", JSON.stringify(data));
            return;
        }
        let self = this;
        cc.Mgr.admob.showRewardedVideoAd((function(_state) {
            if (_state) {
                cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("newItem-title"),"", cc.Mgr.UIMgr.paymentUINode);
                // cc.Mgr.flowerPotMgr.addShopFlowerFot(self.plantData.level, 1);
                cc.Mgr.game.lastAdsGetPlantTime = cc.Mgr.Utils.GetSysTime();
                self.schedule(self.countTime , 1);
    
                cc.Mgr.UIMgr.closeShop();
                self.setContent({lv: self.plantData.level});
                cc.Mgr.UIMgr.openPlantGetUI("get", self.plantData.level);
            } else {
                // let data = {};
                // data.elapsed = cc.Mgr.Utils.getDate9(true);
                // data.adsType = "rewarded";
                // data.feature = "buy_plant";
                // cc.Mgr.analytics.logEvent("ad_present_failed", JSON.stringify(data));
            }
            
        }), cc.Mgr.UIMgr.paymentUINode, "shop", this);
    },

    updateAdsBtnState () {
        cc.Mgr.UIMgr.paymentUINode.getComponent("PaymentUI").checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        if (cc.Mgr.UIMgr.paymentUINode.getComponent("PaymentUI").checkAvailabelAds && this.unlockNode.active == false) {
            this.spriteCoin2.setMaterial(0, this.nomarlM);
            this.btn_ad.active = true;
        } else {
            this.spriteCoin2.setMaterial(0, this.grayM);
            this.btn_ad.active = false;
        }
    },

    checkCanGrownPlantOrPot:function(){
        if(!cc.Mgr.plantMgr.checkHasAnySpaceGird())
        {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoSpaceForPlant"),"", cc.Mgr.UIMgr.paymentUINode);
            return false;
        }
        return true;
    },
});
module.exports = shopItem;
