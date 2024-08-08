var uiConfig = require("uiConfig");
var DataType = require("DataType");
var EffectType = require("EffectType");
var MyEnum = require("MyEnum");
var UIMgr = cc.Class({
    extends: cc.Component,

    properties: {
    	uiRoot:cc.Node,

        tipTrashBackNode:cc.Node,
        trashBoxNode:cc.Node,

        tipRoot: cc.Node,

        loading: cc.Node

        // showDouble: false
    },

    addShowUICount (_name) {
        if (!this.openUINameList) this.openUINameList = [];
        if (this.openUINameList.indexOf(_name) >= 0) return;
        this.openUINameList.push(_name);

        this.currentShowUICount++;
        console.log ("cc.Mgr.UIMgr.currentShowUICount:" + " " + cc.Mgr.UIMgr.currentShowUICount);

        cc.Mgr.ZombieMgr.pause();
        cc.Mgr.GameCenterCtrl.pauseFight = true;
    },

    reduceShowUICount (_name) {
        let index = this.openUINameList.indexOf(_name);
        if (index < 0) return;
        this.currentShowUICount--;
        if (index >= 0) this.openUINameList.splice(index, 1);

        if (cc.Mgr.UIMgr.currentShowUICount <= 0) {
            cc.Mgr.GameCenterCtrl.pauseFight = false;
            cc.Mgr.ZombieMgr.resume();
            cc.Mgr.plantMgr.resume();
            cc.Mgr.plantMgr.autoMerge();
        }
        console.log ("cc.Mgr.UIMgr.currentShowUICount:" + " " + cc.Mgr.UIMgr.currentShowUICount);
    },

    showLoading (_needShow) {
        this.loading.opacity = 0;
        this.loading.active = true;  
        let fadeIn = cc.fadeIn(0.5);
        this.loading.runAction(fadeIn);
    },

    hideLoading () {
        this.loading.stopAllActions();
        this.loading.active = false;
    },

    statics:
    {
        instance:null,
    },
    onLoad()
    {
        UIMgr.instance = this;

        this.currentShowUICount = 0;
    },
    start(){
        //将该脚本归类为管理工具里面
        // cc.Mgr.UIMgr = this;
        
        let self = this;
        cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.promptUI.Name,cc.Prefab, function (errmsg, prefab) {
            if (errmsg) {
                cc.error(errmsg.message || errmsg);
                return;
            }
            self.promptPre = prefab;
        });
    },

    showTrashBoxNode:function(isShow = true){
        this.trashBoxNode.active = isShow;
    },

    showTipToTrash:function(needShow){
        if (this.tipTrashBackNode.active === needShow) return;
        if (needShow && cc.Mgr.plantMgr.otherTipCount > 0) return;
        this.tipTrashBackNode.active = needShow;
        if (needShow) {
            cc.Mgr.plantMgr.otherTipCount++;
        } else {
            cc.Mgr.plantMgr.otherTipCount--;
        }
    },

    playCoinFlyForRecovery:function(money){
        var obj = cc.Mgr.EffectMgr.getObFromPool(EffectType.CoinFly);
        if(obj == null)
            return;

        obj.parent = this.trashBoxNode;
        obj.active = true;
        obj.zIndex = 101;
        obj.y = 60;
        obj.x = 0;

        obj.getComponent("coinFly").setData(cc.Mgr.Utils.getNumStr2(money));
        obj.scale = 1;
        cc.tween(obj).to(0.1,{position:cc.v2(0,90),scale:0.8})
        .to(0.5,{position:cc.v2(0,100)}).call(()=>{
            cc.Mgr.game.money += money;

            // let data = {}
            // data.elapsed = Date.now()
            // data.value = money;
            // data.feature = "recovery";
            // data.double = "False";
            // cc.Mgr.analytics.logEvent("earn_coin", JSON.stringify(data));

            cc.Mgr.game.coin_gained_total += money;
            cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
            cc.Mgr.EffectMgr.ObBackToPool(obj, EffectType.CoinFly);
        }).start();
    },

    openSetting:function() {
        // this.showDouble = !this.showDouble;
        // cc.Mgr.UIMgr.InGameUI.showDoubleCoinBtn(this.showDouble);

        var self = this;
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
            return;
        }
        this.clearPrompt();
        if (this.setUI) {
            this.addShowUICount("setting");
            this.setUI.active = true;
            self.setUI.getComponent("setPanel").showUI()
            this.setUI.zIndex = uiConfig.setUI.Layer;
        } else {
            this.setUI = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.setUI.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("setting");
                self.hideLoading();
                self.setUI = cc.instantiate(prefab);
                self.setUI.parent = self.uiRoot;
                self.setUI.active = true;
                self.setUI.getComponent("setPanel").showUI()
                self.setUI.zIndex = uiConfig.setUI.Layer;
            });
        }
    },

    closeShop:function(){
        if(this.paymentUINode != null) this.paymentUINode.getComponent("PaymentUI").onClickClose();
    },

    openPlantGetUI:function(from, lv, isDrone = false) {
        this.clearPrompt();
        var self = this;
        cc.Mgr.AudioMgr.playSFX("click");
        if (this.plantGetUINode) {
            this.addShowUICount("plantGet");
            this.plantGetUINode.active = true;
            this.plantGetUINode.opacity = 0;
            var fadeIn = cc.fadeIn(0.25);
            this.plantGetUINode.getComponent("plantGetUI").showUI(from, lv, isDrone);
            this.plantGetUINode.runAction(fadeIn);
            this.plantGetUINode.zIndex = uiConfig.plantGetUI.Layer;
        } else {
            this.plantGetUINode = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.plantGetUI.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("plantGet");
                self.hideLoading();
                self.plantGetUINode = cc.instantiate(prefab);
                self.plantGetUINode.parent = self.uiRoot;
                self.plantGetUINode.active = true;
                self.plantGetUINode.opacity = 0;
                var fadeIn = cc.fadeIn(0.25);
                self.plantGetUINode.getComponent("plantGetUI").showUI(from, lv, isDrone);
                self.plantGetUINode.runAction(fadeIn);
                self.plantGetUINode.zIndex = uiConfig.plantGetUI.Layer;
            });
        }
        
        if(from == "unlock" && lv == 5)
            cc.Mgr.UIMgr.InGameUI.showUavNextTime(0.5);
    },

    openDoubleCoinUI:function() {
        this.clearPrompt();
        var self = this;
        cc.Mgr.AudioMgr.playSFX("click");
        if (this.doubleCoinUI) {
            this.addShowUICount("doubleCoin");
            this.doubleCoinUI.active = true;
            this.doubleCoinUI.opacity = 0;
            var fadeIn = cc.fadeIn(0.25);
            this.doubleCoinUI.getComponent("doubleCoinUI").showUI();
            this.doubleCoinUI.runAction(fadeIn);
            this.doubleCoinUI.zIndex = uiConfig.doubleCoinUI.Layer;
        } else {
            this.doubleCoinUI = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.doubleCoinUI.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("doubleCoin");
                self.hideLoading();
                self.doubleCoinUI = cc.instantiate(prefab);
                self.doubleCoinUI.parent = self.uiRoot;
                self.doubleCoinUI.active = true;
                self.doubleCoinUI.opacity = 0;
                var fadeIn = cc.fadeIn(0.25);
                self.doubleCoinUI.getComponent("doubleCoinUI").showUI();
                self.doubleCoinUI.runAction(fadeIn);
                self.doubleCoinUI.zIndex = uiConfig.doubleCoinUI.Layer;
            });
        }
    },

    clearPrompt () {
        if (this.currentTip != null) {
            this.currentTip.stopAllActions();
            this.currentTip.destroy();
            this.currentTip = null;
        }
        if (this.lastTip != null) {
            this.lastTip.stopAllActions();
            this.lastTip.destroy();
            this.lastTip = null;
        }
    },

    showPrompt:function(str, _type, _parent) {
        var self = this;
        if (this.currentTip != null) {
            this.lastTip = this.currentTip;
            this.lastTip.stopAllActions();
            var act3 = cc.moveBy(0.2, 0, 150);
            var act4 = cc.fadeOut(0.2);
            this.lastTip.runAction(cc.sequence(cc.spawn(act3, act4), cc.callFunc(() => {
                if (this.lastTip != null) this.lastTip.destroy();
                this.lastTip = this.currentTip;
            })));
        }
        
        if(this.promptPre == undefined)
        {
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.promptUI.Name,cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.promptPre = prefab;
                self.currentTip = cc.instantiate(prefab)
                self.currentTip.y = 100 - (self.currentTip.height / 2);
                self.currentTip.parent = _parent ? _parent : self.uiRoot;
                self.currentTip.zIndex = uiConfig.promptUI.Layer;
                self.currentTip.getComponent("promptUI").showDes(str,_type);
                var act1 = cc.moveBy(0.2, 0, 150);
                var act2 = cc.moveBy(1, 0, 0);
                var act3 = cc.moveBy(0.2, 0, 150);
                var act4 = cc.fadeOut(0.2);
                self.currentTip.runAction(cc.sequence(act1, act2, cc.callFunc(() => {
                    self.currentTip.runAction(cc.sequence(cc.spawn(act3, act4), cc.callFunc(() => {
                        if (self.currentTip != null) {
                            self.currentTip.destroy();
                            self.currentTip = null;
                        }
                    })))
                })));
            });
        }
        else
        {
            self.currentTip = cc.instantiate(this.promptPre)
            self.currentTip.y = 100 - (self.currentTip.height / 2);
            self.currentTip.parent = _parent ? _parent : self.uiRoot;
            self.currentTip.zIndex = uiConfig.promptUI.Layer;
            self.currentTip.getComponent("promptUI").showDes(str,_type);
            var act1 = cc.moveBy(0.2, 0, 150);
            var act2 = cc.moveBy(1, 0, 0);
            var act3 = cc.moveBy(0.2, 0, 150);
            var act4 = cc.fadeOut(0.2);
            self.currentTip.runAction(cc.sequence(act1, act2, cc.callFunc(() => {
                self.currentTip.runAction(cc.sequence(cc.spawn(act3, act4), cc.callFunc(() => {
                    if (self.currentTip != null) {
                        self.currentTip.destroy();
                        self.currentTip = null;
                    }
                })))
            })));
        }        
    },

    showSmallResult:function(suc){
        var self = this;
        if (this.smallResultNode) {
            this.smallResultNode.active = true;
            this.smallResultNode.scaleY = 0.1;
            this.smallResultNode.getComponent("smallResult").show(suc);
            this.smallResultNode.runAction(cc.scaleTo(0.25,1,1));
            this.smallResultNode.zIndex = uiConfig.smallResult.Layer;
            this.smallResultNode.y = 200;
        } else {
            this.smallResultNode = null;
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.smallResult.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.smallResultNode = cc.instantiate(prefab);
                self.smallResultNode.parent = self.uiRoot;
                self.smallResultNode.active = true;
                self.smallResultNode.scaleY = 0.1;
                self.smallResultNode.getComponent("smallResult").show(suc);
                self.smallResultNode.runAction(cc.scaleTo(0.25,1,1));
                self.smallResultNode.zIndex = uiConfig.smallResult.Layer;
                self.smallResultNode.y = 200;
            });
        }
    },

    showBigResult:function(suc, coin){
        this.clearPrompt();
        var self = this;
        if (this.bigResultNode) {
            this.addShowUICount("bigResult");
            this.bigResultNode.active = true;
            this.bigResultNode.getComponent("bigResult").show(suc,coin);
            this.bigResultNode.zIndex = uiConfig.bigResult.Layer;
        } else {
            this.bigResultNode = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.bigResult.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("bigResult");
                self.hideLoading();
                self.bigResultNode = cc.instantiate(prefab);
                self.bigResultNode.parent = self.uiRoot;
                self.bigResultNode.active = true;
                self.bigResultNode.getComponent("bigResult").show(suc, coin);
                self.bigResultNode.zIndex = uiConfig.bigResult.Layer;
            });
        }
    },

    showBossComing:function(_id){
        var self = this;
        if (this.bossComingNode) {
            this.bossComingNode.active = true;
            this.bossComingNode.getComponent("bossComing").playAnimation(_id);
            this.bossComingNode.zIndex = uiConfig.bossComing.Layer;
        } else {
            this.bossComingNode = null;
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.bossComing.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.bossComingNode = cc.instantiate(prefab);
                self.bossComingNode.parent = self.uiRoot;
                self.bossComingNode.active = true;
                self.bossComingNode.getComponent("bossComing").playAnimation(_id);
                self.bossComingNode.zIndex = uiConfig.bossComing.Layer;
            });
        }
    },

    openBuffUI:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
            return;
        }
        this.clearPrompt();
        var self = this;
        if (this.buffUINode) {
            this.addShowUICount("buff");
            this.buffUINode.active = true;
            this.buffUINode.getComponent("BuffUI").showUI();
            this.buffUINode.zIndex = uiConfig.buffUI.Layer;
        } else {
            this.buffUINode = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.buffUI.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("buff");
                self.hideLoading();
                self.buffUINode = cc.instantiate(prefab);
                self.buffUINode.parent = self.uiRoot;
                self.buffUINode.active = true;
                self.buffUINode.getComponent("BuffUI").showUI();
                self.buffUINode.zIndex = uiConfig.buffUI.Layer;
            });
        }
    },

    openTurnTableUI:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
            return;
        }
        this.clearPrompt();
        var self = this;
        if (this.turnTableUINode) {
            this.addShowUICount("turnTable");
            this.turnTableUINode.active = true;
            this.turnTableUINode.getComponent("turnTableUI").showUI();
            this.turnTableUINode.zIndex = uiConfig.turnTableUI.Layer;
        } else {
            this.turnTableUINode = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.turnTableUI.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("turnTable");
                self.hideLoading();
                self.turnTableUINode = cc.instantiate(prefab);
                self.turnTableUINode.parent = self.uiRoot;
                self.turnTableUINode.active = true;
                self.turnTableUINode.getComponent("turnTableUI").showUI();
                self.turnTableUINode.zIndex = uiConfig.turnTableUI.Layer;
            });
        }

        cc.Mgr.UIMgr.InGameUI.setTopNodeLayer(this.turnTableUINode);

    
    },

    openAssetGetUI:function(rtype, num, fromType = "",callback = null){
        this.clearPrompt();
        var self = this;
        if (this.assetGetUINode) {
            this.addShowUICount("assetGet");
            this.assetGetUINode.active = true;
            this.assetGetUINode.getComponent("assetGetUI").showUI(rtype, num, fromType, callback);
            this.assetGetUINode.zIndex = uiConfig.assetGetUI.Layer;
        } else {
            this.assetGetUINode = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.assetGetUI.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("assetGet");
                self.hideLoading();
                self.assetGetUINode = cc.instantiate(prefab);
                self.assetGetUINode.parent = self.uiRoot;
                self.assetGetUINode.active = true;
                self.assetGetUINode.getComponent("assetGetUI").showUI(rtype, num, fromType, callback);
                self.assetGetUINode.zIndex = uiConfig.assetGetUI.Layer;
            });
        }
    },

    openStarterBundle:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
            return;
        }
        this.clearPrompt();
        var self = this;
        if (this.starterBundleNode) {
            this.addShowUICount("starterBundle");
            this.starterBundleNode.active = true;
            self.starterBundleNode.getComponent("StarterBundle").showUI();
            this.starterBundleNode.zIndex = uiConfig.starterBundleUI.Layer;
        } else {
            this.starterBundleNode = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.starterBundleUI.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("starterBundle");
                self.hideLoading();
                self.starterBundleNode = cc.instantiate(prefab);
                self.starterBundleNode.parent = self.uiRoot;
                self.starterBundleNode.active = true;
                self.starterBundleNode.getComponent("StarterBundle").showUI();
                self.starterBundleNode.zIndex = uiConfig.starterBundleUI.Layer;
            });
        }
    },

    openCoinBundle:function(_coin, _sale){
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
            return;
        }

        this.clearPrompt();
        var self = this;
        if (this.coinBundleNode) {
            this.addShowUICount("coinBundle");
            this.coinBundleNode.active = true;
            self.coinBundleNode.getComponent("CoinBundle").showUI(_coin, _sale);
            this.coinBundleNode.zIndex = uiConfig.coinBundle.Layer;
        } else {
            this.coinBundleNode = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.coinBundle.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("coinBundle");
                self.hideLoading();
                self.coinBundleNode = cc.instantiate(prefab);
                self.coinBundleNode.parent = self.uiRoot;
                self.coinBundleNode.active = true;
                self.coinBundleNode.getComponent("CoinBundle").showUI(_coin, _sale);
                self.coinBundleNode.zIndex = uiConfig.coinBundle.Layer;
            });
        }
    },

    openOfflineBundle:function(_sale){
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
            return;
        }

        this.clearPrompt();
        var self = this;
        if (this.offlineBundleNode) {
            this.addShowUICount("offlineBundle");
            this.offlineBundleNode.active = true;
            self.offlineBundleNode.getComponent("OfflineBundle").showUI(_sale);
            this.offlineBundleNode.zIndex = uiConfig.offlineBundle.Layer;
        } else {
            this.offlineBundleNode = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.offlineBundle.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("offlineBundle");
                self.hideLoading();
                self.offlineBundleNode = cc.instantiate(prefab);
                self.offlineBundleNode.parent = self.uiRoot;
                self.offlineBundleNode.active = true;
                self.offlineBundleNode.getComponent("OfflineBundle").showUI(_sale);
                self.offlineBundleNode.zIndex = uiConfig.offlineBundle.Layer;
            });
        }
    },

    openUnlockAllBundle:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
            return;
        }

        this.clearPrompt();
        var self = this;
        if (this.unlockAllBundleNode) {
            this.addShowUICount("unlockAllBundle");
            this.unlockAllBundleNode.active = true;
            self.unlockAllBundleNode.getComponent("UnlockAllBundle").showUI();
            this.unlockAllBundleNode.zIndex = uiConfig.unlockAllBundle.Layer;
        } else {
            this.unlockAllBundleNode = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.unlockAllBundle.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("unlockAllBundle");
                self.hideLoading();
                self.unlockAllBundleNode = cc.instantiate(prefab);
                self.unlockAllBundleNode.parent = self.uiRoot;
                self.unlockAllBundleNode.active = true;
                self.unlockAllBundleNode.getComponent("UnlockAllBundle").showUI();
                self.unlockAllBundleNode.zIndex = uiConfig.unlockAllBundle.Layer;
            });
        }
    },

    openRemoveAdBundle:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
            return;
        }

        this.clearPrompt();
        var self = this;
        if (this.removeAdBundleNode) {
            this.addShowUICount("removeAdBundle");
            this.removeAdBundleNode.active = true;
            self.removeAdBundleNode.getComponent("RemoveAdBundle").showUI();
            this.removeAdBundleNode.zIndex = uiConfig.removeAdBundle.Layer;
        } else {
            this.removeAdBundleNode = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.removeAdBundle.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("removeAdBundle");
                self.hideLoading();
                self.removeAdBundleNode = cc.instantiate(prefab);
                self.removeAdBundleNode.parent = self.uiRoot;
                self.removeAdBundleNode.active = true;
                self.removeAdBundleNode.getComponent("RemoveAdBundle").showUI();
                self.removeAdBundleNode.zIndex = uiConfig.removeAdBundle.Layer;
            });
        }
    },

    openSpecialGridBundle:function(_sale){
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
            return;
        }

        this.clearPrompt();
        var self = this;
        if (this.specialGridBundleNode) {
            this.addShowUICount("specialGrid");
            this.specialGridBundleNode.active = true;
            self.specialGridBundleNode.getComponent("SpecialGridBundle").showUI(_sale);
            this.specialGridBundleNode.zIndex = uiConfig.specialGridBundle.Layer;
        } else {
            this.specialGridBundleNode = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.specialGridBundle.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("specialGrid");
                self.hideLoading();
                self.specialGridBundleNode = cc.instantiate(prefab);
                self.specialGridBundleNode.parent = self.uiRoot;
                self.specialGridBundleNode.active = true;
                self.specialGridBundleNode.getComponent("SpecialGridBundle").showUI(_sale);
                self.specialGridBundleNode.zIndex = uiConfig.specialGridBundle.Layer;
            });
        }
    },

    openSignUI:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
            return;
        }
        this.clearPrompt();
        var self = this;
        if (this.signUINode) {
            this.addShowUICount("sign");
            this.signUINode.active = true;
            this.signUINode.getComponent("signUI").showUI();
            this.signUINode.zIndex = uiConfig.signUI.Layer;
        } else {
            this.signUINode = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.signUI.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("sign");
                self.hideLoading();
                self.signUINode = cc.instantiate(prefab);
                self.signUINode.parent = self.uiRoot;
                self.signUINode.active = true;
                self.signUINode.getComponent("signUI").showUI();
                self.signUINode.zIndex = uiConfig.signUI.Layer;
            });
        }
    },

    openMissionUI:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
            return;
        }
        this.clearPrompt();
        var self = this;
        if (this.missionUINode) {
            this.addShowUICount("mission");
            this.missionUINode.active = true;
            this.missionUINode.getComponent("missionUI").showUI();
            this.missionUINode.zIndex = uiConfig.missionUI.Layer;
        } else {
            this.missionUINode = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.missionUI.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("mission");
                self.hideLoading();
                self.missionUINode = cc.instantiate(prefab);
                self.missionUINode.parent = self.uiRoot;
                self.missionUINode.active = true;
                self.missionUINode.getComponent("missionUI").showUI();
                self.missionUINode.zIndex = uiConfig.missionUI.Layer;
            });
        }
    },

    openPaymentUI:function(_isPayment){
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
            return;
        }

        this.clearPrompt();
        var self = this;
        if (this.paymentUINode) {
            this.addShowUICount("payment");
            this.paymentUINode.active = true;
            this.paymentUINode.getComponent("PaymentUI").showUI(_isPayment);
            this.paymentUINode.zIndex = uiConfig.paymentUI.Layer;
        } else {
            this.paymentUINode = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.paymentUI.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("payment");
                self.hideLoading();
                self.paymentUINode = cc.instantiate(prefab);
                self.paymentUINode.parent = self.uiRoot;
                self.paymentUINode.active = true;
                self.paymentUINode.getComponent("PaymentUI").showUI(_isPayment);
                self.paymentUINode.zIndex = uiConfig.paymentUI.Layer;
            });
        }
    },

    openMaxLevelUI:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
            return;
        }
        this.clearPrompt();
        var self = this;
        if (this.maxLevelNode) {
            this.addShowUICount("maxLevel");
            this.maxLevelNode.active = true;
            this.maxLevelNode.getComponent("MaxLevel").showUI();
            this.maxLevelNode.zIndex = uiConfig.maxLevel.Layer;
        } else {
            this.maxLevelNode = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.maxLevel.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("maxLevel");
                self.hideLoading();
                self.maxLevelNode = cc.instantiate(prefab);
                self.maxLevelNode.parent = self.uiRoot;
                self.maxLevelNode.active = true;
                self.maxLevelNode.getComponent("MaxLevel").showUI();
                self.maxLevelNode.zIndex = uiConfig.maxLevel.Layer;
            });
        }
    },
    
    openUpdateAvailable:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        this.clearPrompt();
        var self = this;
        if (this.updateAvailableNode) {
            this.addShowUICount("updateAvailable");
            this.updateAvailableNode.active = true;
            this.updateAvailableNode.getComponent("UpdateAvailable").showUI();
            this.updateAvailableNode.zIndex = uiConfig.updateAvailable.Layer;
        } else {
            this.updateAvailableNode = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.updateAvailable.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("updateAvailable");
                self.hideLoading();
                self.updateAvailableNode = cc.instantiate(prefab);
                self.updateAvailableNode.parent = self.uiRoot;
                self.updateAvailableNode.active = true;
                self.updateAvailableNode.getComponent("UpdateAvailable").showUI();
                self.updateAvailableNode.zIndex = uiConfig.updateAvailable.Layer;
            });
        }
    },

    openEnjoyNature:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
            return;
        }
        this.clearPrompt();
        var self = this;
        if (this.enjoyNatureNode) {
            this.addShowUICount("enjoyNature");
            this.enjoyNatureNode.active = true;
            this.enjoyNatureNode.getComponent("EnjoyNature").showUI();
            this.enjoyNatureNode.zIndex = uiConfig.enjoyNature.Layer;
        } else {
            this.enjoyNatureNode = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.enjoyNature.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("enjoyNature");
                self.hideLoading();
                self.enjoyNatureNode = cc.instantiate(prefab);
                self.enjoyNatureNode.parent = self.uiRoot;
                self.enjoyNatureNode.active = true;
                self.enjoyNatureNode.getComponent("EnjoyNature").showUI();
                self.enjoyNatureNode.zIndex = uiConfig.enjoyNature.Layer;
            });
        }
    },

    openVipUI:function(_from){
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
            return;
        }
        this.clearPrompt();
        var self = this;
        if (this.vipNode) {
            this.addShowUICount("vip");
            this.vipNode.active = true;
            this.vipNode.getComponent("Vip").showUI(_from);
            this.vipNode.zIndex = uiConfig.vipUI.Layer;
        } else {
            this.vipNode = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.vipUI.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("vip");
                self.hideLoading();
                self.vipNode = cc.instantiate(prefab);
                self.vipNode.parent = self.uiRoot;
                self.vipNode.active = true;
                self.vipNode.getComponent("Vip").showUI(_from);
                self.vipNode.zIndex = uiConfig.vipUI.Layer;
            });
        }
    },

    openOfflineAssetsUI:function(num){
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
            return;
        }
        this.clearPrompt();
        var self = this;
        if (this.offlineAssetUINode) {
            this.addShowUICount("offlineAssets");
            this.offlineAssetUINode.active = true;
            this.offlineAssetUINode.getComponent("offlineAssetUI").showUI(num);
            this.offlineAssetUINode.zIndex = uiConfig.offlineAssetUI.Layer;
        } else {
            this.offlineAssetUINode = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.offlineAssetUI.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("offlineAssets");
                self.hideLoading();
                self.offlineAssetUINode = cc.instantiate(prefab);
                self.offlineAssetUINode.parent = self.uiRoot;
                self.offlineAssetUINode.active = true;
                self.offlineAssetUINode.getComponent("offlineAssetUI").showUI(num);
                self.offlineAssetUINode.zIndex = uiConfig.offlineAssetUI.Layer;
            });
        }
    },

    openShareUI: function() {
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
            return;
        }

        this.clearPrompt();
        var self = this;
        if (this.shareUINode) {
            this.addShowUICount("shareUI");
            this.shareUINode.active = true;
            this.shareUINode.getComponent("shareUI").showUI();
            this.shareUINode.zIndex = uiConfig.shareUI.Layer;
        } else {
            this.shareUINode = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.shareUI.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("shareUI");
                self.hideLoading();
                self.shareUINode = cc.instantiate(prefab);
                self.shareUINode.parent = self.uiRoot;
                self.shareUINode.active = true;
                self.shareUINode.getComponent("shareUI").showUI();
                self.shareUINode.zIndex = uiConfig.shareUI.Layer;
            });
        }
    },

    openGameInUI:function(callback = null)
    {
        this.callback = callback;
        var self = this;
        cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.gameInUI.Name, cc.Prefab, function (errmsg, prefab) {
            if (errmsg) {
                cc.error(errmsg.message || errmsg);
                return;
            }
            self.GameInUINode = cc.instantiate(prefab);
            self.GameInUINode.parent = self.uiRoot;
            self.GameInUINode.active = true;
            self.GameInUINode.getComponent("InGameUI").init();
            self.GameInUINode.zIndex = uiConfig.gameInUI.Layer;
            
            if(self.callback) self.callback()
        });
    },

    showJibEffect(_flyout)
    {
        var self = this;
        cc.loader.loadRes("prefab/uiPrefab/" + "jinbis", function (errmsg, prefab) {
            if (errmsg) {
                cc.error(errmsg.message || errmsg);
                return;
            }
            var jinbis = cc.instantiate(prefab);
            jinbis.parent = self.uiRoot;
            jinbis.zIndex = uiConfig.jinbi.Layer;
            jinbis.getComponent("jinbiCtrl").showUI(_flyout);
        });
    },

    showGemsEffect(_flyout)
    {
        var self = this;
        cc.loader.loadRes("prefab/uiPrefab/" + "gems", function (errmsg, prefab) {
            if (errmsg) {
                cc.error(errmsg.message || errmsg);
                return;
            }
            var jinbis = cc.instantiate(prefab);
            jinbis.parent = self.uiRoot;
            jinbis.zIndex = uiConfig.jinbi.Layer;
            jinbis.getComponent("jinbiCtrl").showUI(_flyout);
        });
    },

    openGuide()
    {
        var self = this;
        cc.loader.loadRes("prefab/uiPrefab/" + "Guides", function (errmsg, prefab) {
            if (errmsg) {
                cc.error(errmsg.message || errmsg);
                return;
            }
            var jinbis = cc.instantiate(prefab);
            jinbis.parent = self.uiRoot;
            self.guideNode = jinbis;
        });
    },

    openUavUI:function(_isInvite, _photo, _playerId){
        cc.Mgr.AudioMgr.playSFX("click");
        var self = this;
        this.clearPrompt();
        if (this.uavUINode) {
            this.addShowUICount("uav");
            this.uavUINode.active = true;
            this.uavUINode.getComponent("uavUI").showUI(_isInvite, _photo, _playerId);
            this.uavUINode.zIndex = uiConfig.uavUI.Layer;
        } else {
            this.uavUINode = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.uavUI.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("uav");
                self.hideLoading();
                self.uavUINode = cc.instantiate(prefab);
                self.uavUINode.parent = self.uiRoot;
                self.uavUINode.active = true;
                self.uavUINode.getComponent("uavUI").showUI(_isInvite, _photo, _playerId);
                self.uavUINode.zIndex = uiConfig.uavUI.Layer;
            });
        }
    },

    openCompensationUI: function(_data) {
        cc.Mgr.AudioMgr.playSFX("click");
        var self = this;
        this.clearPrompt();
        if (this.compensationUINode) {
            this.addShowUICount("compensation");
            this.compensationUINode.active = true;
            this.compensationUINode.getComponent("Compensation").showUI(_data);
            this.compensationUINode.zIndex = uiConfig.compensationUI.Layer;
        } else {
            this.compensationUINode = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.compensationUI.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("compensation");
                self.hideLoading();
                self.compensationUINode = cc.instantiate(prefab);
                self.compensationUINode.parent = self.uiRoot;
                self.compensationUINode.active = true;
                self.compensationUINode.getComponent("Compensation").showUI(_data);
                self.compensationUINode.zIndex = uiConfig.compensationUI.Layer;
            });
        }
    },

    gemNum()
    {
        var costGem1 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 20];
        return costGem1[cc.Mgr.game.currentExchangeCount];
    },

    // starter bundle
    getCoinNumber () {
        var shopSortDt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.ShopData, cc.Mgr.game.plantMaxLv);
        var index = 0;
        var plantIds={};
        var index = 0;
        var i = 0;
        for(var key in shopSortDt) {
            var dt = shopSortDt[key];
            if(dt == MyEnum.ShopItemType.Money)
            {
                plantIds[i] = cc.Mgr.game.plantMaxLv-index+1;
                i++
            }
            index++;
        }

        if (!plantIds[0] || !plantIds[1]) {
            plantIds[0] = 2;
            plantIds[1] = 1;
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

        return price;
    },

    openExchangeCoinUI:function(_prompt){
        let needGem = this.gemNum();
        if ((needGem > cc.Mgr.game.gems || cc.Mgr.game.currentExchangeCount >= cc.Mgr.game.exchangeCoinConfig.maxExchangeNum) && _prompt) {
            return;
        }
        cc.Mgr.AudioMgr.playSFX("click");

        if(cc.Mgr.game.plantMaxLv < cc.Mgr.game.exchangeCoinConfig.openLevel) {
            this.showPrompt(cc.Mgr.Utils.getTranslation("exchange-tip"), "", this.uiRoot);
            return;
        }
        this.clearPrompt();
        var self = this;
        if (this.exchangeUINode) {
            this.addShowUICount("exchange");
            this.exchangeUINode.active = true;
            this.exchangeUINode.getComponent("exchangeCoinUI").showUI();
            this.exchangeUINode.zIndex = uiConfig.exchangeCoinUI.Layer;
        } else {
            this.exchangeUINode = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.exchangeCoinUI.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("exchange");
                self.hideLoading();
                self.exchangeUINode = cc.instantiate(prefab);
                self.exchangeUINode.parent = self.uiRoot;
                self.exchangeUINode.active = true;
                self.exchangeUINode.getComponent("exchangeCoinUI").showUI();
                self.exchangeUINode.zIndex = uiConfig.exchangeCoinUI.Layer;
            });
        }
    },

    openPauseUI:function(){
        this.clearPrompt();
        cc.Mgr.AudioMgr.playSFX("click");

        if (cc.Mgr.game.needGuide) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
            return;
        }

        var self = this;
        if (this.pauseUINode) {
            this.addShowUICount("pause");
            this.pauseUINode.active = true;
            this.pauseUINode.getComponent("PauseUI").showUI();
            this.pauseUINode.zIndex = uiConfig.pauseUI.Layer;
        } else {
            this.pauseUINode = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.pauseUI.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("pause");
                self.hideLoading();
                self.pauseUINode = cc.instantiate(prefab);
                self.pauseUINode.parent = self.uiRoot;
                self.pauseUINode.active = true;
                self.pauseUINode.getComponent("PauseUI").showUI();
                self.pauseUINode.zIndex = uiConfig.pauseUI.Layer;
            });
        }
    },

    openRecordUI:function(){
        this.clearPrompt();
        cc.Mgr.AudioMgr.playSFX("click");
        var self = this;
        if (this.newRecordUINode) {
            this.addShowUICount("record");
            this.newRecordUINode.active = true;
            this.newRecordUINode.getComponent("newRecordUI").showUI();
            this.newRecordUINode.zIndex = uiConfig.newRecordUI.Layer;
        } else {
            this.newRecordUINode = null;
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.newRecordUI.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("record");
                self.newRecordUINode = cc.instantiate(prefab);
                self.newRecordUINode.parent = self.uiRoot;
                self.newRecordUINode.active = true;
                self.newRecordUINode.getComponent("newRecordUI").showUI();
                self.newRecordUINode.zIndex = uiConfig.newRecordUI.Layer;
            });
        }
    },

    openRankingUI:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
            return;
        }

        this.clearPrompt();
        var self = this;
        if (this.rankingUINode) {
            this.addShowUICount("ranking");
            this.rankingUINode.active = true;
            self.rankingUINode.getComponent("RankingUI").showUI();
            this.rankingUINode.zIndex = uiConfig.rankingUI.Layer;
        } else {
            this.rankingUINode = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.rankingUI.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("ranking");
                self.hideLoading();
                self.rankingUINode = cc.instantiate(prefab);
                self.rankingUINode.parent = self.uiRoot;
                self.rankingUINode.active = true;
                self.rankingUINode.getComponent("RankingUI").showUI();
                self.rankingUINode.zIndex = uiConfig.rankingUI.Layer;
            });
        }
    },

    openAdsBlocker:function(_callback){
        return;
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
            return;
        }

        this.clearPrompt();
        var self = this;
        if (this.adsBlockerNode) {
            this.addShowUICount("adsBlocker");
            this.adsBlockerNode.active = true;
            self.adsBlockerNode.getComponent("AdsBlocker").showUI(_callback);
            this.adsBlockerNode.zIndex = uiConfig.adsBlocker.Layer;
        } else {
            this.adsBlockerNode = null;
            this.showLoading();
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.adsBlocker.Name, cc.Prefab, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.addShowUICount("adsBlocker");
                self.hideLoading();
                self.adsBlockerNode = cc.instantiate(prefab);
                self.adsBlockerNode.parent = self.uiRoot;
                self.adsBlockerNode.active = true;
                self.adsBlockerNode.getComponent("AdsBlocker").showUI(_callback);
                self.adsBlockerNode.zIndex = uiConfig.adsBlocker.Layer;
            });
        }
    },

    update () {

    }

});
module.exports = UIMgr;
