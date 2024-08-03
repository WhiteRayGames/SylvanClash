var DataType = require("DataType");
var MyEnum = require("MyEnum");
var Event = require("Event");
var scaleConfig = 1.3;
var tweenTime = 0.25;
var plantName = require("DB_plantName")

var plantGetUI = cc.Class({
    extends: cc.Component,

    properties: {
        titleLbl:cc.Label,
        lvLbl:cc.Label,
        powerLbl:cc.Label,
        cdLbl:cc.Label,

        dragonParentA:cc.Node,

        dragonParentB:cc.Node,

        dragonParentC:cc.Node,

        nextLvNode:cc.Label,
        previousLvNode: cc.Label,
        coinLbl:cc.Label,
        gemLbl:cc.Label,

        coinNumEffect: cc.Node,
        gemNumEffect: cc.Node,

        doubleGetBtn:cc.Node,
        getBtn: cc.Node,
        adsBtn: cc.Node,
        adsLabel: cc.Label,

        coinNode:cc.Node,
        gemNode:cc.Node,
        powerNode:cc.Node,
        cdNode:cc.Node,

        titleNode:cc.Node,

        toggle: cc.Toggle,

        btnLabel: cc.Label,
        checkboxLabel: cc.Label,

        content: cc.Node,
        blurBg: cc.Node,

        checkboxNode: cc.Node,
        vipNode: cc.Node,

        nameLabel: cc.Label,

        okBtnLabel: cc.Label,
        vipTip: cc.Label,

        coinGemNode: cc.Node,

        noThanks: cc.Node,
        noThanksLabel: cc.Label,

        getPlantCountLabel: cc.Label
    },

    doTween:function(rtype){
        this.titleNode.opacity = 0;
        this.titleNode.scale = 1;
        this.dragonParentA.opacity = 0;
        this.dragonParentB.opacity = 0;
        this.dragonParentC.opacity = 0;
        this.coinGemNode.opacity = 0;

        this.lvLbl.node.opacity = 0;
        this.nextLvNode.node.opacity = 0;

        this.cdNode.opacity = 0;
        this.powerNode.opacity = 0;

        if(rtype == "get")
        {
            cc.tween(this.titleNode).to(tweenTime, {opacity:255, scale: scaleConfig}).to(0.1, {scale:1.0}).call(()=>{
                cc.tween(this.dragonParentA).to(tweenTime, {opacity:255, scale: 1.0}).call(()=>{
                    cc.tween(this.cdNode).to(tweenTime, {opacity:255}).start();
                    cc.tween(this.powerNode).to(tweenTime, {opacity:255}).call(()=>{
                        cc.tween(this.lvLbl.node).to(tweenTime, {opacity:255}).start();
                    }).start();
                }).start(); 
            }).call(()=>{
                if(cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide3)
                {
                    cc.director.GlobalEvent.emit(Event.showSingleGuide,{"step":MyEnum.GuideType.guide4});
                }
            }).start();
        }
        else
        {
            cc.tween(this.titleNode).to(tweenTime, {opacity:255, scale: scaleConfig}).to(0.1, {scale:1.0}).call(()=>{
                cc.tween(this.dragonParentA).to(tweenTime, {opacity:255, scale: 1.0}).start();
                cc.tween(this.dragonParentC).to(tweenTime, {opacity:255, scale: 1.0}).start();
                cc.tween(this.dragonParentB).to(tweenTime, {opacity:255, scale: 1.0}).call(()=>{
                    cc.tween(this.coinGemNode).to(tweenTime, {opacity:255}).call(()=>{
                        cc.tween(this.lvLbl.node).to(tweenTime, {opacity:255}).start();
                        cc.tween(this.nextLvNode.node).to(tweenTime, {opacity:255}).start();
                    }).start();
                }).start();
            }).call(()=>{
                if(cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide3)
                {
                    cc.director.GlobalEvent.emit(Event.showSingleGuide,{"step":MyEnum.GuideType.guide4});
                }

            }).start();
        }
    },

    start(){
        cc.Mgr.UIMgr.plantGetUI = this;

        this.showCount = 0;

        this.nextLvNode.string = cc.Mgr.Utils.getTranslation("getPlant-nextLevel");
        this.previousLvNode.string = cc.Mgr.Utils.getTranslation("getPlant-previousLevel");
        this.btnLabel.string = cc.Mgr.Utils.getTranslation("btn-claim");
        this.checkboxLabel.string = cc.Mgr.Utils.getTranslation("getReward-checkbox-treble");
        this.vipTip.string = cc.Mgr.Utils.getTranslation("vip-treble-tip");
        this.adsLabel.string = cc.Mgr.Utils.getTranslation("btn-treble");
        this.noThanksLabel.string = cc.Mgr.Utils.getTranslation("btn-no-thanks");

        this.limitClick = this.node.getComponent('LimitClick')
    },

    // from 有 get unlock
    showUI:function(from, lv, isDrone = false){
        if (from === "unlock") {
            cc.Mgr.game.needShowInterstitial = lv >= 6;
            cc.Mgr.game.needShowBanner = lv >= 6;
            cc.Mgr.Utils.reportScore(lv);

            cc.Mgr.inviteManager.sendInvitations("get new plant - auto");
        }
        this.node.width = cc.Mgr.Config.winSize.width;
        this.node.height = cc.Mgr.Config.winSize.height;
        this.plantNodeA = null;
        this.plantNodeB = null;
        this.plantNodeC = null;
        this.getCoin = 0;
        this.getGems = 0;

        this.nextLvNode.node.active = false;
        this.previousLvNode.node.active = false;
        this.powerNode.active = false;
        this.cdNode.active = false;
        this.coinNode.active = false;
        this.gemNode.active = false;

        this.doubleGetBtn.active = false;
        this.getBtn.active = false;
        this.adsBtn.active = false;
        this.checkboxNode.active = false;
        this.getPlantCountLabel.node.active = false;

        this.checkboxNode.opacity = 255;

        this.vipNode.active = false;

        var self = this;
    
        this.plantLevel = lv;
        var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, lv);
        this.nameLabel.string = plantName.data[lv - 1][cc.Mgr.Config.language];
        this.nameLabel.node.setScale(0);
        cc.tween(this.nameLabel.node).to(1, {scale: 1}, {easing: "elasticInOut"}).start();
        this.lvLbl.string = cc.Mgr.Utils.getTranslation("plant-level") + " - " +lv;
        this.fromType = from;

        let currentRewardedAvailable = cc.Mgr.admob.checkAvailableRewardedAd();

        this.noThanks.opacity = 0;
        this.noThanks.active = false;

        if (this.showBtnCounter) {
            clearTimeout(this.showBtnCounter);
        }

        if(from == "get" || from == "look")
        {
            this.okBtnLabel.string = from == "get" ? cc.Mgr.Utils.getTranslation("btn-claim") : cc.Mgr.Utils.getTranslation("btn-ok");

            this.getPlantCount = 1;

            if (from == "get") {
                this.titleLbl.string = cc.Mgr.Utils.getTranslation("congratulation-get");
            } else {
                this.titleLbl.string = cc.Mgr.Utils.getTranslation("plantDetail-title");
            }
            
            this.powerNode.active = false;
            this.cdNode.active = false;
            this.powerLbl.string = cc.Mgr.Utils.getNumStr2(plantData.power);
            this.cdLbl.string = plantData.cd;

            if (from === "get") {
                this.getPlantCountLabel.node.active = true;
                this.doubleGetBtn.active = false;
                this.adsBtn.active = false;
                this.getBtn.active = false;
    
                if (!cc.Mgr.game.needGuide) {
                    this.checkboxNode.active = currentRewardedAvailable;
                    this.doubleGetBtn.active = false;
                    this.adsBtn.active = false;
                    if (this.checkboxNode.active && this.toggle.isChecked) {
                        this.adsBtn.active = true;
                    } else {
                        this.doubleGetBtn.active = true;
                    }

                    if (this.toggle.isChecked && currentRewardedAvailable) {
                        this.getPlantCountLabel.string = "x3";
                    } else {
                        this.getPlantCountLabel.string = "x1";
                    }

                    let checkState
                    if (cc.Mgr.game.isPayingUser) {
                        checkState = cc.Mgr.game.isManualSetting_payingUser == undefined ? cc.Mgr.game.checkDoubleReward : cc.Mgr.game.isManualSetting_payingUser;
                        if (this.toggle.isChecked != checkState)this.toggle.isChecked = checkState;
                    } else {
                        checkState = cc.Mgr.game.isManualSetting == undefined ? cc.Mgr.game.checkDoubleReward : cc.Mgr.game.isManualSetting;
                        if (this.toggle.isChecked != checkState)this.toggle.isChecked = checkState;
                    }
                    this.adsBtn.y = -405;
                } else {
                    this.getBtn.active = true;
                    this.noThanks.opacity = 0;
                    this.noThanks.active = false;
                }
            } else {
                this.getBtn.active = true;
                this.noThanks.opacity = 0;
                this.noThanks.active = false;
            }

            if(!isDrone)
            {
                cc.loader.loadRes("prefab/plant/" + plantData.prefab, function (errmsg, prefab) {
                    if (errmsg) {
                        cc.error(errmsg.message || errmsg);
                        return;
                    }
                    self.plantNodeA = cc.instantiate(prefab);
                    self.plantNodeA.parent = self.dragonParentA;
                    self.plantNodeA.group = MyEnum.NodeGroup.UI;
                    self.plantNodeA.position = cc.v2(0,0);
                    self.plantNodeA.active = true;
                    var scp = self.plantNodeA.getComponent("plant");
                    scp.setShowDetailsInUI(1.5, "#ffffff", true);
                });
            }
            else
            {
                this.powerNode.active = false;
                this.cdNode.active = false;
                cc.loader.loadRes("prefab/flowerPot/" + "HuaPen_v3", function (errmsg, prefab) {
                    if (errmsg) {
                        cc.error(errmsg.message || errmsg);
                        return;
                    }
                    self.plantNodeA = cc.instantiate(prefab);
                    self.plantNodeA.parent = self.dragonParentA;
                    self.plantNodeA.group = MyEnum.NodeGroup.UI;
                    self.plantNodeA.position = cc.v2(0,0);
                    self.plantNodeA.getComponent(cc.BoxCollider).enabled = false;
                    self.plantNodeA.active = true;
                    var scp = self.plantNodeA.getComponent("flowerPot");
                    scp.setShowDetailsInUI(1.5, "#ffffff", true);
                });
            }
        }
        else if(from == "unlock")
        {
            this.titleLbl.string = cc.Mgr.Utils.getTranslation("newPlant-title");

            this.checkboxNode.active = !cc.Mgr.game.needGuide;
            this.nextLvNode.node.active = true;
            this.previousLvNode.node.active = true;
            this.coinNode.active = true;
            var choose = (lv - 2) > 0 ? (lv - 2) : 1;
            var cData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, choose);
            var buyNum = cc.Mgr.game.plantBuyRecord[choose];
            buyNum = buyNum ? buyNum : 0;
            var price =  cData.price * BigInt(Math.round(Math.pow(1 + 0.2, buyNum) * 100)) / BigInt(100);
            if(choose == 1)
                price =  cData.price * BigInt(Math.round(Math.pow(1 + 0.1, buyNum) * 100)) / BigInt(100);
            
            // this.coinLbl.string = cc.Mgr.Utils.getNumStr(price);
            price = price * BigInt(64) / BigInt(100);
            this.price = price
            if (this.toggle.isChecked && currentRewardedAvailable) {
                let currentNum = price * BigInt(3)
                this.coinNumEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(currentNum), true)
            } else {
                this.coinNumEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(price), true);
            }

            var dd = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.LevelGemData, lv);
            if(dd != null)
            {
                // this.gemLbl.string = "x"+dd.gem;
                this.gems = dd.gem;
                this.gems = Math.ceil(this.gems * 4 / 5);
                if (this.toggle.isChecked && currentRewardedAvailable) {
                    let currentNum = this.gems * 3;
                    this.gemNumEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(currentNum), true)
                } else {
                    this.gemNumEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(this.gems), true)
                }
                
                this.gemNode.active = true;
                this.getGems = this.gems;
            }


            this.getCoin = price;

            cc.loader.loadRes("prefab/plant/" + plantData.prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.plantNodeA = cc.instantiate(prefab);
                self.plantNodeA.parent = self.dragonParentA;
                self.plantNodeA.group = MyEnum.NodeGroup.UI;
                self.plantNodeA.position = cc.v2(0,0);
                
                self.plantNodeA.scale = 1;

                self.plantNodeA.active = true;
                var scp = self.plantNodeA.getComponent("plant");
                scp.setShowDetailsInUI(1.5, "#ffffff", true);
            });

            let previousPlant = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, (lv - 1));
            cc.loader.loadRes("prefab/plant/" + previousPlant.prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }

                self.plantNodeC = cc.instantiate(prefab);
                self.plantNodeC.parent = self.dragonParentC;
                self.plantNodeC.position = cc.v2(0,0);

                self.plantNodeC.scale = 0.85;

                self.plantNodeC.group = MyEnum.NodeGroup.UI;
                self.plantNodeC.active = true;
                var scp = self.plantNodeC.getComponent("plant");
                scp.setShowDetailsInUI(1, "#ffffff", true);
            });

            if(lv+1 <= cc.Mgr.Config.allPlantCount)
            {
                var nextPlant = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, (lv+1));
                cc.loader.loadRes("prefab/plant/" + nextPlant.prefab, function (errmsg, prefab) {
                    if (errmsg) {
                        cc.error(errmsg.message || errmsg);
                        return;
                    }

                    self.plantNodeB = cc.instantiate(prefab);
                    self.plantNodeB.parent = self.dragonParentB;
                    self.plantNodeB.position = cc.v2(0,0);

                    self.plantNodeB.scale = 0.85;

                    self.plantNodeB.group = MyEnum.NodeGroup.UI;
                    self.plantNodeB.active = true;
                    var scp = self.plantNodeB.getComponent("plant");
                    scp.setShowDetailsInUI(1, "#000000", true);
                });
            }
    
            // vip tempory code
            // if (!cc.Mgr.game.needGuide) this.checkboxNode.active = !cc.Mgr.game.isVIP;
            // if (!cc.Mgr.game.needGuide) this.vipNode.active = cc.Mgr.game.isVIP;
            if (!cc.Mgr.game.needGuide) this.checkboxNode.active = true;
            if (!cc.Mgr.game.needGuide) this.vipNode.active = false;

            if (currentRewardedAvailable === false) this.checkboxNode.active = false;

            this.doubleGetBtn.active = false;
            this.adsBtn.active = false;
            if (this.checkboxNode.active && this.toggle.isChecked) {
                this.adsBtn.active = true;
            } else {
                this.doubleGetBtn.active = true;
            }

            let checkState
            if (cc.Mgr.game.isPayingUser) {
                checkState = cc.Mgr.game.isManualSetting_payingUser == undefined ? cc.Mgr.game.checkDoubleReward : cc.Mgr.game.isManualSetting_payingUser;
                if (this.toggle.isChecked != checkState)this.toggle.isChecked = checkState;
            } else {
                checkState = cc.Mgr.game.isManualSetting == undefined ? cc.Mgr.game.checkDoubleReward : cc.Mgr.game.isManualSetting;
                if (this.toggle.isChecked != checkState)this.toggle.isChecked = checkState;
            }

            this.adsBtn.y = -405;
        }

        this.isDouble = false;

        this.doTween(from);

        this.blurBg.opacity = 0
        this.content.opacity = 0;
        this.content.setScale(.5)
        cc.tween(this.blurBg).to(0.05, {opacity:255}).call().start();
        cc.tween(this.content).to(0.15, {opacity:255, scale: 1}).start();

        // cc.Mgr.admob.showBanner();
    },

    updateReward () {
        if (cc.Mgr.game.needGuide) return;
        // vip tempory code
        // let num = (this.toggle.isChecked === true || cc.Mgr.game.isVIP) ? this.price * 2 : this.price;
        if (this.fromType === "unlock") {
            let num = (this.toggle.isChecked === true && this.checkboxNode.active) ? this.price * BigInt(3) : this.price;
            this.coinNumEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(num))
    
            num = (this.toggle.isChecked === true && this.checkboxNode.active) ? this.gems * 3 : this.gems;
            this.gemNumEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(num))
        } else if (this.fromType === "get") {
            if (this.toggle.isChecked && this.checkboxNode.active) {
                this.getPlantCountLabel.string = "x3";
            } else {
                this.getPlantCountLabel.string = "x1";
            }
        }

        cc.Mgr.game.isManualSetting = cc.Mgr.game.isManualSetting_payingUser = this.toggle.isChecked;

        // let data = {}
        // data.elapsed = cc.Mgr.Utils.getDate9(true)
        // data.action = (this.toggle.isChecked === true && this.checkboxNode.active) ? "check" : "uncheck"
        // data.feature = this.fromType
        // cc.Mgr.analytics.logEvent("checkbox", JSON.stringify(data));

        this.doubleGetBtn.active = false;
        this.adsBtn.active = false;
        if (this.checkboxNode.active && this.toggle.isChecked) {
            this.adsBtn.active = true;
        } else {
            this.doubleGetBtn.active = true;
        }
    },

    adsDoubleGet:function(){
        if (this.limitClick.clickTime() == false) {
            return
        }
        var self = this;
        // vip tempory code
        // if (cc.Mgr.game.isVIP) {
        //     self.getCoin = self.getCoin * 2;
        //     self.getGems = self.getGems * 2;
        //     self.closeUI();
        // } else if (this.toggle.isChecked === true && cc.Mgr.game.needGuide === false) {
        //     cc.Mgr.admob.showRewardedVideoAd((function() {
        //         self.getCoin = self.getCoin * 2;
        //         self.getGems = self.getGems * 2;
        //         self.closeUI();
        //     }), this.node, this.fromType);
        // } else {
        //     self.closeUI();
        // }
        cc.Mgr.admob.showRewardedVideoAd((function(_state) {
            if (_state) {
                if (self.fromType === "get") {
                    self.getPlantCount = 3;
                } else {
                    self.getCoin = self.getCoin * BigInt(3);
                    self.getGems = self.getGems * 3;
                }
                self.isDouble = true;
            } else {
                // let data = {};
                // data.elapsed = cc.Mgr.Utils.getDate9(true);
                // data.adsType = "rewarded";
                // data.feature = "unlock_plant";
                // cc.Mgr.analytics.logEvent("ad_present_failed", JSON.stringify(data));
                self.isDouble = false;
            }
            self.closeUI();
        }), this.node, this.fromType, this);
    },

    updateAdsBtnState () {
        if(this.fromType == "unlock") {
            let currentRewardedAvailable = cc.Mgr.admob.checkAvailableRewardedAd();
            if (this.toggle.isChecked && currentRewardedAvailable) {
                let currentNum = this.price * BigInt(3)
                this.coinNumEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(currentNum), true)
            } else {
                this.coinNumEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(this.price), true)
            }

            var dd = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.LevelGemData, this.plantLevel);
            if(dd != null)
            {
                if (this.toggle.isChecked && currentRewardedAvailable) {
                    let currentNum = this.gems * 3;
                    this.gemNumEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(currentNum), true)
                } else {
                    this.gemNumEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(this.gems), true)
                }
                this.gemNode.active = true;
                this.getGems = this.gems;
            }

            if (currentRewardedAvailable === false) this.checkboxNode.active = false;

            if (this.fromType == "unlock") {
                this.doubleGetBtn.active = false;
                this.adsBtn.active = false;
                if (this.checkboxNode.active && this.toggle.isChecked) {
                    this.adsBtn.active = true;
                } else {
                    this.doubleGetBtn.active = true;
                }
            }
        }
    },

    closeUI:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        // cc.Mgr.admob.hideBanner();
        let self = this
        cc.tween(this.blurBg).to(0.15, {opacity:0}).start();
        cc.tween(this.content).to(0.15, {opacity:0, scale: .5}).call(() => {
            self.unscheduleAllCallbacks();

            if(cc.Mgr.game.needGuide && cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide4)
            {
                cc.director.GlobalEvent.emit(Event.singleGuideComplete,{"step":MyEnum.GuideType.guide4});
                cc.director.GlobalEvent.emit(Event.showSingleGuide,{"step":MyEnum.GuideType.guide5});
            }

            if(self.plantNodeA)self.plantNodeA.destroy();
            if(self.plantNodeB)self.plantNodeB.destroy();
            if(self.plantNodeC)self.plantNodeC.destroy();

            if(self.getGems > 0) {
                cc.Mgr.game.gems += self.getGems;
                cc.Mgr.game.gem_gained_total += self.getGems;
                cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");

                // data = {}
                // data.elapsed = Date.now()
                // data.value = self.getGems;
                // data.feature = self.fromType;
                // // vip tempory code
                // // data.double = (self.toggle.isChecked || cc.Mgr.game.isVIP) ? "True" : "False";
                // data.double = self.toggle.isChecked ? "True" : "False";
                // cc.Mgr.analytics.logEvent("earn_gem", JSON.stringify(data));
                cc.Mgr.UIMgr.showGemsEffect();
            } 

            if (self.getCoin > 0) {
                cc.Mgr.game.money += self.getCoin;
                // cc.Mgr.game.coin_gained_total += self.getCoin; // tempory code
                cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");

                // let data = {}
                // data.elapsed = Date.now()
                // data.value = self.getCoin;
                // data.feature = self.fromType;
                // // vip tempory code
                // // data.double = (self.toggle.isChecked || cc.Mgr.game.isVIP) ? "True" : "False";
                // data.double = self.toggle.isChecked ? "True" : "False";
                // cc.Mgr.analytics.logEvent("earn_coin", JSON.stringify(data));
                
                cc.Mgr.UIMgr.showJibEffect();
            }

            if (this.fromType === "get") {
                cc.Mgr.flowerPotMgr.addShopFlowerFot(self.plantLevel, self.getPlantCount);
            }

            self.node.active = false;

            if (this.fromType === "unlock") {
                let data = {}
                data.elapsed = cc.Mgr.Utils.getDate9(true)
                data.gem = self.getGems || 0;
                data.coin = self.getCoin.toString();
                data.level = self.plantLevel
                data.double = (self.toggle.isChecked && self.checkboxNode.active) ? "True" : "False"
                cc.Mgr.analytics.logEvent("unlock_new_guardian", JSON.stringify(data));

                // update the rank
                cc.Mgr.Utils.downloadRanking();

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
            
            if (this.fromType === "unlock") {
                if (cc.Mgr.game.hasShowLevel8 === false && self.plantLevel === 6) {
                    cc.Mgr.game.hasShowLevel8 = true;
                    // cc.Mgr.UIMgr.openEnjoyNature()
                }
    
                if (cc.Mgr.game.hasShowLevel14 === false && self.plantLevel === 14) {
                    cc.Mgr.game.hasShowLevel14 = true;
                    // cc.Mgr.UIMgr.openEnjoyNature()
                }
    
                if (cc.Mgr.game.hasShowLevel28 === false && self.plantLevel === 19 && cc.Mgr.game.rateState !== 2) {
                    cc.Mgr.game.hasShowLevel28 = true;
                    // cc.Mgr.UIMgr.openEnjoyNature()
                }

                if (self.isDouble !== true && cc.Mgr.game.needGuide === false && self.plantLevel > 6) {
                    // setTimeout (() => {
                    //     cc.Mgr.admob.showInterstitial(this.fromType, 'browse', null, true);
                    // }, 1500);
                }
            }
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("plantGet");

        if (this.fromType === "unlock") {
            if (cc.Mgr.game.isPayingUser !== true) {
                cc.Mgr.game.checkDoubleReward = self.plantLevel >= 6;
            }
        }
    },
});
module.exports = plantGetUI;