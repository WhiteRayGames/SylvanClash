var MyEnum = require("MyEnum");
var MissionType = require("MissionType");
var AchieveType = require("AchieveType");
var bigResult = cc.Class({
    extends: cc.Component,

    properties: {
        sucNode: cc.Node,
        failNode: cc.Node,

        coinNode:cc.Node,
        coinLbl:cc.Label,
    
        timeLbl:cc.Label,

        failedToggle: cc.Toggle,
        winToggle: cc.Toggle,

        winCheckLabel: cc.Label,
        failedCheckLabel: cc.Label,
        rebornLabel: cc.Label,
        getRewardLabel: cc.Label,
        vipTip: cc.Label,

        content: cc.Node,
        blurBg: cc.Node,

        // winDb: dragonBones.ArmatureDisplay,
        // failedDb: dragonBones.ArmatureDisplay,
    
        checkboxNode: cc.Node,
        vipNode: cc.Node,
        failedCheckboxNode: cc.Node,
        failedVipNode: cc.Node,

        failed_adsLabel: cc.Label,
        win_getBtn: cc.Node,
        win_adsBtn: cc.Node,
        failed_adsBtn: cc.Node,
        win_adsLabel: cc.Label,
        inviteBtn: cc.Node,
        inviteLabel: cc.Node,

        numEffect: cc.Node,

        spriteCoin: cc.Sprite,
        nomarlM: cc.Material,
        grayM: cc.Material,

        noThanks: cc.Node,
        noThanksLabel: cc.Label
    },

    onLoad () {
        this.showVipCount = 0;
        this.limitClick = this.node.getComponent('LimitClick')
    },

    onClickToggle () {
        cc.Mgr.game.isManualSetting = cc.Mgr.game.isManualSetting_payingUser = this.winToggle.isChecked;
        // let data = {}
        // data.elapsed = cc.Mgr.Utils.getDate9(true)
        // data.action = (this.winToggle.isChecked && this.checkboxNode.active) ? "check" : "uncheck"
        // data.feature = "fightResutl_win"
        // cc.Mgr.analytics.logEvent("checkbox", JSON.stringify(data));

        let num = (this.winToggle.isChecked === true && this.checkboxNode.active) ? this.coin * BigInt(3) : this.coin;
        this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(num))

        this.win_getBtn.active = false;
        this.win_adsBtn.active = false;
        if (this.winToggle.isChecked && this.checkboxNode.active) {
            this.win_adsBtn.active = this.failed_adsBtn.active = true;
        } else {
            this.win_getBtn.active = this.failed_adsBtn.active = true;
        }
    },

    onClickFaileToggle () {
        // cc.Mgr.game.isManualSetting = cc.Mgr.game.isManualSetting_payingUser = this.failedToggle.isChecked;
        // let data = {}
        // data.elapsed = cc.Mgr.Utils.getDate9(true)
        // data.action = this.failedToggle.isChecked ? "check" : "uncheck"
        // data.feature = "fightResult_failed"
        // cc.Mgr.analytics.logEvent("checkbox", JSON.stringify(data));
    },

    onClickInvite () {
        if (this.limitClick.clickTime() == false) {
            return
        }

        this.unschedule(this.callback);
        let self = this;
        cc.Mgr.UIMgr.showLoading();
        cc.Mgr.Utils.getBase64Image("resources/tex/shareImage_2.png", (_data) => {

            cc.Mgr.UIMgr.hideLoading();

            cc.Mgr.GameCenterCtrl.unschedduleCreateCallBack(false);

            cc.Mgr.game.updateMissionProgressById(MissionType.InviteCount);
            cc.Mgr.game.updateAchieveProgressByType(AchieveType.Invite);
            cc.Mgr.UIMgr.InGameUI.checkMissionAchieveTip();

            cc.Mgr.game.rageTimer += 30;
            if(cc.Mgr.game.rageTimer > 150) cc.Mgr.game.rageTimer = 150;
            cc.Mgr.plantMgr.changePlantAngryState(true);

            let data = {}
            data.elapsed = cc.Mgr.Utils.getDate9(true)
            data.stage = cc.Mgr.game.level
            data.coin = self.coin.toString();
            data.isWin = "NO"
            data.double = "YES"
            cc.Mgr.analytics.logEvent("stage_end", JSON.stringify(data));

            data = {}
            data.elapsed = cc.Mgr.Utils.getDate9(true)
            data.stage = cc.Mgr.game.level
            data.feature = "end of stage"
            cc.Mgr.analytics.logEvent("share_message", JSON.stringify(data));

            self.rebornHandler();

            // failed
            cc.Mgr.UIMgr.hideLoading();
            cc.Mgr.UIMgr.showPrompt("Invitation Failed", "", self.node);

            cc.Mgr.GameCenterCtrl.unschedduleCreateCallBack(false);
        });
    },

    show:function(suc = false, coin){
        if (!coin) coin = BigInt(0);
        this.winCheckLabel.string = cc.Mgr.Utils.getTranslation("getReward-checkbox-treble");
        this.failedCheckLabel.string = cc.Mgr.Utils.getTranslation("bigResult-loss-checkbox");
        this.rebornLabel.string = cc.Mgr.Utils.getTranslation("bigResult-loss-reborn");
        this.getRewardLabel.string = cc.Mgr.Utils.getTranslation("btn-claim");
        this.vipTip.string = cc.Mgr.Utils.getTranslation("vip-treble-tip");
        this.failed_adsLabel.string = cc.Mgr.Utils.getTranslation("btn-retry");
        this.win_adsLabel.string = cc.Mgr.Utils.getTranslation("btn-treble");
        this.noThanksLabel.string = cc.Mgr.Utils.getTranslation("btn-no-thanks");

        this.coin = coin * BigInt(4) / BigInt(5);
        this.sucNode.active = suc;
        this.failNode.active = !suc;

        this.suc = suc;

        if (this.suc) {
            cc.Mgr.inviteManager.sendInvitations("end of stage - auto");
        }

        this.coinNode.active = false;
        this.timeLbl.node.active = false;

        this.noThanks.opacity = 0;
        this.noThanks.active = false;

        if (this.showBtnCounter) {
            clearTimeout(this.showBtnCounter);
        }

        if(suc)
        {
            cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.success1);
            // this.winDb.playAnimation("win", 1);'
            
            // let data = {}
            // data.elapsed = Date.now()
            // data.waveStage = cc.Mgr.game.level
            // data.waveNo = cc.Mgr.game.curBoshu
            // data.is_win = "YES"
            // cc.Mgr.analytics.logEvent("wave_end", JSON.stringify(data));
            this.showVipCount = 0;
        }
        else
        {
            cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.fail);
            // this.failedDb.playAnimation("Defeat", 1);

            // let data = {}
            // data.elapsed = Date.now()
            // data.waveStage = cc.Mgr.game.level
            // data.waveNo = cc.Mgr.game.curBoshu
            // data.isWin = "NO"
            // cc.Mgr.analytics.logEvent("wave_end", JSON.stringify(data));
            this.showVipCount++;
        }      

        if (this.showVipCount >= 10) {
            cc.Mgr.plantMgr.showVipTip();
            this.showVipCount = 0;
        }

        this.blurBg.opacity = 0
        this.content.opacity = 0;
        this.content.setScale(.5)
        cc.tween(this.blurBg).to(0.05, {opacity:255}).call().start();
        cc.tween(this.content).to(0.15, {opacity:255, scale: 1}).start();
        this.countDown();

        let checkState
        if (cc.Mgr.game.isPayingUser) {
            checkState = cc.Mgr.game.isManualSetting_payingUser == undefined ? cc.Mgr.game.checkDoubleReward : cc.Mgr.game.isManualSetting_payingUser;
            if (this.winToggle.isChecked != checkState)this.winToggle.isChecked = checkState;
            // if (this.failedToggle.isChecked != checkState)this.winToggle.isChecked = checkState;
        } else {
            checkState = cc.Mgr.game.isManualSetting == undefined ? cc.Mgr.game.checkDoubleReward : cc.Mgr.game.isManualSetting;
            if (this.winToggle.isChecked != checkState)this.winToggle.isChecked = checkState;
            // if (this.failedToggle.isChecked != checkState)this.winToggle.isChecked = checkState;
        }

        this.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        if (this.checkAvailabelAds) {
            this.win_adsBtn.active = true;
            this.failed_adsBtn.active = true;
            this.spriteCoin.setMaterial(0, this.nomarlM);
        } else {
            this.spriteCoin.setMaterial(0, this.grayM);
            this.win_adsBtn.active = false;
            this.failed_adsBtn.active = false;
        }

        // vip tempory code
        // this.checkboxNode.active = !cc.Mgr.game.isVIP;
        // this.vipNode.active = cc.Mgr.game.isVIP;
        // this.failedCheckboxNode.active = !cc.Mgr.game.isVIP;
        // this.failedVipNode.active = cc.Mgr.game.isVIP;

        this.checkboxNode.opacity = 255;

        this.checkboxNode.active = this.checkAvailabelAds;
        this.vipNode.active = false;
        this.failedCheckboxNode.active = false;
        this.failedVipNode.active = false;

        this.win_getBtn.active = false;
        this.win_adsBtn.active = false;

        this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(this.coin), true)
        if (this.winToggle.isChecked && this.checkboxNode.active) {
            this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(this.coin * BigInt(3)), true)
            this.win_adsBtn.active = true;
        } else {
            this.win_getBtn.active = true;
        }
        
        let showInvite = false;
        this.failed_adsBtn.active = !showInvite && this.checkAvailabelAds;
        this.inviteBtn.active = showInvite;
        this.inviteLabel.active = showInvite;
    },

    countDown:function(){
        this.count = 9
        this.timeLbl.string = "00:0" + this.count;
        this.callback = function () {
            if (this.count == 0) {
                this.claim();
            }
            this.timeLbl.string = "00:0"+this.count;
            this.count--;
        }
        this.timeLbl.node.active = true;
        this.coinNode.active = true;

        this.schedule(this.callback, 1);
    },

    claim:function(){
        this.unschedule(this.callback);

        cc.Mgr.GameCenterCtrl.unschedduleCreateCallBack();

        cc.Mgr.game.money += this.coin;
        cc.Mgr.game.coin_gained_total += this.coin;
        cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
        cc.Mgr.UIMgr.showJibEffect();

        // let data = {}
        // data.elapsed = Date.now()
        // data.value = this.coin;
        // data.feature = "win";
        // data.double = "False";
        // cc.Mgr.analytics.logEvent("earn_coin", JSON.stringify(data));

        let data = {}
        data.elapsed = cc.Mgr.Utils.getDate9(true)
        data.stage = cc.Mgr.game.level
        data.coin = this.coin.toString();
        data.isWin = this.suc ? "YES" : "NO";
        data.double = "NO"
        cc.Mgr.analytics.logEvent("stage_end", JSON.stringify(data));

        this.closeUI();
       
    },

    closeUI:function(){
        let self = this
        cc.tween(this.blurBg).to(0.15, {opacity:0}).start();
        cc.tween(this.content).to(0.15, {opacity:0, scale: .5}).call(() => {
            self.unscheduleAllCallbacks();
            self.node.active = false;

            var score = cc.Mgr.game.level * 100 + cc.Mgr.game.curBoshu;
            if(score > cc.Mgr.game.lastMaxWave && this.suc)
            {
                cc.Mgr.UIMgr.openRecordUI();

                let data = {}
                data.elapsed = cc.Mgr.Utils.getDate9(true)
                data.stage = cc.Mgr.game.level
                cc.Mgr.analytics.logEvent("level_up", JSON.stringify(data));
            }
            // if (cc.Mgr.game.isCleared && this.suc) {
            //     cc.Mgr.UIMgr.openMaxLevelUI();
            //     cc.Mgr.game.isCleared = false;
            // }
            cc.Mgr.game.lastMaxWave = score;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("bigResult");
    },

    doubleClaim:function(){
        cc.Mgr.GameCenterCtrl.unschedduleCreateCallBack();
        cc.Mgr.game.money += BigInt(3) * this.coin;
        cc.Mgr.game.coin_gained_total += BigInt(3) * this.coin;

        // let data = {}
        // data.elapsed = Date.now()
        // data.value = this.coin * 2;
        // data.feature = "win";
        // data.double = "True";
        // cc.Mgr.analytics.logEvent("earn_coin", JSON.stringify(data));

        let data = {}
        data.elapsed = cc.Mgr.Utils.getDate9(true)
        data.stage = cc.Mgr.game.level
        data.coin = (BigInt(3) * this.coin).toString();
        data.isWin = this.suc ? "YES" : "NO";
        data.double = "YES"
        cc.Mgr.analytics.logEvent("stage_end", JSON.stringify(data));

        cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
        cc.Mgr.UIMgr.showJibEffect();

        this.closeUI();
    },

    reSchedule:function(){
        this.schedule(this.callback, 1);
    },

    adsDoubleClaim:function(){
        if (this.limitClick.clickTime() == false) {
            return
        }
        var self = this;
        this.unschedule(this.callback);
        // vip tempory code
        // if (cc.Mgr.game.isVIP) {
        //     self.doubleClaim();
        // } else if (this.winToggle.isChecked === true) {
        //     cc.Mgr.admob.showRewardedVideoAd((function() {
        //         self.doubleClaim();
        //     }), this.node, "win");
        // } else {
        //     this.claim();
        // }
        cc.Mgr.admob.showRewardedVideoAd((function(_state) {
            if (_state) {
                self.doubleClaim();
            } else {
                self.claim();
                // let data = {};
                // data.elapsed = cc.Mgr.Utils.getDate9(true);
                // data.adsType = "rewarded";
                // data.feature = "win";
                // cc.Mgr.analytics.logEvent("ad_present_failed", JSON.stringify(data));
            }
        }), this.node, "win", this);
    },

    updateAdsBtnState () {
        this.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        if (this.checkAvailabelAds) {
            this.win_adsBtn.active = true;
            this.failed_adsBtn.active = true;
            this.spriteCoin.setMaterial(0, this.nomarlM);
        } else {
            this.spriteCoin.setMaterial(0, this.grayM);
            this.win_adsBtn.active = false;
            this.failed_adsBtn.active = false;
        }

        // vip tempory code
        // this.checkboxNode.active = !cc.Mgr.game.isVIP;
        // this.vipNode.active = cc.Mgr.game.isVIP;
        // this.failedCheckboxNode.active = !cc.Mgr.game.isVIP;
        // this.failedVipNode.active = cc.Mgr.game.isVIP;

        this.checkboxNode.active = this.checkAvailabelAds;
        this.vipNode.active = false;
        this.failedCheckboxNode.active = false;
        this.failedVipNode.active = false;

        this.win_getBtn.active = false;
        this.win_adsBtn.active = false;
        
        this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(this.coin), true)
        if (this.winToggle.isChecked && this.checkboxNode.active) {
            this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(this.coin * BigInt(3)), true)
            this.win_adsBtn.active = true;
        } else {
            this.win_getBtn.active = true;
        }
    },

    rebornToGameAds: function() {
        if (this.limitClick.clickTime() == false) {
            return
        }
        if (this.checkAvailabelAds === false) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", this.node);
            // let data = {};
            // data.elapsed = cc.Mgr.Utils.getDate9(true);
            // data.adsType = "rewarded";
            // data.feature = "defeat";
            // cc.Mgr.analytics.logEvent("ad_present_failed", JSON.stringify(data));
            return;
        }
        this.unschedule(this.callback);
        cc.Mgr.GameCenterCtrl.unschedduleCreateCallBack(false);
        let self = this;
        cc.Mgr.admob.showRewardedVideoAd((function(_state) {
            if (_state) {
                cc.Mgr.game.rageTimer += 30;
                if(cc.Mgr.game.rageTimer > 150) cc.Mgr.game.rageTimer = 150;
                cc.Mgr.plantMgr.changePlantAngryState(true);

                let data = {}
                data.elapsed = cc.Mgr.Utils.getDate9(true)
                data.stage = cc.Mgr.game.level
                data.coin = self.coin.toString();
                data.isWin = "NO"
                data.double = "YES"
                cc.Mgr.analytics.logEvent("stage_end", JSON.stringify(data));
            } else {
                // let data = {};
                // data.elapsed = cc.Mgr.Utils.getDate9(true);
                // data.adsType = "rewarded";
                // data.feature = "defeat";
                // cc.Mgr.analytics.logEvent("ad_present_failed", JSON.stringify(data));
            }
            self.rebornHandler();
        }), this.node, "failed", this);
    },

    rebornToGame:function(){
        if (this.limitClick.clickTime() == false) {
            return
        }
        this.claim();
    },

    rebornHandler: function() {
        cc.Mgr.game.hasUseFreeBorn = true;
        cc.Mgr.GameCenterCtrl.rebornToLvLastWave();
        cc.Mgr.game.money += this.coin;

        // let data = {}
        // data.elapsed = Date.now()
        // data.value = this.coin;
        // data.feature = "defeat";
        // data.double = "False";
        // cc.Mgr.analytics.logEvent("earn_coin", JSON.stringify(data));

        cc.Mgr.game.coin_gained_total += this.coin;
        cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
        cc.Mgr.UIMgr.showJibEffect();
        this.closeUI();
    }
});
module.exports = bigResult;