var MySprite = require("MySprite");
var AtlasType = require("AtlasType");
var DataType = require("DataType");
var MyEnum = require("MyEnum");
var iconList = ["icon_coins", "icon_coin", "icon_diamonds", "icon_diamond"];
var scaleConfig = 1.3;
var tweenTime = 0.25;
var assetGetUI = cc.Class({
    extends: cc.Component,

    properties: {
        titleLbl:cc.Label,
        icon:MySprite,
        numLbl:cc.Label,
        dragonParent:cc.Node,
        num:1,

        btnNode:cc.Node,
        doubleGetNode:cc.Node,

        freeLabelNode:cc.Label,
        toggle: cc.Toggle,
        coinNode: cc.Node,
        gemNode: cc.Node,
        rageNode: cc.Node,
        autoNode: cc.Node,
        flameNode: cc.Node,
        freezeNode: cc.Node,
        critNode: cc.Node,
        smallCoinNode: cc.Node,
        smallGemNode: cc.Node,
        checkboxLabel: cc.Label,

        content: cc.Node,
        blurBg: cc.Node,
        blackBg: cc.Node,

        checkboxNode: cc.Node,
        vipNode: cc.Node,
        vipTip: cc.Label,

        numEffect: cc.Node,

        freeDoubleDailyLabel: cc.Label,

        getBtn: cc.Node,
        adsBtn: cc.Node,
        adsLabel: cc.Label,

        gemBtnlabel: cc.Label,

        noThanks: cc.Node,
        noThanksLabel: cc.Label
    },

    onLoad () {
        this.limitClick = this.node.getComponent('LimitClick')
    },

    updateReward () {
        if (this.fromType === "payment" || this.fromType === "compensation") return;

         // vip tempory code
            // let num = (this.toggle.isChecked === true || cc.Mgr.game.isVIP) ? this.num * 2 : this.num;
            let num;
            if (this.rtype == "money") {
                num = ((this.toggle.isChecked === true && this.checkboxNode.active) || (cc.Mgr.game.isVIP && (this.fromType === "sign" || this.fromType === "mission" || this.fromType === "achieve"))) ? this.num * BigInt(3) : this.num;
            } else {
                num = ((this.toggle.isChecked === true && this.checkboxNode.active) || (cc.Mgr.game.isVIP && (this.fromType === "sign" || this.fromType === "mission" || this.fromType === "achieve"))) ? this.num * 3 : this.num;

                if (this.rtype == "plant") num = ((this.toggle.isChecked === true && this.checkboxNode.active) || (cc.Mgr.game.isVIP && (this.fromType === "sign" || this.fromType === "mission" || this.fromType === "achieve"))) ? 3 : 1;

                if (this.rtype == "drone") num = ((this.toggle.isChecked === true && this.checkboxNode.active) || (cc.Mgr.game.isVIP && (this.fromType === "sign" || this.fromType === "mission" || this.fromType === "achieve"))) ? 18 : 6;
                
            }
            if (this.rtype =="rage" || this.rtype =="auto" || this.rtype =="flame" || this.rtype =="freeze" || this.rtype =="crit") {
                this.numEffect.getComponent("NumEffect").setNumber(num + "s")
            } else {
                if (this.rtype == "money") {
                    this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(num))
                } else {
                    this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(num))
                }
            }

            // let data = {}
            // data.elapsed = cc.Mgr.Utils.getDate9(true)
            // data.action = (this.toggle.isChecked === true && this.checkboxNode.active) ? "check" : "uncheck"
            // data.feature = this.fromType
            // cc.Mgr.analytics.logEvent("checkbox", JSON.stringify(data));

            cc.Mgr.game.isManualSetting = cc.Mgr.game.isManualSetting_payingUser = this.toggle.isChecked;

            this.getBtn.active = false;
            this.adsBtn.active = false;
            if (this.checkboxNode.active && this.toggle.isChecked) {
                this.adsBtn.active = true;
            }
            if (this.vipNode.active || ( this.checkboxNode.active && !this.toggle.isChecked)) {
                this.getBtn.active = true;
            }
    },

    doTween:function(rtype){
        this.dragonParent.opacity = 0;
        this.coinNode.opacity = 0;
        this.coinNode.scale = 1;
        this.gemNode.opacity = 0;
        this.gemNode.scale = 1;
        if (rtype == "money") {
            cc.tween(this.coinNode).to(tweenTime, {opacity:255, scale: scaleConfig}).to(0.1, {scale:1.0}).start();
        } else if (rtype == "gem") {
            cc.tween(this.gemNode).to(tweenTime, {opacity:255, scale: scaleConfig}).to(0.1, {scale:1.0}).start();
        } else {
            cc.tween(this.dragonParent).to(tweenTime, {opacity:255, scale: 1.0}).to(0.1, {scale:0.75}).start();
        }
    },

    showUI:function(rtype, num , fromType, callback = null){
        this.titleLbl.string = cc.Mgr.Utils.getTranslation("getReward-title");
        this.freeLabelNode.string = cc.Mgr.Utils.getTranslation("btn-claim");
        this.checkboxLabel.string = cc.Mgr.Utils.getTranslation("getReward-checkbox-treble");
        this.vipTip.string = cc.Mgr.Utils.getTranslation("vip-treble-tip");
        this.freeDoubleDailyLabel.string = cc.Mgr.Utils.getTranslation("free-treble-daily-tip");
        this.adsLabel.string = cc.Mgr.Utils.getTranslation("btn-treble");
        this.gemBtnlabel.string = cc.Mgr.Utils.getTranslation("btn-claim");
        this.noThanksLabel.string = cc.Mgr.Utils.getTranslation("btn-no-thanks");

        this.num = num;
        this.callback = callback;
        this.node.width = cc.Mgr.Config.winSize.width;
        this.node.height = cc.Mgr.Config.winSize.height;
        this.icon.node.active = false;
        this.dragonParent.active = false;
        this.coinNode.active = false;
        this.gemNode.active = false;
        this.rageNode.active = false;
        this.autoNode.active = false;
        this.flameNode.active = false;
        this.freezeNode.active = false;
        this.critNode.active = false;
        this.smallCoinNode.active = false;
        this.smallGemNode.active = false;
        this.freeDoubleDailyLabel.node.active = false;
        // this.numLbl.string = "x"+ cc.Mgr.Utils.getNumStr(num);
        this.fromType = fromType;

        this.noThanks.opacity = 0;
        this.noThanks.active = false;

        this.btnNode.active = false;
        this.doubleGetNode.active = false;
        this.rtype = rtype;
        
        var self = this;

        if (this.showBtnCounter) {
            clearTimeout(this.showBtnCounter);
        }

        let checkState
        if (cc.Mgr.game.isPayingUser) {
            checkState = cc.Mgr.game.isManualSetting_payingUser == undefined ? cc.Mgr.game.checkDoubleReward : cc.Mgr.game.isManualSetting_payingUser;
            if (this.toggle.isChecked != checkState)this.toggle.isChecked = checkState;
        } else {
            checkState = cc.Mgr.game.isManualSetting == undefined ? cc.Mgr.game.checkDoubleReward : cc.Mgr.game.isManualSetting;
            if (this.toggle.isChecked != checkState)this.toggle.isChecked = checkState;
        }

        let currentRewardedAvailable = cc.Mgr.admob.checkAvailableRewardedAd();

        if(rtype == "money")
        {
            this.coinNode.active = true;

            if (this.fromType == "payment" || this.fromType == "exchange" || this.fromType === "compensation") {
                this.btnNode.active = true;
            } else {
                this.doubleGetNode.active = true;
            }

            // vip tempory code 
            // if ((this.toggle.isChecked || cc.Mgr.game.isVIP) && this.fromType != "payment") {
            //     let currentNum = num * 2
            //     this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(currentNum), true)
            // } else {
            //     this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(num), true)
            // }
            if (((this.doubleGetNode.active && this.toggle.isChecked && currentRewardedAvailable === true) || (cc.Mgr.game.isVIP && (this.fromType === "sign" || this.fromType === "mission" || this.fromType === "achieve"))) && (this.fromType != "payment" && this.fromType !== "compensation" && this.fromType != "exchange")) {
                let currentNum = num * BigInt(3);
                this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(currentNum), true)
            } else {
                this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(num), true)
            }
        }
        else if(rtype =="gem")
        {
            this.gemNode.active = true;
            this.smallGemNode.active = true;

            if (this.fromType == "payment" || this.fromType === "compensation") {
                this.btnNode.active = true;
            } else {
                this.doubleGetNode.active = true;
            }

            // vip tempory code 
            // if ((this.toggle.isChecked || cc.Mgr.game.isVIP) && this.fromType != "payment") {
            //     let currentNum = num * 2
            //     this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(currentNum), true)
            // } else {
            //     this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(num), true)
            // }
            if (((this.doubleGetNode.active && this.toggle.isChecked && currentRewardedAvailable === true) || (cc.Mgr.game.isVIP && (this.fromType === "sign" || this.fromType === "mission" || this.fromType === "achieve"))) && (this.fromType != "payment" && this.fromType !== "compensation") || (this.fromType === "sign" && cc.Mgr.game.isFreeDoubleDaily)) {
                let currentNum = num * 3;
                this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(currentNum), true)
            } else {
                this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(num), true)
            }
        }
        else if(rtype =="plant")
        {
            // this.numLbl.string = "x1";
            this.plantId = num;
            this.num = 1;
            // vip tempory code 
            // if (this.toggle.isChecked || cc.Mgr.game.isVIP) {
            //     let currentNum = this.num * 2
            //     this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(currentNum), true)
            // } else {
            //     this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(this.num), true)
            // }
            if (this.toggle.isChecked && currentRewardedAvailable === true) {
                let currentNum = this.num * 3;
                this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(currentNum), true)
            } else {
                let currentNum = this.num;
                this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(currentNum), true)
            }
            
            this.dragonParent.active = true;
            this.doubleGetNode.active = true;

            var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, num);
            cc.loader.loadRes("prefab/plant/" + plantData.prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.plantNodeA = cc.instantiate(prefab);
                self.plantNodeA.parent = self.dragonParent;
                self.plantNodeA.group = MyEnum.NodeGroup.UI;
                self.plantNodeA.position = cc.v2(0,0);
                self.plantNodeA.active = true;
                self.plantNodeA.setScale(0.75)
                var scp = self.plantNodeA.getComponent("plant");
                scp.setShowDetailsInUI(2, "#ffffff", true);
            });
        }
        else if(rtype =="drone")
        {
            this.droneId = num;
            this.num = 6;
            this.doubleGetNode.active = true;

            // this.numLbl.string = "x6";
            // vip tempory code 
            // if (this.toggle.isChecked || cc.Mgr.game.isVIP) {
            //     let currentNum = this.num * 2
            //     this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(currentNum), true)
            // } else {
            //     this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(this.num), true)
            // }
            if ((this.toggle.isChecked && currentRewardedAvailable === true)) {
                let currentNum = this.num * 3;
                this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(currentNum), true)
            } else {
                this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(this.num), true)
            }
            
            this.dragonParent.active = true;
            cc.loader.loadRes("prefab/flowerPot/" + "HuaPen_v1", function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.plantNodeA = cc.instantiate(prefab);
                self.plantNodeA.parent = self.dragonParent;
                self.plantNodeA.group = MyEnum.NodeGroup.UI;
                self.plantNodeA.position = cc.v2(0,0);
                self.plantNodeA.active = true;
                var scp = self.plantNodeA.getComponent("flowerPot");
                scp.setShowDetailsInUI(2, "#ffffff", true);
            });
        }
        else if(rtype =="rage" || rtype =="auto" || rtype =="flame" || rtype =="freeze" || rtype =="crit")
        {
            switch (rtype) {
                case "rage":
                    this.rageNode.active = true;
                    break;
                case "auto":
                    this.autoNode.active = true;
                    break;
                case "flame":
                    this.flameNode.active = true;
                    break;
                case "freeze":
                    this.freezeNode.active = true;
                    break;
                case "crit":
                    this.critNode.active = true;
                    break;
            }

            if (this.fromType == "buff") {
                this.btnNode.active = true;
            } else {
                this.doubleGetNode.active = true;
            }

            if ((this.doubleGetNode.active && this.toggle.isChecked && currentRewardedAvailable === true) || (cc.Mgr.game.isVIP && (this.fromType === "turnTable"))) {
                this.numEffect.getComponent("NumEffect").setNumber(this.num * 3 + "s", true)
            } else {
                this.numEffect.getComponent("NumEffect").setNumber(this.num + "s", true)
            }
        }

        this.isDouble = false;

        this.doTween(rtype);

        this.blurBg.active = false;
        this.blackBg.active = false;
        // if (this.fromType == "payment") {
        //     this.blackBg.active = true;
        //     this.blackBg.opacity = 0
        //     cc.tween(this.blackBg).to(0.15, {opacity:255}).call().start();
        // } else {
        //     this.blurBg.active = true;
        //     this.blurBg.opacity = 0
        //     cc.tween(this.blurBg).to(0.15, {opacity:255}).call().start();
        // }

        this.blurBg.active = true;
        this.blurBg.opacity = 0
        cc.tween(this.blurBg).to(0.05, {opacity:255}).call().start();
        
        this.content.opacity = 0;
        this.content.setScale(.5)
        cc.tween(this.content).to(0.15, {opacity:255, scale: 1}).start();

        cc.Mgr.admob.showBanner("getReward");

        this.checkboxNode.opacity = 255;

        // vip tempory code 
        // this.checkboxNode.active = !cc.Mgr.game.isVIP;
        // this.vipNode.active = cc.Mgr.game.isVIP;
        this.checkboxNode.active = !(cc.Mgr.game.isVIP && (this.fromType === "sign" || this.fromType === "mission" || this.fromType === "achieve"));
        
        if (currentRewardedAvailable === false) this.checkboxNode.active = false;
        this.vipNode.active = (cc.Mgr.game.isVIP && (this.fromType === "sign" || this.fromType === "mission" || this.fromType === "achieve"));
        if (this.fromType == "payment" || this.fromType == "exchange" || this.fromType === "compensation") {
            this.checkboxNode.active = false;
            this.vipNode.active = false;
        }

        this.getBtn.active = false;
        this.adsBtn.active = false;
        if (this.fromType === "sign" && cc.Mgr.game.isFreeDoubleDaily) {
            this.checkboxNode.active = false;
            this.vipNode.active = false;
            this.freeDoubleDailyLabel.node.active = true;
            this.getBtn.active = true;
        } else {
            if (this.checkboxNode.active && this.toggle.isChecked) {
                this.adsBtn.active = true;
            }
            if (this.vipNode.active || (!this.checkboxNode.active || !this.toggle.isChecked)) {
                this.getBtn.active = true;
            }
        }
    },

    updateAdsBtnState () {
        this.icon.node.active = false;
        this.dragonParent.active = false;
        this.coinNode.active = false;
        this.gemNode.active = false;
        this.rageNode.active = false;
        this.autoNode.active = false;
        this.flameNode.active = false;
        this.freezeNode.active = false;
        this.critNode.active = false;
        this.smallCoinNode.active = false;
        this.smallGemNode.active = false;
        this.freeDoubleDailyLabel.node.active = false;

        this.btnNode.active = false;
        this.doubleGetNode.active = false;

        let checkState
        if (cc.Mgr.game.isPayingUser) {
            checkState = cc.Mgr.game.isManualSetting_payingUser == undefined ? cc.Mgr.game.checkDoubleReward : cc.Mgr.game.isManualSetting_payingUser;
            if (this.toggle.isChecked != checkState)this.toggle.isChecked = checkState;
        } else {
            checkState = cc.Mgr.game.isManualSetting == undefined ? cc.Mgr.game.checkDoubleReward : cc.Mgr.game.isManualSetting;
            if (this.toggle.isChecked != checkState)this.toggle.isChecked = checkState;
        }

        let currentRewardedAvailable = cc.Mgr.admob.checkAvailableRewardedAd();

        if(this.rtype == "money")
        {
            this.coinNode.active = true;
            this.smallCoinNode.active = true;
            this.doubleGetNode.active = true;

            if (this.fromType == "payment" || this.fromType == "exchange" || this.fromType === "compensation") {
                this.btnNode.active = true;
            } else {
                this.doubleGetNode.active = true;
            }

            if (((this.toggle.isChecked && currentRewardedAvailable === true) || (cc.Mgr.game.isVIP && (this.fromType === "sign" || this.fromType === "mission" || this.fromType === "achieve"))) && (this.fromType != "payment" && this.fromType !== "compensation")) {
                let currentNum = this.num * BigInt(3)
                this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(currentNum), true)
            } else {
                this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(this.num), true)
            }
        }
        else if(this.rtype =="gem")
        {
            this.gemNode.active = true;
            this.smallGemNode.active = true;

            if (this.fromType == "payment" || this.fromType === "compensation") {
                this.btnNode.active = true;
            } else {
                this.doubleGetNode.active = true;
            }

            if (((this.toggle.isChecked && currentRewardedAvailable === true) || (cc.Mgr.game.isVIP && (this.fromType === "sign" || this.fromType === "mission" || this.fromType === "achieve"))) && (this.fromType != "payment" && this.fromType !== "compensation") || (this.fromType === "sign" && cc.Mgr.game.isFreeDoubleDaily)) {
                let currentNum = this.num * 3;
                this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(currentNum), true)
            } else {
                this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(this.num), true)
            }
        }
        else if(this.rtype =="plant")
        {
            // this.numLbl.string = "x1";
            this.num = 1;
            this.dragonParent.active = true;
            this.doubleGetNode.active = true;
            if ((this.toggle.isChecked && currentRewardedAvailable === true)) {
                let currentNum = this.num * 3;
                this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(currentNum), true)
            } else {
                let currentNum = this.num;
                this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(currentNum), true)
            }
        }
        else if(this.rtype =="drone")
        {
            this.num = 6;
            this.doubleGetNode.active = true;
            this.dragonParent.active = true;
            if ((this.toggle.isChecked && currentRewardedAvailable === true)) {
                let currentNum = this.num * 3;
                this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(currentNum), true)
            } else {
                this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(this.num), true)
            }
        }
        else if(this.rtype =="rage" || this.rtype =="auto" || this.rtype =="flame" || this.rtype =="freeze" || this.rtype =="crit")
        {
            switch (this.rtype) {
                case "rage":
                    this.rageNode.active = true;
                    break;
                case "auto":
                    this.autoNode.active = true;
                    break;
                case "flame":
                    this.flameNode.active = true;
                    break;
                case "freeze":
                    this.freezeNode.active = true;
                    break;
                case "crit":
                    this.critNode.active = true;
                    break;
            }

            if (this.fromType == "buff") {
                this.btnNode.active = true;
            } else {
                this.doubleGetNode.active = true;
            }

            if ((this.toggle.isChecked && currentRewardedAvailable === true) || (cc.Mgr.game.isVIP && (this.fromType === "sign" || this.fromType === "mission" || this.fromType === "achieve"))) {
                this.numEffect.getComponent("NumEffect").setNumber(this.num * 3 + "s", true)
            } else {
                this.numEffect.getComponent("NumEffect").setNumber(this.num + "s", true)
            }
        }

        this.checkboxNode.active = !(cc.Mgr.game.isVIP && (this.fromType === "sign" || this.fromType === "mission" || this.fromType === "achieve"));
        if (currentRewardedAvailable === false) this.checkboxNode.active = false;
        this.vipNode.active = (cc.Mgr.game.isVIP && (this.fromType === "sign" || this.fromType === "mission" || this.fromType === "achieve"));
        if (this.fromType == "payment" || this.fromType == "exchange" || this.fromType === "compensation") {
            this.checkboxNode.active = false;
            this.vipNode.active = false;
        }

        this.getBtn.active = false;
        this.adsBtn.active = false;
        if (this.fromType === "sign" && cc.Mgr.game.isFreeDoubleDaily) {
            this.checkboxNode.active = false;
            this.vipNode.active = false;
            this.freeDoubleDailyLabel.node.active = true;
            this.getBtn.active = true;
        } else {
            if (this.checkboxNode.active && this.toggle.isChecked) {
                this.adsBtn.active = true;
            }
            if (this.vipNode.active || (!this.checkboxNode.active || !this.toggle.isChecked)) {
                this.getBtn.active = true;
            }
        }
    },

    doubleGetAds () {
        if (this.limitClick.clickTime() == false) {
            return
        }

        var self = this;
        cc.Mgr.admob.showRewardedVideoAd((function(_state) {
            if (_state === true) {
                if (self.rtype == "money") {
                    self.num = self.num * BigInt(3);
                } else {
                    self.num = self.num * 3;
                }
                self.isDouble = true;
            } else {
                // let data = {};
                // data.elapsed = cc.Mgr.Utils.getDate9(true);
                // data.adsType = "rewarded";
                // data.feature = self.fromType;
                // cc.Mgr.analytics.logEvent("ad_present_failed", JSON.stringify(data));
                self.isDouble = false;
            }
            
            self.closeUI();
        }), this.node, this.fromType, this);
    },

    doubleGet:function(){
        if (this.limitClick.clickTime() == false) {
            return
        }

        // vip tempory code
        // if (cc.Mgr.game.isVIP && this.fromType !== "payment") {
        //     self.num = self.num * 2;
        //     self.closeUI();
        // } else if(this.toggle.isChecked === true && this.fromType !== "payment") {
        //     cc.Mgr.admob.showRewardedVideoAd((function() {
        //         self.num = self.num * 2
        //         self.closeUI();
        //     }), this.node, this.fromType);
        // } else {
        //     this.closeUI();
        // }
        if ((cc.Mgr.game.isVIP && (this.fromType === "sign" || this.fromType === "mission" || this.fromType === "achieve")) && (this.fromType != "payment" && this.fromType !== "compensation") || (this.fromType === "sign" && cc.Mgr.game.isFreeDoubleDaily)) {
            if (this.rtype == "money") {
                this.num = this.num * BigInt(3);
            } else {
                this.num = this.num * 3;
            }
            this.isDouble = true;
            this.closeUI();
        } else {
            this.isDouble = false;
            this.closeUI();
        }
    },

    closeUI:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("getReward");
        let self = this
        if (this.fromType == "payment" || this.fromType == "exchange" || this.fromType === "compensation") {
            cc.tween(this.blackBg).to(0.15, {opacity:0}).start();
        } else {
            cc.tween(this.blurBg).to(0.15, {opacity:0}).start();
        }
        
        cc.tween(this.content).to(0.15, {opacity:0, scale: .5}).call(() => {
            if(self.plantNodeA)this.plantNodeA.destroy();

            if(self.rtype == "gem")
            {
                cc.Mgr.game.gems += self.num;
                cc.Mgr.game.gem_gained_total += self.num;
                cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");
                cc.Mgr.UIMgr.showGemsEffect();

                // let data = {}
                // data.elapsed = Date.now()
                // data.value = self.num;
                // data.feature = self.fromType;
                // // vip tempory code 
                // // data.double = (self.toggle.isChecked || cc.Mgr.game.isVIP) ? "True" : "False";
                // data.double = (self.toggle.isChecked || (cc.Mgr.game.isVIP && (this.fromType === "sign" || this.fromType === "mission" || this.fromType === "achieve"))) ? "True" : "False";
                // cc.Mgr.analytics.logEvent("earn_gem", JSON.stringify(data));
            }

            if(self.rtype == "money")
            {
                cc.Mgr.game.money += self.num;
                cc.Mgr.game.coin_gained_total += self.num;
                cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
                cc.Mgr.UIMgr.showJibEffect();

                // let data = {}
                // data.elapsed = Date.now()
                // data.value = self.num;
                // data.feature = self.fromType;
                // // vip tempory code
                // // data.double = (self.toggle.isChecked || cc.Mgr.game.isVIP) ? "True" : "False";
                // data.double = (self.toggle.isChecked || (cc.Mgr.game.isVIP && (this.fromType === "sign" || this.fromType === "mission" || this.fromType === "achieve"))) ? "True" : "False";
                // cc.Mgr.analytics.logEvent("earn_coin", JSON.stringify(data));
            }
            
            if (self.rtype == "plant") {
                cc.Mgr.flowerPotMgr.addTurnTableFlowerFot(this.plantId, self.num);
            }

            if (self.rtype == "rage") {
                cc.Mgr.game.rageTimer += self.num;
                if(cc.Mgr.game.rageTimer > 900) cc.Mgr.game.rageTimer = 900;
                cc.Mgr.plantMgr.changePlantAngryState(true);
            }

            if (self.rtype == "auto") {
                cc.Mgr.game.autoTimer += self.num;
                if(cc.Mgr.game.autoTimer > 900) cc.Mgr.game.autoTimer = 900;
                cc.Mgr.plantMgr.changePlantAutoState(true);
            }

            if (self.rtype == "flame") {
                cc.Mgr.game.fireTimer += self.num;
                if(cc.Mgr.game.fireTimer > 900) cc.Mgr.game.fireTimer = 900;
                cc.Mgr.plantMgr.changePlantFireState(true);
            }

            if (self.rtype == "freeze") {
                cc.Mgr.game.iceTimer += self.num;
                if(cc.Mgr.game.iceTimer > 900) cc.Mgr.game.iceTimer = 900;
                cc.Mgr.plantMgr.changePlantIceState(true);
            }

            if (self.rtype == "crit") {
                cc.Mgr.game.critTimer += self.num;
                if(cc.Mgr.game.critTimer > 900) cc.Mgr.game.critTimer = 900;
                cc.Mgr.plantMgr.changePlantCritState(true);
            }

            if (self.rtype == "drone") {
                cc.Mgr.flowerPotMgr.addDroneFlowerFot(this.droneId, self.num);
            }

            if (self.fromType === "mission" || self.fromType === "achieve" || self.fromType === "sign") {
                if (self.isDouble !== true) {
                    // setTimeout (() => {
                    //     cc.Mgr.admob.showInterstitial(self.fromType, 'browse', null, true);
                    // }, 1500);
                }
            }

            self.node.active = false;
            if(self.callback != null && typeof self.callback == "function")
            {
                self.callback();
            }

            if(cc.Mgr.UIMgr.turnTableUINode != null && cc.Mgr.UIMgr.turnTableUINode.active == true)
            {
                cc.Mgr.UIMgr.turnTableUI.showBtns();
            }
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("assetGet");
    },
});
module.exports = assetGetUI;
