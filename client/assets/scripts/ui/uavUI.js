var DataType = require("DataType");
var scaleConfig = 1.3;
var tweenTime = 0.25;
var MissionType = require("MissionType");
var AchieveType = require("AchieveType");
var uavUI = cc.Class({
    extends: cc.Component,

    properties: {
        numLbl:cc.Label,
        num:1,
        lv:5,

        dragonNode:cc.Node,
        playerPhoto: cc.Sprite,
        playerPhotoNode: cc.Node,
        closeNode:cc.Node,
        gemLabel:cc.Label,

        titleLabel: cc.Label,
        btnLabel: cc.Label,

        content: cc.Node,
        blurBg: cc.Node,

        tip: cc.Label,
        inviteLabel: cc.Label,
        inviteBtn: cc.Node,
        adBtn: cc.Node,
        btnNode: cc.Node,

        spriteCoin: cc.Sprite,
        nomarlM: cc.Material,
        grayM: cc.Material,

        timeNode: cc.Node,
        timeDesLbl: cc.Label,
        timeTipLabel: cc.Label,

        box: sp.Skeleton,
        boxBg: cc.Node,
        eggNode: cc.Node
    },

    onLoad () {
        this.limitClick = this.node.getComponent('LimitClick');

        this.allowShow = true;
    },

    doTween:function(){
        this.box.node.position = this.playerPhotoNode.position = this.dragonNode.position = cc.v2(0,920);
        this.closeNode.opacity = 0;
        this.closeNode.scale = 0;
        if (this.isInvite) {
            // this.playerPhotoNode.active = true;
            // cc.tween(this.playerPhotoNode).to(tweenTime, {position:cc.v2(0,100)}).call(()=>{
            //     cc.tween(this.closeNode).to(0.15, {opacity:255, scale:1.0}).start();
            // }).start();
            this.box.node.active = true;
            cc.tween(this.box.node).to(tweenTime, {position:cc.v2(0,70)}).call(()=>{
                this.box.paused = false;
                cc.tween(this.closeNode).to(0.15, {opacity:255, scale:1.0}).start();
            }).start();
            setTimeout(() => {
                this.numLbl.node.active = true;
            }, 1000);
        } else {
            this.dragonNode.active = true;
            cc.tween(this.dragonNode).to(tweenTime, {position:cc.v2(0,25)}).call(()=>{
                cc.tween(this.closeNode).to(0.15, {opacity:255, scale:1.0}).start();
            }).start();
        }
    },

    changePlayerPhoto: function (_tex) {
        let slot = this.box.findSlot("head3");
        let attach = slot.getAttachment();

        _tex.width = _tex.height = 50;

        let spineTexture = new sp.SkeletonTexture({ width: _tex.width, height: _tex.height });
        spineTexture.setRealTexture(_tex);

        let region = attach.region;
        region.width = _tex.width;
        region.height = _tex.height;
        region.originalWidth = _tex.width;
        region.originalHeight = _tex.height;
        region.rotate = false;
        region.u = 0;
        region.v = 0;
        region.u2 = 1;
        region.v2 = 1;
        region.texture = spineTexture;
        region.renderObject = region;
        attach.width = _tex.width;
        attach.height = _tex.height;

        if (attach instanceof sp.spine.MeshAttachment) {
            attach.updateUVs();
        } else {
            attach.setRegion(region);
            attach.updateOffset();
        }
        this.box.invalidAnimationCache();
    },

    showUI:function(_isInvite, _photo, _playerId){
        if (_isInvite) {
            _isInvite =  false;
        }
        
        if (_isInvite == true) {
            this.titleLabel.string = cc.Mgr.Utils.getTranslation("special-gift");
        } else {
            this.titleLabel.string = cc.Mgr.Utils.getTranslation("uav-title");
        }

        this.boxBg.active = !_isInvite;
        this.eggNode.active = !_isInvite;

        this.btnLabel.string = cc.Mgr.Utils.getTranslation("btn-get") + "(" + cc.Mgr.game.uavAdsCount + "/5)";
        this.inviteLabel.string = cc.Mgr.Utils.getTranslation("btn-thanks");
        this.timeTipLabel.string = cc.Mgr.Utils.getTranslation("roulette-timeTip");

        this.costGem = 3;

        this.isInvite = _isInvite;

        this.inviteBtn.active = _isInvite;
        this.btnNode.active = !_isInvite;

        this.dragonNode.active = false;
        this.playerPhotoNode.active = false;
        this.box.node.active = false;
        this.box.setAnimation(0, "animation", false);
        this.box.paused = true;
        this.numLbl.node.active = false;
        if (this.isInvite) {
            this.playerId = _playerId;
            this.numLbl.node.position = cc.v2(-70,-370);
            this.numLbl.fontSize = 60;
            cc.assetManager.loadRemote(_photo, (err, texture) => {
                if (err == null) {
                    var spriteFrame = new cc.SpriteFrame(texture);
                    this.playerPhoto.spriteFrame = spriteFrame;
                    this.playerPhoto.node.width = this.playerPhoto.node.height = 80;

                    this.changePlayerPhoto(texture);
                }
            });
        } else {
            this.numLbl.node.active = true;
            this.numLbl.fontSize = 40;
            this.numLbl.node.position = cc.v2(15,-498);
        }
       
        var data = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.DroneData, cc.Mgr.game.plantMaxLv);
        
        if (cc.Mgr.game.level <= 10) {
            this.num = 6;
            this.costGem = 3;
        } else if (cc.Mgr.game.level <= 20) {
            this.num = 5;
            this.costGem = 3;
        } else if (cc.Mgr.game.level <= 30) {
            this.num = 4;
            this.costGem = 5;
        } else if (cc.Mgr.game.level <= 40) {
            this.num = 3;
            this.costGem = 15;
        } else if (cc.Mgr.game.level <= 50) {
            this.num = 2;
            this.costGem = 25;
        } else {
            this.num = 1;
            this.costGem = 35;
        }
        this.num = _isInvite == true ? 3 : this.num;

        // this.num = 6;
        this.gemLabel.string = this.costGem;
        this.lv = data.Drone;
        this.numLbl.string = "x" + this.num;
        if (_isInvite) {
            this.tip.string = cc.Mgr.Utils.getTranslation("special-gift-desc");
        } else {
            this.tip.string = cc.Mgr.Utils.getTranslation("fairyGift-tip",[this.num]);
        }
        
        this.doTween();

        this.blurBg.opacity = 0
        this.content.opacity = 0;
        this.content.setScale(.5)
        cc.tween(this.blurBg).to(0.05, {opacity:255}).call().start();
        cc.tween(this.content).to(0.15, {opacity:255, scale: 1}).start();

        cc.Mgr.admob.showBanner("uav");

        this.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        this.adBtn.active = cc.Mgr.game.uavAdsCount > 0 && this.checkAvailabelAds;

        if (this.checkAvailabelAds) {
            this.spriteCoin.setMaterial(0, this.nomarlM);
        } else {
            this.spriteCoin.setMaterial(0, this.grayM);
        }

        this.startTimeCount();
    },

    onClickInvite: function () {
        let self = this;
        cc.Mgr.UIMgr.showLoading();
        cc.Mgr.inviteManager.sendInvitation("resources/tex/shareImage_3.png", this.playerId, "playerName" + ' thanks you for the great gift!', 'Learn more', "special gift", (result) => {
            cc.Mgr.UIMgr.hideLoading();
                    
            if (result) {
                cc.Mgr.game.updateMissionProgressById(MissionType.InviteCount);
                cc.Mgr.game.updateAchieveProgressByType(AchieveType.Invite);
                cc.Mgr.UIMgr.InGameUI.checkMissionAchieveTip();

                cc.Mgr.flowerPotMgr.addDroneFlowerFot(self.lv, self.num);
                self.closeUI();
                
                cc.Mgr.UIMgr.showPrompt("Invitation Succeeded", "", self.node);
            } else {
                cc.Mgr.UIMgr.showPrompt("Invitation Failed", "", self.node);
            }
        });
    },

    gemGetDrone:function () {
        if (this.limitClick.clickTime() == false) {
            return
        }
        if(cc.Mgr.game.gems < this.costGem)
        {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoGems"), "gem", this.node);
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
            return;
        }
        cc.Mgr.game.gems -= this.costGem;
        cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");
        cc.Mgr.flowerPotMgr.addDroneFlowerFot(this.lv, this.num);

        // let data = {}
        // data.elapsed = Date.now()
        // data.value = this.costGem;
        // data.feature = "fairy_gift";
        // cc.Mgr.analytics.logEvent("spend_gem", JSON.stringify(data));

        this.closeUI();
    },

    adsGetDrone:function(){
        if (this.limitClick.clickTime() == false) {
            return
        }
        if (this.checkAvailabelAds === false) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", this.node);
            // let data = {};
            // data.elapsed = cc.Mgr.Utils.getDate9(true);
            // data.adsType = "rewarded";
            // data.feature = "fairy_gift";
            // cc.Mgr.analytics.logEvent("ad_present_failed", JSON.stringify(data));
            return;
        }
        let self = this
        cc.Mgr.admob.showRewardedVideoAd((function(_state) {
            if (_state) {
                cc.Mgr.flowerPotMgr.addDroneFlowerFot(self.lv, self.num);
                cc.Mgr.game.uavAdsCount--;
                if (cc.Mgr.game.uavAdsCount <= 0) {
                    self.adBtn.active = false;
                }
                self.closeUI();
            } else {
                // let data = {};
                // data.elapsed = cc.Mgr.Utils.getDate9(true);
                // data.adsType = "rewarded";
                // data.feature = "fairy_gift";
                // cc.Mgr.analytics.logEvent("ad_present_failed", JSON.stringify(data));
            }

            
        }), this.node, "fairyGift", this);
    },

    startTimeCount:function(){
        if(cc.Mgr.game.uavAdsCount > 0 || this.isInvite) {
            this.timeNode.active = false;
            return;
        }
        
        //北京时间相差8个小时
        // tempory code 10
        cc.Mgr.game.uavAdsTimeCount = cc.Mgr.game.uavAdsTimeCount <= 0 ? (cc.Mgr.Utils.GetSysTime() + 2 * 3600) : cc.Mgr.game.uavAdsTimeCount;

        this.seconds = cc.Mgr.game.uavAdsTimeCount - cc.Mgr.Utils.GetSysTime();

        this.unschedule(this.countTime);
        if(this.seconds > 0)
        {
            this.timeNode.active = true;
            var timeStr = cc.Mgr.Utils.FormatNumToTime(this.seconds);
            this.timeDesLbl.string = timeStr;
            this.schedule(this.countTime, 1);
        } else {
            cc.Mgr.game.uavAdsCount = 0;
            cc.Mgr.game.uavAdsTimeCount = 0;
            this.btnLabel.string = cc.Mgr.Utils.getTranslation("btn-get") + "(" + cc.Mgr.game.uavAdsCount + "/5)";
            this.timeNode.active = false;
            this.adBtn.active = cc.Mgr.game.uavAdsCount > 0;
        }
    },

    countTime:function(){
        this.seconds -= 1;
        if(this.seconds < 0)
        {
            this.unschedule(this.countTime);
            cc.Mgr.game.uavAdsCount = 5;
            cc.Mgr.game.uavAdsTimeCount = 0;
            this.btnLabel.string = cc.Mgr.Utils.getTranslation("btn-get") + "(" + cc.Mgr.game.uavAdsCount + "/5)";
            this.timeNode.active = false;
            return;
        }
        var timeStr = cc.Mgr.Utils.FormatNumToTime(this.seconds);
        this.timeDesLbl.string = timeStr;
    },

    updateAdsBtnState () {
        this.adBtn.active = false;
        this.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        if (this.checkAvailabelAds) {
            this.spriteCoin.setMaterial(0, this.nomarlM);
            if (cc.Mgr.game.uavAdsCount > 0) {
                this.adBtn.active = true;
            }
        } else {
            this.spriteCoin.setMaterial(0, this.grayM);
        }
    },

    closeUI:function(){  
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("uav");
        let self = this
        cc.tween(this.blurBg).to(0.15, {opacity:0}).start();
        cc.tween(this.content).to(0.15, {opacity:0, scale: .5}).call(() => {
            cc.Mgr.UIMgr.InGameUI.closeUav();
            self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("uav");
    },
});
module.exports = uavUI;
